import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";
import { Dashboard } from "./pages/Dashboard";
import { CourseViewer } from "./pages/CourseViewer";
import { LoginPage } from "./pages/LoginPage";
// SignupPage removed - functionality integrated into WelcomePage
import { WelcomePage } from "./pages/WelcomePage";
import { Profile } from "./pages/Profile";
import { Settings } from "./pages/Settings";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/useAuth";
import { useTokenRefresh } from "./hooks/useTokenRefresh";
import { useSessionTimeout } from "./hooks/useSessionTimeout";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Use the token refresh hook in protected routes
  useTokenRefresh();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  // Redirect to welcome page if not authenticated
  return isAuthenticated ? <>{children}</> : <Navigate to="/static/welcome" />;
};

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  // Add session timeout handler with 30 minutes idle timeout
  // and auto-refresh of the session on user activity
  useSessionTimeout({
    idleTimeout: 30 * 60 * 1000, // 30 minutes
    autoRefresh: true,
  });

  // Also use the token refresh hook for page navigation
  useTokenRefresh();

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/static/login"
        element={isAuthenticated ? <Navigate to="/static" /> : <LoginPage />}
      />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/static" /> : <LoginPage />}
      />
      {/* Signup is now integrated into WelcomePage */}
      <Route path="/static/welcome" element={<WelcomePage />} />
      <Route path="/" element={<Navigate to="/static/welcome" />} />

      {/* Protected routes */}
      <Route
        path="/static"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-hub/basics"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CourseViewer />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-hub/rag/*"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CourseViewer />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-hub/*"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CourseViewer />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-hub/agents"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CourseViewer />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-hub/fine-tuning"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CourseViewer />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-hub/evaluation"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CourseViewer />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-hub/tracking"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CourseViewer />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-hub/azure"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CourseViewer />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-hub/devops"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CourseViewer />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Redirect unmatched routes */}
      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? "/static" : "/static/welcome"} />
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
