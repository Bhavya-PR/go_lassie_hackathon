import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function PayerDetails() {
  const { id } = useParams();
  const [payer, setPayer] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/payers/${id}`)
      .then((response) => setPayer(response.data))
      .catch((error) => console.error('Error fetching payer details:', error));
  }, [id]);

  if (!payer) return <h2>Loading...</h2>;

  return (
    <div>
      <h1>{payer.payer.name}</h1>
      <h2>Payer Details:</h2>
      <ul>
        {payer.details.map((detail) => (
          <li key={detail.id}>
            {detail.payer_name} - {detail.payer_number || "No Number"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PayerDetails;
