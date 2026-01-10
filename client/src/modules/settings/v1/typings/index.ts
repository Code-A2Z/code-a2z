import { ReactNode } from 'react';

export interface SettingTabType {
  id: string;
  icon: ReactNode;
  path: string;
  name: string;
  description?: string;
  locked?: boolean;
  isNew?: boolean;
  newText?: string;
  disabled?: boolean;
  feature?: string;
}

export interface IntegrationSettingType {
  id: string;
  type: string;
  integrationSlug: string;
  icon: ReactNode;
  name: string;
  description?: string;
  locked?: boolean;
}
