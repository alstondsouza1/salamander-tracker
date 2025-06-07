// === src/app/page.js ===
"use client";

import { Container, Typography, Box, Button, Fade, Zoom } from "@mui/material";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <Fade in timeout={1000}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 3,
          minHeight: "80vh",
          p: { xs: 4, md: 8 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          boxShadow: 3,
          color: "white",
          "::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundImage: 'url("/images/salamander-bg.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "scroll",
            filter: "brightness(0.5)", // 🔦 Darkens the image
            zIndex: 0,
          },
          "& > *": {
            position: "relative",
            zIndex: 1,
          },
        }}
      >
        <Zoom in timeout={1200}>
          <Typography
            variant="h2"
            fontWeight="bold"
            gutterBottom
            sx={{ textShadow: "2px 2px 8px #000" }}
          >
            Welcome to Salamander Tracker
          </Typography>
        </Zoom>

        <Typography
          variant="h5"
          gutterBottom
          sx={{ maxWidth: "600px", textShadow: "1px 1px 4px #000" }}
        >
          Track salamanders in videos with interactive color tuning and
          real-time centroid detection. Explore nature, one frame at a time.
        </Typography>

        <Box mt={4}>
          <Button
            component={Link}
            href="/videos"
            variant="contained"
            color="secondary"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: "bold",
              boxShadow: 2,
              ":hover": {
                backgroundColor: "secondary.dark",
                transform: "scale(1.05)",
              },
              transition: "transform 0.3s ease",
            }}
          >
            Get Started
          </Button>
        </Box>

        <Box mt={6} sx={{ display: { xs: "none", md: "block" } }}>
          <Image
            src="/images/salamander-sample.png"
            alt="Salamander Preview"
            width={480}
            height={300}
            style={{
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
            }}
          />
        </Box>
      </Box>
    </Fade>
  );
}
