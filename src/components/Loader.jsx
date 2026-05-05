const Loader = ({ label = "Loading" }) => (
  <div className="flex min-h-[240px] items-center justify-center">
    <div className="rounded-md border border-black/10 bg-white px-5 py-4 text-sm font-semibold shadow-sm">{label}...</div>
  </div>
);

export default Loader;
