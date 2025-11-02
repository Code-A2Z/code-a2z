import { Box, Stack, Skeleton, useTheme } from '@mui/material';

const NoBannerSkeleton = ({ count }: { count: number }) => {
  const theme = useTheme();

  const bgColor = theme.palette.mode === 'dark' ? '#151515' : '#f5f5f5';
  const innerBg = theme.palette.mode === 'dark' ? '#2a2a2a' : '#d4d4d4';

  return (
    <Stack spacing={2}>
      {[...Array(count)].map((_, idx) => (
        <Box
          key={idx}
          sx={{
            width: '100%',
            p: 2,
            borderRadius: 2,
            bgcolor: bgColor,
            animation: 'pulse 1.5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%': { opacity: 1 },
              '50%': { opacity: 0.5 },
              '100%': { opacity: 1 },
            },
          }}
        >
          {/* Header section */}
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Skeleton
              variant="rounded"
              width={40}
              height={40}
              sx={{ borderRadius: 2, bgcolor: innerBg }}
            />
            <Skeleton
              variant="circular"
              width={40}
              height={40}
              sx={{ bgcolor: innerBg }}
            />
            <Stack direction="row" spacing={2} flex={1} alignItems="center">
              <Skeleton
                variant="rectangular"
                width={120}
                height={16}
                sx={{ borderRadius: 1, bgcolor: innerBg }}
              />
              <Skeleton
                variant="rectangular"
                width={96}
                height={16}
                sx={{ borderRadius: 1, bgcolor: innerBg }}
              />
            </Stack>
          </Stack>

          {/* Title section */}
          <Box ml={7}>
            <Skeleton
              variant="rectangular"
              width="66%"
              height={32}
              sx={{ borderRadius: 1, bgcolor: innerBg }}
            />
          </Box>
        </Box>
      ))}
    </Stack>
  );
};

export default NoBannerSkeleton;
