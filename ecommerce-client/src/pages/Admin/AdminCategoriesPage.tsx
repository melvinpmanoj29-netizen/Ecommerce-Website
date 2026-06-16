import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { Link } from "react-router-dom";

import { getCategories } from "../../services/categoryService";
import toast from "react-hot-toast";
import { deleteCategory} from "../../services/categoryService";

function AdminCategoriesPage() {

  const [categories,
    setCategories] =
    useState<any[]>([]);

  useEffect(() => {

    loadCategories();

  }, []);

  const loadCategories =
    async () => {

      const data =
        await getCategories();

      setCategories(data);
    };

    const handleDelete =
  async (id: number) => {

    try {

      await deleteCategory(id);

      toast.success(
        "Category Deleted"
      );

      loadCategories();

    }
    catch {

      toast.error(
        "Delete Failed"
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
       <div
        className="
        flex
        justify-between
        items-center
        mb-8
        "
        >
    <h1
        className="
        text-3xl
        font-bold
        "
    >
        Manage Categories
     </h1>

    <Link
        to="/admin/categories/create"
        className="
        bg-blue-600
        px-4
        py-2
        rounded
        "
    >
        Add Category
    </Link>
</div>

        {
          categories.map(
            category => (

            <div
              key={category.id}
              className="
              bg-slate-800
              p-4
              rounded-lg
              mb-4
              flex
              justify-between
              items-center
              "
            >
              <div>
                <h3>
                  {category.name}
                </h3>
              </div>

              <div
                className="
                flex
                gap-3
                "
              >
                <Link
                to={`/admin/categories/edit/${category.id}`}
                className="
                bg-yellow-600
                px-4
                py-2
                rounded
                "
                >
                Edit
                </Link>

                <button
                    onClick={() =>
                        handleDelete(
                        category.id
                        )
                    }
                    className="
                    bg-red-600
                    px-4
                    py-2
                    rounded
                    "
                    >
                    Delete
                </button>

              </div>

            </div>

          ))
        }

      </div>

    </MainLayout>
  );
}

export default AdminCategoriesPage;