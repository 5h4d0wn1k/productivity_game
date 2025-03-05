import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Star, Zap, Award } from 'lucide-react-native';
import { Link } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, getUserRank, getUserTasks, getCharacterStats } from '../services/firebase';

export default function HomeScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userRank, setUserRank] = useState('Private');
  const [tasks, setTasks] = useState<any[]>([]);
  const [characterStats, setCharacterStats] = useState<any>({
    stats: {
      strength: 10,
      intelligence: 10,
      creativity: 10,
      focus: 10
    }
  });

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load user profile
      const profile = await getUserProfile(user!.uid);
      setUserProfile(profile);
      
      // Load user rank
      const rankData = await getUserRank(user!.uid);
      if (rankData) {
        setUserRank(rankData.rank);
      }
      
      // Load tasks
      const userTasks = await getUserTasks(user!.uid);
      setTasks(userTasks.filter((task: any) => !task.completed).slice(0, 3));
      
      // Load character stats
      const stats = await getCharacterStats(user!.uid);
      if (stats) {
        setCharacterStats(stats);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.message}>Please sign in to view your dashboard</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello {userRank}, {userProfile?.username || user.displayName || 'Adventurer'}</Text>
          <Text style={styles.subtitle}>Ready to level up today?</Text>
        </View>

        <View style={styles.characterContainer}>
          {user && user.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.characterImage} />
          ) : (
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=500&auto=format&fit=crop' }} 
              style={styles.characterImage} 
            />
          )}
          <View style={styles.characterStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Level</Text>
              <Text style={styles.statValue}>{Math.floor(Math.sqrt((userProfile?.points || 0) / 10)) + 1}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Strength</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${characterStats.stats.strength}%` }]} />
              </View>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Focus</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${characterStats.stats.focus}%` }]} />
              </View>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Creativity</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${characterStats.stats.creativity}%` }]} />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Tasks</Text>
            <Link href="/tasks" asChild>
              <TouchableOpacity>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </Link>
          </View>
          
          <View style={styles.taskList}>
            {tasks.length === 0 ? (
              <Text style={styles.noTasksText}>No tasks for today. Add some tasks to get started!</Text>
            ) : (
              tasks.map((task) => (
                <TouchableOpacity key={task.id} style={styles.taskItem}>
                  <View style={styles.taskCheckbox} />
                  <View style={styles.taskContent}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <Text style={styles.taskTime}>{task.time || 'No time set'}</Text>
                  </View>
                  <View style={styles.taskReward}>
                    <Star size={14} color="#000" />
                    <Text style={styles.rewardText}>+{task.points || 10}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Weekly Challenge</Text>
            <TouchableOpacity>
              <ChevronRight size={20} color="#000" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.challengeCard}>
            <View style={styles.challengeHeader}>
              <Award size={24} color="#000" />
              <Text style={styles.challengeTitle}>Productivity Master</Text>
            </View>
            <Text style={styles.challengeDescription}>
              Complete 20 tasks this week to earn a special weapon for your character!
            </Text>
            <View style={styles.challengeProgress}>
              <Text style={styles.progressText}>{userProfile?.completedTasks || 0}/20 completed</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${Math.min(100, ((userProfile?.completedTasks || 0) / 20) * 100)}%` }]} />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Meta Space</Text>
            <Link href="/components/metspace" asChild>
              <TouchableOpacity style={styles.enterButton}>
                <Text style={styles.enterButtonText}>Enter Meta Space</Text>
              </TouchableOpacity>
            </Link>
          </View>
          
          <View style={styles.metaSpacePreview}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=500&auto=format&fit=crop' }} 
              style={styles.metaSpaceImage} 
            />
            <View style={styles.metaSpaceOverlay}>
              <Text style={styles.metaSpaceText}>Your Workspace</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#000',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  characterContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  characterImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 16,
  },
  characterStats: {
    flex: 1,
    justifyContent: 'center',
  },
  statItem: {
    marginBottom: 8,
  },
  statLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#000',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#000',
  },
  seeAll: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
  },
  taskList: {
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    padding: 8,
  },
  noTasksText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    padding: 16,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  taskCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#000',
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#000',
  },
  taskTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  taskReward: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rewardText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#000',
    marginLeft: 4,
  },
  challengeCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    padding: 16,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#000',
    marginLeft: 12,
  },
  challengeDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  challengeProgress: {
    marginTop: 8,
  },
  progressText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#000',
    marginBottom: 8,
  },
  metaSpacePreview: {
    position: 'relative',
    height: 150,
    borderRadius: 16,
    overflow: 'hidden',
  },
  metaSpaceImage: {
    width: '100%',
    height: '100%',
  },
  metaSpaceOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
  metaSpaceText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#fff',
  },
  enterButton: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#000',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  enterButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#000',
  },
  userPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
});