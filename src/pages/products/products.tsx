import { Link } from "react-router-dom";
import { useGetProductsQuery } from "../../core/features/productApi";
import { useState } from "react";
import { useGetAllCategoriesQuery } from "../../core/features/categoryApi";
import addToCartsvg from "../../assets/add-to-cart.svg";
import { useDispatch } from "react-redux";
import { addToCart } from "../../core/features/cartSlice";
import { Slider } from "@mui/material";

export default function Products() {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    title: "",
    price_min: 0,
    price_max: 200,
    categoryId: "",
    limit: 25,
    offset: 0,
  });

  const { data: products, error, isLoading } = useGetProductsQuery(filters);
  const { data: categories } = useGetAllCategoriesQuery();

  const handlePriceChange = (_: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setFilters({
        ...filters,
        price_min: newValue[0],
        price_max: newValue[1],
      });
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading Products...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error Occurred !!!</p>;

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="font-bold text-2xl mb-3 sm:mb-0 text-gray-800">🛍️ Products</h1>
        <Link to="product/create">
          <button className="py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200">
            + Add Product
          </button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4 bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Filters</h2>

          {/* Search */}
          <label htmlFor="name" className="block font-medium text-gray-600 mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Search by name..."
            value={filters.title}
            onChange={(e) =>
              setFilters({ ...filters, title: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Price Range */}
          <div className="mt-6">
            <label className="block font-medium text-gray-600 mb-2">
              Price Range
            </label>
            <Slider
              value={[filters.price_min, filters.price_max]}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={200}
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>${filters.price_min}</span>
              <span>${filters.price_max}</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mt-6">
            <label htmlFor="category" className="block font-medium text-gray-600 mb-2">
              Category
            </label>
            <select
              id="category"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) =>
                setFilters({ ...filters, categoryId: e.target.value })
              }
            >
              <option value="">All</option>
              {categories?.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>

          {/* Show Items */}
          <div className="mt-6">
            <label htmlFor="limit" className="block font-medium text-gray-600 mb-2">
              Show Items
            </label>
            <select
              id="limit"
              value={filters.limit}
              onChange={(e) => setFilters({ ...filters, limit: +e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {[25, 50, 75, 100].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:w-3/4">
          <div
            className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
            style={{ maxHeight: "75vh", overflowY: "auto" }}
          >
            {products?.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 p-3 flex flex-col"
              >
                <Link to={`product-detail/${p.id}`}>
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <h3 className="mt-3 font-medium text-gray-800 text-sm sm:text-base truncate">
                    {p.title}
                  </h3>
                </Link>

                <div className="flex justify-between items-center mt-2">
                  <h4 className="font-semibold text-blue-600">${p.price}</h4>
                  <button
                    onClick={() => dispatch(addToCart(p))}
                    aria-label={`Add ${p.title} to cart`}
                    className="p-2 rounded-full hover:bg-blue-100 transition"
                  >
                    <img src={addToCartsvg} alt="" width="20px" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Show More */}
          <div className="text-center mt-8">
            <button
              className="py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200"
              onClick={() =>
                setFilters({ ...filters, limit: filters.limit + 25 })
              }
            >
              Show More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
