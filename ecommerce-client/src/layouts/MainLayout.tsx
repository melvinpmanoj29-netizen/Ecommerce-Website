import type { ReactNode } from "react";
import Navbar from "../components/layouts/Navbar";
interface Props {
  children: ReactNode;
}

function MainLayout({
  children
}: Props) {
  return (
    <>
      <Navbar />

      <main>
        {children}
      </main>

      <footer
        className="
        mt-20
        border-t
        border-slate-800
        py-8
        text-center
        text-slate-400
        "
      >
        <h3
          className="
          text-lg
          font-semibold
          text-white
          mb-2
          "
        >
          ME10XLUXE
        </h3>

        <p>
          Modern Ecommerce Experience
        </p>

        <p
          className="
          mt-2
          text-sm
          "
        >
         © 2026 ME10XLUXE - All rights reserved.
        </p>
      </footer>
    </>
  );
}

export default MainLayout;