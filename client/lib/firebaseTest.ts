import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

// Simple test function to check Firebase connection
export const testFirebaseConnection = async (): Promise<boolean> => {
  try {
    console.log('Testing Firebase connection...');
    
    // Try to write a test document
    const testRef = doc(db, 'test', 'connection-test');
    await setDoc(testRef, {
      message: 'Firebase connection successful!',
      timestamp: new Date()
    });
    
    console.log('✅ Firebase connection test successful!');
    return true;
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error);
    return false;
  }
};
