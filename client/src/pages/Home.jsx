import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
  const [payers, setPayers] = useState([]);  // Full payer list
  const [filteredPayers, setFilteredPayers] = useState([]); // Filtered list for UI
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get('http://localhost:5000/payers')
      .then((response) => {
        setPayers(response.data);
        setFilteredPayers(response.data); // Initialize with full list
      })
      .catch((error) => console.error('Error fetching payers:', error));
  }, []);

  // 🔍 Filter in real-time as user types
  const handleInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);

    if (query === "") {
      setFilteredPayers(payers); // Reset to full list
    } else {
      const filtered = payers.filter(payer =>
        payer.name.toLowerCase().includes(query)
      );
      setFilteredPayers(filtered);
    }
  };

  // 🔍 Fetch filtered results from backend when pressing search button
  const handleSearch = () => {
    axios.get(`http://localhost:5000/payers/search?query=${search}`)
      .then((response) => {
        console.log("✅ Backend Search Response:", response.data);
        setFilteredPayers(response.data);
      })
      .catch((error) => console.error('Search error:', error));
  };

  return (
    <div>
      <h1>Payer List</h1>
      <input 
        type="text" 
        placeholder="Search Payers..." 
        value={search} 
        onChange={handleInputChange} 
      />
      <button onClick={handleSearch}>Search</button>

      <ul>
        {filteredPayers.map((payer) => (
          <li key={payer.id}>
            <Link to={`/payer/${payer.id}`}>{payer.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
