import { Link } from "react-router-dom";
import { useGetAllCategoriesQuery } from "../../core/features/categoryApi";

export default function Categories() {
  const { data: categories, error, isLoading } = useGetAllCategoriesQuery();

  if (isLoading) return <p className="text-center mt-10">Loading Categories...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error loading categories!</p>;

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="font-bold text-2xl mb-3 sm:mb-0 text-gray-800">📚 Categories</h1>
        <Link to="/category/create">
          <button className="py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200">
            + Add Category
          </button>
        </Link>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {categories?.map((cat) => (
          <Link
            key={cat.id}
            to={`/category-detail/${cat.id}`}
            className="group"
          >
            <div className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-all duration-200 overflow-hidden">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4 text-center">
                <h3 className="text-gray-800 font-semibold text-base group-hover:text-blue-600 transition">
                  {cat.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{cat.slug}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
