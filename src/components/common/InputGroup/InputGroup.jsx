import '../../../styles/components/common/InputGroup.css';

/**
 * Componente reutilizable de campo de formulario con ícono.
 * @param {Object} props
 * @param {React.ElementType} props.icon - Componente de ícono (de Lucide).
 * @param {string} props.type - Tipo del input (text, email, password, etc).
 * @param {string} props.placeholder - Placeholder del campo.
 * @param {string} props.value - Valor actual del input.
 * @param {Function} props.onChange - Callback al cambiar el valor.
 * @param {boolean} [props.required=false] - Si el campo es obligatorio.
 * @param {string} [props.className] - Clases CSS adicionales.
 */
export default function InputGroup({
  icon: Icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  className = '',
}) {
  return (
    <div className={`input-group ${className}`}>
      {Icon && <Icon size={20} className="input-group__icon" />}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}
