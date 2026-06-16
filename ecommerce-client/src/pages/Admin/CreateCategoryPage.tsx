    import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";

import {
  createCategory
}
from "../../services/categoryService";

function CreateCategoryPage() {

  const navigate =
    useNavigate();

  const [name, setName] =
    useState("");

  const [imageUrl,
    setImageUrl] =
    useState("");

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      try {

        await createCategory({
          name,
          imageUrl
        });

        toast.success(
          "Category Created"
        );

        navigate(
          "/admin/categories"
        );

      }
      catch {

        toast.error(
          "Create Failed"
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
          Create Category
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
            placeholder="Category Name"
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
            bg-blue-600
            px-6
            py-3
            rounded
            "
          >
            Create Category
          </button>

        </form>

      </div>

    </MainLayout>
  );
}

export default CreateCategoryPage;