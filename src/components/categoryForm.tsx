import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateCategoryMutation,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} from "../core/features/categoryApi";
import { useEffect, useState } from "react";

export default function CategoryForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    data: existingCategory,
    error,
    isLoading,
  } = useGetCategoryByIdQuery(+id!, { skip: !id });

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    image: "",
  });

  useEffect(() => {
    if (existingCategory) {
      setCategoryForm({
        name: existingCategory.name || "",
        slug: existingCategory.slug || "",
        image: existingCategory.image || "",
      });
    }
  }, [existingCategory]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setCategoryForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (id) {
        await updateCategory({
          id: +id,
          data: { ...categoryForm },
        })
          .unwrap()
          .then(() => {
            navigate(`/category-detail/${id}`);
          });
      } else {
        await createCategory({
          ...categoryForm,
        })
          .unwrap()
          .then(() => navigate("/categories"));
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <>Loading Categories...</>;
  if (error) return <>Error !!!</>;
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800">
          {id ? "Update Product" : "Create Product"}
        </h2>

        {/* Title */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={categoryForm.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
            Slug
          </label>
          <input
            id="slug"
            type="text"
            name="slug"
            value={categoryForm.slug}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image
          </label>
          <div className="space-y-2">
            <input
              type="text"
              name="image"
              value={categoryForm.image}
              onChange={handleChange}
              placeholder="Image URL"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition"
        >
          {id ? "Update" : "Create"}
        </button>
      </form>
    </>
  );
}
