import { Link } from "react-router-dom";
import { useGetProductsQuery } from "../../core/features/productApi";
import { useState } from "react";

export default function Products() {
  const [filters, setFilters] = useState({
    title: "",
    price_min: "",
    price_max: "",
    categoryId: "",
    limit: 25,
    offset: 0,
  });
  const { data: products, error, isLoading } = useGetProductsQuery(filters);

  if (isLoading) return <p>Loading Products....</p>;
  if (error) return <p>Error Occurred !!!</p>;
  return (
    <>
      <div>
        <div className="flex">
          <div className="grow">
            <h1 className="font-bold text-xl mt-3 ps-3">Products</h1>
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
          <div className="size-14 grow-2">
            <h2 className="ps-4">Filters</h2>
            <div className="ps-4">
              <input
                type="text"
                placeholder="Search by Name"
                value={filters.title}
                onChange={(e) =>
                  setFilters({ ...filters, title: e.target.value })
                }
                className="my-5 border"
              />

              <input
                type="number"
                placeholder="Min Price"
                value={filters.price_min}
                onChange={(e) =>
                  setFilters({ ...filters, price_min: e.target.value })
                }
                className="my-5 border"
              />

              <input
                type="number"
                placeholder="Max Price"
                value={filters.price_max}
                onChange={(e) =>
                  setFilters({ ...filters, price_max: e.target.value })
                }
                className="my-5 border"
              />

              <input
                type="number"
                placeholder="Category ID"
                value={filters.categoryId}
                onChange={(e) =>
                  setFilters({ ...filters, categoryId: e.target.value })
                }
                className="my-5 border"
              />
            </div>
          </div>
          <div className="size-14 grow-8 pr-4">
            Show Items:
            <select
              value={filters.limit}
              onChange={(e) => {
                setFilters({ ...filters, limit: +e.target.value });
              }}
            >
              <option key={25} value="25">
                25
              </option>
              <option key={50} value="50">
                50
              </option>
              <option key={75} value="75">
                75
              </option>
              <option key={100} value="100">
                100
              </option>
            </select>
            <div
              className="grid grid-cols-6 gap-4 mt-5"
              style={{ height: "76dvh", overflowY: "auto" }}
            >
              {products?.map((p) => (
                <Link key={p.id} to={`product-detail/${p.id}`}>
                  <div className="">
                    <img src={p.images[0]} alt={p.title} />
                    <h3 className="mt-2">{p.title}</h3>
                    <h4 className="font-bold mt-1">{`$${p.price}`}</h4>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center p-5">
              <button
                className=" py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition"
                onClick={()=>setFilters({ ...filters, limit: filters.limit + 25 })}
              >
                Show More
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
