import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Clock, MapPin, Users, X } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, createEvent, getUserEvents } from '../services/firebase';
import DateTimePicker from '@react-native-community/datetimepicker';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startTime: Date;
  endTime: Date;
  allDay?: boolean;
  attendees?: string[];
}

export default function CalendarScreen() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGoogleCalendarLinked, setIsGoogleCalendarLinked] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'start' | 'end'>('start');
  
  // New event form state
  const [newEvent, setNewEvent] = useState<Omit<CalendarEvent, 'id'>>({
    title: '',
    description: '',
    location: '',
    startTime: new Date(),
    endTime: new Date(Date.now() + 60 * 60 * 1000),
    allDay: false,
    attendees: [],
  });
  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    if (user) {
      checkGoogleCalendarStatus();
      loadEvents();
    }
  }, [user, selectedDate]);

  const checkGoogleCalendarStatus = async () => {
    try {
      const userProfile = await getUserProfile(user!.uid);
      setIsGoogleCalendarLinked(!!userProfile?.calendarSyncEnabled);
    } catch (error) {
      console.error('Error checking Google Calendar status:', error);
    }
  };

  const handleAddEvent = async () => {
    try {
      if (!newEvent.title) {
        Alert.alert('Error', 'Please enter an event title');
        return;
      }

      setLoading(true);
      const createdEvent = await createEvent(user!.uid, newEvent);
      setEvents(prevEvents => [...prevEvents, createdEvent as CalendarEvent]);
      setShowAddEventModal(false);
      setNewEvent({
        title: '',
        description: '',
        location: '',
        startTime: new Date(),
        endTime: new Date(Date.now() + 60 * 60 * 1000),
        allDay: false,
        attendees: [],
      });
      Alert.alert('Success', 'Event created successfully!');
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Error', 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const fetchedEvents = await getUserEvents(user!.uid, startOfDay, endOfDay);
      setEvents(fetchedEvents as CalendarEvent[]);
    } catch (error) {
      console.error('Error loading events:', error);
      Alert.alert('Error', 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const days = [];

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
    }

    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isSelectedDate = (date: Date | null) => {
    if (!date) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      const newDate = new Date(date);
      if (pickerMode === 'start') {
        setNewEvent(prev => ({
          ...prev,
          startTime: newDate,
          endTime: new Date(newDate.getTime() + 60 * 60 * 1000),
        }));
      } else {
        setNewEvent(prev => ({
          ...prev,
          endTime: newDate,
        }));
      }
    }
  };

  const handleTimeChange = (event: any, date?: Date) => {
    setShowTimePicker(false);
    if (date) {
      if (pickerMode === 'start') {
        setNewEvent(prev => ({
          ...prev,
          startTime: date,
          endTime: new Date(date.getTime() + 60 * 60 * 1000),
        }));
      } else {
        setNewEvent(prev => ({
          ...prev,
          endTime: date,
        }));
      }
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.message}>Please sign in to view your calendar</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendar</Text>
        {!isGoogleCalendarLinked && (
          <TouchableOpacity 
            style={styles.syncButton}
            onPress={() => {
              Alert.alert('Coming Soon', 'Google Calendar sync functionality will be available soon!');
            }}
          >
            <Text style={styles.syncButtonText}>Sync with Google</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={goToPreviousMonth}>
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.monthYearText}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Text>
        <TouchableOpacity onPress={goToNextMonth}>
          <ChevronRight size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.daysOfWeek}>
        {daysOfWeek.map((day, index) => (
          <Text key={index} style={styles.dayOfWeekText}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.calendarGrid}>
        {generateCalendarDays().map((date, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.calendarDay,
              isSelectedDate(date) && styles.selectedDay,
              isToday(date) && styles.today,
            ]}
            onPress={() => date && setSelectedDate(date)}
            disabled={!date}
          >
            {date && (
              <Text
                style={[
                  styles.calendarDayText,
                  isSelectedDate(date) && styles.selectedDayText,
                  isToday(date) && styles.todayText,
                ]}
              >
                {date.getDate()}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.eventsHeader}>
        <Text style={styles.eventsTitle}>
          Events for {selectedDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
        </Text>
        <TouchableOpacity
          style={styles.addEventButton}
          onPress={() => setShowAddEventModal(true)}
        >
          <Plus size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <ScrollView style={styles.eventsList}>
          {events.length === 0 ? (
            <Text style={styles.noEventsText}>No events scheduled for this day</Text>
          ) : (
            events.map((event) => (
              <View key={event.id} style={styles.eventItem}>
                <View style={styles.eventTimeContainer}>
                  <Text style={styles.eventTime}>
                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                  </Text>
                </View>
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  {event.description && (
                    <Text style={styles.eventDescription}>{event.description}</Text>
                  )}
                  {event.location && (
                    <View style={styles.eventLocationContainer}>
                      <MapPin size={14} color="#666" />
                      <Text style={styles.eventLocation}>{event.location}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      <Modal
        visible={showAddEventModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddEventModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Event</Text>
              <TouchableOpacity onPress={() => setShowAddEventModal(false)}>
                <X size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <Text style={styles.inputLabel}>Event Title</Text>
              <TextInput
                style={styles.input}
                value={newEvent.title}
                onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
                placeholder="Enter event title"
              />

              <Text style={styles.inputLabel}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newEvent.description}
                onChangeText={(text) => setNewEvent({ ...newEvent, description: text })}
                placeholder="Enter event description"
                multiline
              />

              <Text style={styles.inputLabel}>Location (Optional)</Text>
              <TextInput
                style={styles.input}
                value={newEvent.location}
                onChangeText={(text) => setNewEvent({ ...newEvent, location: text })}
                placeholder="Enter event location"
              />

              <Text style={styles.inputLabel}>Start Time</Text>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => {
                  setPickerMode('start');
                  setShowDatePicker(true);
                }}
              >
                <CalendarIcon size={16} color="#000" />
                <Text style={styles.dateTimeButtonText}>
                  {newEvent.startTime.toLocaleDateString()}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => {
                  setPickerMode('start');
                  setShowTimePicker(true);
                }}
              >
                <Clock size={16} color="#000" />
                <Text style={styles.dateTimeButtonText}>
                  {formatTime(newEvent.startTime)}
                </Text>
              </TouchableOpacity>

              <Text style={styles.inputLabel}>End Time</Text>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => {
                  setPickerMode('end');
                  setShowDatePicker(true);
                }}
              >
                <CalendarIcon size={16} color="#000" />
                <Text style={styles.dateTimeButtonText}>
                  {newEvent.endTime.toLocaleDateString()}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => {
                  setPickerMode('end');
                  setShowTimePicker(true);
                }}
              >
                <Clock size={16} color="#000" />
                <Text style={styles.dateTimeButtonText}>
                  {formatTime(newEvent.endTime)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.createEventButton}
                onPress={handleAddEvent}
              >
                <Text style={styles.createEventButtonText}>Create Event</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          value={pickerMode === 'start' ? newEvent.startTime : newEvent.endTime}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={pickerMode === 'start' ? newEvent.startTime : newEvent.endTime}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
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
  syncButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  syncButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#000',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  monthYearText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#000',
  },
  daysOfWeek: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  dayOfWeekText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  calendarDayText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#000',
  },
  selectedDay: {
    backgroundColor: '#000',
    borderRadius: 20,
  },
  selectedDayText: {
    color: '#fff',
  },
  today: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  todayText: {
    fontFamily: 'Inter-SemiBold',
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  eventsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#000',
  },
  addEventButton: {
    backgroundColor: '#000',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  noEventsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  eventItem: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  eventTimeContainer: {
    marginRight: 16,
  },
  eventTime: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#000',
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000',
    marginBottom: 4,
  },
  eventDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  eventLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventLocation: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#000',
  },
  modalForm: {
    maxHeight: '90%',
  },
  inputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  dateTimeButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginLeft: 8,
  },
  createEventButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  createEventButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});