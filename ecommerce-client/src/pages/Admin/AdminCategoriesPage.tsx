import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { Link } from "react-router-dom";

import { getCategories } from "../../services/categoryService";
import toast from "react-hot-toast";
import { deleteCategory} from "../../services/categoryService";
import Button from "../../components/buttons/Button";
import { FaTrash, FaEdit, FaPlus, FaTags } from "react-icons/fa";

function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this category?");
    if (!confirmed) return;

    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully");
      loadCategories();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <MainLayout>
      <div className="py-6">
        
        {/* Header row */}
        <div className="flex justify-between items-center mb-6 border-b border-theme pb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-theme-primary font-outfit">
              Manage Categories
            </h1>
            <p className="text-xs text-theme-muted mt-0.5">Maintain category tags for product classification</p>
          </div>

          <Link to="/admin/categories/create">
            <Button variant="primary" className="px-4 py-2 font-semibold">
              <FaPlus size={10} />
              <span>Add Category</span>
            </Button>
          </Link>
        </div>

        {/* Categories timeline lists */}
        {loading ? (
          <div className="py-20 flex justify-center bg-theme-card border border-theme rounded-md shadow-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2874F0]"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20 bg-theme-card border border-theme rounded-md shadow-sm transition-colors duration-200">
            <FaTags size={48} className="mx-auto text-theme-muted mb-4" />
            <p className="text-sm text-theme-muted">No categories found.</p>
          </div>
        ) : (
          <div className="bg-theme-card border border-theme rounded-md shadow-sm divide-y divide-theme/60 transition-colors duration-200">
            {categories.map((category) => (
              <div
                key={category.id}
                className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:bg-theme-body/10"
              >
                <div>
                  <h3 className="text-sm md:text-base font-bold text-theme-primary">
                    {category.name}
                  </h3>
                </div>

                <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end pt-3 sm:pt-0 border-t border-theme/40 sm:border-t-0">
                  <Link to={`/admin/categories/edit/${category.id}`}>
                    <Button variant="secondary" className="px-3 py-1.5 flex items-center gap-1">
                      <FaEdit size={10} className="text-yellow-600 dark:text-yellow-400" />
                      <span>Edit</span>
                    </Button>
                  </Link>

                  <Button
                    onClick={() => handleDelete(category.id)}
                    variant="danger"
                    className="px-3 py-1.5 flex items-center gap-1"
                  >
                    <FaTrash size={10} />
                    <span>Delete</span>
                  </Button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default AdminCategoriesPage;