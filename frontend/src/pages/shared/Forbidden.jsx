function Forbidden() {
  return (
    <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Access denied</h2>
      <p className="mt-1 text-slate-600">Your role does not have permission to open this module.</p>
    </section>
  );
}

export default Forbidden;

