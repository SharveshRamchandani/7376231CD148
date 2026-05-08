import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import NotificationsOffRoundedIcon from "@mui/icons-material/NotificationsOffRounded";
import { Alert, Box, CircularProgress, Stack, Typography } from "@mui/material";

export function LoadingState() {
  return (
    <Box
      sx={{
        minHeight: 240,
        display: "grid",
        placeItems: "center",
      }}
    >
      <Stack spacing={2} sx={{ alignItems: "center" }}>
        <CircularProgress />
        <Typography color="text.secondary">Loading notifications...</Typography>
      </Stack>
    </Box>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <Alert icon={<ErrorOutlineRoundedIcon />} severity="error" sx={{ borderRadius: 4 }}>
      {message}
    </Alert>
  );
}

export function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Box
      sx={{
        borderRadius: 4,
        border: "1px dashed",
        borderColor: "divider",
        p: 4,
        textAlign: "center",
        backgroundColor: "rgba(255,255,255,0.72)",
      }}
    >
      <Stack spacing={1.5} sx={{ alignItems: "center" }}>
        <NotificationsOffRoundedIcon color="disabled" sx={{ fontSize: 42 }} />
        <Typography variant="h6">{title}</Typography>
        <Typography color="text.secondary">{subtitle}</Typography>
      </Stack>
    </Box>
  );
}
