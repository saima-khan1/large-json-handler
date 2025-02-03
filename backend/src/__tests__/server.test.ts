import request from "supertest";
import axios from "axios";
import app from "../app";
import { describe, expect, it, jest } from "@jest/globals";

jest.mock("axios");

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

describe("GET /large-json-data", () => {
  it("should return 400 if no sourceUrl is provided", async () => {
    const response = await request(app).get("/large-json-data");
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "No source URL provided" });
  });

  it("should handle errors when fetching data", async () => {
    (axios as jest.Mocked<typeof axios>).get.mockRejectedValue(
      new Error("Error fetching data")
    );

    const response = await request(app)
      .get("/large-json-data")
      .query({ sourceUrl: "http://example.com/data.json" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Failed to fetch data" });
  });

  it("should stream JSON data correctly", async () => {
    const mockData = [
      { id: 1, name: "Item 1" },
      { id: 2, name: "Another Item" },
    ];
    const mockStream = require("stream").Readable.from(
      JSON.stringify(mockData)
    );

    (axios as jest.Mocked<typeof axios>).get.mockResolvedValue({
      data: mockStream,
    });

    const response = await request(app)
      .get("/large-json-data")
      .query({ sourceUrl: "http://example.com/data.json" });

    expect(response.status).toBe(200);
    expect(response.text).toContain("Item 1");
    expect(response.text).toContain("Another Item");
  });

  it("should filter results based on search query", async () => {
    const mockData = [
      { id: 1, name: "Item 1" },
      { id: 2, name: "Another Item" },
    ];

    const mockStream = require("stream").Readable.from(
      JSON.stringify(mockData)
    );

    (axios as jest.Mocked<typeof axios>).get.mockResolvedValue({
      data: mockStream,
    });

    const response = await request(app)
      .get("/large-json-data")
      .query({ sourceUrl: "http://example.com/data.json", search: "Another" });

    expect(response.status).toBe(200);
    expect(response.text).toContain("Another Item");
    expect(response.text).not.toContain("Item 1");
  });
});
