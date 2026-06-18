import MainLayout from "../../layouts/MainLayout";
import { useState } from "react";
import { createProduct } from "../../services/adminProductService";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { uploadImage } from "../../services/uploadService";
import { getCategories } from "../../services/categoryService";
import { useEffect } from "react";
import Button from "../../components/buttons/Button";
import { FaPlus, FaArrowLeft, FaImage } from "react-icons/fa";

function CreateProductPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadImage(file);
      setImageUrl(url);
      toast.success("Image Uploaded");
    } catch {
      toast.error("Upload Failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock || !categoryId || !imageUrl) {
      toast.error("Please fill in all required fields and upload an image");
      return;
    }

    try {
      await createProduct({
        name,
        description,
        price: Number(price.replaceAll(",", "")),
        stock: Number(stock),
        imageUrl,
        categoryId: Number(categoryId)
      });

      toast.success("Product Created Successfully");
      navigate("/admin/products");
    } catch {
      toast.error("Failed to create product");
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
              Create New Product
            </h1>
            <p className="text-xs text-theme-muted mt-0.5">Add a new item to your online catalog</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-theme-card border border-theme rounded-md shadow-sm p-6 transition-colors duration-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label htmlFor="prod-name" className="mb-1 font-semibold text-xs text-theme-secondary uppercase">
                Product Title *
              </label>
              <input
                id="prod-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Apple iPhone 15 Pro (128GB)"
                className="w-full bg-theme-body"
              />
            </div>

            <div>
              <label htmlFor="prod-desc" className="mb-1 font-semibold text-xs text-theme-secondary uppercase">
                Description
              </label>
              <textarea
                id="prod-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide detailed technical specifications or description..."
                rows={4}
                className="w-full bg-theme-body"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="prod-price" className="mb-1 font-semibold text-xs text-theme-secondary uppercase">
                  Price (INR) *
                </label>
                <input
                  id="prod-price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 79999"
                  className="w-full bg-theme-body"
                />
              </div>

              <div>
                <label htmlFor="prod-stock" className="mb-1 font-semibold text-xs text-theme-secondary uppercase">
                  Initial Stock Count *
                </label>
                <input
                  id="prod-stock"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full bg-theme-body"
                />
              </div>
            </div>

            <div>
              <label htmlFor="prod-category" className="mb-1 font-semibold text-xs text-theme-secondary uppercase">
                Product Category *
              </label>
              <select
                id="prod-category"
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

            <div>
              <label className="mb-1.5 font-semibold text-xs text-theme-secondary uppercase">
                Product Image File *
              </label>
              
              <div className="flex flex-col gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full bg-theme-body text-xs cursor-pointer"
                />
                
                {imageUrl && (
                  <div className="relative w-32 h-32 bg-white rounded border border-theme p-2 flex items-center justify-center overflow-hidden">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                
                {uploading && (
                  <p className="text-xs text-theme-muted flex items-center gap-1.5 font-medium animate-pulse">
                    <FaImage /> Uploading image in background...
                  </p>
                )}
              </div>
            </div>

            {/* CTA buttons */}
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
                disabled={uploading}
              >
                <FaPlus size={10} />
                <span>Create Product</span>
              </Button>
            </div>

          </form>
        </div>
      </div>
    </MainLayout>
  );
}

export default CreateProductPage;