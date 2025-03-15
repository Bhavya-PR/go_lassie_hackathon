import { useEffect, useState } from "react";
import { getPayers } from "../services/api.js";
import { Link } from "react-router-dom";

const PayerList = () => {
  const [payers, setPayers] = useState([]);

  useEffect(() => {
    getPayers().then((res) => setPayers(res.data));
  }, []);

  return (
    <div className="p-4">
        <br />
      <h2 className="text-xl font-semibold mb-4">Payers</h2>
      <ul className="bg-white shadow rounded p-4">
        {payers.map((payer) => (
          <li key={payer.id} className="border-b py-2">
            <Link to={`/payers/${payer.id}`} className="text-blue-500 hover:underline">
              {payer.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PayerList;
