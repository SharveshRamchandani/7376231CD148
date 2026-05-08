import { Box, Chip, Stack } from "@mui/material";
import { useState } from "react";
import { NotificationCard } from "../components/NotificationCard";
import { NotificationControls } from "../components/NotificationControls";
import { EmptyState, ErrorState, LoadingState } from "../components/StateViews";
import { PageIntro } from "../components/PageIntro";
import { useNotifications } from "../hooks/useNotifications";
import {
  filterNotifications,
  sortByPriority,
} from "../services/notifications";
import { NotificationFilter } from "../types";

export function PriorityPage() {
  const { notifications, loading, error } = useNotifications();
  const [filter, setFilter] = useState<NotificationFilter>("All");
  const [limit, setLimit] = useState(10);

  const filteredAndRanked = sortByPriority(
    filterNotifications(notifications, filter),
  ).slice(0, limit);

  return (
    <Box>
      <PageIntro
        eyebrow="Priority"
        title="Focus on the Most Important Updates"
        description="This view ranks notifications by category importance first, then by recency, so placement alerts stay above results and events."
        stats={
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{ pt: 1, flexWrap: "wrap" }}
          >
            <Chip label={`Top ${limit}`} color="secondary" />
            <Chip
              label={`Filter: ${filter}`}
              variant="outlined"
              sx={{ color: "white", borderColor: "rgba(255,255,255,0.45)" }}
            />
          </Stack>
        }
      />

      <Stack spacing={3}>
        <NotificationControls
          filter={filter}
          onFilterChange={setFilter}
          limit={limit}
          onLimitChange={setLimit}
        />

        {loading ? <LoadingState /> : null}
        {!loading && error ? <ErrorState message={error} /> : null}
        {!loading && !error && filteredAndRanked.length === 0 ? (
          <EmptyState
            title="No priority notifications available"
            subtitle="There are no items matching the selected type right now."
          />
        ) : null}

        {!loading && !error && filteredAndRanked.length > 0 ? (
          <Stack spacing={2}>
            {filteredAndRanked.map((notification, index) => (
              <NotificationCard
                key={`${notification.id}-${notification.timestamp}`}
                notification={notification}
                showPriorityRank={index + 1}
              />
            ))}
          </Stack>
        ) : null}
      </Stack>
    </Box>
  );
}
