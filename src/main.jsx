import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext.jsx'
import { useApp } from './context/useApp'
import Navbar from './components/layout/Navbar'
import Landing from './components/pages/Landing'
import Auth from './components/pages/Auth'
import ChatBoard from './components/pages/ChatBoard'
import './styles/global.css'

function ProtectedRoute({ children }) {
  const { user } = useApp();

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return children;
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/chat"
            element={(
              <ProtectedRoute>
                <ChatBoard />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/users"
            element={(
              <ProtectedRoute>
                <ChatBoard initialTab="users" />
              </ProtectedRoute>
            )}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)