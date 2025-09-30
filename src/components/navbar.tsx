import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
        <div className="text-xl font-bold">
          <Link to="/">My Store</Link>
        </div>
        <ul className="flex gap-6">
          <li>
            <Link to="/" className="hover:text-gray-200">
              Home
            </Link>
          </li>
          <li>
            <Link to="/products" className="hover:text-gray-200">
              Products
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
