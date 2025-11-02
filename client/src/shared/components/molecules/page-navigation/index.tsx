import { useState } from 'react';
import { Box, Tabs, Tab, useTheme } from '@mui/material';

interface InPageNavigationProps {
  routes: string[];
  defaultHidden?: string[];
  defaultActiveIndex?: number;
  children: React.ReactNode;
  variant?: 'scrollable' | 'fullWidth' | 'standard';
  scrollButtons?: 'auto' | true | false;
  tabProps?: React.ComponentProps<typeof Tabs>;
}

const InPageNavigation = ({
  routes,
  defaultHidden = [],
  defaultActiveIndex = 0,
  children,
  variant = 'standard',
  scrollButtons = 'auto',
  tabProps,
}: InPageNavigationProps) => {
  const [value, setValue] = useState(defaultActiveIndex);
  const theme = useTheme();

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          mb: 3,
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant={variant}
          scrollButtons={scrollButtons}
          textColor="inherit"
          {...tabProps}
        >
          {routes.map((route, i) => (
            <Tab
              key={i}
              label={route}
              sx={{
                textTransform: 'capitalize',
                fontWeight: 500,
                color:
                  value === i
                    ? theme.palette.text.primary
                    : theme.palette.text.secondary,
                display: defaultHidden.includes(route)
                  ? { md: 'none' }
                  : 'flex',
                px: 3,
                py: 2,
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Tab content */}
      {Array.isArray(children) ? children[value] : children}
    </>
  );
};

export default InPageNavigation;
