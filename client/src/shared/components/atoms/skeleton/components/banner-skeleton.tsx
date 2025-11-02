import { Box, Stack, Skeleton, useTheme } from '@mui/material';

const BannerSkeleton = ({ count = 3 }: { count?: number }) => {
  const theme = useTheme();

  const bgColor = theme.palette.mode === 'dark' ? '#151515' : '#f5f5f5';
  const innerBgColor = theme.palette.mode === 'dark' ? '#2a2a2a' : '#d4d4d4';

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
          {/* Top Avatar + Info Row */}
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Skeleton
              variant="circular"
              width={40}
              height={40}
              sx={{ bgcolor: innerBgColor }}
            />
            <Stack direction="row" spacing={1} alignItems="center" flex={1}>
              <Skeleton
                variant="rectangular"
                width={120}
                height={16}
                sx={{ borderRadius: 1, bgcolor: innerBgColor }}
              />
              <Skeleton
                variant="rectangular"
                width={100}
                height={16}
                sx={{ borderRadius: 1, bgcolor: innerBgColor }}
              />
            </Stack>
          </Stack>

          {/* Middle Content + Thumbnail */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              width: '100%',
              maxWidth: 900,
              p: 2,
              borderRadius: 2,
              bgcolor: bgColor,
            }}
          >
            <Stack flex={1} pr={2} spacing={1}>
              <Skeleton
                variant="rectangular"
                width="66%"
                height={32}
                sx={{ borderRadius: 1, bgcolor: innerBgColor }}
              />
              <Skeleton
                variant="rectangular"
                width="83%"
                height={16}
                sx={{ borderRadius: 1, bgcolor: innerBgColor }}
              />
              <Skeleton
                variant="rectangular"
                width="83%"
                height={16}
                sx={{ borderRadius: 1, bgcolor: innerBgColor }}
              />
            </Stack>
            <Skeleton
              variant="rectangular"
              width={112}
              height={96}
              sx={{ borderRadius: 2, flexShrink: 0, bgcolor: innerBgColor }}
            />
          </Box>

          {/* Bottom Buttons */}
          <Stack direction="row" spacing={2} mt={2} alignItems="center">
            <Skeleton
              variant="rectangular"
              width={48}
              height={32}
              sx={{ borderRadius: '9999px', bgcolor: innerBgColor }}
            />
            <Skeleton
              variant="circular"
              width={32}
              height={32}
              sx={{ bgcolor: innerBgColor }}
            />
          </Stack>
        </Box>
      ))}
    </Stack>
  );
};

export default BannerSkeleton;
