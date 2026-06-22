import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getUsers, deleteUser, updateUserRole } from "../../services/userService";
import toast from "react-hot-toast";
import Button from "../../components/buttons/Button";
import { FaTrash, FaUsers, FaUserCog } from "react-icons/fa";
import ConfirmModal from "../../components/common/ConfirmModal";

function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] =
  useState(false);

  const [selectedUserId, setSelectedUserId] =
    useState<number | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

 const openDeleteModal = (userId: number) => {
    setSelectedUserId(userId);
    setShowDeleteModal(true);
    };                     
  
  const confirmDeleteUser = async () => {
    if (!selectedUserId) return;

    try {
      await deleteUser(selectedUserId);

      toast.success("User deleted successfully");

      loadUsers();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        "Failed to delete user"
      );
    } finally {
      setShowDeleteModal(false);
      setSelectedUserId(null);
    } 
  };

  const handleRoleChange = async (id: number, role: string) => {
    try {
      await updateUserRole(id, role);
      toast.success("User role updated");
      loadUsers();
    } catch {
      toast.error("Update failed");
    }
  };

  
  return (
    <MainLayout>
      <div className="py-6">
        
        {/* Header row */}
        <div className="flex justify-between items-center mb-6 border-b border-theme pb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-theme-primary font-outfit">
              Manage Users
            </h1>
            <p className="text-xs text-theme-muted mt-0.5">Edit access privileges and remove accounts</p>
          </div>
        </div>

        {/* Users list */}
        {loading ? (
          <div className="py-20 flex justify-center bg-theme-card border border-theme rounded-md shadow-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2874F0]"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 bg-theme-card border border-theme rounded-md shadow-sm transition-colors duration-200">
            <FaUsers size={48} className="mx-auto text-theme-muted mb-4" />
            <p className="text-sm text-theme-muted">No users registered.</p>
          </div>
        ) : (
          <div className="bg-theme-card border border-theme rounded-md shadow-sm divide-y divide-theme/60 transition-colors duration-200">
            {users.map((user) => (
              <div
                key={user.id}
                className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:bg-theme-body/10"
              >
                
                {/* Details */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm md:text-base font-bold text-theme-primary truncate">
                    {user.name}
                  </h3>
                  <p className="text-xs text-theme-muted font-semibold mt-0.5">{user.email}</p>

                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="text-xs font-bold text-theme-secondary flex items-center gap-1">
                      <FaUserCog /> Privilege level:
                    </span>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="bg-theme-body border border-theme p-1 py-0.5 text-xs font-semibold focus:outline-none rounded shadow-sm"
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                      <option value="DeliveryAgent">Delivery Agent</option>
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end pt-3 sm:pt-0 border-t border-theme/40 sm:border-t-0">
                  <Button
                    onClick={() => openDeleteModal(user.id)}
                    variant="danger"
                    className="px-3 py-1.5 flex items-center gap-1.5"
                  >
                    <FaTrash size={10} />
                    <span>Delete Account</span>
                  </Button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete User Account"
        message="Are you sure you want to permanently delete this user account? This action cannot be undone."
        confirmText="Delete User"
        cancelText="Keep User"
        onConfirm={confirmDeleteUser}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedUserId(null);
        }}
      />
    </MainLayout>
  );
}

export default AdminUsersPage;