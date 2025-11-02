import { IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const A2ZIconButton = ({
  children,
  link,
  size,
  props,
}: {
  children: React.ReactNode;
  link?: string;
  size?: 'small' | 'medium' | 'large';
  props?: React.ComponentProps<typeof IconButton>;
}) => {
  return (
    <IconButton
      size={size ?? 'large'}
      color="inherit"
      {...(link ? { component: RouterLink, to: link } : {})}
      {...props}
    >
      {children}
    </IconButton>
  );
};

export default A2ZIconButton;
