import { createElement } from 'react';
import '../../../styles/components/pages/Landing/FeatureCard.css';

/**
 * Tarjeta de característica reutilizable para la landing.
 * @param {Object} props
 * @param {React.ElementType} props.icon - Componente del ícono.
 * @param {string} props.title - Título de la característica.
 * @param {string} props.description - Descripción de la característica.
 */
export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card glass">
      {createElement(icon, { className: 'feature-card__icon' })}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
