import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function PayerDetails() {
  const { id } = useParams();
  const [payer, setPayer] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/payers/${id}`)
      .then((response) => setPayer(response.data))
      .catch((error) => console.error('Error fetching payer details:', error));
  }, [id]);

  if (!payer) return <h2 className="text-center text-gray-500 mt-10">Loading...</h2>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">{payer.payer.payer_name}</h1>
      <h2 className="text-xl text-gray-700">Group: {payer.payer.group_name || "No Group Assigned"}</h2>

      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6 mt-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Payer Details:</h2>
        <ul className="divide-y divide-gray-200">
          {payer.details.map((detail) => (
            <li key={detail.id} className="py-3">
              <span className="font-semibold">{detail.payer_name}</span> 
              <span className="text-gray-500"> - {detail.payer_number || "No Number"}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link to="/" className="mt-6 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
        Back to Payers
      </Link>
    </div>
  );
}

export default PayerDetails;
