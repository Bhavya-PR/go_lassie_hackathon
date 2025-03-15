import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
  const [payers, setPayers] = useState([]);
  const [filteredPayers, setFilteredPayers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get('http://localhost:5000/payers')
      .then((response) => {
        setPayers(response.data);
        setFilteredPayers(response.data);
      })
      .catch((error) => console.error('Error fetching payers:', error));
  }, []);

  // 🔍 Real-time filtering while typing
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);

    if (query === "") {
      setFilteredPayers(payers);
    } else {
      const filtered = payers.filter(payer =>
        payer.name.toLowerCase().includes(query)
      );
      setFilteredPayers(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Payer List</h1>

      <div className="w-full max-w-md flex space-x-2">
        <input 
          type="text" 
          placeholder="Search Payers..." 
          value={search} 
          onChange={handleSearch} 
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <ul className="mt-6 w-full max-w-md bg-white shadow-md rounded-lg p-4 divide-y divide-gray-200">
        {filteredPayers.map((payer) => (
          <li key={payer.id} className="py-3 hover:bg-gray-50 transition">
            <Link to={`/payer/${payer.id}`} className="text-blue-600 font-semibold">
              {payer.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
