import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import TextType from '../ui/TextType';
import '../../styles/components/Landing.css';
import { FADE_UP, FADE_SCALE_HERO, TEXTTYPE_BASE } from '../../config/animaciones';
import { useApp } from '../../context/AppContext';
import { TEXTTYPE_TEXTS, FEATURE_CARDS, MOCKUP_BUBBLES } from '../../config/uiConfig';

/**
 * Componente principal de la Landing Page.
 * Utiliza Framer Motion para animaciones de entrada y el contexto de la aplicación
 * para manejar redirecciones inteligentes basadas en el estado de autenticación.
 */
export default function Landing() {
  const { user } = useApp(); // Acceso al usuario actual para redirección dinámica

  return (
    <div className="landing-container">

      {/* --- SECCIÓN HERO --- */}
      <section className="hero">

        {/* Contenido textual de la izquierda con animación FADE_UP */}
        <motion.div {...FADE_UP} className="hero-content">
          <div className="badge floating">
            <span>El futuro del social blog</span>
          </div>
          <h1 className="hero-typing-title">
            <div>Conecta,</div>
            <div>Comparte y</div>
            <div className="gradient-text">
              {/* Efecto de escritura dinámica */}
              <TextType
                text={TEXTTYPE_TEXTS.landing}
                {...TEXTTYPE_BASE}
              />
            </div>
          </h1>
          <p>
            Una plataforma híbrida donde el blog se encuentra con el chat en tiempo real.
            Regístrate para unirte a la conversación más vibrante de la web.
          </p>
          <div className="hero-btns">
            {/* Si el usuario está logueado va al Chat, si no al login/registro */}
            <Link to={user ? "/chat" : "/auth"} className="btn-primary">Empezar Ahora</Link>
            <a href="#features" className="btn-secondary">Saber más</a>
          </div>
        </motion.div>

        {/* Elementos visuales de la derecha: Mockup de chat y figuras abstractas */}
        <motion.div {...FADE_SCALE_HERO} className="hero-image">
          <div className="glass-blob blob-1"></div>
          <div className="glass-blob blob-2"></div>
          {/* Simulación visual de la interfaz de chat */}
          <div className="mockup glass">
            <div className="mockup-header">
              <div className="dot red"></div>
              <div className="dot yellow"></div>
              <div className="dot green"></div>
            </div>
            <div className="mockup-body">
              {MOCKUP_BUBBLES.map((bubble, i) => (
                <div key={i} className={`chat-bubble ${bubble.side}`}>
                  {bubble.text}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </section>

      {/* --- SECCIÓN DE CARACTERÍSTICAS --- */}
      <section id="features" className="features">
        {FEATURE_CARDS.map(({ icon: Icon, title, description }) => (
          <div key={title} className="feature-card glass">
            <Icon className="feat-icon" />
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </section>

    </div>
  );
}
