import { Box, Button } from '@mui/material';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';
import A2ZTypography from '../../../../shared/components/atoms/typography';

const NoResultsFound = ({
  searchTerm,
  handleOnClearClick,
}: {
  searchTerm: string;
  handleOnClearClick: () => void;
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        p: '30px 25px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.25,
      }}
    >
      <SearchOffOutlinedIcon
        sx={{
          fontSize: 40,
          mb: 1.875,
          color: 'text.secondary',
        }}
      />
      <A2ZTypography text="No results found" variant="body1" />
      {searchTerm && (
        <Button
          variant="outlined"
          sx={{
            width: '100%',
            borderColor: 'divider',
            color: 'text.primary',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'action.hover',
            },
          }}
          onClick={handleOnClearClick}
        >
          Clear Search
        </Button>
      )}
    </Box>
  );
};

export default NoResultsFound;
