const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-6 px-8 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          &copy; {currentYear} SCA App. All rights reserved.
        </div>
        <div className="text-slate-500 dark:text-slate-400 text-sm font-medium flex items-center gap-1">
          Crafted with <span className="text-rose-500 text-lg leading-none">&hearts;</span> by 
          <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold ml-1 transition-colors">
            DevJMR
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
