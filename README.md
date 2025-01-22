# Large JSON Handler

## Overview

This project is designed to handle large JSON data efficiently by streaming it in small chunks instead of loading the entire dataset into memory at once. This approach significantly improves page performance and optimization, especially when dealing with large datasets.

## Features

- **Efficient JSON Streaming**: Fetches large JSON data in chunks of 20KB per chunk.
- **Dynamic URL Support**: Allows fetching JSON from any valid URL.
- **Search Functionality**: Filters JSON data dynamically based on a search keyword.
- **Memory Optimization**: Prevents excessive memory consumption by streaming data instead of loading it all at once.
- **React Frontend**: Provides an interactive UI to load and search JSON data.
- **Pagination Support**: Users can load more data progressively using a "Show More" button.

## Tech Stack

### Backend:

- **Node.js** (Express.js)
- **Axios Stream**Axios Stream (for handling data streaming efficiently)
- **JSONStream** (for streaming JSON data)
- **CORS** (to handle cross-origin requests)

### Frontend:

- **React.js** (with TypeScript)
- **React JSON Viewer** (`react-json-view` for structured JSON display)
- **JSON Repair** (`jsonrepair` to fix broken JSON structures)
- **Axios Stream** (for efficient data retrieval)

## How It Works

### Backend:

1. The backend exposes an API endpoint: `GET /large-json-data?sourceUrl=<URL>`.
2. The server fetches JSON data from the provided URL using Axios.
3. The response is streamed using JSONStream, processing objects one by one.
4. Data is chunked into 20KB-sized parts before being sent to the client.
5. If a search keyword is provided, only matching objects are sent.

### Frontend:

1. Users input a JSON URL and click "Load JSON" to fetch data.
2. Data is loaded incrementally in chunks to optimize performance.
3. JSON data is displayed using `react-json-view`, which formats it for better readability.
4. `jsonrepair` is used to fix any malformed JSON before parsing and rendering.
5. Users can search for specific data by entering a keyword. If a search term is provided, the backend filters matching JSON objects and streams only the relevant data. The frontend processes and displays the search results dynamically.
6. Additional data can be loaded using the "Show More" button, which progressively loads more chunks.

## Installation & Setup

### Backend:

1. Clone the repository.
2. Install dependencies:

'npm install'

3. Start the server:

'npm run dev'

The server will run at `http://localhost:5001`.

### Frontend:

1. Navigate to the frontend directory.
2. Install dependencies:

   'npm install'

3. Start the React app:

   'npm start'

   The frontend will run at `http://localhost:5173`.

## API Usage

#### Parameters:

- `sourceUrl` (required): The URL of the JSON data source.
- `search` (optional): A keyword to filter results.

### Endpoint to load json 

GET /large-json-data?sourceUrl=<URL>

#### Example url:

GET /large-json-data?sourceUrl=https://jsonplaceholder.typicode.com/photos

##  &#x20;

### Example Search URL:

GET /large-json-data?sourceUrl=https%3A%2F%2Fjsonplaceholder.typicode.com%2Fphotos&search=d32776

## License

This project is open-source and available under the MIT License.
