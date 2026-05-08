import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import { NotificationFilter } from "../types";

interface NotificationControlsProps {
  filter: NotificationFilter;
  onFilterChange: (value: NotificationFilter) => void;
  limit?: number;
  onLimitChange?: (value: number) => void;
}

const filterOptions: NotificationFilter[] = ["All", "Event", "Result", "Placement"];

export function NotificationControls({
  filter,
  onFilterChange,
  limit,
  onLimitChange,
}: NotificationControlsProps) {
  const handleFilterChange = (event: SelectChangeEvent) => {
    onFilterChange(event.target.value as NotificationFilter);
  };

  const handleLimitChange = (event: SelectChangeEvent) => {
    onLimitChange?.(Number(event.target.value));
  };

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{
          alignItems: { xs: "stretch", md: "center" },
          justifyContent: "space-between",
        }}
      >
        <Typography variant="subtitle1" color="text.primary">
          Refine the list by type{limit ? " and priority count" : ""}.
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="type-filter-label">Type</InputLabel>
            <Select
              labelId="type-filter-label"
              value={filter}
              label="Type"
              onChange={handleFilterChange}
            >
              {filterOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {typeof limit === "number" && onLimitChange ? (
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="limit-filter-label">Top N</InputLabel>
              <Select
                labelId="limit-filter-label"
                value={String(limit)}
                label="Top N"
                onChange={handleLimitChange}
              >
                {[10, 15, 20].map((option) => (
                  <MenuItem key={option} value={option}>
                    Top {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : null}
        </Stack>
      </Stack>
    </Paper>
  );
}
