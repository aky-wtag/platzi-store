import {
  useCreateProductMutation,
  useGetProductsQuery,
} from "../../core/features/productApi";

export default function Products() {
  const { data: products, error, isLoading } = useGetProductsQuery();
  const [createProduct] = useCreateProductMutation();

  const addNew = async () => {
    await createProduct({
      title: "New Product",
      price: 99,
      description: "A cool product",
      categoryId: 1,
      images: ["https://placehold.co/600x400"],
    });
  };
  if (isLoading) return <p>Loading Products....</p>;
  if (error) return <p>Error Occurred !!!</p>;
  return (
    <>
      <div>
        <h1>Products</h1>
        <button onClick={addNew}>Add Product</button>
        <div className="flex">
          <div className="size-14 grow-2">a</div>
          <div className="size-14 grow-8 pr-4">
            <div className="grid grid-cols-6 gap-4 mt-5">
              {products?.map((p) => (
                <div key={p.id} className="">
                  <img key={p.id} src={p.images[0]} alt={p.title} />
                  <h3 className="mt-2">{p.title}</h3>
                  <h4 className="font-bold mt-1">{`$${p.price}`}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
