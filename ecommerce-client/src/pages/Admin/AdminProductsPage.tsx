import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getProducts } from "../../services/productService";
import { Link } from "react-router-dom";    
import { deleteProduct } from "../../services/adminDeleteProductService";
import Button from "../../components/buttons/Button";
import toast from "react-hot-toast";
import { FaTrash, FaEdit, FaPlus, FaBoxOpen } from "react-icons/fa";

function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    try {
      await deleteProduct(id);  
      toast.success("Product deleted successfully");
      loadProducts();
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
              Manage Products
            </h1>
            <p className="text-xs text-theme-muted mt-0.5">Maintain your active retail items catalog</p>
          </div>

          <Link to="/admin/products/create">
            <Button variant="primary" className="px-4 py-2 font-semibold">
              <FaPlus size={10} />
              <span>Add Product</span>
            </Button>
          </Link>
        </div>

        {/* Products timeline lists */}
        {loading ? (
          <div className="py-20 flex justify-center bg-theme-card border border-theme rounded-md shadow-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2874F0]"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-theme-card border border-theme rounded-md shadow-sm transition-colors duration-200">
            <FaBoxOpen size={48} className="mx-auto text-theme-muted mb-4" />
            <p className="text-sm text-theme-muted">No products found in the catalog.</p>
          </div>
        ) : (
          <div className="bg-theme-card border border-theme rounded-md shadow-sm divide-y divide-theme/60 transition-colors duration-200">
            {products.map((product) => (
              <div
                key={product.id}
                className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:bg-theme-body/10"
              >
                {/* Details layout */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 h-14 bg-white rounded border border-theme p-1 flex items-center justify-center shrink-0">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm md:text-base font-bold text-theme-primary truncate">
                      {product.name}
                    </h3>
                    <div className="flex gap-4 text-xs text-theme-muted mt-1 font-semibold">
                      <span>Price: ₹{product.price}</span>
                      <span>Stock: {product.stock} items</span>
                    </div>
                  </div>
                </div>

                {/* Actions row */}
                <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end pt-3 sm:pt-0 border-t border-theme/40 sm:border-t-0">
                  <Link to={`/admin/products/edit/${product.id}`}>
                    <Button variant="secondary" className="px-3 py-1.5 flex items-center gap-1">
                      <FaEdit size={10} className="text-yellow-600 dark:text-yellow-400" />
                      <span>Edit</span>
                    </Button>
                  </Link>

                  <Button
                    onClick={() => handleDelete(product.id)}
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

export default AdminProductsPage;