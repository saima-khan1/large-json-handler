import React from "react";
import ReactJson from "@microlink/react-json-view";
import { jsonrepair } from "jsonrepair";
import { Container } from "@mui/material";

interface JsonViewerProps {
  visibleChunks: string[];
  error: string | null;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ visibleChunks, error }) => {
  if (error)
    return <p style={{ color: "red", paddingLeft: "27px" }}>{error}</p>;
  if (visibleChunks.length === 0) {
    return (
      <p style={{ color: "gray", paddingLeft: "27px" }}>No data available...</p>
    );
  }

  try {
    const accumulatedJson = visibleChunks.join("");

    const repairedJson = jsonrepair(accumulatedJson);

    const parsedJson = JSON.parse(repairedJson);

    return (
      <Container maxWidth="md">
        <ReactJson
          src={parsedJson.flat()}
          theme="monokai"
          collapsed={1}
          enableClipboard={true}
          displayDataTypes={false}
          iconStyle="triangle"
          groupArraysAfterLength={0}
          style={{ fontSize: "18px" }}
        />
      </Container>
    );
  } catch (err) {
    console.warn("⚠️ JSON Repair Failed:", err);
    return <p style={{ color: "red", paddingLeft: "27px" }}>Invalid JSON</p>;
  }
};

export default JsonViewer;
