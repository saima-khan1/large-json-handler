import React, { useState } from "react";
import { Drawer, Box, Typography, Stack, Container } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const HelpInfo: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Container maxWidth="md">
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
          <Box
            sx={{
              width: { md: 500, sm: 400, xs: 250 },
              padding: 2,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                mt: 2,
                marginLeft: 4,
              }}
            >
              About This App
            </Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>
              <ul>
                <li>Efficiently processes and displays large JSON files.</li>
                <li>
                  Streams data in small chunks instead of loading everything at
                  once.
                </li>
                <li>Optimizes page performance.</li>
                <li>Reduces memory usage.</li>
                <li>Ensures a smooth user experience.</li>
                <li>Supports search functionality.</li>
                <li>
                  Includes pagination for easy navigation of large datasets.
                </li>
                <li>
                  Example URL to test:{" "}
                  <a
                    href="https://jsonplaceholder.typicode.com/photos"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://jsonplaceholder.typicode.com/photos
                  </a>
                </li>
              </ul>
            </Typography>
          </Box>
        </Drawer>
      </Container>
    </>
  );
};

export default HelpInfo;
