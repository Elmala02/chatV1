import { useContext } from 'react';
import { AppContext } from './appContext';

export function useApp() {
  return useContext(AppContext);
}
