import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

function AdminRoute({
  children,
}: Props) {

  const user =
    JSON.parse(
      localStorage.getItem("user")
      || "null"
    );

  if (
    !user ||
    user.role !== "Admin"
  ) {
    return (
      <Navigate to="/" />
    );
  }

  return <>{children}</>;
}

export default AdminRoute;