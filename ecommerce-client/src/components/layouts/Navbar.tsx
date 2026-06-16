import { Link } from "react-router-dom";

function Navbar() {

  const token =
    localStorage.getItem("token");

  const user =
    JSON.parse(
      localStorage.getItem("user")
      || "null"
    );

  return (
    <nav
      className="
      sticky
      top-0
      z-50
      bg-slate-900
      border-b
      border-slate-800
      "
    >
      <div
        className="
        container-custom
        flex
        justify-between
        items-center
        py-4
        "
      >
        <div className="flex gap-6 items-center">

          <Link
            to="/"
            className="text-slate-200 hover:text-blue-400 transition"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="text-slate-200 hover:text-blue-400 transition"
          >
            Products
          </Link>

          <Link
            to="/cart"
            className="text-slate-200 hover:text-blue-400 transition"
          >
            Cart
          </Link>

          {
            token && (
              <Link
                to="/orders"
                className="text-slate-200 hover:text-blue-400 transition"
              >
                Orders
              </Link>
            )
          }

          {
            user && (
              <span className="text-slate-300">
                Welcome {user.name}
              </span>
            )
          }

          {
  token ? (
    <button
      onClick={() => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.reload();

          }}
          className="
          text-red-400
          hover:text-red-300
          "
        >
          Logout
    </button>
    ) : (
    <>
      <Link
        to="/login"
        className="
        text-slate-200
        hover:text-blue-400
        "
      >
        Login
      </Link>

      <Link
        to="/register"
        className="
        text-slate-200
        hover:text-blue-400
        "
      >
        Register
      </Link>
    </>
  )
}
          {
            user?.role === "Admin" && (
              <Link
                to="/admin"
                className="
                text-slate-200
                hover:text-blue-400
                "
              >
                Admin
              </Link>
            ) 
          }

        </div>
      </div>
    </nav>
  );
}

export default Navbar;