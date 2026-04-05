<<<<<<< HEAD
# Finance Dashboard UI

This project is a React-based finance dashboard interface built to evaluate frontend development skills. It features a clean, responsive, and interactive design for tracking financial activity.

## Features & Approach
- **Modern UI/UX**: Designed with a premium aesthetic featuring glassmorphism elements, gradient accents, dark mode toggle, and micro-interactions for a better user experience. Vanilla CSS is utilized instead of utility frameworks to demonstrate core design capabilities and maintain a robust custom design system.
- **Summary & Analytics**: Dynamic summary cards displaying total balance, income, and expenses along with clear visualizations (Line Chart for balance trends, Pie Chart for category breakdowns) using `recharts`.
- **Transactions Management**: Complete data table for recent transactions featuring filtering (income/expense) and active text search capabilities.
- **Simulated Role-Based Access Control (RBAC)**: Switch between `Viewer` and `Admin` modes. Admin mode unlocks the ability to add new transactions via an interactive modal, while Viewer mode displays an informative alert and restricts destructive or mutative actions.
- **State Management**: Robust React Hook data management using `useState`, `useMemo` for derived states/calculations, and `useEffect` with `localStorage` for complete data persistence.

## Technologies Used
- React 18
- Vite
- Recharts (Data Visualization)
- Lucide React (Icons)
- Vanilla CSS 

## Setup Instructions

Make sure you have Node.js and npm installed.

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5175`.

## File Structure Structure
- `src/App.jsx` - Main application logic, state, and UI layout.
- `src/index.css` - Custom styling system, variables, and responsive layout.
- `src/main.jsx` - React entry point.

## Design Decisions
1. **Glassmorphism Theme**: Adds a modern touch to the interface that feels high-quality and premium.
2. **Dynamic Theming**: Both Light and Dark modes are supported purely via CSS variables (`[data-theme='light']`) minimizing JS overhead and preventing theme flashing.
3. **Optimized Calculations**: Use of `useMemo` extensively ensures that chart formats, filtering, and total reductions only recalculate when transaction data specifically mutates, optimizing the react render cycle.
=======
# financial_dashboard_UI
A modern and responsive finance dashboard UI that visualizes income, expenses, savings, and transaction analytics through interactive cards, charts, and tables. Designed with intuitive navigation, dark mode support, and mobile-friendly layouts for seamless financial tracking.
>>>>>>> 9ccb2d7153ba703fefe1528653c18d0b92831d48
