import '../../../styles/components/pages/Landing/HeroMockup.css';

/**
 * Mockup visual del chat usado en el Hero de la landing.
 * @param {Object} props
 * @param {Array} props.bubbles - Array de objetos { side, text }.
 */
export default function HeroMockup({ bubbles }) {
  return (
    <div className="hero-mockup glass">
      <div className="hero-mockup__header">
        <div className="hero-mockup__dot hero-mockup__dot--red" />
        <div className="hero-mockup__dot hero-mockup__dot--yellow" />
        <div className="hero-mockup__dot hero-mockup__dot--green" />
      </div>
      <div className="hero-mockup__body">
        {bubbles.map((bubble, i) => (
          <div key={i} className={`hero-mockup__bubble hero-mockup__bubble--${bubble.side}`}>
            {bubble.text}
          </div>
        ))}
      </div>
    </div>
  );
}
