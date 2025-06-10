import React from "react";
import { CircularProgress, Box } from "@mui/material";

const withLoading = (Component) => {
  return function WithLoadingComponent({ loading, ...props }) {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      );
    }
    return <Component {...props} />;
  };
};

export default withLoading;