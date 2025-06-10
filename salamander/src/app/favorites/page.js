"use client";

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
} from "@mui/material";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";

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
        <Grid container spacing={4}>
          {favorites.map((video, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card elevation={4}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1}>
                    <VideoLibraryIcon color="primary" />
                    <Typography variant="h6">{video}</Typography>
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
                    Preview
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}