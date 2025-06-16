"use client";

// import hooks and components needed from libraries anc context
import { useFavorites } from "../../context/FavoritesContext";
import Link from "next/link";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Zoom,
} from "@mui/material";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import StarIcon from "@mui/icons-material/Star";

// component to display favorite videos
export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        ⭐ Favorite Videos
      </Typography>

      {favorites.length === 0 ? (
        <Typography>No favorites yet. Go star some videos!</Typography>
      ) : (

        // display each favorite video in a grid layout
        <Grid container spacing={4}>
          {favorites.map((video, idx) => (
            <Zoom in key={idx} style={{ transitionDelay: `${idx * 80}ms` }}>
              <Grid item xs={12} sm={6} md={4}>
                <Card elevation={6} sx={{ borderLeft: '6px solid #f97316' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1}>
                      <VideoLibraryIcon color="primary" />
                      <Typography variant="h6" fontWeight={600} noWrap>
                        {video}
                      </Typography>
                    </Box>
                  </CardContent>

                   {/* Action button linking to preview page */}
                  <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                    <Button
                      component={Link}
                      href={`/preview/${encodeURIComponent(video)}`}
                      variant="contained"
                      color="secondary"
                      fullWidth
                      startIcon={<StarIcon />}
                    >
                      Preview Again
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Zoom>
          ))}
        </Grid>
      )}
    </Container>
  );
}