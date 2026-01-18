import { ReactNode } from 'react';

export interface HeaderAction {
  key: string;
  label: string;
  icon: ReactNode;
  link?: string;
  onClick?: () => void;
  ariaLabel?: string;
}
