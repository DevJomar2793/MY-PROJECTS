const UsersIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const SalesIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const OrdersIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>
);

const IssuesIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

const Cards = () => {
  const data = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12.5%",
      isPositive: true,
      icon: UsersIcon,
      color: "from-blue-500 to-indigo-600",
      shadow: "shadow-indigo-500/30",
    },
    {
      title: "Total Revenues",
      value: "$12,345",
      change: "+8.2%",
      isPositive: true,
      icon: SalesIcon,
      color: "from-emerald-400 to-teal-500",
      shadow: "shadow-teal-500/30",
    },
    {
      title: "Pending Orders",
      value: "567",
      change: "-2.4%",
      isPositive: false,
      icon: OrdersIcon,
      color: "from-orange-400 to-amber-500",
      shadow: "shadow-orange-500/30",
    },
    {
      title: "Active Issues",
      value: "23",
      change: "-1.5%",
      isPositive: false,
      icon: IssuesIcon,
      color: "from-rose-400 to-red-500",
      shadow: "shadow-rose-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 mb-8 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((item, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 hover:-translate-y-1 transition-transform duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-slate-500 dark:text-slate-400 text-sm font-semibold tracking-wide uppercase">
              {item.title}
            </h5>
            <div
              className={`w-12 h-12 rounded-xl bg-linear-to-br ${item.color} flex items-center justify-center text-white shadow-lg ${item.shadow}`}
            >
              <item.icon />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-3xl font-bold text-slate-800 dark:text-white">
              {item.value}
            </h3>
            <div
              className={`flex items-center gap-1 text-sm font-medium ${item.isPositive ? "text-emerald-500" : "text-rose-500"}`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {item.isPositive ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                )}
              </svg>
              <span>{item.change}</span>
              <span className="text-slate-400 dark:text-slate-500 font-normal ml-1">
                vs last month
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cards;
