"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Container,
  Typography,
  Slider,
  TextField,
  Button,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Divider,
} from "@mui/material";

export default function PreviewPage() {
  const { filename } = useParams();
  const [thumbnail, setThumbnail] = useState("");
  const [binarized, setBinarized] = useState(null);
  const [targetColor, setTargetColor] = useState("#ff0000");
  const [threshold, setThreshold] = useState(50);
  const [centroid, setCentroid] = useState({ x: 100, y: 100 });
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);

  useEffect(() => {
    const fetchThumbnail = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/videos/thumbnail/${filename}`);
        const blob = await res.blob();
        setThumbnail(URL.createObjectURL(blob));
      } catch (err) {
        console.error("Failed to fetch thumbnail:", err);
      }
    };

    const fetchPreview = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/videos/preview/${filename}?targetColor=${targetColor.replace("#", "")}&threshold=${threshold}`
        );

        if (!res.ok) {
          console.error("Preview failed to load.");
          setBinarized(null);
          return;
        }

        const data = await res.json();
        setBinarized(data.image);
        setCentroid(data.centroid);
      } catch (err) {
        console.error("Preview error:", err);
        setBinarized(null);
      }
    };

    fetchThumbnail();
    fetchPreview();
  }, [filename, targetColor, threshold]);

  const handleProcessClick = async () => {
    const hex = targetColor.replace("#", "");
    try {
      const res = await fetch(
        `http://localhost:3001/api/process/${filename}?targetColor=${hex}&threshold=${threshold}`,
        { method: "POST" }
      );
      const data = await res.json();
      setJobId(data.jobId);
      setStatus("processing");

      const interval = setInterval(async () => {
        const statusRes = await fetch(
          `http://localhost:3001/api/process/${data.jobId}/status`
        );
        const statusData = await statusRes.json();

        if (statusData.status === "done") {
          clearInterval(interval);
          setStatus("done");
          setResultUrl(`http://localhost:3001/results/${data.jobId}.csv`);
        }
      }, 2000);
    } catch (err) {
      console.error("Failed to start job:", err);
    }
  };

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Preview Processing
      </Typography>

      <Typography sx={{ mb: 4 }}>
        Adjust the color and threshold below to binarize your salamander video and detect its centroid.
      </Typography>

      <Grid container spacing={4} alignItems="center" sx={{ mb: 2 }}>
        <Grid item>
          <TextField
            label="Target Color"
            type="color"
            value={targetColor}
            onChange={(e) => setTargetColor(e.target.value)}
            sx={{ width: 100 }}
            InputLabelProps={{ shrink: true }}
            inputProps={{ 'aria-label': 'Target Color Picker' }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography gutterBottom>Threshold</Typography>
          <Slider
            min={0}
            max={255}
            value={threshold}
            onChange={(e, val) => setThreshold(val)}
            valueLabelDisplay="auto"
            color="secondary"
            aria-label="Threshold slider"
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, position: "relative", height: "100%" }} elevation={4}>
            <Typography fontWeight="bold" gutterBottom>
              Original Frame (with centroid)
            </Typography>
            <img
              src={thumbnail}
              alt="Original"
              style={{ width: "100%", border: "1px solid #ccc", borderRadius: 12 }}
            />
            <div
              style={{
                position: "absolute",
                left: `${centroid.x}px`,
                top: `${centroid.y}px`,
                transform: "translate(-50%, -50%)",
                width: "12px",
                height: "12px",
                backgroundColor: "lime",
                borderRadius: "50%",
                border: "2px solid white",
              }}
              aria-label="Centroid marker"
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, position: "relative", height: "100%" }} elevation={4}>
            <Typography fontWeight="bold" gutterBottom>
              Binarized Frame (with centroid)
            </Typography>
            {binarized ? (
              <img
                src={binarized}
                alt="Binarized"
                style={{ width: "100%", border: "1px solid #ccc", borderRadius: 12 }}
              />
            ) : (
              <Typography color="error">Binarized frame not available.</Typography>
            )}
            <div
              style={{
                position: "absolute",
                left: `${centroid.x}px`,
                top: `${centroid.y}px`,
                transform: "translate(-50%, -50%)",
                width: "12px",
                height: "12px",
                backgroundColor: "lime",
                borderRadius: "50%",
                border: "2px solid white",
              }}
              aria-label="Centroid marker"
            />
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 5 }} />

      <Button
        variant="contained"
        color="secondary"
        onClick={handleProcessClick}
        size="large"
        sx={{ fontWeight: 600, px: 4, py: 1.5 }}
        aria-label="Process video button"
      >
        Process Video with These Settings
      </Button>

      {status === "processing" && (
        <Box mt={4} display="flex" alignItems="center" gap={2}>
          <CircularProgress color="primary" />
          <Typography>Processing video...</Typography>
        </Box>
      )}

      {status === "done" && (
        <Box mt={4}>
          <Typography color="success.main" fontWeight="medium">
            ✅ Processing complete!
          </Typography>
          <a href={resultUrl} download>
            <Button variant="outlined" sx={{ mt: 2 }}>
              📄 Download CSV
            </Button>
          </a>
        </Box>
      )}
    </Container>
  );
}
