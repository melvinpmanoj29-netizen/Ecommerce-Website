import {
  useEffect,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import toast
from "react-hot-toast";

import MainLayout
from "../../layouts/MainLayout";

import {
  getCategoryById,
  updateCategory
}
from "../../services/categoryService";

function EditCategoryPage() {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [name,
    setName] =
    useState("");

  const [imageUrl,
    setImageUrl] =
    useState("");

  useEffect(() => {

    loadCategory();

  }, []);

  const loadCategory =
    async () => {

      const category =
        await getCategoryById(
          Number(id)
        );

      setName(
        category.name
      );

      setImageUrl(
        category.imageUrl
      );
    };

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      try {

        await updateCategory(
          Number(id),
          {
            name,
            imageUrl
          }
        );

        toast.success(
          "Category Updated"
        );

        navigate(
          "/admin/categories"
        );

      }
      catch {

        toast.error(
          "Update Failed"
        );
      }
    };

  return (
    <MainLayout>

      <div
        className="
        container-custom
        py-10
        "
      >

        <h1
          className="
          text-3xl
          font-bold
          mb-6
          "
        >
          Edit Category
        </h1>

        <form
          onSubmit={
            handleSubmit
          }
          className="
          max-w-lg
          space-y-4
          "
        >

          <input
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            placeholder="Name"
            className="
            w-full
            p-3
            rounded
            bg-slate-800
            "
          />

          <input
            value={imageUrl}
            onChange={(e) =>
              setImageUrl(
                e.target.value
              )
            }
            placeholder="Image URL"
            className="
            w-full
            p-3
            rounded
            bg-slate-800
            "
          />

          <button
            type="submit"
            className="
            bg-green-600
            px-6
            py-3
            rounded
            "
          >
            Update Category
          </button>

        </form>

      </div>

    </MainLayout>
  );
}

export default EditCategoryPage;