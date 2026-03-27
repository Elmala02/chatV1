import { createElement } from 'react';
import { SIDEBAR_TABS } from '../../../config/uiConfig';
import '../../../styles/components/pages/ChatBoard/Sidebar.css';

/**
 * Barra lateral de navegación del ChatBoard.
 * @param {Object} props
 * @param {string} props.activeTab - Pestaña activa actual.
 * @param {Function} props.onTabChange - Callback al cambiar de pestaña.
 * @param {number} props.requestCount - Cantidad de solicitudes pendientes.
 * @param {React.ReactNode} props.logo - Elemento del logo.
 */
export default function Sidebar({ activeTab, onTabChange, requestCount, logo }) {
  return (
    <div className="board-sidebar">
      <div className="board-sidebar__header">
        {logo}
      </div>
      <nav className="board-sidebar__nav">
        {SIDEBAR_TABS.map(({ id, icon, label, clearFriend }) => (
          <button
            key={id}
            className={activeTab === id ? 'active' : ''}
            onClick={() => onTabChange(id, clearFriend)}
          >
            {createElement(icon, { size: 20 })}
            {label}
            {id === 'requests' && requestCount > 0 && (
              <span className="board-sidebar__badge">{requestCount}</span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
