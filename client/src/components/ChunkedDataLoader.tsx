import React, { useState, useEffect, useRef } from "react";

const ChunkedDataLoader: React.FC = () => {
  const allChunksRef = useRef<string[]>([]);
  const [visibleChunks, setVisibleChunks] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFetchingNextChunk, setIsFetchingNextChunk] =
    useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5001/large-json-data");
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

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          accumulatedData += chunk;

          allChunksRef.current.push(accumulatedData);
          accumulatedData = "";

          if (currentIndex === 0) {
            setVisibleChunks([allChunksRef.current[0]]);
          }
        }
      }

      setLoading(false);
      setHasMore(allChunksRef.current.length > visibleChunks.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(false);
    }
  };

  const handleShowMore = () => {
    if (isFetchingNextChunk || loading) return;

    setIsFetchingNextChunk(true);
    const nextIndex = currentIndex + 1;

    if (nextIndex < allChunksRef.current.length) {
      setVisibleChunks((prevChunks) => [
        ...prevChunks,
        allChunksRef.current[nextIndex],
      ]);
      setCurrentIndex(nextIndex);
      setHasMore(nextIndex + 1 < allChunksRef.current.length);
    }

    setIsFetchingNextChunk(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Large JSON Data</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <div>
        {visibleChunks.map((chunk, index) => (
          <pre key={index}>{chunk}</pre>
        ))}
      </div>

      {!loading && hasMore && (
        <button
          onClick={handleShowMore}
          disabled={isFetchingNextChunk || loading}
        >
          {isFetchingNextChunk ? "Loading More..." : "Show More"}
        </button>
      )}
    </div>
  );
};

export default ChunkedDataLoader;
