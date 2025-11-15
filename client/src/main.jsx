import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import Savings from './pages/Savings';
import Notes from './pages/Notes';

import PrivateRoute from './components/PrivateRoute';
import './index.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>

        <Route
          index
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route
          path="add"
          element={
            <PrivateRoute>
              <AddExpense />
            </PrivateRoute>
          }
        />

        <Route
          path="savings"
          element={
            <PrivateRoute>
              <Savings />
            </PrivateRoute>
          }
        />

        <Route
          path="notes"
          element={
            <PrivateRoute>
              <Notes />
            </PrivateRoute>
          }
        />

      </Route>
    </Routes>
  </BrowserRouter>
);
