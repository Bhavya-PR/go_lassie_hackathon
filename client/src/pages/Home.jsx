import PayerList from "../components/PayerList.jsx";
import SearchBar from "../components/SearchBar.jsx";

const Home = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Payer Management</h1>
      <SearchBar />
      <PayerList />
    </div>
  );
};

export default Home;
