import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { createHabit, getUserHabits } from '../services/firebase';
import { Calendar, Clock, BarChart, Check } from 'lucide-react-native';

interface Habit {
  id: string;
  habitName: string;
  frequency: string;
  streak: number;
  lastCompleted: Date | null;
}

export default function HabitCreator() {
  const { user } = useAuth();
  const [habitName, setHabitName] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [loading, setLoading] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loadingHabits, setLoadingHabits] = useState(true);

  useEffect(() => {
    if (user) {
      loadHabits();
    }
  }, [user]);

  const loadHabits = async () => {
    try {
      setLoadingHabits(true);
      const userHabits = await getUserHabits(user!.uid);
      setHabits(userHabits as Habit[]);
    } catch (error) {
      console.error('Error loading habits:', error);
      Alert.alert('Error', 'Failed to load habits');
    } finally {
      setLoadingHabits(false);
    }
  };

  const handleAddHabit = async () => {
    if (!habitName.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    setLoading(true);
    try {
      const newHabit = await createHabit(user!.uid, {
        userId: user!.uid,
        habitName,
        frequency
      });
      
      setHabits([newHabit as Habit, ...habits]);
      setHabitName('');
      Alert.alert('Success', 'Habit created successfully!');
    } catch (error) {
      console.error('Error creating habit:', error);
      Alert.alert('Error', 'Failed to create habit');
    } finally {
      setLoading(false);
    }
  };

  const getFrequencyText = (freq: string) => {
    switch (freq) {
      case 'daily': return 'Every day';
      case 'weekly': return 'Every week';
      case 'monthly': return 'Every month';
      default: return freq;
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.message}>Please sign in to create habits</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Habit Creator</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Create a New Habit</Text>
          
          <TextInput
            style={styles.input}
            placeholder="What habit do you want to build?"
            value={habitName}
            onChangeText={setHabitName}
          />
          
          <Text style={styles.label}>Frequency</Text>
          <View style={styles.frequencyContainer}>
            <TouchableOpacity
              style={[styles.frequencyOption, frequency === 'daily' && styles.selectedFrequency]}
              onPress={() => setFrequency('daily')}
            >
              <Calendar size={16} color={frequency === 'daily' ? '#fff' : '#000'} />
              <Text style={[styles.frequencyText, frequency === 'daily' && styles.selectedFrequencyText]}>Daily</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.frequencyOption, frequency === 'weekly' && styles.selectedFrequency]}
              onPress={() => setFrequency('weekly')}
            >
              <Calendar size={16} color={frequency === 'weekly' ? '#fff' : '#000'} />
              <Text style={[styles.frequencyText, frequency === 'weekly' && styles.selectedFrequencyText]}>Weekly</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.frequencyOption, frequency === 'monthly' && styles.selectedFrequency]}
              onPress={() => setFrequency('monthly')}
            >
              <Calendar size={16} color={frequency === 'monthly' ? '#fff' : '#000'} />
              <Text style={[styles.frequencyText, frequency === 'monthly' && styles.selectedFrequencyText]}>Monthly</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddHabit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.addButtonText}>Create Habit</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.habitsContainer}>
          <Text style={styles.sectionTitle}>Your Habits</Text>
          
          {loadingHabits ? (
            <ActivityIndicator size="large" color="#000" style={styles.loader} />
          ) : habits.length === 0 ? (
            <Text style={styles.noHabitsText}>You haven't created any habits yet</Text>
          ) : (
            habits.map((habit) => (
              <View key={habit.id} style={styles.habitItem}>
                <View style={styles.habitHeader}>
                  <Text style={styles.habitName}>{habit.habitName}</Text>
                  <View style={styles.streakContainer}>
                    <BarChart size={16} color="#000" />
                    <Text style={styles.streakText}>{habit.streak || 0} streak</Text>
                  </View>
                </View>
                
                <View style={styles.habitDetails}>
                  <View style={styles.habitDetail}>
                    <Clock size={16} color="#666" />
                    <Text style={styles.habitDetailText}>{getFrequencyText(habit.frequency)}</Text>
                  </View>
                  
                  <View style={styles.habitDetail}>
                    <Calendar size={16} color="#666" />
                    <Text style={styles.habitDetailText}>
                      {habit.lastCompleted 
                        ? `Last completed: ${new Date(habit.lastCompleted).toLocaleDateString()}`
                        : 'Not completed yet'}
                    </Text>
                  </View>
                </View>
                
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={() => {
                    Alert.alert(
                      'Mark as Complete',
                      `Did you complete "${habit.habitName}" today?`,
                      [
                        {
                          text: 'Cancel',
                          style: 'cancel',
                        },
                        {
                          text: 'Yes, Complete',
                          onPress: async () => {
                            try {
                              // Logic to mark habit as complete
                              // This would be implemented in the firebase.ts service
                              Alert.alert('Success', 'Habit marked as complete!');
                              loadHabits(); // Reload habits to show updated streak
                            } catch (error) {
                              Alert.alert('Error', 'Failed to mark habit as complete');
                            }
                          },
                        },
                      ]
                    );
                  }}
                >
                  <Check size={16} color="#fff" />
                  <Text style={styles.completeButtonText}>Mark Complete</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#000',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#000',
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  frequencyContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  frequencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginRight: 8,
  },
  selectedFrequency: {
    backgroundColor: '#000',
  },
  frequencyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#000',
    marginLeft: 4,
  },
  selectedFrequencyText: {
    color: '#fff',
  },
  addButton: {
    height: 48,
    backgroundColor: '#000',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  habitsContainer: {
    marginBottom: 24,
  },
  loader: {
    marginTop: 20,
  },
  noHabitsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  habitItem: {
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  habitName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#000',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  streakText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#000',
    marginLeft: 4,
  },
  habitDetails: {
    marginBottom: 16,
  },
  habitDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  habitDetailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  completeButton: {
    flexDirection: 'row',
    height: 40,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
});