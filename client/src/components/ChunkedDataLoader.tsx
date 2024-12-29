import React, { useState, useEffect } from "react";

const CompressedDataViewer: React.FC = () => {
  const [dataChunks, setDataChunks] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5001/photos");
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

      const chunks: string[] = [];

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          accumulatedData += chunk;

          if (accumulatedData.length >= 20 * 1024 || done) {
            chunks.push(accumulatedData);
            accumulatedData = "";
          }
        }
      }

      setDataChunks(chunks);
      setHasMore(chunks.length > 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleShowMore = () => {
    if (currentIndex < dataChunks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setHasMore(false);
    }
  };

  return (
    <div>
      <h1>Compressed Data Viewer</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <div>
        {dataChunks.slice(0, currentIndex + 1).map((chunk, index) => (
          <pre key={index}>{chunk}</pre>
        ))}
      </div>

      {hasMore && (
        <button onClick={handleShowMore} disabled={loading}>
          Show More
        </button>
      )}
    </div>
  );
};

export default CompressedDataViewer;
