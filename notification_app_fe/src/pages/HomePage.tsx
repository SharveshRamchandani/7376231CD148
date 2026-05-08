import {
  Box,
  Chip,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { NotificationCard } from "../components/NotificationCard";
import { NotificationControls } from "../components/NotificationControls";
import { EmptyState, ErrorState, LoadingState } from "../components/StateViews";
import { PageIntro } from "../components/PageIntro";
import { useNotifications } from "../hooks/useNotifications";
import { filterNotifications } from "../services/notifications";
import { NotificationFilter } from "../types";

const PAGE_SIZE = 6;

export function HomePage() {
  const { notifications, loading, error } = useNotifications();
  const [filter, setFilter] = useState<NotificationFilter>("All");
  const [page, setPage] = useState(1);

  const filteredNotifications = filterNotifications(notifications, filter);

  const unreadCount = filteredNotifications.filter(
    (notification) => !notification.read,
  ).length;
  const pageCount = Math.max(1, Math.ceil(filteredNotifications.length / PAGE_SIZE));
  const paginatedNotifications = filteredNotifications.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const handleFilterChange = (value: NotificationFilter) => {
    setFilter(value);
    setPage(1);
  };

  return (
    <Box>
      <PageIntro
        eyebrow="Home"
        title="Every Notification, One Clear Feed"
        description="Browse the complete notification stream with a compact, readable layout that keeps unread items front and center."
        stats={
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{ pt: 1, flexWrap: "wrap" }}
          >
            <Chip label={`${filteredNotifications.length} visible`} color="secondary" />
            <Chip
              label={`${unreadCount} unread`}
              variant="outlined"
              sx={{ color: "white", borderColor: "rgba(255,255,255,0.45)" }}
            />
          </Stack>
        }
      />

      <Stack spacing={3}>
        <NotificationControls filter={filter} onFilterChange={handleFilterChange} />

        {loading ? <LoadingState /> : null}
        {!loading && error ? <ErrorState message={error} /> : null}
        {!loading && !error && filteredNotifications.length === 0 ? (
          <EmptyState
            title="No notifications found"
            subtitle="Try changing the type filter to see a different part of the feed."
          />
        ) : null}

        {!loading && !error && filteredNotifications.length > 0 ? (
          <>
            <Stack spacing={2}>
              {paginatedNotifications.map((notification) => (
                <NotificationCard
                  key={`${notification.id}-${notification.timestamp}`}
                  notification={notification}
                />
              ))}
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
              }}
            >
              <Typography color="text.secondary">
                Showing {(page - 1) * PAGE_SIZE + 1}-
                {Math.min(page * PAGE_SIZE, filteredNotifications.length)} of{" "}
                {filteredNotifications.length}
              </Typography>

              <Pagination
                page={page}
                count={pageCount}
                color="primary"
                onChange={(_, value) => setPage(value)}
              />
            </Stack>
          </>
        ) : null}
      </Stack>
    </Box>
  );
}
