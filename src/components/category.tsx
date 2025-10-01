import { Link, useParams } from "react-router-dom";
import { useGetCategoryByIdQuery } from "../core/features/categoryApi";
import editIcon from "../assets/edit-icon.svg";

export default function Category() {
  const { id } = useParams();
  const {
    data: category,
    error,
    isLoading,
  } = useGetCategoryByIdQuery(+id!, { skip: !id });

  if (isLoading) return <>Loading Category...</>;
  if (error) return <>Error Occured!!!</>;

  return (
    <>
      <div className="flex">
        <div className="p-5 ">
          <img src={category?.image} width={"200px"} />
        </div>
        <div className="flex p-5 size-14 grow-6">
          <div className="grow">
            <h1 className="text-2xl font-bold pt-5 mt-4">{category?.name}</h1>

            <p className="text-justify pr-5">Slug: {category?.slug}</p>
          </div>
          <div className="text-right">
            <Link to={`/category-detail/${id}/edit`}>
              <button className="pt-5 mt-4 pr-5">
                <img src={editIcon} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
