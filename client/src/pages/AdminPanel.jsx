import { useEffect, useState } from 'react';
import axios from 'axios';

function AdminPanel() {
  const [payers, setPayers] = useState([]);
  const [selectedPayers, setSelectedPayers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/payers')
      .then((response) => setPayers(response.data))
      .catch((error) => console.error('Error fetching payers:', error));
  }, []);

  const handleCheckboxChange = (payerId) => {
    setSelectedPayers((prev) =>
      prev.includes(payerId)
        ? prev.filter(id => id !== payerId)
        : [...prev, payerId]
    );
  };

  const mergePayers = () => {
    axios.post('http://localhost:5000/admin/merge', { payerIds: selectedPayers })
      .then(() => {
        alert('Payers merged successfully!');
        setSelectedPayers([]);
      })
      .catch((error) => console.error('Merge error:', error));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Admin Panel</h1>

      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-3">Select Payers to Merge:</h2>
        <ul className="divide-y divide-gray-200">
          {payers.map((payer) => (
            <li key={payer.id} className="py-3 flex items-center">
              <input
                type="checkbox"
                checked={selectedPayers.includes(payer.id)}
                onChange={() => handleCheckboxChange(payer.id)}
                className="mr-3"
              />
              <span className="font-semibold">{payer.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <button 
        onClick={mergePayers}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Merge Selected Payers
      </button>
    </div>
  );
}

export default AdminPanel;
