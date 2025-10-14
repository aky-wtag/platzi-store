import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCart } from "../core/features/cartSlice";

export default function Navbar() {
  const dispatch: any = useDispatch();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const { items } = useSelector((state: any) => state.cart);

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold">
        <Link to="/" className="font-bold">My Store</Link>
      </div>

      <ul className="flex gap-6">
        <li>
          <Link to="/" className="hover:text-gray-200 font-semibold">
            Home
          </Link>
        </li>
        <li>
          <Link to="/products" className="hover:text-gray-200 font-semibold">
            Products
          </Link>
        </li>
        <li>
          <Link to="/categories" className="hover:text-gray-200 font-semibold">
            Categories
          </Link>
        </li>
        <li className="relative">
          <Link to="/cart" className="hover:text-gray-200 font-semibold flex items-center gap-2">
            Cart
            {items.length > 0 && (
              <span className="ml-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                {items.length}
              </span>
            )}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
