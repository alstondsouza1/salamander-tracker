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
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useFavorites } from '../../context/FavoritesContext';

export default function VideoChooserPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { favorites, toggleFavorite } = useFavorites();

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
      <Typography variant="h4" fontWeight={700} gutterBottom>
        📼 Available Salamander Videos
      </Typography>
      <Typography sx={{ mb: 4 }}>
        Click any video below to enter the preview and processing interface.
      </Typography>

      <Grid container spacing={4}>
        {loading
          ? Array.from(new Array(6)).map((_, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Skeleton variant="rounded" height={180} />
                <Skeleton width="60%" />
              </Grid>
            ))
          : videos.map((video, idx) => (
              <Zoom in key={idx} style={{ transitionDelay: `${idx * 100}ms` }}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card elevation={6}>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={1}>
                        <VideoLibraryIcon color="primary" />
                        <Typography fontWeight={600} noWrap>
                          {video}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ flexDirection: 'column', gap: 1 }}>
                      <Button
                        component={Link}
                        href={`/preview/${encodeURIComponent(video)}`}
                        variant="contained"
                        color="secondary"
                        fullWidth
                      >
                        🔍 Preview
                      </Button>
                      <Button
                        variant={favorites.includes(video) ? "contained" : "outlined"}
                        color="primary"
                        fullWidth
                        startIcon={<FavoriteIcon />}
                        onClick={() => toggleFavorite(video)}
                      >
                        {favorites.includes(video) ? "Unfavorite" : "Save to Favorites"}
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