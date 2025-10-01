import { Link } from "react-router-dom";
import { useGetAllCategoriesQuery } from "../../core/features/categoryApi";

export default function Categories() {
  const { data: categories, error, isLoading } = useGetAllCategoriesQuery();
  if (isLoading) return <>Category Loading...</>;
  if (error) return <>Error!!!</>;
  return (
    <>
      <div>
        <div className="flex">
          <div className="grow">
            <h1 className="font-bold text-xl mt-3">Categories</h1>
          </div>
          <div className="grow text-right pr-5  mt-3">
            <Link to="/category/create">
              <button className=" py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition">
                Add Category
              </button>
            </Link>
          </div>
        </div>
        <div className="flex">
          <div className="size-14 grow-8 p-4">
            <div className="grid grid-cols-5 gap-4 mt-5">
              {categories?.map((p) => (
                <Link to={`/category-detail/${p.id}`}>
                  <div key={p.id} className="">
                    <img key={p.id} src={p.image} alt={p.name} />
                    <h3 className="mt-2">{p.name}</h3>
                    <small className="mt-1">{`${p.slug}`}</small>
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
