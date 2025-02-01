import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import ChunkedDataLoader from "./ChunkedDataLoader";

(globalThis as any).fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    body: {
      getReader: () => {
        let chunks = [new TextEncoder().encode('{"key": "value"}')];
        return {
          read: () =>
            Promise.resolve({
              value: chunks.shift(),
              done: chunks.length === 0,
            }),
        };
      },
    },
  })
);

describe("ChunkedDataLoader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders input and load button", () => {
    render(<ChunkedDataLoader />);
    expect(
      screen.getByPlaceholderText("Enter JSON URL...")
    ).toBeInTheDocument();
    expect(screen.getByText("Load JSON")).toBeInTheDocument();
  });

  test("displays error on invalid URL", async () => {
    render(<ChunkedDataLoader />);
    fireEvent.change(screen.getByPlaceholderText("Enter JSON URL..."), {
      target: { value: "invalid-url" },
    });
    fireEvent.click(screen.getByText("Load JSON"));
    await waitFor(() =>
      expect(screen.getByText("Please enter a valid URL.")).toBeInTheDocument()
    );
  });

  test("fetches and displays JSON data", async () => {
    render(<ChunkedDataLoader />);
    fireEvent.change(screen.getByPlaceholderText("Enter JSON URL..."), {
      target: { value: "https://example.com/data.json" },
    });
    fireEvent.click(screen.getByText("Load JSON"));

    await waitFor(() => expect(screen.getByText(/value/i)).toBeInTheDocument());
  });

  test("performs search and updates results", async () => {
    render(<ChunkedDataLoader />);
    fireEvent.change(screen.getByPlaceholderText("Enter JSON URL..."), {
      target: { value: "https://example.com/data.json" },
    });
    fireEvent.click(screen.getByText("Load JSON"));
    await waitFor(() => expect(screen.getByText(/value/i)));

    fireEvent.change(screen.getByPlaceholderText("Search..."), {
      target: { value: "key" },
    });
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => expect(screen.getByText(/value/i)).toBeInTheDocument());
  });

  test("handles clear search correctly", async () => {
    render(<ChunkedDataLoader />);
    fireEvent.change(screen.getByPlaceholderText("Enter JSON URL..."), {
      target: { value: "https://example.com/data.json" },
    });
    fireEvent.click(screen.getByText("Load JSON"));
    await waitFor(() => expect(screen.getByText(/value/i)));

    fireEvent.change(screen.getByPlaceholderText("Search..."), {
      target: { value: "key" },
    });
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() => expect(screen.getByText(/value/i)).toBeInTheDocument());

    fireEvent.click(screen.getByText("Clear Search"));
    await waitFor(() => expect(screen.getByText(/value/i)).toBeInTheDocument());
  });
});
