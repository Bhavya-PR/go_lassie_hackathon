import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function App() {
  const [payers, setPayers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get('http://localhost:5000/payers')
      .then((response) => setPayers(response.data))
      .catch((error) => console.error('Error fetching payers:', error));
  }, []);

  const handleSearch = () => {
    axios.get(`http://localhost:5000/payers/search?query=${search}`)
      .then((response) => setPayers(response.data))
      .catch((error) => console.error('Search error:', error));
  };

  return (
    <div>
      <h1>Payer List</h1>
      <input 
        type="text" 
        placeholder="Search Payers..." 
        value={search} 
        onChange={(e) => setSearch(e.target.value)} 
      />
      <button onClick={handleSearch}>Search</button>

      <ul>
        {payers.map((payer) => (
          <li key={payer.id}>
            <Link to={`/payer/${payer.id}`}>{payer.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
