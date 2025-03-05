import {
  getAuth,
  signInWithEmailAndPassword as firebaseSignInWithEmail,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  Timestamp,
  orderBy,
  limit,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';
import { GoogleSignin, SignInResponse } from '@react-native-google-signin/google-signin';
import FIREBASE_CONFIG,{ auth, db, rtdb } from '../config/firebase';
import { Platform } from 'react-native';
import { 
  createRecord, 
  createRecordWithId, 
  readRecord, 
  updateRecord, 
  deleteRecord, 
  queryRecords 
} from './realtimeDatabase';

// User type definition
export interface User {
  id: string;
  email: string;
  username: string;
  phone?: string;
  avatar?: string;
  points: number;
  completedTasks: number;
  createdAt: Date;
}

// Updated Data Structures
export interface Rank {
  userId: string;
  rank: string;
  points: number;
  [key: string]: any;
}

export interface CharacterStat {
  userId: string;
  characterId: string;
  stats: Record<string, number>;
  [key: string]: any;
}

export interface Habit {
  userId: string;
  habitName: string;
  frequency: string;
  [key: string]: any;
}

export interface Note {
  userId: string;
  noteContent: string;
  createdAt: Date;
  [key: string]: any;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  time?: string;
  completed: boolean;
  points: number;
  userId: string;
  createdAt: Date;
}

// Sign in with email and password
export const signInWithEmailAndPassword = async (email: string, password: string): Promise<User> => {
  const userCredential = await firebaseSignInWithEmail(auth, email, password);
  
  // Try to get user from Firestore first
  const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
  
  if (userDoc.exists()) {
    return {
      id: userCredential.user.uid,
      ...userDoc.data() as Omit<User, 'id'>,
      createdAt: userDoc.data().createdAt.toDate(),
    };
  }
  
  // If not in Firestore, try Realtime Database
  const userData = await readRecord(`users/${userCredential.user.uid}`);
  
  if (userData) {
    return {
      id: userCredential.user.uid,
      ...userData,
      createdAt: new Date(userData.createdAt),
    };
  }
  
  throw new Error('User profile not found');
};

// Sign up with email and password
export const signUpWithEmailAndPassword = async (
  email: string,
  password: string,
  username: string,
  phone: string
): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Update profile with display name
  await updateProfile(userCredential.user, {
    displayName: username
  });
  
  const userData: Omit<User, 'id'> = {
    email,
    username,
    phone,
    points: 0,
    completedTasks: 0,
    createdAt: new Date(),
  };
  
  // Save to Firestore
  await setDoc(doc(db, 'users', userCredential.user.uid), {
    ...userData,
    createdAt: Timestamp.fromDate(userData.createdAt)
  });
  
  // Save to Realtime Database
  await createRecord(`users/${userCredential.user.uid}`, userData);
  
  // Initialize character stats
  await createRecord(`characterStats/${userCredential.user.uid}`, {
    userId: userCredential.user.uid,
    characterId: 'default',
    stats: {
      strength: 10,
      intelligence: 10,
      creativity: 10,
      focus: 10
    },
    createdAt: userData.createdAt.getTime()
  });
  
  // Initialize rank
  await createRecord(`ranks/${userCredential.user.uid}`, {
    userId: userCredential.user.uid,
    rank: 'Private',
    points: 0,
    createdAt: userData.createdAt.getTime()
  });
  
  return {
    id: userCredential.user.uid,
    ...userData,
  };
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<User> => {
  try {
    let userCredential;

    if (Platform.OS === 'web') {
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/calendar');
      userCredential = await signInWithPopup(auth, provider);
    } else {
      await GoogleSignin.hasPlayServices();
      const signInResponse = await GoogleSignin.signIn() as SignInResponse;

      if ('idToken' in signInResponse && typeof signInResponse.idToken === 'string') {
        const { idToken } = signInResponse;
        const credential = GoogleAuthProvider.credential(idToken);
        userCredential = await signInWithCredential(auth, credential);
      } else {
        throw new Error('Google sign-in was canceled or failed.');
      }
    }
    
    // Check if user profile exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    // Check if user profile exists in Realtime Database
    const rtdbUser = await readRecord(`users/${userCredential.user.uid}`);
    
    if (!userDoc.exists() && !rtdbUser) {
      // Create new user profile
      const userData: Omit<User, 'id'> = {
        email: userCredential.user.email!,
        username: userCredential.user.displayName || userCredential.user.email!.split('@')[0],
        avatar: userCredential.user.photoURL || undefined,
        points: 0,
        completedTasks: 0,
        createdAt: new Date(),
      };
      
      // Save to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        ...userData,
        createdAt: Timestamp.fromDate(userData.createdAt)
      });
      
      // Save to Realtime Database
      await createRecord(`users/${userCredential.user.uid}`, userData);
      
      // Initialize character stats
      await createRecord(`characterStats/${userCredential.user.uid}`, {
        userId: userCredential.user.uid,
        characterId: 'default',
        stats: {
          strength: 10,
          intelligence: 10,
          creativity: 10,
          focus: 10
        },
        createdAt: userData.createdAt.getTime()
      });
      
      // Initialize rank
      await createRecord(`ranks/${userCredential.user.uid}`, {
        userId: userCredential.user.uid,
        rank: 'Private',
        points: 0,
        createdAt: userData.createdAt.getTime()
      });
      
      return {
        id: userCredential.user.uid,
        ...userData,
      };
    }
    
    if (userDoc.exists()) {
      return {
        id: userCredential.user.uid,
        ...userDoc.data() as Omit<User, 'id'>,
        createdAt: userDoc.data().createdAt.toDate(),
      };
    }
    
    return {
      id: userCredential.user.uid,
      ...rtdbUser,
      createdAt: new Date(rtdbUser.createdAt),
    };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Sign out
export const signOut = async (): Promise<void> => {
  if (Platform.OS !== 'web') {
    await GoogleSignin.signOut(); // Sign out from Google
  }
  await firebaseSignOut(auth); // Sign out from Firebase
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  
  // Try Firestore first
  const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
  if (userDoc.exists()) {
    return {
      id: currentUser.uid,
      ...userDoc.data() as Omit<User, 'id'>,
      createdAt: userDoc.data().createdAt.toDate(),
    };
  }
  
  // Try Realtime Database
  const userData = await readRecord(`users/${currentUser.uid}`);
  if (userData) {
    return {
      id: currentUser.uid,
      ...userData,
      createdAt: new Date(userData.createdAt),
    };
  }
  
  return null;
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// User Profile Services
export const getUserProfile = async (userId: string) => {
  // Try Firestore first
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data();
  }
  
  // Try Realtime Database
  return await readRecord(`users/${userId}`);
};

export const updateUserProfile = async (userId: string, data: any) => {
  // Update in Firestore
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, data);
  
  // Update in Realtime Database
  await updateRecord(`users/${userId}`, data);
};

// Task Services
export const createTask = async (userId: string, taskData: any) => {
  const now = new Date();
  const task = {
    ...taskData,
    userId,
    createdAt: now,
    completed: false
  };
  
  // Add to Firestore
  const docRef = await addDoc(collection(db, 'tasks'), {
    ...task,
    createdAt: Timestamp.fromDate(now)
  });
  
  // Add to Realtime Database
  const rtdbTask = await createRecordWithId(`tasks`, {
    ...task,
    createdAt: now.getTime()
  });
  
  return {
    id: docRef.id,
    ...task
  };
};

export const getUserTasks = async (userId: string): Promise<Task[]> => {
  try {
    // Try Firestore first
    const tasksRef = collection(db, 'tasks');
    const q = query(
      tasksRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        completed: doc.data().completed
      })) as Task[];
    }
    
    // Try Realtime Database
    const rtdbTasks = await queryRecords('tasks', 'userId', userId);
    
    if (Object.keys(rtdbTasks).length > 0) {
      return Object.entries(rtdbTasks).map(([id, task]: [string, Record<string, any>]) => ({
        id,
        ...task,
        createdAt: new Date(task.createdAt),
        completed: task.completed
      })) as Task[];
    }
    
    return [];
  } catch (error) {
    console.error('Error getting user tasks:', error);
    return [];
  }
};

export const updateTask = async (taskId: string, data: any) => {
  try {
    // Update in Firestore
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, data);
    
    // Update in Realtime Database
    await updateRecord(`tasks/${taskId}`, data);
    
    // If task is completed, update user stats
    if (data.completed === true) {
      const taskDoc = await getDoc(taskRef);
      if (taskDoc.exists()) {
        const task = taskDoc.data();
        const userId = task.userId;
        const points = task.points || 10;
        
        // Update user points in Firestore
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const currentPoints = userData.points || 0;
          const completedTasks = userData.completedTasks || 0;
          
          await updateDoc(userRef, {
            points: currentPoints + points,
            completedTasks: completedTasks + 1
          });
        }
        
        // Update user points in Realtime Database
        const rtdbUser = await readRecord(`users/${userId}`);
        if (rtdbUser) {
          await updateRecord(`users/${userId}`, {
            points: (rtdbUser.points || 0) + points,
            completedTasks: (rtdbUser.completedTasks || 0) + 1
          });
        }
        
        // Update character stats based on task completion
        await updateCharacterStats(userId);
      }
    }
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Calendar Events Services
export const createEvent = async (userId: string, eventData: any) => {
  const now = new Date();
  const event = {
    ...eventData,
    userId,
    createdAt: now
  };
  
  // Add to Firestore
  const docRef = await addDoc(collection(db, 'events'), {
    ...event,
    createdAt: Timestamp.fromDate(now),
    startTime: Timestamp.fromDate(event.startTime),
    endTime: Timestamp.fromDate(event.endTime)
  });
  
  // Add to Realtime Database
  await createRecordWithId('events', {
    ...event,
    createdAt: now.getTime(),
    startTime: event.startTime.getTime(),
    endTime: event.endTime.getTime()
  });
  
  return {
    id: docRef.id,
    ...event
  };
};

export const getUserEvents = async (userId: string, startDate?: Date, endDate?: Date) => {
  try {
    // Try Firestore first
    const eventsRef = collection(db, 'events');
    let q;
    
    if (startDate && endDate) {
      q = query(
        eventsRef,
        where('userId', '==', userId),
        where('startTime', '>=', Timestamp.fromDate(startDate)),
        where('startTime', '<=', Timestamp.fromDate(endDate)),
        orderBy('startTime', 'asc')
      );
    } else {
      q = query(
        eventsRef,
        where('userId', '==', userId),
        orderBy('startTime', 'asc')
      );
    }
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startTime: doc.data().startTime.toDate(),
        endTime: doc.data().endTime.toDate(),
        createdAt: doc.data().createdAt.toDate()
      }));
    }
    
    // Try Realtime Database
    const rtdbEvents = await queryRecords('events', 'userId', userId);
    
    if (Object.keys(rtdbEvents).length > 0) {
      const events = Object.entries(rtdbEvents).map(([id, event]: [string, Record<string, any>]) => ({
        id,
        ...event,
        startTime: new Date(event.startTime),
        endTime: new Date(event.endTime),
        createdAt: new Date(event.createdAt)
      }));
      
      if (startDate && endDate) {
        return events.filter(event => 
          event.startTime >= startDate && event.startTime <= endDate
        ).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
      }
      
      return events.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    }
    
    return [];
  } catch (error) {
    console.error('Error getting user events:', error);
    return [];
  }
};

// Leaderboard Services
export const getGlobalLeaderboard = async () => {
  try {
    // Try Firestore first
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      orderBy('points', 'desc'),
      limit(20)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }
    
    // Try Realtime Database
    const rtdbUsers = await readRecord('users') as Record<string, User>;
    
    if (rtdbUsers) {
      return Object.entries(rtdbUsers)
        .map(([id, user]) => ({
          ...user,
          id
        }))
        .sort((a, b) => (b.points || 0) - (a.points || 0))
        .slice(0, 20);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching global leaderboard:', error);
    throw new Error('Failed to fetch global leaderboard');
  }
};

// Character Stats Services
export const getCharacterStats = async (userId: string) => {
  // Try Firestore first
  const docRef = doc(db, 'characterStats', userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data();
  }
  
  // Try Realtime Database
  return await readRecord(`characterStats/${userId}`);
};

export const updateCharacterStats = async (userId: string, statsData?: any) => {
  try {
    // Get current stats
    const currentStats = await getCharacterStats(userId);
    
    if (!currentStats) {
      // Initialize stats if they don't exist
      const initialStats = statsData || {
        userId,
        characterId: 'default',
        stats: {
          strength: 10,
          intelligence: 10,
          creativity: 10,
          focus: 10
        },
        createdAt: Date.now()
      };
      
      // Save to Firestore
      await setDoc(doc(db, 'characterStats', userId), initialStats);
      
      // Save to Realtime Database
      await createRecord(`characterStats/${userId}`, initialStats);
      
      return initialStats;
    }
    
    if (statsData) {
      // Update with provided stats
      const updatedStats = {
        ...currentStats,
        ...statsData,
        stats: {
          ...currentStats.stats,
          ...(statsData.stats || {})
        }
      };
      
      // Update in Firestore
      await updateDoc(doc(db, 'characterStats', userId), updatedStats);
      
      // Update in Realtime Database
      await updateRecord(`characterStats/${userId}`, updatedStats);
      
      return updatedStats;
    } else {
      // Auto-update stats based on completed tasks
      const tasks = await getUserTasks(userId);
      const completedTasks = tasks.filter(task => task.completed).length;
      
      // Simple algorithm to update stats based on completed tasks
      const strengthIncrease = Math.floor(completedTasks / 5);
      const intelligenceIncrease = Math.floor(completedTasks / 4);
      const creativityIncrease = Math.floor(completedTasks / 6);
      const focusIncrease = Math.floor(completedTasks / 3);
      
      const updatedStats = {
        ...currentStats,
        stats: {
          strength: Math.min(100, (currentStats.stats.strength || 10) + strengthIncrease),
          intelligence: Math.min(100, (currentStats.stats.intelligence || 10) + intelligenceIncrease),
          creativity: Math.min(100, (currentStats.stats.creativity || 10) + creativityIncrease),
          focus: Math.min(100, (currentStats.stats.focus || 10) + focusIncrease)
        }
      };
      
      // Update in Firestore
      await updateDoc(doc(db, 'characterStats', userId), updatedStats);
      
      // Update in Realtime Database
      await updateRecord(`characterStats/${userId}`, updatedStats);
      
      // Update user rank based on points
      await updateUserRank(userId);
      
      return updatedStats;
    }
  } catch (error) {
    console.error('Error updating character stats:', error);
    throw error;
  }
};

// Rank Services
export const getUserRank = async (userId: string) => {
  // Try Firestore first
  const docRef = doc(db, 'ranks', userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data();
  }
  
  // Try Realtime Database
  return await readRecord(`ranks/${userId}`);
};

export const updateUserRank = async (userId: string) => {
  try {
    // Get user profile to check points
    const userProfile = await getUserProfile(userId);
    
    if (!userProfile) {
      throw new Error('User profile not found');
    }
    
    const points = userProfile.points || 0;
    let newRank = 'Private';
    
    // Determine rank based on points
    if (points > 1800) newRank = 'General';
    else if (points > 1500) newRank = 'Colonel';
    else if (points > 1200) newRank = 'Major';
    else if (points > 900) newRank = 'Captain';
    else if (points > 600) newRank = 'Lieutenant';
    else if (points > 300) newRank = 'Sergeant';
    else if (points > 100) newRank = 'Corporal';
    
    // Get current rank
    const currentRankData = await getUserRank(userId);
    
    if (!currentRankData) {
      // Initialize rank if it doesn't exist
      const rankData = {
        userId,
        rank: newRank,
        points,
        createdAt: Date.now()
      };
      
      // Save to Firestore
      await setDoc(doc(db, 'ranks', userId), rankData);
      
      // Save to Realtime Database
      await createRecord(`ranks/${userId}`, rankData);
      
      return rankData;
    }
    
    // Only update if rank has changed
    if (currentRankData.rank !== newRank) {
      const updatedRank = {
        ...currentRankData,
        rank: newRank,
        points,
        updatedAt: Date.now()
      };
      
      // Update in Firestore
      await updateDoc(doc(db, 'ranks', userId), updatedRank);
      
      // Update in Realtime Database
      await updateRecord(`ranks/${userId}`, updatedRank);
      
      return updatedRank;
    }
    
    return currentRankData;
  } catch (error) {
    console.error('Error updating user rank:', error);
    throw error;
  }
};

// Habit Services
export const createHabit = async (userId: string, habitData: Habit) => {
  const now = new Date();
  const habit = {
    ...habitData,
    userId,
    createdAt: now,
    streak: 0,
    lastCompleted: null
  };
  
  // Add to Firestore
  const docRef = await addDoc(collection(db, 'habits'), {
    ...habit,
    createdAt: Timestamp.fromDate(now)
  });
  
  // Add to Realtime Database
  await createRecordWithId('habits', {
    ...habit,
    createdAt: now.getTime()
  });
  
  return {
    id: docRef.id,
    ...habit
  };
};

export const getUserHabits = async (userId: string) => {
  try {
    // Try Firestore first
    const habitsRef = collection(db, 'habits');
    const q = query(
      habitsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        lastCompleted: doc.data().lastCompleted ? doc.data().lastCompleted.toDate() : null
      }));
    }
    
    // Try Realtime Database
    const rtdbHabits = await queryRecords('habits', 'userId', userId);
    
    if (Object.keys(rtdbHabits).length > 0) {
      return Object.entries(rtdbHabits).map(([id, habit]: [string, Record<string, any>]) => ({
        id,
        ...habit,
        createdAt: new Date(habit.createdAt),
        lastCompleted: habit.lastCompleted ? new Date(habit.lastCompleted) : null
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error getting user habits:', error);
    return [];
  }
};

export const updateHabit = async (habitId: string, data: any) => {
  try {
    // Update in Firestore
    const habitRef = doc(db, 'habits', habitId);
    await updateDoc(habitRef, data);
    
    // Update in Realtime Database
    await updateRecord(`habits/${habitId}`, data);
    
    return { id: habitId, ...data };
  } catch (error) {
    console.error('Error updating habit:', error);
    throw error;
  }
};

export const completeHabit = async (habitId: string, userId: string) => {
  try {
    const now = new Date();
    
    // Get current habit data
    const habitRef = doc(db, 'habits', habitId);
    const habitDoc = await getDoc(habitRef);
    
    if (!habitDoc.exists()) {
      throw new Error('Habit not found');
    }
    
    const habitData = habitDoc.data();
    const lastCompleted = habitData.lastCompleted ? habitData.lastCompleted.toDate() : null;
    let streak = habitData.streak || 0;
    
    // Check if streak should be incremented
    if (!lastCompleted || isNewStreak(lastCompleted, now, habitData.frequency)) {
      streak += 1;
    }
    
    // Update habit
    const updateData = {
      lastCompleted: Timestamp.fromDate(now),
      streak
    };
    
    await updateDoc(habitRef, updateData);
    await updateRecord(`habits/${habitId}`, {
      lastCompleted: now.getTime(),
      streak
    });
    
    // Award points for habit completion
    const points = 5 + Math.min(10, Math.floor(streak / 5)); // More points for longer streaks
    
    // Update user points
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      await updateDoc(userRef, {
        points: (userData.points || 0) + points
      });
    }
    
    await updateRecord(`users/${userId}/points`, (await readRecord(`users/${userId}/points`) || 0) + points);
    
    // Update character stats
    await updateCharacterStats(userId);
    
    return {
      id: habitId,
      ...habitData,
      lastCompleted: now,
      streak,
      pointsEarned: points
    };
  } catch (error) {
    console.error('Error completing habit:', error);
    throw error;
  }
};

// Helper function to determine if a new streak should be counted
function isNewStreak(lastCompleted: Date, now: Date, frequency: string): boolean {
  const lastDate = new Date(lastCompleted);
  const nowDate = new Date(now);
  
  // Reset hours, minutes, seconds for date comparison
  lastDate.setHours(0, 0, 0, 0);
  nowDate.setHours(0, 0, 0, 0);
  
  // Different logic based on frequency
  switch (frequency) {
    case 'daily':
      // Check if it's a new day but not more than 1 day has passed
      const dayDiff = Math.floor((nowDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      return dayDiff === 1;
      
    case 'weekly':
      // Check if it's a new week
      const weekDiff = Math.floor((nowDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
      return weekDiff === 1;
      
    case 'monthly':
      // Check if it's a new month
      return (
        nowDate.getMonth() !== lastDate.getMonth() ||
        nowDate.getFullYear() !== lastDate.getFullYear()
      );
      
    default:
      return false;
  }
}

// Function to populate Firestore with initial data
export const populateFirestoreWithInitialData = async (userId: string, email: string, displayName: string, photoURL: string) => {
  const now = new Date();
  
  // Create user profile if it doesn't exist
  const userProfile = {
    email,
    username: displayName,
    points: 0,
    completedTasks: 0,
    createdAt: now,
    avatar: photoURL
  };
  
  // Save to Firestore
  await setDoc(doc(db, 'users', userId), {
    ...userProfile,
    createdAt: Timestamp.fromDate(now)
  });
  
  // Save to Realtime Database
  await createRecord(`users/${userId}`, {
    ...userProfile,
    createdAt: now.getTime()
  });
  
  // Populate character stats
  const characterStats = {
    userId,
    characterId: 'default',
    stats: {
      strength: 10,
      intelligence: 8,
      creativity: 7,
      focus: 9
    },
    createdAt: now.getTime()
  };
  
  await setDoc(doc(db, 'characterStats', userId), characterStats);
  await createRecord(`characterStats/${userId}`, characterStats);
  
  // Populate tasks
  const tasks = [
    {
      userId,
      title: 'Complete project report',
      description: 'Finish the report by the end of the week.',
      completed: false,
      points: 10,
      time: '10:00 AM',
      createdAt: now
    },
    {
      userId,
      title: 'Prepare for presentation',
      description: 'Practice the presentation for the team meeting.',
      completed: false,
      points: 15,
      time: '2:00 PM',
      createdAt: now
    }
  ];
  
  for (const task of tasks) {
    // Add to Firestore
    const docRef = await addDoc(collection(db, 'tasks'), {
      ...task,
      createdAt: Timestamp.fromDate(task.createdAt)
    });
    
    // Add to Realtime Database
    await createRecord(`tasks/${docRef.id}`, {
      ...task,
      createdAt: task.createdAt.getTime()
    });
  }
  
  // Populate calendar events
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);
  
  const tomorrowEnd = new Date(tomorrow);
  tomorrowEnd.setHours(11, 0, 0, 0);
  
  const events = [
    {
      userId,
      title: 'Team Meeting',
      description: 'Weekly team sync-up',
      location: 'Conference Room A',
      startTime: tomorrow,
      endTime: tomorrowEnd,
      allDay: false,
      attendees: [],
      createdAt: now
    }
  ];
  
  for (const event of events) {
    // Add to Firestore
    const docRef = await addDoc(collection(db, 'events'), {
      ...event,
      startTime: Timestamp.fromDate(event.startTime),
      endTime: Timestamp.fromDate(event.endTime),
      createdAt: Timestamp.fromDate(event.createdAt)
    });
    
    // Add to Realtime Database
    await createRecord(`events/${docRef.id}`, {
      ...event,
      startTime: event.startTime.getTime(),
      endTime: event.endTime.getTime(),
      createdAt: event.createdAt.getTime()
    });
  }
  
  // Populate habits
  const habits = [
    {
      userId,
      habitName: 'Exercise',
      frequency: 'daily',
      streak: 0,
      lastCompleted: null,
      createdAt: now
    }
  ];
  
  for (const habit of habits) {
    // Add to Firestore
    const docRef = await addDoc(collection(db, 'habits'), {
      ...habit,
      createdAt: Timestamp.fromDate(habit.createdAt)
    });
    
    // Add to Realtime Database
    await createRecord(`habits/${docRef.id}`, {
      ...habit,
      createdAt: habit.createdAt.getTime()
    });
  }
  
  // Initialize rank
  const rankData = {
    userId,
    rank: 'Private',
    points: 0,
    createdAt: now.getTime()
  };
  
  await setDoc(doc(db, 'ranks', userId), rankData);
  await createRecord(`ranks/${userId}`, rankData);
};