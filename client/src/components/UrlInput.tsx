import React from "react";
import { Button, InputBase, Box, Container } from "@mui/material";

interface UrlInputProps {
  fetchedUrl: string;
  setFetchedUrl: (url: string) => void;
  fetchData: () => void;
  loading: boolean;
}

const UrlInput: React.FC<UrlInputProps> = ({
  fetchedUrl,
  setFetchedUrl,
  fetchData,
}) => (
  <Container maxWidth="md">
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        border: "1px solid #ccc",
        borderRadius: "8px",
        overflow: "hidden",
        width: { md: 850, sm: 600, xs: 300 },
      }}
    >
      <InputBase
        sx={{ flex: 1, padding: "8px", fontSize: "18px" }}
        placeholder="Enter JSON URL..."
        value={fetchedUrl}
        onChange={(e) => setFetchedUrl(e.target.value)}
      />
      <Button
        variant="contained"
        color="info"
        sx={{ borderRadius: 0, lineHeight: 2.75 }}
        onClick={fetchData}
      >
        Load JSON
      </Button>
    </Box>
  </Container>
);

export default UrlInput;
