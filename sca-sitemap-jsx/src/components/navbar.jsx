import { useState } from "react";

const Navbar = () => {
  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (name, e) => {
    if (e) e.preventDefault();
    setOpenDropdowns((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: DashboardIcon,
      active: true,
    },
    {
      name: "Pages",
      href: "#",
      icon: OrdersIcon,
      active: false,
      subItems: [
        { name: "Profile", href: "#" },
        { name: "Settings", href: "#" },
        { name: "Pricing", href: "#" },
      ],
    },
    { name: "Settings", href: "/settings", icon: ProductsIcon, active: false },
    { name: "Customers", href: "#", icon: CustomersIcon, active: false },
    { name: "Reports", href: "#", icon: ReportsIcon, active: false },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 shadow-2xl flex flex-col pt-6 pb-4">
      {/* Brand logo/title */}
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <h5 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
          SCA App
        </h5>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto mt-2">
        {menuItems.map((item) => (
          <div key={item.name} className="flex flex-col">
            <a
              href={item.subItems ? "#" : item.href}
              onClick={(e) =>
                item.subItems ? toggleDropdown(item.name, e) : null
              }
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ease-in-out group relative ${
                item.active
                  ? "bg-indigo-600/10 text-indigo-400 cursor-pointer"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 cursor-pointer"
              }`}
            >
              {item.active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
              )}
              <item.icon
                className={`w-5 h-5 transition-transform duration-300 ${item.active ? "text-indigo-400" : "group-hover:scale-110"}`}
              />
              <span className="font-medium tracking-wide text-sm">
                {item.name}
              </span>
              {item.subItems && (
                <svg
                  className={`w-4 h-4 ml-auto transition-transform duration-300 text-slate-400 ${
                    openDropdowns[item.name] ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              )}
            </a>

            {/* Dropdown Items */}
            {item.subItems && (
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openDropdowns[item.name]
                    ? "max-h-48 opacity-100 mt-1"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="flex flex-col space-y-1 pl-12 pr-4 py-2 relative">
                  {/* Optional left styling line for subitems */}
                  <div className="absolute left-[26px] top-2 bottom-2 w-px bg-slate-700/50 hidden sm:block"></div>
                  {item.subItems.map((subItem) => (
                    <a
                      key={subItem.name}
                      href={subItem.href}
                      className="text-sm font-medium text-slate-400 hover:text-slate-200 py-2 transition-colors duration-200"
                    >
                      {subItem.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Basic User Profile Section */}
      <div className="px-4 mt-auto">
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm cursor-pointer hover:bg-slate-800/60 transition-colors">
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              alt="User profile"
              className="w-10 h-10 rounded-full border-2 border-slate-600"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                John Doe
              </p>
              <p className="text-xs text-slate-400 truncate">
                john@example.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

// SVG Icon Components for better organization
const DashboardIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
    />
  </svg>
);

const OrdersIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>
);

const ProductsIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
  </svg>
);

const CustomersIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const ReportsIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

export default Navbar;
