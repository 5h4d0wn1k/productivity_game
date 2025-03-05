import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Calendar event interface
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startTime: Date;
  endTime: Date;
  allDay?: boolean;
  attendees?: string[];
  recurrence?: string[];
}

// Google Calendar API base URL
const CALENDAR_API_BASE_URL = 'https://www.googleapis.com/calendar/v3';

// Get access token based on platform
async function getAccessToken(): Promise<string> {
  if (Platform.OS === 'web') {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/calendar');
    
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      return credential?.accessToken || '';
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  } else {
    try {
      const { accessToken } = await GoogleSignin.getTokens();
      return accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }
}

// Get events from Google Calendar
export const listEvents = async (
  timeMin: Date = new Date(),
  timeMax: Date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  maxResults: number = 100
): Promise<CalendarEvent[]> => {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(
      `${CALENDAR_API_BASE_URL}/calendars/primary/events?` +
      new URLSearchParams({
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        maxResults: maxResults.toString(),
        singleEvents: 'true',
        orderBy: 'startTime',
      }),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }

    const data = await response.json();
    return (data.items || []).map((event: any) => ({
      id: event.id,
      title: event.summary,
      description: event.description,
      location: event.location,
      startTime: new Date(event.start?.dateTime || event.start?.date),
      endTime: new Date(event.end?.dateTime || event.end?.date),
      allDay: !event.start?.dateTime,
      attendees: event.attendees?.map((a: { email: string }) => a.email),
      recurrence: event.recurrence,
    }));
  } catch (error) {
    console.error('Error listing calendar events:', error);
    throw error;
  }
};

// Create a new event in Google Calendar
export const createEvent = async (event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> => {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(
      `${CALENDAR_API_BASE_URL}/calendars/primary/events`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: event.title,
          description: event.description,
          location: event.location,
          start: {
            dateTime: event.allDay ? undefined : event.startTime.toISOString(),
            date: event.allDay ? event.startTime.toISOString().split('T')[0] : undefined,
          },
          end: {
            dateTime: event.allDay ? undefined : event.endTime.toISOString(),
            date: event.allDay ? event.endTime.toISOString().split('T')[0] : undefined,
          },
          attendees: event.attendees?.map(email => ({ email })),
          recurrence: event.recurrence,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create event: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      id: data.id,
      title: data.summary,
      description: data.description,
      location: data.location,
      startTime: new Date(data.start?.dateTime || data.start?.date),
      endTime: new Date(data.end?.dateTime || data.end?.date),
      allDay: !data.start?.dateTime,
      attendees: data.attendees?.map((a: { email: string }) => a.email),
      recurrence: data.recurrence,
    };
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
};

// Update an existing event in Google Calendar
export const updateEvent = async (event: CalendarEvent): Promise<CalendarEvent> => {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(
      `${CALENDAR_API_BASE_URL}/calendars/primary/events/${event.id}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: event.title,
          description: event.description,
          location: event.location,
          start: {
            dateTime: event.allDay ? undefined : event.startTime.toISOString(),
            date: event.allDay ? event.startTime.toISOString().split('T')[0] : undefined,
          },
          end: {
            dateTime: event.allDay ? undefined : event.endTime.toISOString(),
            date: event.allDay ? event.endTime.toISOString().split('T')[0] : undefined,
          },
          attendees: event.attendees?.map(email => ({ email })),
          recurrence: event.recurrence,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update event: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      id: data.id,
      title: data.summary,
      description: data.description,
      location: data.location,
      startTime: new Date(data.start?.dateTime || data.start?.date),
      endTime: new Date(data.end?.dateTime || data.end?.date),
      allDay: !data.start?.dateTime,
      attendees: data.attendees?.map((a: { email: string }) => a.email),
      recurrence: data.recurrence,
    };
  } catch (error) {
    console.error('Error updating calendar event:', error);
    throw error;
  }
};

// Delete an event from Google Calendar
export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(
      `${CALENDAR_API_BASE_URL}/calendars/primary/events/${eventId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete event: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    throw error;
  }
};