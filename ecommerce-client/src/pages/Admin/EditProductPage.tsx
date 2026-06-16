import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";

import { getProductById } from "../../services/productDetailsService";

import { updateProduct } from "../../services/adminUpdateProductService";
import { getCategories } from "../../services/categoryService";

function EditProductPage() {

  const { id } = useParams();

  const navigate =
    useNavigate();

  const [name, setName] =
    useState("");

  const [description,
    setDescription] =
    useState("");

  const [price,
    setPrice] =
    useState("");

  const [stock,
    setStock] =
    useState("");

  const [imageUrl,
    setImageUrl] =
    useState("");

  const [categoryId,
    setCategoryId] =
    useState("");

  useEffect(() => {

    loadProduct();

  }, []);

  const loadProduct =
    async () => {

      const product =
        await getProductById(
          Number(id)
        );

      setName(product.name);

      setDescription(
        product.description
      );

      setPrice(
        product.price.toString()
      );

      setStock(
        product.stock.toString()
      );

      setImageUrl(
        product.imageUrl
      );

      setCategoryId(
        product.categoryId
          .toString()
      );
    };

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      try {

        await updateProduct(
          Number(id),
          {
            name,
            description,

            price:
              Number(price),

            stock:
              Number(stock),

            imageUrl,

            categoryId:
              Number(categoryId)
          }
        );

        toast.success(
          "Product Updated"
        );

        navigate(
          "/admin/products"
        );

      }
      catch {

        toast.error(
          "Update Failed"
        );
      }
    };
    const [categories, setCategories] =
    useState<any[]>([]);
    const loadCategories =
    async () => {

    const data =
      await getCategories();

    setCategories(data);
    };
    useEffect(() => {

    loadProduct();

    loadCategories();

    }, []);

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
          Edit Product
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

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            placeholder="Description"
            className="
            w-full
            p-3
            rounded
            bg-slate-800
            "
          />

          <input
            value={price}
            onChange={(e) =>
              setPrice(
                e.target.value
              )
            }
            placeholder="Price"
            type="number"
            className="
            w-full
            p-3
            rounded
            bg-slate-800
            "
          />

          <input
            value={stock}
            onChange={(e) =>
              setStock(
                e.target.value
              )
            }
            placeholder="Stock"
            type="number"
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

          <select
                value={categoryId}
                onChange={(e) =>
                    setCategoryId(
                    e.target.value
                    )
                }
                className="
                w-full
                p-3
                rounded
                bg-slate-800
                "
                >
                <option value="">
                    Select Category
                </option>

                {categories.map(category => (

                    <option
                    key={category.id}
                    value={category.id}
                    >
                    {category.name}
                    </option>

                ))}
            </select>

          <button
            type="submit"
            className="
            bg-green-600
            px-6
            py-3
            rounded
            "
          >
            Update Product
          </button>

        </form>

      </div>

    </MainLayout>
  );
}

export default EditProductPage;