

import { useState, useEffect } from 'react';
import { 
  auth,
  db,
  collection, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  query, 
  where,
  onSnapshot,
  serverTimestamp,
  setDoc,  
  getDoc   
} from '../firebase';

export const useFirestoreData = () => {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = auth.currentUser;

  
  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setBudgets({});
      setIncome([]);
      setLoading(false);
      return;
    }

    console.log('📥 Loading data for user:', user.uid);
    setLoading(true);

  
    const expensesQuery = query(
      collection(db, 'expenses'),
      where('userId', '==', user.uid)
    );

    const unsubscribeExpenses = onSnapshot(expensesQuery, (snapshot) => {
      const expenseData = [];
      snapshot.forEach((doc) => {
        expenseData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      expenseData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setExpenses(expenseData);
      console.log('✅ Expenses loaded:', expenseData.length);
    }, (err) => {
      console.error('Error loading expenses:', err);
      setError('Failed to load expenses');
    });

  
    const budgetRef = doc(db, 'budgets', user.uid);
    const unsubscribeBudgets = onSnapshot(budgetRef, (docSnapshot) => {
      console.log('📥 Budgets snapshot received');
      
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        console.log('✅ Budgets loaded from Firestore:', data);
        setBudgets(data);
      } else {
        console.log('📝 No budgets found, creating default');
        // Create default budgets
        const defaultBudgets = {
          Food: 0,
          Utilities: 0,
          Transport: 0,
          Shopping: 0,
          Health: 0,
          Entertainment: 0,
          Other: 0
        };
        
       
        const budgetDoc = doc(db, 'budgets', user.uid);
        setDoc(budgetDoc, defaultBudgets)
          .then(() => {
            console.log('✅ Default budgets created in Firestore');
            setBudgets(defaultBudgets);
          })
          .catch((err) => {
            console.error('❌ Error creating default budgets:', err);
            setError('Failed to create default budgets');
          });
      }
    }, (err) => {
      console.error('Error loading budgets:', err);
      setError('Failed to load budgets');
    });

    
    const incomeQuery = query(
      collection(db, 'income'),
      where('userId', '==', user.uid)
    );

    const unsubscribeIncome = onSnapshot(incomeQuery, (snapshot) => {
      const incomeData = [];
      snapshot.forEach((doc) => {
        incomeData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      incomeData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setIncome(incomeData);
      setLoading(false);
      console.log('✅ Income loaded:', incomeData.length);
    }, (err) => {
      console.error('Error loading income:', err);
      setError('Failed to load income');
      setLoading(false);
    });

    return () => {
      unsubscribeExpenses();
      unsubscribeBudgets();
      unsubscribeIncome();
    };
  }, [user]);

  
  const addExpense = async (newExpense) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const docRef = await addDoc(collection(db, 'expenses'), {
        ...newExpense,
        userId: user.uid,
        email: user.email,
        createdAt: serverTimestamp()
      });
      console.log('✅ Expense added:', docRef.id);
      return { id: docRef.id, ...newExpense };
    } catch (err) {
      console.error('Error adding expense:', err);
      throw err;
    }
  };

  const deleteExpense = async (id) => {
    if (!user) throw new Error('User not authenticated');
    try {
      await deleteDoc(doc(db, 'expenses', id));
      console.log('✅ Expense deleted:', id);
    } catch (err) {
      console.error('Error deleting expense:', err);
      throw err;
    }
  };

  const updateExpense = async (id, updatedData) => {
    if (!user) throw new Error('User not authenticated');
    try {
      await updateDoc(doc(db, 'expenses', id), updatedData);
      console.log('✅ Expense updated:', id);
    } catch (err) {
      console.error('Error updating expense:', err);
      throw err;
    }
  };

  const updateBudget = async (category, amount) => {
    if (!user) {
      console.error('❌ No user authenticated');
      throw new Error('User not authenticated');
    }
    
    try {
      console.log('📤 Updating budget:', { category, amount, user: user.uid });
      
     
      const currentBudgets = { ...budgets };
      currentBudgets[category] = Number(amount);
      
     
      const budgetRef = doc(db, 'budgets', user.uid);
      await setDoc(budgetRef, currentBudgets);
      
      console.log('✅ Budget updated in Firestore:', category, amount);
      
      // Update local state immediately
      setBudgets(currentBudgets);
      
      return currentBudgets;
    } catch (err) {
      console.error('❌ Error updating budget:', err);
      throw err;
    }
  };

 
  const addIncome = async (newIncome) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const docRef = await addDoc(collection(db, 'income'), {
        ...newIncome,
        userId: user.uid,
        email: user.email,
        createdAt: serverTimestamp()
      });
      console.log('✅ Income added:', docRef.id);
      return { id: docRef.id, ...newIncome };
    } catch (err) {
      console.error('Error adding income:', err);
      throw err;
    }
  };

  const deleteIncome = async (id) => {
    if (!user) throw new Error('User not authenticated');
    try {
      await deleteDoc(doc(db, 'income', id));
      console.log('✅ Income deleted:', id);
    } catch (err) {
      console.error('Error deleting income:', err);
      throw err;
    }
  };

  return {
    expenses,
    budgets,
    income,
    loading,
    error,
    addExpense,
    deleteExpense,
    updateExpense,
    updateBudget,
    addIncome,
    deleteIncome
  };
};