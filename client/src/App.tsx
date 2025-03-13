import ChunkedDataLoader from "./components/ChunkedDataLoader";
import { Box } from "@mui/material";

const App = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 2, sm: 4 },
        backgroundColor: "#f5f5f5",
        overflow: "hidden",
      }}
    >
      <ChunkedDataLoader />
    </Box>
  );
};

export default App;
