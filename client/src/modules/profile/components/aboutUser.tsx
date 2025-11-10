import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Typography, Link, Stack, IconButton, useTheme } from "@mui/material";
import { getFullDay } from "../../../shared/utils/date";

interface AboutUserProps {
  className?: string;
  bio: string;
  social_links: Record<string, string>;
  joinedAt: string;
}

const AboutUser: React.FC<AboutUserProps> = ({ className = "", bio, social_links, joinedAt }) => {
  const theme = useTheme();

  return (
    <Box
      className={className}
      sx={{
        width: { md: "90%" },
        mt: { md: 7 },
      }}
    >
      {/* Bio Section */}
      <Typography variant="body1" sx={{ fontSize: "1.25rem", lineHeight: 1.7 }}>
        {bio?.length ? bio : "Nothing to read here"}
      </Typography>

      {/* Social Links */}
      <Stack
        direction="row"
        spacing={3}
        flexWrap="wrap"
        alignItems="center"
        sx={{
          my: 4,
          color: theme.palette.text.secondary,
        }}
      >
        {Object.keys(social_links).map((key) => {
          const link = social_links[key];
          if (!link) return null;

          return (
            <Link
              component={RouterLink}
              to={link}
              key={key}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
            >
              <IconButton
                sx={{
                  color: "text.secondary",
                  transition: "color 0.2s",
                  "&:hover": {
                    color: "text.primary",
                  },
                }}
              >
                <i
                  className={
                    "fi " +
                    (key !== "website" ? "fi-brands-" + key : "fi-rr-globe")
                  }
                  style={{ fontSize: "1.5rem" }}
                />
              </IconButton>
            </Link>
          );
        })}
      </Stack>

      {/* Joined Date */}
      <Typography variant="body1" sx={{ fontSize: "1.25rem", color: "text.secondary" }}>
        Joined on {getFullDay(joinedAt)}
      </Typography>
    </Box>
  );
};

export default AboutUser;
