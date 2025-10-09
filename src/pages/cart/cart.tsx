import { useSelector, useDispatch } from "react-redux";
import type { Product } from "../../core/interfaces/product";
import { clearCart, removeFromCart, updateQuantity } from "../../core/features/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state: any) => state.cart);

  const handleCheckout = () => {
    alert(`Order placed! Total: $${totalAmount}`);
    dispatch(clearCart());
  };

  const handleQuantityChange = (id: number, value: any) => {
    const quantity = parseInt(value, 10);
    if (!isNaN(quantity) && quantity > 0) {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>

      {items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        <div>
          {items.map((item: Product) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b py-4"
            >
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-gray-600">${item.price}</p>
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) =>
                    handleQuantityChange(item.id, e.target.value)
                  }
                  className="w-16 border rounded p-1 text-center"
                />
                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center mt-6">
            <h3 className="text-xl font-bold">Total: ${totalAmount}</h3>
            <button
              onClick={handleCheckout}
              className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
