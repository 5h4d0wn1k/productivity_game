import { getDatabase, ref, set, get, update, remove, push, query, orderByChild, equalTo, onValue, off } from 'firebase/database';
import { rtdb } from '../config/firebase';

// Create a new record
export const createRecord = async (path: string, data: any) => {
  try {
    await set(ref(rtdb, path), data);
    console.log('Record created successfully');
    return data;
  } catch (error) {
    console.error('Error creating record:', error);
    throw error;
  }
};

// Create a record with auto-generated ID
export const createRecordWithId = async (path: string, data: any) => {
  try {
    const newRef = push(ref(rtdb, path));
    await set(newRef, data);
    console.log('Record created successfully with ID:', newRef.key);
    return { id: newRef.key, ...data };
  } catch (error) {
    console.error('Error creating record:', error);
    throw error;
  }
};

// Read a record
export const readRecord = async (path: string) => {
  try {
    const snapshot = await get(ref(rtdb, path));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log('No data available at path:', path);
      return null;
    }
  } catch (error) {
    console.error('Error reading record:', error);
    throw error;
  }
};

// Read records by query
export const queryRecords = async (path: string, childKey: string, childValue: any) => {
  try {
    const recordsQuery = query(ref(rtdb, path), orderByChild(childKey), equalTo(childValue));
    const snapshot = await get(recordsQuery);
    
    if (snapshot.exists()) {
      const records: Record<string, any> = {};
      snapshot.forEach((childSnapshot) => {
        records[childSnapshot.key!] = childSnapshot.val();
      });
      return records;
    } else {
      console.log('No records found matching query');
      return {};
    }
  } catch (error) {
    console.error('Error querying records:', error);
    throw error;
  }
};

// Update a record
export const updateRecord = async (path: string, data: any) => {
  try {
    await update(ref(rtdb, path), data);
    console.log('Record updated successfully');
    return data;
  } catch (error) {
    console.error('Error updating record:', error);
    throw error;
  }
};

// Delete a record
export const deleteRecord = async (path: string) => {
  try {
    await remove(ref(rtdb, path));
    console.log('Record deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting record:', error);
    throw error;
  }
};

// Subscribe to real-time updates
export const subscribeToRecord = (path: string, callback: (data: any) => void) => {
  const recordRef = ref(rtdb, path);
  onValue(recordRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
  
  // Return function to unsubscribe
  return () => off(recordRef);
};

// Subscribe to real-time updates with query
export const subscribeToQuery = (path: string, childKey: string, childValue: any, callback: (data: Record<string, any>) => void) => {
  const recordsQuery = query(ref(rtdb, path), orderByChild(childKey), equalTo(childValue));
  
  onValue(recordsQuery, (snapshot) => {
    const records: Record<string, any> = {};
    snapshot.forEach((childSnapshot) => {
      records[childSnapshot.key!] = childSnapshot.val();
    });
    callback(records);
  });
  
  // Return function to unsubscribe
  return () => off(recordsQuery);
};