import { Link } from "react-router-dom";
import { useGetProductsQuery } from "../../core/features/productApi";

export default function Products() {
  const { data: products, error, isLoading } = useGetProductsQuery();

  if (isLoading) return <p>Loading Products....</p>;
  if (error) return <p>Error Occurred !!!</p>;
  return (
    <>
      <div>
        <div className="flex">
          <div className="grow">
            <h1 className="font-bold text-xl mt-3">Products</h1>
          </div>
          <div className="grow text-right pr-5  mt-3">
            <Link to="product/create">
              <button className=" py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition">
                Add Product
              </button>
            </Link>
          </div>
        </div>
        <div className="flex">
          <div className="size-14 grow-2">Filters</div>
          <div className="size-14 grow-8 pr-4">
            <div className="grid grid-cols-6 gap-4 mt-5">
              {products?.map((p) => (
                <Link to={`product-detail/${p.id}`}>
                  <div key={p.id} className="">
                    <img key={p.id} src={p.images[0]} alt={p.title} />
                    <h3 className="mt-2">{p.title}</h3>
                    <h4 className="font-bold mt-1">{`$${p.price}`}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
