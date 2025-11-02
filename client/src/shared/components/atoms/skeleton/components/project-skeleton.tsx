import { Box, Stack, Skeleton } from '@mui/material';

const ProjectLoadingSkeleton = ({ count }: { count: number }) => {
  return (
    <Box
      sx={{
        mx: 'auto',
        maxWidth: 900,
        py: 10,
        px: { lg: 0, xs: '5vw' },
        animation: 'pulse 2s infinite',
      }}
    >
      {/* Header section */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ sm: 'center' }}
        spacing={2}
        sx={{ my: 8 }}
      >
        <Skeleton
          variant="rounded"
          height={40}
          width="60%"
          sx={{ bgcolor: 'grey.400' }}
        />
        <Stack direction="row" spacing={2} alignItems="center">
          <Skeleton
            variant="rounded"
            height={36}
            width={80}
            sx={{ bgcolor: 'grey.400' }}
          />
          <Skeleton
            variant="rounded"
            height={36}
            width={80}
            sx={{ bgcolor: 'grey.400' }}
          />
        </Stack>
      </Stack>

      {/* Banner */}
      <Skeleton
        variant="rounded"
        sx={{
          aspectRatio: '16 / 9',
          width: '100%',
          bgcolor: 'grey.400',
        }}
      />

      {/* Author section */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        sx={{ my: 12 }}
      >
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Skeleton
            variant="circular"
            width={48}
            height={48}
            sx={{ bgcolor: 'grey.400' }}
          />
          <Stack spacing={1}>
            <Skeleton variant="rounded" width={128} height={16} />
            <Skeleton variant="rounded" width={80} height={16} />
          </Stack>
        </Stack>
        <Skeleton
          variant="rounded"
          width={160}
          height={16}
          sx={{
            mt: { xs: 3, sm: 0 },
            ml: { xs: 6, sm: 0 },
            pl: { xs: 2, sm: 0 },
          }}
        />
      </Stack>

      {/* Dynamic content skeletons */}
      {[...Array(count)].map((_, i) => (
        <Box key={i} sx={{ my: 4 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              borderTop: '2px solid',
              borderBottom: '2px solid',
              borderColor: 'grey.300',
              py: 2,
              my: 2,
            }}
          >
            <Stack direction="row" spacing={2}>
              <Skeleton variant="rounded" width={40} height={40} />
              <Skeleton variant="rounded" width={40} height={40} />
            </Stack>
            <Skeleton variant="rounded" width={40} height={40} />
          </Stack>
          <Skeleton variant="rounded" height={40} width="80%" sx={{ my: 4 }} />
        </Box>
      ))}
    </Box>
  );
};

export default ProjectLoadingSkeleton;
