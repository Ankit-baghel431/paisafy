import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Budget from "./pages/Budget";
import Goals from "./pages/Goals";
import Reports from "./pages/Reports";
import AIAdvisor from "./pages/AIAdvisor";
import LandingPage from "./pages/LandingPage";
import Onboarding from "./pages/Onboarding";
import Layout from "./components/Layout";
import "./index.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/transactions"
            element={
              <Layout>
                <Transactions />
              </Layout>
            }
          />
          <Route
            path="/analytics"
            element={
              <Layout>
                <Analytics />
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route
            path="/budget"
            element={
              <Layout>
                <Budget />
              </Layout>
            }
          />
          <Route
            path="/goals"
            element={
              <Layout>
                <Goals />
              </Layout>
            }
          />
          <Route
            path="/reports"
            element={
              <Layout>
                <Reports />
              </Layout>
            }
          />
          <Route
            path="/advisor"
            element={
              <Layout>
                <AIAdvisor />
              </Layout>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
