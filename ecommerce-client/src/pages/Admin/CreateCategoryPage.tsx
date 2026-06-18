import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";
import { createCategory } from "../../services/categoryService";
import Button from "../../components/buttons/Button";
import { FaPlus, FaArrowLeft } from "react-icons/fa";

function CreateCategoryPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      await createCategory({
        name,
        imageUrl
      });

      toast.success("Category Created Successfully");
      navigate("/admin/categories");
    } catch {
      toast.error("Create Failed");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-[600px] mx-auto py-6">
        
        {/* Title link row */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/admin/categories")}
            className="p-2 bg-theme-card border border-theme text-theme-secondary hover:bg-gray-150 rounded-full transition-colors cursor-pointer"
            aria-label="Back to Categories"
          >
            <FaArrowLeft size={12} />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-theme-primary font-outfit">
              Create New Category
            </h1>
            <p className="text-xs text-theme-muted mt-0.5">Add a new category classification to products</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-theme-card border border-theme rounded-md shadow-sm p-6 transition-colors duration-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label htmlFor="cat-name" className="mb-1 font-semibold text-xs text-theme-secondary uppercase">
                Category Name *
              </label>
              <input
                id="cat-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Smart Watches"
                className="w-full bg-theme-body"
              />
            </div>

            <div>
              <label htmlFor="cat-img" className="mb-1 font-semibold text-xs text-theme-secondary uppercase">
                Category Image URL
              </label>
              <input
                id="cat-img"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Image URL"
                className="w-full bg-theme-body"
              />
              {imageUrl && (
                <div className="relative w-20 h-20 bg-white rounded border border-theme p-1 flex items-center justify-center overflow-hidden mt-3">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-theme/60 flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/admin/categories")}
                className="px-5 font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="px-5 font-semibold"
              >
                <FaPlus size={10} />
                <span>Create Category</span>
              </Button>
            </div>

          </form>
        </div>
      </div>
    </MainLayout>
  );
}

export default CreateCategoryPage;