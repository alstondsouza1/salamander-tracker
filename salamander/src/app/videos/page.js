// === src/app/videos/page.js ===
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Skeleton,
  Zoom,
  Box,
} from "@mui/material";
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

export default function VideoChooserPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/videos");
        const data = await res.json();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        📼 Available Salamander Videos
      </Typography>

      <Typography variant="body2" gutterBottom sx={{ mb: 4 }}>
        Click any video below to enter the preview and processing interface.
      </Typography>

      <Grid container spacing={4}>
        {loading
          ? Array.from(new Array(6)).map((_, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Skeleton variant="rectangular" height={140} />
                <Skeleton width="80%" />
              </Grid>
            ))
          : videos.map((video, idx) => (
              <Zoom in key={idx} style={{ transitionDelay: `${idx * 100}ms` }}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    elevation={4}
                    sx={{
                      border: '2px dashed #ccc',
                      borderRadius: 3,
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.03)',
                      },
                    }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={1}>
                        <VideoLibraryIcon color="primary" />
                        <Typography variant="h6" noWrap>
                          {video}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        component={Link}
                        href={`/preview/${encodeURIComponent(video)}`}
                        variant="contained"
                        color="secondary"
                        fullWidth
                      >
                        🔍 Preview
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Zoom>
            ))}
      </Grid>
    </Container>
  );
}