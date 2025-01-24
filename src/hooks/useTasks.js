import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  addDoc, 
  updateDoc,
  doc,
  onSnapshot,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const tasksRef = collection(db, `users/${user.uid}/tasks`);
    const q = query(tasksRef, orderBy('dueDate', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Ensure completed is a boolean
        completed: doc.data().completed === true
      }));
      setTasks(tasksData);
      setLoading(false);
    },
    (err) => {
      console.error('Error fetching tasks:', err);
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const deleteTask = async (taskId) => {
    if (!user) throw new Error('Must be logged in to delete tasks');
    try {
      const taskRef = doc(db, `users/${user.uid}/tasks`, taskId);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const updateTask = async (taskId, updates) => {
    if (!user) throw new Error('Must be logged in to update tasks');
    try {
      const taskRef = doc(db, `users/${user.uid}/tasks`, taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  return { tasks, loading, error, deleteTask, updateTask };
}

export function useAddTask() {
  const { user } = useAuth();

  return async (taskData) => {
    if (!user) throw new Error('Must be logged in to add tasks');

    try {
      const tasksRef = collection(db, `users/${user.uid}/tasks`);
      
      // Don't modify the original dueDate, just store it as ISO string
      const docRef = await addDoc(tasksRef, {
        ...taskData,
        userId: user.uid,
        dueDate: taskData.dueDate, // Store the original date string
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      console.log('Task added successfully:', docRef.id);
      return docRef;
    } catch (error) {
      console.error('Error in useAddTask:', error);
      throw new Error(`Failed to add task: ${error.message}`);
    }
  };
}

export function useUpdateTask() {
  const { user } = useAuth();

  return async (taskId, updates) => {
    if (!user) throw new Error('Must be logged in to update tasks');

    const taskRef = doc(db, `users/${user.uid}/tasks`, taskId);
    return updateDoc(taskRef, updates);
  };
}

export function useDeleteTask() {
  const { user } = useAuth();

  return async (taskId) => {
    if (!user) throw new Error('Must be logged in to delete tasks');

    const taskRef = doc(db, `users/${user.uid}/tasks`, taskId);
    return deleteDoc(taskRef);
  };
} 