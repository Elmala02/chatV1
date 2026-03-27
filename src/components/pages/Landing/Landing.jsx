import { Link } from 'react-router-dom';
import TextType from '../../ui/TextType';
import { TEXTTYPE_BASE } from '../../../config/animaciones';
import { useApp } from '../../../context/useApp';
import { TEXTTYPE_TEXTS, FEATURE_CARDS, MOCKUP_BUBBLES } from '../../../config/uiConfig';
import HeroMockup from './HeroMockup';
import FeatureCard from './FeatureCard';
import '../../../styles/components/pages/Landing/Landing.css';

/**
 * Componente principal de la Landing Page.
 * Utiliza Framer Motion para animaciones y sub-componentes para cada sección.
 */
export default function Landing() {
  const { user } = useApp();

  return (
    <div className="landing-container">
      {/* --- SECCIÓN HERO --- */}
      <section className="hero">
        <div className="hero-content">
          <div className="badge floating">
            <span>El futuro del social blog</span>
          </div>
          <h1 className="hero-typing-title">
            <div>Conecta,</div>
            <div>Comparte y</div>
            <div className="gradient-text">
              <TextType text={TEXTTYPE_TEXTS.landing} {...TEXTTYPE_BASE} />
            </div>
          </h1>
          <p>
            Una plataforma híbrida donde el blog se encuentra con el chat en tiempo real.
            Regístrate para unirte a la conversación más vibrante de la web.
          </p>
          <div className="hero-btns">
            <Link to={user ? "/chat" : "/auth"} className="btn-primary">Empezar Ahora</Link>
            <a href="#features" className="btn-secondary">Saber más</a>
          </div>
        </div>

        <div className="hero-image">
          <div className="glass-blob blob-1" />
          <div className="glass-blob blob-2" />
          <HeroMockup bubbles={MOCKUP_BUBBLES} />
        </div>
      </section>

      {/* --- SECCIÓN DE CARACTERÍSTICAS --- */}
      <section id="features" className="features">
        {FEATURE_CARDS.map(({ icon, title, description }) => (
          <FeatureCard key={title} icon={icon} title={title} description={description} />
        ))}
      </section>
    </div>
  );
}
