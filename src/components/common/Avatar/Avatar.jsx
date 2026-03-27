import '../../../styles/components/common/Avatar.css';

/**
 * Componente reutilizable de Avatar.
 * Muestra la inicial del nombre sobre un fondo circular coloreado.
 * @param {Object} props
 * @param {string} props.name - Nombre del usuario (se usa la primera letra).
 * @param {string} [props.avatar] - Texto personalizado del avatar (opcional).
 * @param {number} [props.size=45] - Tamaño del avatar en px.
 * @param {'primary'|'secondary'|'accent'} [props.variant='primary'] - Variante de color.
 * @param {string} [props.className] - Clases CSS adicionales.
 */
export default function Avatar({
  name,
  avatar,
  size = 45,
  variant = 'primary',
  className = '',
}) {
  const displayChar = avatar || (name ? name[0] : '?');
  const fontSize = size * 0.42;

  return (
    <div
      className={`avatar avatar--${variant} ${className}`}
      style={{ width: size, height: size, fontSize }}
    >
      {displayChar}
    </div>
  );
}
