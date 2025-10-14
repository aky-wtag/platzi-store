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
            <div className="ps-4 flex flex-col pr-5">
              <label htmlFor="name" className="mt-5">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Search by Name"
                value={filters.title}
                onChange={(e) =>
                  setFilters({ ...filters, title: e.target.value })
                }
                className="border"
              />

              <label className="mt-5">Price Range</label>
              <Slider
                value={[filters.price_min, filters.price_max]}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={200}
              />
              <div className="flex justify-between text-sm">
                <span>${filters.price_min}</span>
                <span>${filters.price_max}</span>
              </div>

              <label htmlFor="category">Categories</label>
              <select
                className="border"
                id="category"
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
                <div key={p.id}>
                  <Link to={`product-detail/${p.id}`}>
                    <div>
                      <img src={p.images[0]} alt={p.title} />
                      <h3 className="mt-2">{p.title.slice(0, 20)}...</h3>
                    </div>
                  </Link>
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-bold mt-1">{`$${p.price}`}</h4>
                    </div>

                    <button onClick={() => dispatch(addToCart(p))} aria-label={`Add ${p.title} to cart`}>
                      <img src={addToCartsvg} alt="" width={"18px"} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center p-5">
              <button
                className=" py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition"
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
    </>
  );
}
