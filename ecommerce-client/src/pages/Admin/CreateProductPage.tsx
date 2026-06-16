import MainLayout from "../../layouts/MainLayout";
import { useState } from "react";
import { createProduct } from "../../services/adminProductService";

import { toast } from "react-hot-toast";

import { useNavigate } from "react-router-dom";
import { uploadImage } from "../../services/uploadService";
import { getCategories } from "../../services/categoryService";
import {useEffect} from "react";

function CreateProductPage() {
    const [name, setName] =
    useState("");

    const [description, setDescription] =
    useState("");

    const [price, setPrice] =
    useState("");

    const [stock, setStock] =
    useState("");

    const [categoryId, setCategoryId] =
    useState("");

    const [imageUrl, setImageUrl] =
    useState("");

    const navigate = useNavigate();
    const [uploading, setUploading] =useState(false);
    const [categories, setCategories] =
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
    const handleImageUpload =
  async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      e.target.files?.[0];

    if (!file)
      return;

    try {

      setUploading(true);

      const url =
        await uploadImage(
          file
        );

      setImageUrl(url);

      toast.success(
        "Image Uploaded"
      );

    }
    catch {

      toast.error(
        "Upload Failed"
      );

    }
    finally {

      setUploading(false);

    }
  };
    const handleSubmit =
  async (
    e: React.FormEvent
  ) => {

    e.preventDefault();
    

    try {

      await createProduct({

        name,

        description,

        price: 
            Number(price.replaceAll(",", "")),

        stock:
          Number(stock),

        imageUrl,

        categoryId:
          Number(categoryId)

      });

      toast.success(
        "Product Created"
      );

      navigate(
        "/admin/products"
      );

    }
    catch {

      toast.error(
        "Failed to create product"
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
          Create Product
        </h1>
      </div>
        <form className="space-y-4  max-w-lg" onSubmit={handleSubmit}>


  <input value={name}  onChange={(e) => setName(e.target.value)} placeholder="Name" className=" w-full p-3 rounded bg-slate-800" />

    <textarea
    value={description}
    onChange={(e) =>
      setDescription(e.target.value)
    }
    placeholder="Description"
    className="w-full p-3 rounded bg-slate-800"
  />

 <input
  value={price}
  onChange={(e) =>
    setPrice(e.target.value)
    }
    placeholder="Price"
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
    setStock(e.target.value)
    }
    placeholder="Stock"
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

 <div>

  <input
    type="file"
    accept="image/*"
    onChange={
      handleImageUpload
    }
    placeholder="Category Id"
    className="
    w-full
    p-3
    rounded
    bg-slate-800
    "
  />
    {
    imageUrl && (

        <img
        src={imageUrl}
        alt="Preview"
        className="
        w-48
        h-48
        object-cover
        rounded
        mt-4
        "
        />

    )
    }
    {
    uploading && (
        <p>
        Uploading...
        </p>
    )
    }

    </div>

    <button
        className="
        bg-blue-600
        px-6
        py-3
        rounded
        "
    >
        Create Product
    </button>

    </form>
    </MainLayout>
  );
}

export default CreateProductPage;