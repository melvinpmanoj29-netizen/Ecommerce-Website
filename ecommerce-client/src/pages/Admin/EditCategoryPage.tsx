import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";
import { getCategoryById, updateCategory } from "../../services/categoryService";
import Button from "../../components/buttons/Button";
import { FaSave, FaArrowLeft } from "react-icons/fa";

function EditCategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    loadCategory();
  }, []);

  const loadCategory = async () => {
    try {
      const category = await getCategoryById(Number(id));
      setName(category.name);
      setImageUrl(category.imageUrl || "");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      await updateCategory(Number(id), {
        name,
        imageUrl
      });

      toast.success("Category Updated Successfully");
      navigate("/admin/categories");
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
            onClick={() => navigate("/admin/categories")}
            className="p-2 bg-theme-card border border-theme text-theme-secondary hover:bg-gray-150 rounded-full transition-colors cursor-pointer"
            aria-label="Back to Categories"
          >
            <FaArrowLeft size={12} />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-theme-primary font-outfit">
              Edit Category details
            </h1>
            <p className="text-xs text-theme-muted mt-0.5">Modify information for category #{id}</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-theme-card border border-theme rounded-md shadow-sm p-6 transition-colors duration-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label htmlFor="editcat-name" className="mb-1 font-semibold text-xs text-theme-secondary uppercase">
                Category Name *
              </label>
              <input
                id="editcat-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category Name"
                className="w-full bg-theme-body"
              />
            </div>

            <div>
              <label htmlFor="editcat-img" className="mb-1 font-semibold text-xs text-theme-secondary uppercase">
                Category Image URL
              </label>
              <input
                id="editcat-img"
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

export default EditCategoryPage;