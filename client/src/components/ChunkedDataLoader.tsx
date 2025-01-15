import React, { useState, useEffect, useRef } from "react";

const ChunkedDataLoader: React.FC = () => {
  const allChunksRef = useRef<string[]>([]);
  const searchChunksRef = useRef<string[]>([]);
  const [visibleChunks, setVisibleChunks] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [hasMoreSearch, setHasMoreSearch] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentSearchIndex, setCurrentSearchIndex] = useState<number>(0);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);

  const fetchData = async (search?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:5001/large-json-data${
          search ? `?search=${search}` : ""
        }`
      );
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedData = "";

      if (!reader) {
        throw new Error("No readable stream available");
      }

      const newChunks: string[] = [];
      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          accumulatedData += chunk;

          newChunks.push(accumulatedData);
          accumulatedData = "";
        }
      }

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

      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(false);
    }
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

  const handleSearch = () => {
    setIsSearching(true);

    if (searchKeyword.trim() === "") {
      setVisibleChunks(allChunksRef.current.slice(0, currentIndex + 1));
      setHasMore(currentIndex + 1 < allChunksRef.current.length);
      setIsSearchActive(false);
      setIsSearching(false);
      return;
    }

    fetchData(searchKeyword).finally(() => setIsSearching(false));
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    setVisibleChunks(allChunksRef.current.slice(0, currentIndex + 1));
    setHasMore(currentIndex + 1 < allChunksRef.current.length);
    setIsSearchActive(false);
    setHasMoreSearch(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Large JSON Data</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter keyword..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            width: "300px",
            marginRight: "10px",
          }}
        />
        <button
          onClick={handleSearch}
          disabled={loading || isSearching}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          {isSearching ? "Searching..." : "Search"}
        </button>

        {isSearchActive && (
          <button
            onClick={handleClearSearch}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#DC3545",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Clear Search
          </button>
        )}
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <div>
        {visibleChunks.map((chunk, index) => (
          <pre key={index}>{chunk}</pre>
        ))}
      </div>

      {!loading &&
        ((isSearchActive && hasMoreSearch) || (!isSearchActive && hasMore)) && (
          <button
            onClick={handleShowMore}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#28A745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "20px",
            }}
          >
            Show More
          </button>
        )}
    </div>
  );
};

export default ChunkedDataLoader;
