import { useEffect, useState } from "react";
import { getPayerDetails } from "../services/api";
import { useParams } from "react-router-dom";

const PayerDetails = () => {
  const { id } = useParams();
  const [payer, setPayer] = useState(null);

  useEffect(() => {
    getPayerDetails(id).then((res) => setPayer(res.data));
  }, [id]);

  if (!payer) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">{payer.payer.name}</h2>
      <ul className="bg-white shadow rounded p-4">
        {payer.details.map((detail) => (
          <li key={detail.id} className="border-b py-2">
            {detail.payer_name} | {detail.payer_number}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PayerDetails;
