import React from "react";
import { Button, InputBase, Box } from "@mui/material";

interface SearchBarProps {
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
  handleSearch: () => void;
  handleClearSearch: () => void;
  loading: boolean;
  isSearching: boolean;
  isSearchActive: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchKeyword,
  setSearchKeyword,
  handleSearch,
  handleClearSearch,

  isSearching,
  isSearchActive,
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      border: "1px solid #ccc",
      borderRadius: "8px",
      overflow: "hidden",
      width: "850px",
      marginTop: "20px",
      marginBottom: "20px",
    }}
  >
    <InputBase
      sx={{ flex: 1, padding: "8px", fontSize: "16px" }}
      placeholder="Search..."
      value={searchKeyword}
      onChange={(e) => setSearchKeyword(e.target.value)}
    />
    <Button
      variant="contained"
      color={isSearchActive ? "error" : "info"}
      sx={{ borderRadius: 0, lineHeight: 2.75, minWidth: "120px" }}
      onClick={isSearchActive ? handleClearSearch : handleSearch}
    >
      {isSearching ? "Searching..." : isSearchActive ? "Clear" : "Search"}
    </Button>
  </Box>
);

export default SearchBar;
