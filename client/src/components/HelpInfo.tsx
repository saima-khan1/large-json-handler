import React, { useState } from "react";
import { Drawer, Box, Typography, Stack } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const HelpInfo: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          position: "absolute",
          top: 30,
          right: 16,
          backgroundColor: "white",
          padding: "6px 12px",
          borderRadius: "20px",
          boxShadow: 2,
          cursor: "pointer",
        }}
        onClick={() => setOpen(true)}
      >
        <Typography variant="h6" fontWeight="bold">
          Help
        </Typography>
        <HelpOutlineIcon />
      </Stack>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 300, padding: 2 }}>
          <Typography variant="h6">About This App</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            This application efficiently processes and displays large JSON files
            by streaming data in small chunks instead of loading everything at
            once. This approach optimizes page performance, reduces memory
            usage, and ensures a smooth user experience. It supports search
            functionality and pagination, making large datasets easy to navigate
            and interact with.
          </Typography>
        </Box>
      </Drawer>
    </>
  );
};

export default HelpInfo;
