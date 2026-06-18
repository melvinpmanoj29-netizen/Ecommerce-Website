import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";
import { getProductById } from "../../services/productDetailsService";
import { updateProduct } from "../../services/adminUpdateProductService";
import { getCategories } from "../../services/categoryService";
import Button from "../../components/buttons/Button";
import { FaSave, FaArrowLeft } from "react-icons/fa";

function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    loadProduct();
    loadCategories();
  }, []);

  const loadProduct = async () => {
    try {
      const product = await getProductById(Number(id));
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.toString());
      setStock(product.stock.toString());
      setImageUrl(product.imageUrl);
      setCategoryId(product.categoryId.toString());
    } catch (error) {
      console.error(error);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock || !categoryId || !imageUrl) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await updateProduct(Number(id), {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        imageUrl,
        categoryId: Number(categoryId)
      });

      toast.success("Product Updated Successfully");
      navigate("/admin/products");
    } catch {
      toast.error("Update Failed");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-[600px] mx-auto py-6">
        
        {/* Title link row */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/admin/products")}
            className="p-2 bg-theme-card border border-theme text-theme-secondary hover:bg-gray-150 rounded-full transition-colors cursor-pointer"
            aria-label="Back to Products"
          >
            <FaArrowLeft size={12} />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-theme-primary font-outfit">
              Edit Product Details
            </h1>
            <p className="text-xs text-theme-muted mt-0.5">Modify information for product #{id}</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-theme-card border border-theme rounded-md shadow-sm p-6 transition-colors duration-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label htmlFor="edit-name" className="mb-1 font-semibold text-xs text-theme-secondary uppercase">
                Product Title *
              </label>
              <input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product Name"
                className="w-full bg-theme-body"
              />
            </div>

            <div>
              <label htmlFor="edit-desc" className="mb-1 font-semibold text-xs text-theme-secondary uppercase">
                Description
              </label>
              <textarea
                id="edit-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product Description"
                rows={4}
                className="w-full bg-theme-body"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-price" className="mb-1 font-semibold text-xs text-theme-secondary uppercase">
                  Price (INR) *
                </label>
                <input
                  id="edit-price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price"
                  className="w-full bg-theme-body"
                />
              </div>

              <div>
                <label htmlFor="edit-stock" className="mb-1 font-semibold text-xs text-theme-secondary uppercase">
                  Available Stock *
                </label>
                <input
                  id="edit-stock"
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="Stock"
                  className="w-full bg-theme-body"
                />
              </div>
            </div>

            <div>
              <label htmlFor="edit-img" className="mb-1 font-semibold text-xs text-theme-secondary uppercase">
                Image URL *
              </label>
              <input
                id="edit-img"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Image URL"
                className="w-full bg-theme-body"
              />
              {imageUrl && (
                <div className="relative w-24 h-24 bg-white rounded border border-theme p-1 flex items-center justify-center overflow-hidden mt-3">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="edit-category" className="mb-1 font-semibold text-xs text-theme-secondary uppercase">
                Product Category *
              </label>
              <select
                id="edit-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-theme-body"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-theme/60 flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/admin/products")}
                className="px-5 font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="px-5 font-semibold"
              >
                <FaSave size={10} />
                <span>Save Changes</span>
              </Button>
            </div>

          </form>
        </div>
      </div>
    </MainLayout>
  );
}

export default EditProductPage;