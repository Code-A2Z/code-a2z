import { Typography } from '@mui/material';

const A2ZTypography = ({
  text,
  variant,
  component,
  noWrap,
  props,
}: {
  text: string;
  variant?:
    | 'body1'
    | 'body2'
    | 'caption'
    | 'subtitle1'
    | 'subtitle2'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6';
  component?: 'div' | 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  noWrap?: boolean;
  props?: Record<string, unknown>;
}) => {
  return (
    <Typography
      variant={variant ?? 'body1'}
      component={component ?? 'div'}
      noWrap={noWrap}
      color="inherit"
      {...props}
    >
      {text}
    </Typography>
  );
};

export default A2ZTypography;
