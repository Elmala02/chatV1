/* eslint-disable react-refresh/only-export-components */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import './styles/global.css'

// Componentes
import Navbar from './components/pages/Navbar'
import Landing from './components/pages/Landing'
import Auth from './components/pages/Auth'
import ChatBoard from './components/pages/ChatBoard'

const ProtectedRoute = ({ children }) => {
  const { user } = useApp();
  if (!user) return <Navigate to="/entrar" />;
  return children;
};

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/entrar" element={<Auth />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute>
              <ChatBoard initialTab="users" />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppProvider>
  </StrictMode>,
)
