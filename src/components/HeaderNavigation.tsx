import { Link } from "react-router-dom";
import { Home, LifeBuoy } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import AuthenticationButton from "./AuthenticationButton.tsx";
import NavBarDropdown from "./NavBarDropdown.tsx";
import AdminNavDropdown from "./AdminNavDropdown.tsx";
import BoatIcon from "../assets/icons/cruiser.svg?react";

const HeaderNavigation = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-900 bg-slate-800 px-4 py-3 shadow-md lg:px-8 lg:py-4">
      <Link
        to="/"
        aria-label="C-Hero eTraining home"
        className="flex items-center gap-2 text-slate-050 transition-opacity hover:opacity-80"
      >
        <LifeBuoy
          className="h-7 w-7 text-orange-400 lg:h-8 lg:w-8"
          strokeWidth={2}
        />
        <span className="text-lg font-bold tracking-tight lg:text-xl">
          C-Hero eTraining
        </span>
      </Link>
      <BoatIcon
        className="pointer-events-none absolute left-1/2 hidden h-10 w-10 -translate-x-1/2 text-slate-300 md:block lg:h-12 lg:w-12"
        aria-hidden="true"
      />
      <div className="flex items-center gap-3 lg:gap-4">
        {isAuthenticated && (
          <>
            <Link
              to="/"
              aria-label="Home"
              title="Home"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-slate-050 transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 lg:px-4 lg:py-2 lg:text-base"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <AdminNavDropdown />
            <NavBarDropdown />
          </>
        )}
        <div className="flex min-w-[88px] items-center justify-end lg:min-w-[100px]">
          <AuthenticationButton />
        </div>
      </div>
    </header>
  );
};

export default HeaderNavigation;
