import { useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "../core/features/productApi";

export default function Product() {
  const { id } = useParams();
  if (!id) return <>Error Occured!!!</>;
  const { data: product, error, isLoading } = useGetProductByIdQuery(+id);
  if (isLoading) return <>Loading Product...</>;
  if (error) return <>Error Occured!!!</>;
  return (
    <>
      <div>
        <div>
          <ul>
            {product?.images.map((image) => (
              <img src={image} />
            ))}
          </ul>
        </div>
        <div></div>
      </div>
      <div></div>
    </>
  );
}
