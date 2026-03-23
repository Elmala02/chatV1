/**
 * Barrel export de todos los hooks personalizados.
 * Permite importaciones limpias desde un solo punto de entrada:
 *
 * import { useAuth, useChat, useFriends } from '../hooks';
 */

export { useAuth } from './useAuth';
export { useChat } from './useChat';
export { usePrivateChat } from './usePrivateChat';
export { useNotifications } from './useNotifications';
export { useFriends } from './useFriends';
export { useNavbar } from './useNavbar';
export { useChatBoard } from './useChatBoard';
