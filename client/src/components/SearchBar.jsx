import { useState, useEffect } from "react";
import { searchPayers } from "../services/api";
import { Link } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch search results from API
  const fetchSearchResults = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const res = await searchPayers(searchTerm);
      setResults(res.data);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search (avoid excessive API calls)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchSearchResults(query);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <input
        type="text"
        placeholder="Search payers by name or ID..."
        className="border rounded px-4 py-2 w-full"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Loading Indicator */}
      {loading && <p className="text-gray-500 text-sm mt-2">Searching...</p>}

      {/* Search Results */}
      <ul className="mt-4 bg-gray-100 rounded-md">
        {results.length > 0 ? (
          results.map((payer) => (
            <li key={payer.id} className="border-b px-4 py-2 hover:bg-gray-200">
              <Link to={`/payers/${payer.id}`} className="text-blue-500 hover:underline">
                {payer.name} (ID: {payer.payer_number})
              </Link>
            </li>
          ))
        ) : (
          !loading && query && <p className="text-gray-500 text-sm px-4 py-2">No results found.</p>
        )}
      </ul>
    </div>
  );
};

export default SearchBar;
