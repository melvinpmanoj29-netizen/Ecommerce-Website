import { useEffect, useState} from "react";

import MainLayout from "../../layouts/MainLayout";

import { getUsers, deleteUser, updateUserRole} from "../../services/userService";

import toast from "react-hot-toast";

function AdminUsersPage() {

  const [users,
    setUsers] =
    useState<any[]>([]);

  useEffect(() => {

    loadUsers();

  }, []);

  const loadUsers =
    async () => {

      const data =
        await getUsers();

      setUsers(data);
    };

  const handleDelete =
    async (id: number) => {

      const confirmed =
        window.confirm(
          "Delete this user?"
        );

      if (!confirmed) {
        return;
      }

      try {

        await deleteUser(id);

        toast.success(
          "User deleted"
        );

        loadUsers();

      }
      catch {

        toast.error(
          "Delete failed"
        );

      }
    };
    const handleRoleChange =
    async (
        id: number,
        role: string
    ) => {

        try {

        await updateUserRole(
            id,
            role
        );

        toast.success(
            "Role updated"
        );

        loadUsers();

        }
        catch {

        toast.error(
            "Update failed"
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
          mb-8
          "
        >
          Manage Users
        </h1>

        {
          users.map(user => (

            <div
              key={user.id}
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

              <div>

                <h3
                  className="
                  text-xl
                  font-semibold
                  "
                >
                  {user.name}
                </h3>

                <p>
                  {user.email}
                </p>

                <div className="mt-2">

                    <select
                        value={user.role}
                        onChange={(e) =>
                        handleRoleChange(
                            user.id,
                            e.target.value
                        )
                        }
                        className="
                        bg-slate-700
                        p-2
                        rounded
                        "
                        >

                        <option value="User">
                            User
                        </option>

                        <option value="Admin">
                            Admin
                        </option>

                    </select>

                </div>

              </div>

              <button
                onClick={() =>
                  handleDelete(
                    user.id
                  )
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

          ))
        }

      </div>

    </MainLayout>
  );
}

export default AdminUsersPage;