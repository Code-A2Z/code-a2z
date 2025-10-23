// client/src/modules/search/utils.ts
import { Dispatch, SetStateAction } from 'react';

interface KeyboardHandlersParams {
  setActiveTab: Dispatch<SetStateAction<number>>;
  setShowShortcuts: Dispatch<SetStateAction<boolean>>;
  setLastAction: Dispatch<SetStateAction<string>>;
  handleRefresh: () => void;
}

export const initKeyboardShortcuts = ({
  setActiveTab,
  setShowShortcuts,
  setLastAction,
  handleRefresh,
}: KeyboardHandlersParams) => {
  const handleKeyPress = (event: KeyboardEvent) => {
    const activeTag = document.activeElement?.tagName;
    if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;

    const ctrl = event.ctrlKey || event.metaKey;

    if (event.shiftKey && event.key === '/') {
      event.preventDefault();
      setShowShortcuts(true);
      setLastAction('Shift + / - Help opened');
    } else if (ctrl && event.key.toLowerCase() === 'h') {
      event.preventDefault();
      setShowShortcuts(true);
      setLastAction('Ctrl + H - Help opened');
    } else if (event.key === 'Escape') {
      setShowShortcuts(false);
      setLastAction('Esc - Dialog closed');
    } else if (ctrl && event.key === '1') {
      setActiveTab(0);
      setLastAction('Ctrl+1 - Projects tab');
    } else if (ctrl && event.key === '2') {
      setActiveTab(1);
      setLastAction('Ctrl+2 - Users tab');
    } else if (ctrl && event.key.toLowerCase() === 'r') {
      handleRefresh();
      setLastAction('Ctrl+R - Refreshed data');
    } else if (event.altKey && event.key.toLowerCase() === 'd') {
      console.log('🎯 Debug Info Active');
    }
  };

  window.addEventListener('keydown', handleKeyPress, true);
  return () => window.removeEventListener('keydown', handleKeyPress, true);
};
