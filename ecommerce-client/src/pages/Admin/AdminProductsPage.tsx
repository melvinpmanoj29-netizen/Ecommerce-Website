import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getProducts } from "../../services/productService";
import { Link } from "react-router-dom";    
import { deleteProduct } from "../../services/adminDeleteProductService";

import toast from "react-hot-toast";

function AdminProductsPage() {

  const [products, setProducts] =
    useState<any[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts =
    async () => {

      const data =
        await getProducts();

      setProducts(data);
    };
    const handleDelete =
  async (id: number) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmed) {
      return;
    }

    try {

      await deleteProduct(id);  
      toast.success(
        "Product deleted"
      );

      loadProducts();

    }
    catch {

      toast.error(
        "Delete failed"
      );

    }
    };

  return (
    <MainLayout>

      <div className="container-custom py-10">

            <div  className="flex justify-between items-center mb-8">
                
                <h1 className="text-3xl font-bold">
                    Manage Products
                </h1>

                <Link
                    to="/admin/products/create"
                    className="
                    bg-blue-600
                    px-4
                    py-2
                    rounded
                    "
                    >
                    Add Product
                </Link>
            </div>
            {
                products.map(product => (

                    <div
                    key={product.id}
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
                    <div className="flex items-center gap-4">

                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="
                        w-16
                        h-16
                        object-cover
                        rounded-lg
                        border
                        border-slate-700
                        "
                      />

                        <div>
                        <h3
                            className="
                            text-xl
                            font-semibold
                            "
                        >
                            {product.name}
                        </h3>

                        <p>
                            ₹{product.price}
                        </p>

                        <p>
                            Stock: {product.stock}
                        </p>
                        </div>

                    </div>

                    <div className="flex gap-3">
                        <Link
                            to={`/admin/products/edit/${product.id}`}
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
                                handleDelete(product.id)
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

export default AdminProductsPage;