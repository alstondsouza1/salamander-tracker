"use client";

import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Fade,
  Zoom,
  Collapse,
  Paper,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const [showMore, setShowMore] = useState(false);

  return (
    <Fade in timeout={1000}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 4,
          minHeight: "80vh",
          p: { xs: 4, md: 8 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          boxShadow: 4,
          color: "white",
          "::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundImage: 'url("/images/salamander-bg.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "brightness(0.4)",
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
            fontWeight={800}
            gutterBottom
            sx={{ textShadow: "2px 2px 10px #000" }}
          >
            Welcome to Salamander Tracker
          </Typography>
        </Zoom>

        <Typography
          variant="h6"
          sx={{ maxWidth: "700px", textShadow: "1px 1px 6px #000", mb: 2 }}
        >
          Salamander Tracker helps researchers study salamanders using computer
          vision. It detects movement, calculates centroids, and logs data to
          CSV for analysis.
        </Typography>

        <Button
          onClick={() => setShowMore(!showMore)}
          variant="outlined"
          size="small"
          sx={{ mb: 2, color: "white", borderColor: "white" }}
        >
          {showMore ? "Hide Details" : "Learn More"}
        </Button>

        <Collapse in={showMore} timeout="auto" unmountOnExit>
          <Paper
            elevation={0}
            sx={{
              backgroundColor: "rgba(0,0,0,0.4)",
              p: 2,
              maxWidth: "90%",
              backdropFilter: "blur(4px)",
              borderRadius: 2,
              mb: 2,
            }}
          >
            <Typography variant="body1" sx={{ color: "#f1f1f1" }}>
              Designed in collaboration with researchers at Ohio State
              University, this tool automates the process of analyzing
              salamander behavior. By extracting position data frame-by-frame
              and saving it to CSV files, Salamander Tracker accelerates
              research into movement patterns, environmental adaptation, and
              more — all within a visually interactive platform.
            </Typography>
          </Paper>
        </Collapse>

        <Box>
          <Button
            component={Link}
            href="/videos"
            variant="contained"
            color="secondary"
            size="large"
            sx={{
              px: 5,
              py: 1.8,
              fontWeight: 700,
              borderRadius: 3,
              boxShadow: 3,
              ":hover": {
                backgroundColor: "secondary.dark",
                transform: "scale(1.05)",
              },
              transition: "all 0.3s ease",
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
              borderRadius: "16px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.6)",
            }}
          />
        </Box>
      </Box>
    </Fade>
  );
}