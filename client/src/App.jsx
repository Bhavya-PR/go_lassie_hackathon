import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PayerDetails from './pages/PayerDetails';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/payer/:id" element={<PayerDetails />} />
    </Routes>
  );
}

export default App;
