import { Link, useLocation } from "react-router-dom";

function NavBar({ modules, user, onLogout }) {
  const location = useLocation();

  return (
    <aside className="bg-gradient-to-b from-sky-950 to-sky-800 p-6 text-slate-100 md:min-h-screen">
      <h1 className="text-3xl font-semibold tracking-tight">EMRS</h1>
      <p className="mt-2 mb-5 text-sm text-sky-200">
        {user ? `${user.fullName} (${user.role})` : "Hospital Management"}
      </p>
      <nav className="flex flex-col gap-2">
        <Link
          className={`rounded-lg px-3 py-2 transition ${
            location.pathname === "/" ? "bg-white/20" : "hover:bg-white/10"
          }`}
          to="/"
        >
          Dashboard
        </Link>
        {modules.map((module) => (
          <Link
            key={module.key}
            className={`rounded-lg px-3 py-2 transition ${
              location.pathname === `/${module.key}` ? "bg-white/20" : "hover:bg-white/10"
            }`}
            to={`/${module.key}`}
          >
            {module.title}
          </Link>
        ))}
        <button
          type="button"
          className="mt-3 rounded-lg border border-white/30 px-3 py-2 text-left transition hover:bg-white/10"
          onClick={onLogout}
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}

export default NavBar;
