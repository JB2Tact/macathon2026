import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from './components/common/PageTransition';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { FullPageSpinner } from './components/common/Spinner';
import type { ReactNode } from 'react';

// Lazy-loaded pages for code splitting
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('./pages/SignupPage').then(m => ({ default: m.SignupPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const SendPage = lazy(() => import('./pages/SendPage').then(m => ({ default: m.SendPage })));
const ResultsPage = lazy(() => import('./pages/ResultsPage').then(m => ({ default: m.ResultsPage })));
const HistoryPage = lazy(() => import('./pages/HistoryPage').then(m => ({ default: m.HistoryPage })));
const ConnectBankPage = lazy(() => import('./pages/ConnectBankPage').then(m => ({ default: m.ConnectBankPage })));
const ContactsPage = lazy(() => import('./pages/ContactsPage').then(m => ({ default: m.ContactsPage })));
const MarketPage = lazy(() => import('./pages/MarketPage').then(m => ({ default: m.MarketPage })));

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { firebaseUser, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  if (!firebaseUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { firebaseUser, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  if (firebaseUser) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PublicRoute><PageTransition><LoginPage /></PageTransition></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><PageTransition><SignupPage /></PageTransition></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><ErrorBoundary><PageTransition><DashboardPage /></PageTransition></ErrorBoundary></ProtectedRoute>} />
        <Route path="/send" element={<ProtectedRoute><ErrorBoundary><PageTransition><SendPage /></PageTransition></ErrorBoundary></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute><ErrorBoundary><PageTransition><ResultsPage /></PageTransition></ErrorBoundary></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><ErrorBoundary><PageTransition><HistoryPage /></PageTransition></ErrorBoundary></ProtectedRoute>} />
        <Route path="/connect-bank" element={<ProtectedRoute><ErrorBoundary><PageTransition><ConnectBankPage /></PageTransition></ErrorBoundary></ProtectedRoute>} />
        <Route path="/contacts" element={<ProtectedRoute><ErrorBoundary><PageTransition><ContactsPage /></PageTransition></ErrorBoundary></ProtectedRoute>} />
        <Route path="/market" element={<ProtectedRoute><ErrorBoundary><PageTransition><MarketPage /></PageTransition></ErrorBoundary></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Suspense fallback={<FullPageSpinner />}>
            <AppRoutes />
          </Suspense>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                borderRadius: '10px',
                background: 'var(--surface)',
                color: 'var(--text)',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                border: '1px solid var(--border)',
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
