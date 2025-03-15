import PayerList from "../components/PlayerList";
import SearchBar from "../components/SearchBar";

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
