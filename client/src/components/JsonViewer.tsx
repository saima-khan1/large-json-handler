import React from "react";
import ReactJson from "@microlink/react-json-view";
import { jsonrepair } from "jsonrepair";

interface JsonViewerProps {
  visibleChunks: string[];
  error: string | null;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ visibleChunks, error }) => {
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (visibleChunks.length === 0 || !visibleChunks.join("")) {
    return <p style={{ color: "gray" }}>No data available...</p>;
  }

  try {
    const repairedJson = jsonrepair(visibleChunks.join(""));
    const parsedJson = JSON.parse(repairedJson);
    return (
      <ReactJson
        src={parsedJson}
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
    return <p style={{ color: "red" }}>Invalid JSON</p>;
  }
};

export default JsonViewer;
