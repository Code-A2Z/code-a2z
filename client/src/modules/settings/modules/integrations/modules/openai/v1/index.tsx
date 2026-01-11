import { Box, Button, Stack, CircularProgress } from '@mui/material';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import InputBox from '../../../../../../../shared/components/atoms/input-box';
import A2ZTypography from '../../../../../../../shared/components/atoms/typography';
import useOpenAIIntegrationV1 from './hooks';

const OpenAI = () => {
  const {
    apiKey,
    setApiKey,
    isConnected,
    loading,
    handleConnect,
    handleDisconnect,
  } = useOpenAIIntegrationV1();

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        height: '100%',
        overflow: 'auto',
      }}
    >
      <Stack spacing={3}>
        <A2ZTypography
          text="Connect your OpenAI account by providing your API key."
          variant="body2"
          props={{
            sx: {
              color: 'text.secondary',
            },
          }}
        />

        <Box>
          <InputBox
            id="openai-api-key"
            name="apiKey"
            type={isConnected ? 'text' : 'password'}
            value={isConnected ? '*'.repeat(apiKey.length) : apiKey}
            placeholder={
              isConnected
                ? 'Your API key is connected and encrypted'
                : 'Enter your OpenAI API key'
            }
            icon={<VpnKeyIcon />}
            disabled={isConnected}
            autoComplete="off"
            autoFocus={!isConnected && !loading}
            sx={{
              width: '50%',
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.paper',
              },
            }}
            slotProps={{
              htmlInput: {
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  setApiKey(e.target.value);
                },
              },
            }}
          />
          <A2ZTypography
            text={
              isConnected
                ? 'Your API key is connected and encrypted'
                : 'Your API key will be securely stored and encrypted'
            }
            variant="caption"
            props={{
              sx: {
                mt: 0.5,
                display: 'block',
                color: 'text.secondary',
              },
            }}
          />
        </Box>

        <Box>
          <Button
            variant="contained"
            color={isConnected ? 'error' : 'primary'}
            disabled={loading || !apiKey.trim()}
            onClick={isConnected ? handleDisconnect : handleConnect}
            sx={{
              py: 1.2,
              fontSize: '1rem',
              borderRadius: 1,
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={18} sx={{ mr: 1 }} />
                {isConnected ? 'Disconnecting...' : 'Connecting...'}
              </>
            ) : isConnected ? (
              'Disconnect'
            ) : (
              'Connect'
            )}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default OpenAI;
