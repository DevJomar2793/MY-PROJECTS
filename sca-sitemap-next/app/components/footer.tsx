import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 mt-auto border-t border-slate-200 bg-slate-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-4 sm:px-6 lg:px-8 text-sm text-slate-500">
        <p>&copy; {currentYear} DevJMR. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a
            href="#"
            className="hover:text-slate-900 transition-colors font-medium"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="hover:text-slate-900 transition-colors font-medium"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="hover:text-slate-900 transition-colors font-medium"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
