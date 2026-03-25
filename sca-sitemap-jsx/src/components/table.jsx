const Table = () => {
  const orders = [
    { id: "1024", customer: "Alice Johnson", product: "MacBook Pro 16\"", status: "Completed", amount: "$2,400", date: "Oct 24, 2026" },
    { id: "1025", customer: "Bob Smith", product: "iPhone 15 Pro", status: "Pending", amount: "$999", date: "Oct 23, 2026" },
    { id: "1026", customer: "Charlie Davis", product: "AirPods Max", status: "Cancelled", amount: "$549", date: "Oct 21, 2026" },
    { id: "1027", customer: "Diana Prince", product: "iPad Air", status: "Completed", amount: "$599", date: "Oct 19, 2026" },
    { id: "1028", customer: "Ethan Hunt", product: "Magic Keyboard", status: "Pending", amount: "$299", date: "Oct 18, 2026" },
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Completed':
        return <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 uppercase">Completed</span>;
      case 'Pending':
        return <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-amber-100/80 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 uppercase">Pending</span>;
      case 'Cancelled':
        return <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-rose-100/80 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 uppercase">Cancelled</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 overflow-hidden mt-8 mb-8">
      {/* Header Area */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Recent Orders</h2>
        <button className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
          View All &rarr;
        </button>
      </div>
      
      {/* Table Area */}
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-slate-700">Order ID</th>
              <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-slate-700">Customer</th>
              <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-slate-700">Product</th>
              <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-slate-700">Date</th>
              <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-slate-700">Status</th>
              <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-slate-700 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {orders.map((order) => (
              <tr 
                key={order.id} 
                className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-200 group"
              >
                <td className="px-6 py-4 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  #{order.id}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                      {order.customer.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      {order.customer}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                  {order.product}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-500">
                  {order.date}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(order.status)}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-slate-800 dark:text-white text-right">
                  {order.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
