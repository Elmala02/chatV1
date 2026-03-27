import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import TextType from '../../ui/TextType';
import Login from './Login';
import Register from './Register';
import { TEXTTYPE_BASE } from '../../../config/animaciones';
import { TEXTTYPE_TEXTS } from '../../../config/uiConfig';
import '../../../styles/components/pages/Auth/Auth.css';

/**
 * Componente de autenticación.
 * Maneja el intercambio entre las vistas de Login y Registro.
 */
export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-card glass">
        <div className="auth-header">
          <Zap className="auth-logo" size={40} />
          <h2>{isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}</h2>
          <div className="auth-subtitle-wrapper">
            <TextType
              text={TEXTTYPE_TEXTS.auth}
              {...TEXTTYPE_BASE}
              className="auth-subtitle"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isLogin ? (
            <div key="login">
              <Login onToggleAuth={() => setIsLogin(false)} />
            </div>
          ) : (
            <div key="register">
              <Register onToggleAuth={() => setIsLogin(true)} />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
