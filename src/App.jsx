import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Plus, 
  Settings, 
  LogOut,
  Moon,
  Sun,
  ShieldAlert,
  BarChart3,
  X,
  User,
  Lightbulb
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { useFinance } from './context/FinanceContext';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function App() {
  const { 
    transactions, addTransaction, deleteTransaction, 
    role, setRole, theme, toggleTheme,
    totalIncome, totalExpense, balance, categoryData, insights
  } = useFinance();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortType, setSortType] = useState('date_desc');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Trend Data for Line Chart
  const trendData = useMemo(() => {
    let currentBalance = 0;
    // Sort chronologically for the trend chart
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    return sorted.map(t => {
      currentBalance += t.type === 'income' ? t.amount : -t.amount;
      return {
        name: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        balance: currentBalance
      };
    });
  }, [transactions]);

  // Filtered & Sorted Transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let result = transactions.filter(t => filterType === 'all' || t.type === filterType);
    
    if (searchTerm) {
      result = result.filter(t => 
         t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
         t.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort logic
    result.sort((a, b) => {
      if (sortType === 'date_desc') return new Date(b.date) - new Date(a.date);
      if (sortType === 'date_asc') return new Date(a.date) - new Date(b.date);
      if (sortType === 'amount_desc') return b.amount - a.amount;
      if (sortType === 'amount_asc') return a.amount - b.amount;
      return 0;
    });

    return result;
  }, [transactions, searchTerm, filterType, sortType]);

  const handleAddTransaction = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTx = {
      id: Date.now(),
      description: formData.get('description'),
      amount: parseFloat(formData.get('amount')),
      date: formData.get('date'),
      category: formData.get('category'),
      type: formData.get('type')
    };
    addTransaction(newTx);
    setIsModalOpen(false);
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <Wallet className="text-accent-primary" size={28} />
          FinanceFlow
        </div>
        
        <nav>
          <a className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={20} /> Dashboard
          </a>
          <a className={`nav-link ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}>
            <ArrowRightLeft size={20} /> Transactions
          </a>
          <a className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
            <BarChart3 size={20} /> Analytics
          </a>
          <a className="nav-link" style={{ marginTop: 'auto' }}>
            <Settings size={20} /> Settings
          </a>
          <a className="nav-link text-danger" style={{ color: 'var(--danger)' }}>
            <LogOut size={20} /> Logout
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div>
            <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
            <p>Welcome back, here's your financial overview.</p>
          </div>
          
          <div className="header-actions">
            <div className="input-group" style={{ marginRight: '1rem' }}>
              <select 
                className="select" 
                value={role} 
                onChange={e => setRole(e.target.value)}
                style={{ appearance: 'auto', paddingRight: '2rem' }}
              >
                <option value="Admin">Role: Admin</option>
                <option value="Viewer">Role: Viewer</option>
              </select>
            </div>
            
            <button className="btn btn-icon btn-outline" onClick={toggleTheme} aria-label="Toggle Theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {role === 'Admin' && (
              <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                <Plus size={18} /> Add Transaction
              </button>
            )}
            
            <div className="user-profile">
              <div className="user-avatar">
                <User size={18} />
              </div>
              <span className="user-name">GOLLA GANESH</span>
            </div>
          </div>
        </header>

        {role === 'Viewer' && (
          <div className="glass-panel" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '4px solid var(--warning)' }}>
            <ShieldAlert size={20} color="var(--warning)" />
            <p style={{ margin: 0, fontSize: '0.9rem' }}>You are viewing this dashboard in <strong>Viewer mode</strong>. You cannot add or edit transactions. Switch to Admin mode to unlock features.</p>
          </div>
        )}

        {/* --- DASHBOARD OR ANALYTICS VIEW --- */}
        {(activeTab === 'dashboard' || activeTab === 'analytics') && (
          <div className="summary-cards">
            <div className="glass-panel stat-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="stat-header">
                <p>Total Balance</p>
                <div className="stat-icon" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}>
                  <Wallet color="var(--accent-primary)" size={20} />
                </div>
              </div>
              <div className="stat-value">${balance.toLocaleString()}</div>
              <div className="stat-trend trend-up">
                <TrendingUp size={16} /> Data synced successfully
              </div>
            </div>
            
            <div className="glass-panel stat-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="stat-header">
                <p>Total Income</p>
                <div className="stat-icon" style={{ backgroundColor: 'var(--success-bg)' }}>
                  <ArrowRightLeft color="var(--success)" size={20} />
                </div>
              </div>
              <div className="stat-value">${totalIncome.toLocaleString()}</div>
              <div className="stat-trend trend-up">
                <TrendingUp size={16} /> Active incoming sources
              </div>
            </div>

            <div className="glass-panel stat-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="stat-header">
                <p>Total Expenses</p>
                <div className="stat-icon" style={{ backgroundColor: 'var(--danger-bg)' }}>
                  <TrendingDown color="var(--danger)" size={20} />
                </div>
              </div>
              <div className="stat-value">${totalExpense.toLocaleString()}</div>
              <div className="stat-trend trend-down">
                Highest spent: {insights.highestExpenseCategory}
              </div>
            </div>
          </div>
        )}

        {/* --- INSIGHTS SECTION (Only visible on dashboard/analytics) --- */}
        {(activeTab === 'dashboard' || activeTab === 'analytics') && (
          <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.35s', borderLeft: '4px solid var(--accent-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="stat-icon" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}>
              <Lightbulb color="var(--accent-primary)" size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem' }}>Smart Insight</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{insights.topInsight}</p>
            </div>
          </div>
        )}

        {/* --- CHARTS GRID (Only visible on dashboard/analytics) --- */}
        {(activeTab === 'dashboard' || activeTab === 'analytics') && (
          <div className="dashboard-grid">
            <div className="col-span-8 glass-panel animate-fade-in" style={{ animationDelay: '0.4s', height: '350px' }}>
              <h3 style={{ marginBottom: '1rem' }}>Balance Trend</h3>
              <ResponsiveContainer width="100%" height="80%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={val => `$${val}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
                  />
                  <Line type="monotone" dataKey="balance" stroke="url(#colorUv)" strokeWidth={3} dot={{ fill: 'var(--accent-primary)', r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="var(--accent-primary)" />
                      <stop offset="100%" stopColor="var(--accent-secondary)" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="col-span-4 glass-panel animate-fade-in" style={{ animationDelay: '0.5s', height: '350px' }}>
              <h3 style={{ marginBottom: '1rem' }}>Spending by Category</h3>
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                  />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* --- TRANSACTIONS LIST --- */}
        {(activeTab === 'dashboard' || activeTab === 'transactions') && (
          <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="header" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h3>Recent Transactions</h3>
              <div className="header-actions" style={{ flexWrap: 'wrap' }}>
                <div className="input-group">
                  <Search size={16} className="input-icon" />
                  <input 
                    type="text" 
                    className="input" 
                    placeholder="Search tasks..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ minWidth: '200px' }}
                  />
                </div>
                
                {/* Type Filter */}
                <select 
                  className="select"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>

                {/* Sort Dropdown */}
                <select 
                  className="select"
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value)}
                >
                  <option value="date_desc">Newest First</option>
                  <option value="date_asc">Oldest First</option>
                  <option value="amount_desc">Highest Amount</option>
                  <option value="amount_asc">Lowest Amount</option>
                </select>
              </div>
            </div>

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedTransactions.length > 0 ? (
                    filteredAndSortedTransactions.map((tx) => (
                      <tr key={tx.id}>
                        <td style={{ fontWeight: 500 }}>{tx.description}</td>
                        <td>{tx.category}</td>
                        <td>{new Date(tx.date).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge ${tx.type === 'income' ? 'badge-success' : 'badge-danger'}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 600, color: tx.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                          {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>
                        <p>No transactions found.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* --- ADD TRANSACTION MODAL --- */}
      {isModalOpen && role === 'Admin' && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="header">
              <h2>Add Transaction</h2>
              <button className="btn-icon btn-outline" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddTransaction} style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input type="text" name="description" required className="form-input" placeholder="e.g. Groceries" />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Amount ($)</label>
                  <input type="number" name="amount" min="0" step="0.01" required className="form-input" placeholder="0.00" />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input type="date" name="date" required className="form-input" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select name="type" className="form-input select" required>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select name="category" className="form-input select" required>
                    <option value="Food">Food & Dining</option>
                    <option value="Transport">Transport</option>
                    <option value="Housing">Housing</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Salary">Salary</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Transaction</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
