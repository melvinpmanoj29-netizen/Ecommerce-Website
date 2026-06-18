import type { ReactNode } from "react";
import Navbar from "../components/layouts/Navbar";
import { FaFacebook, FaTwitter, FaYoutube, FaInstagram, FaCcVisa, FaCcMastercard, FaLock } from "react-icons/fa";

interface Props {
  children: ReactNode;
}

function MainLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-theme-body transition-colors duration-200">
      <Navbar />

      <main className="flex-1 w-full max-w-[1240px] mx-auto px-4 py-6">
        {children}
      </main>

      <footer className="mt-auto bg-[#172337] text-white border-t border-gray-700">
        {/* Main Footer Links */}
        <div className="max-w-[1240px] mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs text-[#878787]">
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wider uppercase">ABOUT</h3>
            <ul className="space-y-2.5">
              <li><a href="#" className="hover:underline hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:underline hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:underline hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:underline hover:text-white">ME10XLUXE Stories</a></li>
              <li><a href="#" className="hover:underline hover:text-white">Press</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wider uppercase">HELP</h3>
            <ul className="space-y-2.5">
              <li><a href="#" className="hover:underline hover:text-white">Payments</a></li>
              <li><a href="#" className="hover:underline hover:text-white">Shipping</a></li>
              <li><a href="#" className="hover:underline hover:text-white">Cancellation & Returns</a></li>
              <li><a href="#" className="hover:underline hover:text-white">FAQ</a></li>
              <li><a href="#" className="hover:underline hover:text-white">Report Infringement</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wider uppercase">CONSUMER POLICY</h3>
            <ul className="space-y-2.5">
              <li><a href="#" className="hover:underline hover:text-white">Cancellation & Returns</a></li>
              <li><a href="#" className="hover:underline hover:text-white">Terms Of Use</a></li>
              <li><a href="#" className="hover:underline hover:text-white">Security</a></li>
              <li><a href="#" className="hover:underline hover:text-white">Privacy</a></li>
              <li><a href="#" className="hover:underline hover:text-white">Sitemap</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wider uppercase font-outfit">ME10XLUXE</h3>
            <p className="mb-4 leading-relaxed text-[#9e9e9e]">
              Discover premium products, mobiles, laptops, and smart accessories at the best guaranteed prices. Shopping made simple.
            </p>
            <div className="flex gap-4 text-base text-gray-400 mt-2">
              <a href="#" className="hover:text-white transition-colors"><FaFacebook /></a>
              <a href="#" className="hover:text-white transition-colors"><FaTwitter /></a>
              <a href="#" className="hover:text-white transition-colors"><FaYoutube /></a>
              <a href="#" className="hover:text-white transition-colors"><FaInstagram /></a>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="border-t border-gray-700/60 bg-[#121c2c] py-6">
          <div className="max-w-[1240px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#878787]">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <span className="flex items-center gap-1.5"><FaLock className="text-green-500" /> 100% Secure Shopping</span>
              <span className="flex items-center gap-1"><FaCcVisa size={16} /> Visa</span>
              <span className="flex items-center gap-1"><FaCcMastercard size={16} /> Mastercard</span>
            </div>
            
            <p className="text-center md:text-right">
              © 2026 ME10XLUXE.com — All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;