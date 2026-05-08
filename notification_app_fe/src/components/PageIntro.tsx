import { Paper, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

interface PageIntroProps {
  eyebrow: string;
  title: string;
  description: string;
  stats?: ReactNode;
}

export function PageIntro({
  eyebrow,
  title,
  description,
  stats,
}: PageIntroProps) {
  return (
    <Paper
      sx={{
        p: { xs: 2.5, md: 4 },
        mb: 3,
        borderRadius: 5,
        background:
          "linear-gradient(135deg, rgba(15,76,129,0.96) 0%, rgba(33,115,171,0.9) 55%, rgba(201,123,36,0.85) 100%)",
        color: "common.white",
      }}
    >
      <Stack spacing={1.25}>
        <Typography variant="overline" sx={{ opacity: 0.85 }}>
          {eyebrow}
        </Typography>
        <Typography variant="h4">{title}</Typography>
        <Typography sx={{ maxWidth: 760, opacity: 0.95 }}>{description}</Typography>
        {stats}
      </Stack>
    </Paper>
  );
}
