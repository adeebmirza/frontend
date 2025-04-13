import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("auth/login");
  };

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">📝 MyNotes</Link>
      <div className="space-x-4 text-sm hidden sm:flex">
        <Link to="/" className="hover:text-blue-300">Home</Link>
        <Link to="/notes/new" className="hover:text-blue-300">Create</Link>
        <button onClick={handleLogout} className="hover:text-red-300">Logout</button>
      </div>
      <button className="sm:hidden" onClick={handleLogout}>🚪</button>
    </nav>
  );
};

export default Navbar;
