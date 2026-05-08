import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";

interface AppLayoutProps {
  children: ReactNode;
}

const navItems = [
  { label: "All Notifications", path: "/", icon: <NotificationsActiveRoundedIcon /> },
  { label: "Priority Inbox", path: "/priority", icon: <StarRoundedIcon /> },
];

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          backdropFilter: "blur(14px)",
          backgroundColor: "rgba(245, 247, 251, 0.86)",
        }}
      >
        <Toolbar sx={{ py: 1.5 }}>
          <Container
            maxWidth="lg"
            sx={{
              display: "flex",
              alignItems: { xs: "flex-start", md: "center" },
              justifyContent: "space-between",
              gap: 2,
              flexDirection: { xs: "column", md: "row" },
              px: "0 !important",
            }}
          >
            <Box>
              <Typography variant="h5" color="primary.main">
                Notification Center
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track every update and surface what matters first.
              </Typography>
            </Box>

            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              sx={{ flexWrap: "wrap" }}
            >
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <Button
                    key={item.path}
                    component={NavLink}
                    to={item.path}
                    startIcon={item.icon}
                    variant={isActive ? "contained" : "text"}
                    color={isActive ? "primary" : "inherit"}
                    sx={{
                      borderRadius: 999,
                      px: 2,
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        {children}
      </Container>
    </Box>
  );
}
