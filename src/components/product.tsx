import { Link, useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "../core/features/productApi";
import { useState } from "react";
import editIcon from "../assets/edit-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateQuantity } from "../core/features/cartSlice";
import type { RootState } from "../core/store/store";

export default function Product() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { data: product, error, isLoading } = useGetProductByIdQuery(+id!, { skip: !id });
  const [currentIndex, setIndex] = useState(0);

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItem = product ? cartItems.find((item) => item.id === product.id) : null;
  const quantity = cartItem ? cartItem.quantity : 0;

  if (isLoading) return <p className="text-center mt-10">Loading Product...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">Error Occurred!</p>;

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="font-bold text-2xl text-gray-800">🛒 Product Detail</h1>
        <Link to={`/product-detail/${id}/edit`}>
          <button className="flex items-center gap-2 py-1 px-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-all duration-200">
            <img src={editIcon} alt="Edit" className="w-5 h-5" />
            Edit
          </button>
        </Link>
      </div>

      {/* Product Layout */}
      <div className="flex flex-col lg:flex-row bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
        {/* Image Section */}
        <div className="lg:w-1/2 flex flex-col p-4 bg-gray-50">
          {/* Main Image */}
          <div className="flex justify-center items-center mb-4">
            <img
              src={product?.images[currentIndex]}
              alt={product?.title}
              className="object-contain max-h-[500px] w-full"
              loading="lazy"
            />
          </div>

          {/* Carousel Thumbnails */}
          <div className="flex justify-center gap-2 overflow-x-auto">
            {product?.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setIndex(index)}
                className={`border-2 rounded-md overflow-hidden ${
                  currentIndex === index
                    ? "border-blue-500"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <img
                  src={image}
                  alt={`${product.title}-${index}`}
                  className="w-20 h-20 object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product?.title}</h1>

            {/* Price */}
            <p className="mb-4 text-blue-600 font-semibold flex items-start">
              <span className="text-3xl mr-1">$</span>
              <span className="text-2xl">{product?.price}</span>
            </p>

            <h2 className="text-lg font-semibold mb-2 text-gray-700">Description</h2>
            <p className="text-gray-600 mb-5 leading-relaxed text-justify">{product?.description}</p>

            <p className="text-sm text-gray-500">
              Category:{" "}
              <span className="font-medium text-gray-800">{product?.category.name}</span>
            </p>
          </div>

          {/* Add to Cart with Quantity */}
          <div className="mt-6 flex items-center gap-3">
            {quantity > 0 ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => dispatch(updateQuantity({ id: product.id, quantity: quantity - 1 }))}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) =>
                    dispatch(updateQuantity({ id: product.id, quantity: Math.max(1, +e.target.value || 1) }))
                  }
                  className="w-12 text-center border rounded"
                />
                <button
                  onClick={() => dispatch(updateQuantity({ id: product.id, quantity: quantity + 1 }))}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={() => dispatch(addToCart(product))}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
              >
                🛒 Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
