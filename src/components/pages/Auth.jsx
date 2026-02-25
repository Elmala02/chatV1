import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import TextType from '../ui/TextType';
import Login from './Login';
import Register from './Register';
import '../../styles/components/Auth.css';
import { FADE_SCALE_IN, SLIDE_IN_LEFT, SLIDE_IN_RIGHT, TEXTTYPE_BASE } from '../../config/animaciones';
import { TEXTTYPE_TEXTS } from '../../config/uiConfig';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">
      <motion.div
        {...FADE_SCALE_IN}
        className="auth-card glass"
      >
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
            <motion.div
              key="login"
              {...SLIDE_IN_LEFT}
              transition={{ duration: 0.3 }}
            >
              <Login onToggleAuth={() => setIsLogin(false)} />
            </motion.div>
          ) : (
            <motion.div
              key="register"
              {...SLIDE_IN_RIGHT}
              transition={{ duration: 0.3 }}
            >
              <Register onToggleAuth={() => setIsLogin(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
