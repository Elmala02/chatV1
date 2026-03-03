import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import './styles/global.css'

// Components
import Navbar from './components/pages/Navbar'
import Landing from './components/pages/Landing'
import Auth from './components/pages/Auth'
import ChatBoard from './components/pages/ChatBoard'

/**
 * Componente que protege las rutas de la aplicación.
 * Redirige a /auth si el usuario no ha iniciado sesión.
 * @param {Object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Componentes protegidos.
 */
const ProtectedRoute = ({ children }) => {
  const { user } = useApp();
  if (!user) return <Navigate to="/auth" />;
  return children;
};

/**
 * Componente principal que define la estructura y rutas de la aplicación.
 */
const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
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
