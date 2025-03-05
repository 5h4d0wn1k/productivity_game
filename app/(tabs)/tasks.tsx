import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, X, Clock, Star } from 'lucide-react-native';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  doc, 
  updateDoc, 
  getDocs 
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface Task {
  id: string;
  title: string;
  description?: string;
  time?: string;
  completed: boolean;
  points: number;
  userId: string;
  createdAt: Date;
  dueDate?: number;
}

const TasksScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [newTaskPoints, setNewTaskPoints] = useState('10');
  const [newTaskDueDate, setNewTaskDueDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'completed'>('today');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    // Real-time listener for tasks
    const tasksQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      try {
        const tasksData: Task[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt),
          dueDate: doc.data().dueDate || undefined
        } as Task));

        // Sort tasks by creation date (newest first)
        tasksData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setTasks(tasksData);
        setLoading(false);
      } catch (error) {
        console.error('Error processing tasks:', error);
        Alert.alert('Error', 'Failed to process tasks');
      }
    }, (error) => {
      console.error('Snapshot error:', error);
      Alert.alert('Error', 'Failed to load tasks');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const toggleTaskCompletion = async (id: string) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      const updatedTask = { ...task, completed: !task.completed };
      await updateDoc(taskRef, { completed: updatedTask.completed });

      // Optimistic update
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === id ? updatedTask : t)
      );
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const addNewTask = async () => {
    if (!newTaskTitle.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    try {
      setCreating(true);
      const newTaskData = {
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim() || undefined,
        time: newTaskTime.trim() || '12:00 PM',
        completed: false,
        points: parseInt(newTaskPoints) || 10,
        userId: user.uid,
        createdAt: Date.now(),
        dueDate: newTaskDueDate ? newTaskDueDate.getTime() : null
      };

      const docRef = await addDoc(collection(db, 'tasks'), newTaskData);
      
      // Reset form
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskTime('');
      setNewTaskPoints('10');
      setNewTaskDueDate(null);
      setShowNewTask(false);
      setCreating(false);

      Alert.alert('Success', 'Task created successfully!');
    } catch (error) {
      console.error('Error creating task:', error);
      Alert.alert('Error', 'Failed to create task');
      setCreating(false);
    }
  };

  const getFilteredTasks = (): Task[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      taskDate.setHours(0, 0, 0, 0);

      switch (activeTab) {
        case 'today':
          return taskDate.getTime() === today.getTime() && !task.completed;
        case 'upcoming':
          return taskDate.getTime() > today.getTime() && !task.completed;
        case 'completed':
          return task.completed;
        default:
          return true;
      }
    });
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleDateConfirm = (date: Date) => {
    setNewTaskDueDate(date);
    hideDatePicker();
  };

  const handleTimeConfirm = (time: Date) => {
    const updatedDate = newTaskDueDate || new Date();
    updatedDate.setHours(time.getHours(), time.getMinutes());
    setNewTaskDueDate(updatedDate);
    hideTimePicker();
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.message}>Please sign in to view your tasks</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowNewTask(true)}
          disabled={creating}
        >
          <Plus size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        {(['today', 'upcoming', 'completed'] as const).map(tab => (
          <TouchableOpacity 
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {showNewTask && (
        <View style={styles.newTaskContainer}>
          <View style={styles.newTaskHeader}>
            <Text style={styles.newTaskTitle}>New Task</Text>
            <TouchableOpacity 
              onPress={() => setShowNewTask(false)}
              disabled={creating}
            >
              <X size={20} color="#000" />
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={styles.newTaskInput}
            placeholder="What do you need to do?"
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            autoFocus
            editable={!creating}
          />
          
          <TextInput
            style={styles.newTaskInput}
            placeholder="Description (optional)"
            value={newTaskDescription}
            onChangeText={setNewTaskDescription}
            multiline
            editable={!creating}
          />
          
          <View style={styles.newTaskRow}>
            <View style={styles.newTaskHalf}>
              <Text style={styles.newTaskLabel}>Time</Text>
              <TextInput
                style={styles.newTaskSmallInput}
                placeholder="e.g., 3:00 PM"
                value={newTaskTime}
                onChangeText={setNewTaskTime}
                editable={!creating}
              />
            </View>
            
            <View style={styles.newTaskHalf}>
              <Text style={styles.newTaskLabel}>Points</Text>
              <TextInput
                style={styles.newTaskSmallInput}
                placeholder="10"
                value={newTaskPoints}
                onChangeText={setNewTaskPoints}
                keyboardType="numeric"
                editable={!creating}
              />
            </View>
          </View>
          
          <TouchableOpacity onPress={showDatePicker}>
            <Text style={styles.newTaskInput}>
              {newTaskDueDate ? newTaskDueDate.toLocaleString() : 'Select Due Date and Time'}
            </Text>
          </TouchableOpacity>
          
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleDateConfirm}
            onCancel={hideDatePicker}
          />
          
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleTimeConfirm}
            onCancel={hideTimePicker}
          />
          
          <TouchableOpacity 
            style={[styles.addTaskButton, creating && styles.disabledButton]}
            onPress={addNewTask}
            disabled={creating}
          >
            {creating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.addTaskButtonText}>Add Task</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.taskList}>
        {loading ? (
          <ActivityIndicator size="large" color="#000" style={styles.loader} />
        ) : getFilteredTasks().length === 0 ? (
          <Text style={styles.message}>
            {activeTab === 'today' ? 'No tasks for today. Add your first task!' : 
             activeTab === 'upcoming' ? 'No upcoming tasks.' : 
             'No completed tasks yet.'}
          </Text>
        ) : (
          getFilteredTasks().map(task => (
            <TouchableOpacity 
              key={task.id} 
              style={styles.taskItem}
              onPress={() => toggleTaskCompletion(task.id)}
            >
              <TouchableOpacity 
                style={[
                  styles.taskCheckbox,
                  task.completed && styles.taskCheckboxCompleted
                ]}
                onPress={() => toggleTaskCompletion(task.id)}
              >
                {task.completed && <View style={styles.checkmark} />}
              </TouchableOpacity>
              
              <View style={styles.taskContent}>
                <Text 
                  style={[
                    styles.taskTitle,
                    task.completed && styles.taskTitleCompleted
                  ]}
                >
                  {task.title}
                </Text>
                {task.description && (
                  <Text style={styles.taskDescription}>{task.description}</Text>
                )}
                {task.time && (
                  <View style={styles.taskTimeContainer}>
                    <Clock size={12} color="#666" />
                    <Text style={styles.taskTime}>{task.time}</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.taskPoints}>
                <Star size={14} color="#000" />
                <Text style={styles.pointsText}>+{task.points}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

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
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#000',
  },
  addButton: {
    backgroundColor: '#000',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#000',
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  taskList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  taskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskCheckboxCompleted: {
    backgroundColor: '#000',
  },
  checkmark: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#000',
    marginBottom: 4,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  taskDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  taskTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  taskPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#000',
    marginLeft: 4,
  },
  newTaskContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  newTaskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  newTaskTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#000',
  },
  newTaskInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
    marginBottom: 16,
  },
  newTaskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  newTaskHalf: {
    width: '48%',
  },
  newTaskLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  newTaskSmallInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addTaskButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#666',
  },
  addTaskButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  loader: {
    marginTop: 20,
  },
});

export default TasksScreen;