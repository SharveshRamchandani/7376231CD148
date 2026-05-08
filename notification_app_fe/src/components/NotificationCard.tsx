import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import DraftsRoundedIcon from "@mui/icons-material/DraftsRounded";
import MarkEmailReadRoundedIcon from "@mui/icons-material/MarkEmailReadRounded";
import {
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { NotificationItem } from "../types";

interface NotificationCardProps {
  notification: NotificationItem;
  showPriorityRank?: number;
}

function formatTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function NotificationCard({
  notification,
  showPriorityRank,
}: NotificationCardProps) {
  return (
    <Card
      sx={{
        border: "1px solid",
        borderColor: notification.read ? "grey.200" : "primary.light",
        backgroundColor: notification.read ? "grey.50" : "background.paper",
      }}
    >
      <CardContent sx={{ p: { xs: 2.25, md: 3 } }}>
        <Stack spacing={1.5}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              sx={{ flexWrap: "wrap" }}
            >
              {showPriorityRank ? (
                <Chip label={`Rank #${showPriorityRank}`} color="secondary" />
              ) : null}
              <Chip label={notification.type} color="primary" variant="outlined" />
              <Chip
                icon={
                  notification.read ? (
                    <MarkEmailReadRoundedIcon />
                  ) : (
                    <DraftsRoundedIcon />
                  )
                }
                label={notification.read ? "Read" : "Unread"}
                variant="outlined"
              />
            </Stack>

            <Stack
              direction="row"
              spacing={0.75}
              sx={{ alignItems: "center" }}
            >
              <AccessTimeRoundedIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {formatTimestamp(notification.timestamp)}
              </Typography>
            </Stack>
          </Stack>

          <Typography
            variant="h6"
            sx={{
              fontWeight: notification.read ? 500 : 800,
              color: notification.read ? "text.secondary" : "text.primary",
            }}
          >
            {notification.title}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: notification.read ? "text.secondary" : "text.primary",
            }}
          >
            {notification.message}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
