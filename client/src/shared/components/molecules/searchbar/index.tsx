import {
  Ref,
  KeyboardEvent,
  ChangeEvent,
  useState,
  forwardRef,
  useRef,
} from 'react';
import {
  Box,
  IconButton,
  useTheme,
  SxProps,
  Theme,
  Drawer,
} from '@mui/material';
import { CloseRounded, Search as SearchIcon } from '@mui/icons-material';
import Loader from '../../molecules/loader';
import InputBox from '../../atoms/input-box';
import { useDevice } from '../../../hooks/use-device';

interface SearchbarProps {
  customCSS?: Record<string, string>;
  placeholder?: string;
  showLoading?: boolean;
  onSearch: (value: string) => void;
  searchTerm: string;
  handleOnClearClick: () => void;
  variant?: 'fullWidth' | 'iconButton' | 'auto';
  sx?: SxProps<Theme>;
  autoFocus?: boolean;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  inputRef?: Ref<HTMLInputElement>;
  showClearButton?: boolean;
}

const Searchbar = forwardRef<HTMLInputElement, SearchbarProps>(
  (
    {
      customCSS = {},
      placeholder = 'Search settings...',
      showLoading = false,
      onSearch,
      searchTerm,
      handleOnClearClick,
      variant = 'auto',
      sx = {},
      autoFocus = true,
      onKeyDown,
      inputRef,
      showClearButton = true,
    },
    ref
  ) => {
    const theme = useTheme();
    const { isMobile } = useDevice();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const internalInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (value: string) => {
      onSearch(value);
    };

    const shouldShowIconButton =
      variant === 'iconButton' || (variant === 'auto' && isMobile);

    const handleIconButtonClick = () => {
      setIsDrawerOpen(true);
    };

    const handleDrawerClose = () => {
      setIsDrawerOpen(false);
    };

    const handleClearClick = () => {
      handleOnClearClick();
      // Focus the input after clearing
      setTimeout(() => {
        const refToUse = inputRef || ref || internalInputRef;
        if (
          refToUse &&
          typeof refToUse === 'object' &&
          'current' in refToUse &&
          refToUse.current
        ) {
          refToUse.current.focus();
        }
      }, 0);
    };

    const searchbarContent = (
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          gap: 1,
          alignItems: 'center',
          ...sx,
        }}
      >
        <InputBox
          id="searchbar"
          name="search"
          type="text"
          placeholder={placeholder}
          icon={
            <SearchIcon
              sx={{
                color: 'text.secondary',
                fontSize: '1.25rem',
              }}
            />
          }
          sx={{
            flex: 1,
            '.MuiFormControl-root': { margin: '0' },
            '.MuiInputBase-root': {
              bgcolor: 'background.paper',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              '&::before': { border: 'none' },
              '&::after': { border: 'none' },
              '&:hover:not(.Mui-disabled)': {
                borderColor: 'primary.main',
              },
              '&.Mui-focused': {
                borderColor: 'primary.main',
              },
              'input::placeholder, textArea::placeholder': {
                color: 'text.secondary',
              },
              input: {
                color: 'text.primary',
                py: 1,
              },
              ...customCSS,
            },
          }}
          value={searchTerm}
          inputRef={inputRef || ref || internalInputRef}
          slotProps={{
            htmlInput: {
              onChange: (e: ChangeEvent<HTMLInputElement>) =>
                handleInputChange(e.target.value),
              onKeyDown: onKeyDown,
              autoFocus: autoFocus && !shouldShowIconButton,
            },
          }}
        />
        {showLoading && (
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
            <Loader size={16} />
          </Box>
        )}
        {showClearButton && searchTerm && (
          <IconButton
            onClick={handleClearClick}
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary',
                bgcolor: 'action.hover',
              },
            }}
          >
            <CloseRounded fontSize="small" />
          </IconButton>
        )}
      </Box>
    );

    if (shouldShowIconButton) {
      return (
        <>
          <IconButton
            onClick={handleIconButtonClick}
            sx={{
              color: 'text.primary',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
            aria-label="Open search"
          >
            <SearchIcon />
          </IconButton>
          <Drawer
            anchor="top"
            open={isDrawerOpen}
            onClose={handleDrawerClose}
            PaperProps={{
              sx: {
                p: 2,
                bgcolor: 'background.paper',
                borderBottom: `1px solid ${theme.palette.divider}`,
              },
            }}
          >
            {searchbarContent}
          </Drawer>
        </>
      );
    }

    return searchbarContent;
  }
);

Searchbar.displayName = 'Searchbar';

export default Searchbar;
