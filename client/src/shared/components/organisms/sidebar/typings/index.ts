import { SxProps, Theme } from '@mui/material';
import { ReactNode, MouseEvent, ElementType } from 'react';
import { ROUTES_PAGE_V1 } from '../../../../../app/routes/constants/routes';

export type SideBarItemsType = {
  icon: ElementType;
  title: ReactNode;
  label?: string;
  path?: string;
  screenName?: ROUTES_PAGE_V1;
  onClick?: (event: MouseEvent<Element>) => void;
  hasAccess?: boolean;
  style?: SxProps<Theme>;
  component?: () => React.ReactNode | void;
  disable?: boolean;
  hideRipple?: boolean;
  hide?: boolean;
};
