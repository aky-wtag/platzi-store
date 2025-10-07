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
  const [currntIndex, setIndex] = useState(0);
  if (isLoading) return <>Loading Product...</>;
  if (error) return <>Error Occured!!!</>;
  return (
    <>
      <div className="flex">
        <div className="p-5 flex size-14 grow-6">
          <div className="size-14 grow-1">
            <ul>
              {product?.images.map((image, index) => (
                <li
                  key={index}
                  className="my-5"
                  onClick={() => setIndex(index)}
                >
                  <img src={image} />
                </li>
              ))}
            </ul>
          </div>
          <div className="size-14 grow-9 ml-2 mt-5">
            <img src={product?.images[currntIndex]} />
          </div>
        </div>
        <div className="size-14 grow-6">
          <div className="flex">
            <div className="grow">
              <h1 className="text-2xl font-bold pt-5 mt-4">{product?.title}</h1>
            </div>
            <div className="text-right">
              <Link to={`/product-detail/${id}/edit`}>
                <button className="pt-5 mt-4 pr-5">
                  <img src={editIcon} />
                </button>
              </Link>
            </div>
          </div>
          <p className="text-xl font-bold mt-2">${product?.price}</p>
          <h2 className="mt-3 text-xl font-bold">Description</h2>
          <p className="text-justify pr-5">{product?.description}</p>
          <h2 className="text-xl mt-2">Category: {product?.category.name}</h2>
          <p className="mt-10">
            <button
              onClick={() => dispatch(addToCart(product))}
              type="button"
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            >
              Add To Cart
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
