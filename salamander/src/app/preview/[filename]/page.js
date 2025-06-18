"use client";

import { useEffect, useState, useRef } from "react";
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
  Alert,
} from "@mui/material";

export default function PreviewPage() {
  const { filename } = useParams();

  // ─── User inputs & validation ─────────────────────────────────────────
  const [targetColor, setTargetColor] = useState("");
  const [threshold, setThreshold] = useState(null);
  const [errors, setErrors] = useState({ color: "", threshold: "", fetch: "", process: "" });

  // ─── Preview & centroid state ──────────────────────────────────────────
  const [thumbnail, setThumbnail] = useState(null);
  const [binarizedDataUrl, setBinarized] = useState(null);
  const [centroid, setCentroid] = useState({ x: -1, y: -1 });
  const canvasRef = useRef(null);

  // ─── Processing job state ─────────────────────────────────────────────
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);

  // fetch first‐frame thumbnail once
  useEffect(() => {
    fetch(`http://localhost:3001/api/videos/thumbnail/${filename}`)
      .then((res) => {
        if (!res.ok) throw new Error("fetch");
        return res.blob();
      })
      .then((blob) => setThumbnail(URL.createObjectURL(blob)))
      .catch(() => {
        setErrors((e) => ({ ...e, fetch: "Failed to load thumbnail." }));
      });
  }, [filename]);

  // whenever thumbnail, color or threshold changes → re‐binarize offscreen
  useEffect(() => {
    if (!thumbnail || !targetColor || threshold == null) {
      setBinarized(null);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = thumbnail;
    img.onload = () => {
      const w = img.naturalWidth,
        h = img.naturalHeight;
      let canvas = canvasRef.current;
      if (!canvas) {
        canvas = document.createElement("canvas");
        canvasRef.current = canvas;
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);

      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;

      // parse hex targetColor
      const hex = targetColor.replace(/^#/, "");
      const rT = parseInt(hex.substring(0, 2), 16);
      const gT = parseInt(hex.substring(2, 4), 16);
      const bT = parseInt(hex.substring(4, 6), 16);

      let sumX = 0,
        sumY = 0,
        count = 0;
      for (let i = 0; i < data.length; i += 4) {
        const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
        const dist = Math.hypot(r - rT, g - gT, b - bT);
        const v = dist <= threshold ? 255 : 0;
        data[i] = data[i + 1] = data[i + 2] = v;
        if (v === 255) {
          const px = (i / 4) % w;
          const py = Math.floor(i / 4 / w);
          sumX += px;
          sumY += py;
          count++;
        }
      }
      ctx.putImageData(imageData, 0, 0);

      if (count > 0) {
        setCentroid({ x: Math.round(sumX / count), y: Math.round(sumY / count) });
      } else {
        setCentroid({ x: -1, y: -1 });
      }
      setBinarized(canvas.toDataURL("image/png"));
    };
  }, [thumbnail, targetColor, threshold]);

  // ─── Kick off the video‐processing job ─────────────────────────────────
  const handleProcess = async () => {
    // clear old errors
    setErrors({ color: "", threshold: "", fetch: errors.fetch, process: "" });

    // validation
    let ok = true;
    if (!targetColor) {
      setErrors((e) => ({ ...e, color: "Please choose a target color." }));
      ok = false;
    }
    if (threshold == null) {
      setErrors((e) => ({ ...e, threshold: "Please set a threshold value." }));
      ok = false;
    }
    if (!ok) return;

    setStatus("processing");
    const hex = targetColor.replace("#", "");
    try {
      const res = await fetch(
        `http://localhost:3001/api/process/${filename}?targetColor=${hex}&threshold=${threshold}`,
        { method: "POST" }
      );
      if (!res.ok) throw new Error("start");
      const { jobId } = await res.json();
      setJobId(jobId);

      // poll status every 2s
      const iv = setInterval(async () => {
        const st = await fetch(`http://localhost:3001/api/process/${jobId}/status`);
        const { status: s, error } = await st.json();
        if (s === "done" || s === "error") {
          clearInterval(iv);
          setStatus(s);
          if (s === "error") setErrors((e) => ({ ...e, process: error || "Server error." }));
        }
      }, 2000);
    } catch {
      setStatus("error");
      setErrors((e) => ({ ...e, process: "Failed to start processing." }));
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

      {/* ─── Controls ───────────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 4, mb: 2 }}>
        {/* Color picker */}
        <Box
          sx={{
            p: 1.5,
            border: "1px solid #ccc",
            borderRadius: 2,
            textAlign: "center",
            width: 140,
          }}
        >
          <Typography variant="caption" gutterBottom>
            Target Color
          </Typography>
          <TextField
            type="color"
            value={targetColor}
            onChange={(e) => setTargetColor(e.target.value)}
            variant="standard"
            error={!!errors.color}
            helperText={errors.color}
            sx={{
              "& .MuiInputBase-input": {
                cursor: "pointer",
                width: "100%",
                height: 36,
                padding: 0,
              },
            }}
          />
        </Box>

        {/* Threshold slider */}
        <Box sx={{ width: 360 }}>
          <Typography gutterBottom>Threshold</Typography>
          <Slider
            min={0}
            max={255}
            value={threshold ?? 0}
            onChange={(_, v) => setThreshold(v)}
            valueLabelDisplay="auto"
            sx={{
              "& .MuiSlider-thumb": {
                bgcolor: "primary.main",
                border: "2px solid white",
              },
              "& .MuiSlider-rail": { bgcolor: "#ddd" },
            }}
          />
          {errors.threshold && (
            <Typography color="error" variant="caption">
              {errors.threshold}
            </Typography>
          )}
        </Box>
      </Box>

      {/* ─── Preview Frames ──────────────────────────────────────────────────── */}
      <Grid container spacing={4}>
        {/* Original */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ position: "relative", p: 2, borderRadius: 3 }}>
            <Typography fontWeight={600} gutterBottom>
              Original Frame (with centroid)
            </Typography>
            {thumbnail ? (
              <Box
                component="img"
                src={thumbnail}
                alt="Original"
                sx={{ width: "100%", borderRadius: 2 }}
              />
            ) : (
              <Typography color="error">{errors.fetch}</Typography>
            )}
            {centroid.x >= 0 && (
              <Box
                sx={{
                  position: "absolute",
                  left: `${centroid.x}px`,
                  top: `${centroid.y}px`,
                  transform: "translate(-50%, -50%)",
                  width: 12,
                  height: 12,
                  bgcolor: "lime",
                  border: "2px solid white",
                  borderRadius: "50%",
                }}
              />
            )}
          </Paper>
        </Grid>

        {/* Binarized */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ position: "relative", p: 2, borderRadius: 3 }}>
            <Typography fontWeight={600} gutterBottom>
              Binarized Frame (with centroid)
            </Typography>
            {binarizedDataUrl ? (
              <Box
                component="img"
                src={binarizedDataUrl}
                alt="Binarized"
                sx={{ width: "100%", borderRadius: 2 }}
              />
            ) : (
              <Typography color="error">Binarized frame not available.</Typography>
            )}
            {centroid.x >= 0 && (
              <Box
                sx={{
                  position: "absolute",
                  left: `${centroid.x}px`,
                  top: `${centroid.y}px`,
                  transform: "translate(-50%, -50%)",
                  width: 12,
                  height: 12,
                  bgcolor: "lime",
                  border: "2px solid white",
                  borderRadius: "50%",
                }}
              />
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* ─── Process Button & Status ────────────────────────────────────────── */}
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleProcess}
          sx={{ px: 4, py: 1.5, fontWeight: 600, borderRadius: 3 }}
        >
          Process Video with These Settings
        </Button>
      </Box>

      {status === "processing" && (
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <CircularProgress />
          <Typography>Processing…</Typography>
        </Box>
      )}

      {status === "done" && jobId && (
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Alert severity="success">✅ Processing complete!</Alert>
          <Button
            variant="outlined"
            component="a"
            href={`http://localhost:3001/results/${jobId}.csv`}
            download
            sx={{ mt: 1, textTransform: "none" }}
          >
            📄 Download CSV
          </Button>
        </Box>
      )}

      {status === "error" && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error">
            ❌ {errors.process || "An error occurred during processing."}
          </Alert>
        </Box>
      )}

      {/* Offscreen canvas → not rendered */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </Container>
  );
}
