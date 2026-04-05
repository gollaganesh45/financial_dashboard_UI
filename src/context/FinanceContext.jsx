import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const INITIAL_TRANSACTIONS = [
  { id: 1, date: '2026-04-01', amount: 3500, category: 'Salary', type: 'income', description: 'Monthly Salary' },
  { id: 2, date: '2026-04-02', amount: 120, category: 'Food', type: 'expense', description: 'Groceries' },
  { id: 3, date: '2026-04-03', amount: 45, category: 'Transport', type: 'expense', description: 'Gas Station' },
  { id: 4, date: '2026-04-05', amount: 1200, category: 'Housing', type: 'expense', description: 'Rent' },
  { id: 5, date: '2026-04-08', amount: 300, category: 'Freelance', type: 'income', description: 'Web Design Project' },
  { id: 6, date: '2026-04-10', amount: 60, category: 'Entertainment', type: 'expense', description: 'Movie Tickets' },
  { id: 7, date: '2026-04-15', amount: 150, category: 'Utilities', type: 'expense', description: 'Electricity Bill' },
];

const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('dashboard_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  
  const [role, setRole] = useState('Admin'); // Default to Admin for full experience
  const [theme, setTheme] = useState('dark');

  // Persist transactions
  useEffect(() => {
    localStorage.setItem('dashboard_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Handle Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const addTransaction = (transaction) => {
    if (role === 'Viewer') return;
    setTransactions(prev => [transaction, ...prev]);
  };

  const deleteTransaction = (id) => {
    if (role === 'Viewer') return;
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Derived Calculations
  const { totalIncome, totalExpense, balance } = useMemo(() => {
    let inc = 0, exp = 0;
    transactions.forEach(t => {
      if (t.type === 'income') inc += t.amount;
      else exp += t.amount;
    });
    return { totalIncome: inc, totalExpense: exp, balance: inc - exp };
  }, [transactions]);

  const categoryData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    return Object.entries(grouped)
                 .map(([name, value]) => ({ name, value }))
                 .sort((a,b) => b.value - a.value);
  }, [transactions]);

  const highestExpenseCategory = categoryData[0]?.name || 'N/A';
  const highestExpenseAmount = categoryData[0]?.value || 0;

  const insights = useMemo(() => {
    // Generate intelligent insights
    let topInsight = "";
    if (totalExpense > totalIncome) {
      topInsight = "Warning: Expenses exceed income. Review spending.";
    } else if (highestExpenseCategory !== 'N/A') {
      const percentage = Math.round((highestExpenseAmount / totalExpense) * 100);
      topInsight = `${highestExpenseCategory} accounts for ${percentage}% of all expenses.`;
    } else {
      topInsight = "Your financial health looks stable.";
    }
    
    return {
      highestExpenseCategory,
      highestExpenseAmount,
      topInsight
    };
  }, [totalExpense, totalIncome, highestExpenseCategory, highestExpenseAmount]);

  const value = {
    transactions,
    addTransaction,
    deleteTransaction,
    role,
    setRole,
    theme,
    toggleTheme,
    totalIncome,
    totalExpense,
    balance,
    categoryData,
    insights
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export const useFinance = () => useContext(FinanceContext);
