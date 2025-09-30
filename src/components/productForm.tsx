import { useEffect, useState } from "react";
import {
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
} from "../core/features/productApi";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    data: existingProduct,
    error,
    isLoading,
  } = useGetProductByIdQuery(+id!, { skip: !id });
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const [productForm, setProductForm] = useState({
    title: "",
    slug: "",
    price: 0,
    description: "",
    categoryId: 0,
    images: [""],
  });

  useEffect(() => {
    if (existingProduct) {
      setProductForm({
        title: existingProduct.title || "",
        slug: existingProduct.slug || "",
        price: existingProduct.price || -1,
        description: existingProduct.description || "",
        categoryId: existingProduct.category.id || -1,
        images: existingProduct.images || [""],
      });
    }
  }, [existingProduct]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleImageChange = (index: number, value: string) => {
    const newImages = [...productForm.images];
    newImages[index] = value;
    setProductForm((prev) => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setProductForm((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateProduct({
          id: +id,
          data: { ...productForm },
        })
          .unwrap()
          .then(() => {
            console.log(1)
            navigate(`/product-detail/${id}`);
          });
      } else {
        await createProduct({...productForm}).unwrap();
      }
    } catch (err) {
      console.error("Save failed:", err);
    }
  };
  if (isLoading) return <p>Loading product...</p>;
  if (error) return <p>Error Occured!!!</p>;

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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={productForm.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug
          </label>
          <input
            type="text"
            name="slug"
            value={productForm.slug}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={productForm.price}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={productForm.description}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
            type="number"
            name="categoryId"
            value={productForm.categoryId}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Images
          </label>
          <div className="space-y-2">
            {productForm.images.map((img, i) => (
              <input
                key={i}
                type="text"
                value={img}
                onChange={(e) => handleImageChange(i, e.target.value)}
                placeholder="Image URL"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
          <button
            type="button"
            onClick={addImageField}
            className="mt-2 inline-block px-3 py-1.5 text-sm bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition"
          >
            + Add Image
          </button>
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
