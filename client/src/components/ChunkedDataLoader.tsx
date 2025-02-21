import React, { useState, useRef } from "react";
import UrlInput from "./UrlInput";
import SearchBar from "./SearchBar";
import JsonViewer from "./JsonViewer";
import ShowMoreButton from "./ShowMoreButton";
import { fetchJsonChunks, isValidUrl } from "../../src/services/fetchUtils";
import HelpTooltip from "./HelpInfo";
import {
  Box,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";

const ChunkedDataLoader: React.FC = () => {
  const [fetchedUrl, setFetchedUrl] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loadingJson, setLoadingJson] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [visibleChunks, setVisibleChunks] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [hasMoreSearch, setHasMoreSearch] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentSearchIndex, setCurrentSearchIndex] = useState<number>(0);

  const allChunksRef = useRef<string[]>([]);
  const searchChunksRef = useRef<string[]>([]);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const loadData = async (search?: string) => {
    if (!isValidUrl(fetchedUrl)) {
      setError("Please enter a valid URL.");
      return;
    }

    if (search) {
      setLoadingSearch(true);
    } else {
      setLoadingJson(true);
    }
    setError(null);

    try {
      const newChunks = await fetchJsonChunks(baseUrl, fetchedUrl, search);
      if (!search) {
        allChunksRef.current = newChunks;
        setVisibleChunks([newChunks[0]]);
        setCurrentIndex(0);
        setHasMore(newChunks.length > 1);
        setIsSearchActive(false);
      } else {
        searchChunksRef.current = newChunks;
        setVisibleChunks([newChunks[0]]);
        setCurrentSearchIndex(0);
        setHasMoreSearch(newChunks.length > 1);
        setIsSearchActive(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      if (search) {
        setLoadingSearch(false);
      } else {
        setLoadingJson(false);
      }
    }
  };

  const fetchData = () => loadData();

  const handleSearch = () => {
    if (!fetchedUrl) return;
    setIsSearching(true);

    if (searchKeyword.trim() === "") {
      setVisibleChunks(allChunksRef.current.slice(0, currentIndex + 1));
      setHasMore(currentIndex + 1 < allChunksRef.current.length);
      setIsSearchActive(false);
      setIsSearching(false);
      return;
    }

    loadData(searchKeyword).finally(() => setIsSearching(false));
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    setVisibleChunks(allChunksRef.current.slice(0, currentIndex + 1));
    setHasMore(currentIndex + 1 < allChunksRef.current.length);
    setIsSearchActive(false);
    setHasMoreSearch(false);
  };

  const handleShowMore = () => {
    if (isSearchActive) {
      const nextSearchIndex = currentSearchIndex + 1;
      if (nextSearchIndex < searchChunksRef.current.length) {
        setVisibleChunks((prevChunks) => [
          ...prevChunks,
          searchChunksRef.current[nextSearchIndex],
        ]);
        setCurrentSearchIndex(nextSearchIndex);
        setHasMoreSearch(nextSearchIndex + 1 < searchChunksRef.current.length);
      }
    } else {
      const nextIndex = currentIndex + 1;
      if (nextIndex < allChunksRef.current.length) {
        setVisibleChunks((prevChunks) => [
          ...prevChunks,
          allChunksRef.current[nextIndex],
        ]);
        setCurrentIndex(nextIndex);
        setHasMore(nextIndex + 1 < allChunksRef.current.length);
      }
    }
  };

  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          py: 3,
        }}
      >
        <Stack
          alignItems="center"
          justifyContent="space-around"
          spacing={2}
          sx={{ mb: 3, mt: 7 }}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              textAlign: "center",
              pb: 6,
              fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            Large Json Data Viewer
          </Typography>
          <HelpTooltip />

          <UrlInput
            fetchedUrl={fetchedUrl}
            setFetchedUrl={setFetchedUrl}
            fetchData={fetchData}
            loading={loadingJson}
          />

          {fetchedUrl && (
            <Box mt={3}>
              <SearchBar
                searchKeyword={searchKeyword}
                setSearchKeyword={setSearchKeyword}
                handleSearch={handleSearch}
                handleClearSearch={handleClearSearch}
                loading={loadingSearch || isSearching}
                isSearching={isSearching}
                isSearchActive={isSearchActive}
              />

              {loadingJson || isSearching ? (
                <Box display="flex" justifyContent="center" my={2}>
                  <CircularProgress />
                </Box>
              ) : (
                <JsonViewer visibleChunks={visibleChunks} error={error} />
              )}
              {!loadingJson &&
                !isSearching &&
                ((isSearchActive && hasMoreSearch) ||
                  (!isSearchActive && hasMore)) && (
                  <Box mt={2}>
                    <ShowMoreButton
                      handleShowMore={handleShowMore}
                      hasMore={true}
                    />
                  </Box>
                )}
            </Box>
          )}
        </Stack>
      </Container>
    </>
  );
};

export default ChunkedDataLoader;
