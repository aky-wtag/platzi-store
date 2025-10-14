import { Link, useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "../core/features/productApi";
import { useState } from "react";
import editIcon from "../assets/edit-icon.svg";
import { useDispatch } from "react-redux";
import { addToCart } from "../core/features/cartSlice";

export default function Product() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const {
    data: product,
    error,
    isLoading,
  } = useGetProductByIdQuery(+id!, {
    skip: !id,
  });

  const [currentIndex, setIndex] = useState(0);

  if (isLoading) return <p className="text-center mt-10">Loading Product...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">Error Occurred!</p>;

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="font-bold text-2xl text-gray-800">🛒 Product Detail</h1>
        <Link to={`/product-detail/${id}/edit`}>
          <button className="flex items-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200">
            <img src={editIcon} alt="Edit" className="w-4 h-4" />
            Edit Product
          </button>
        </Link>
      </div>

      {/* Product Layout */}
      <div className="flex flex-col lg:flex-row bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
        {/* Image Gallery */}
        <div className="lg:w-1/2 flex flex-col md:flex-row lg:flex-col">
          {/* Thumbnails */}
          <div className="flex md:flex-col overflow-x-auto md:overflow-y-auto gap-2 p-4 border-r border-gray-100">
            {product?.images?.map((image, index) => (
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
                  className="w-16 h-16 object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-grow flex justify-center items-center bg-gray-50">
            <img
              src={product?.images[currentIndex]}
              alt={product?.title}
              className="object-contain max-h-[500px] p-4"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {product?.title}
            </h1>
            <p className="text-3xl font-semibold text-blue-600 mb-4">
              ${product?.price}
            </p>

            <h2 className="text-lg font-semibold mb-2 text-gray-700">
              Description
            </h2>
            <p className="text-gray-600 mb-5 leading-relaxed text-justify">
              {product?.description}
            </p>

            <p className="text-sm text-gray-500">
              Category:{" "}
              <span className="font-medium text-gray-800">
                {product?.category.name}
              </span>
            </p>
          </div>

          {/* Add to Cart Button */}
          <div className="mt-8">
            <button
              onClick={() => dispatch(addToCart(product))}
              type="button"
              className="w-full sm:w-auto bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300"
            >
              🛒 Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
