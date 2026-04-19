export const CardSection = ({ title, icon: Icon, children }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5 text-blue-700" />}
        <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};
