import React from "react";
import ReactJson from "@microlink/react-json-view";
import { jsonrepair } from "jsonrepair";

interface JsonViewerProps {
  visibleChunks: string[];
  error: string | null;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ visibleChunks, error }) => {
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (visibleChunks.length === 0) {
    return <p style={{ color: "gray" }}>No data available...</p>;
  }

  try {
    const accumulatedJson = visibleChunks.join("");

    const repairedJson = jsonrepair(accumulatedJson);

    const parsedJson = JSON.parse(repairedJson);

    return (
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
    );
  } catch (err) {
    console.warn("⚠️ JSON Repair Failed:", err);
    return <p style={{ color: "red" }}>Invalid JSON</p>;
  }
};

export default JsonViewer;
