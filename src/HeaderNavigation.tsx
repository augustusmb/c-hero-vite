import eTrainingIcon from "./assets/c-hero-etraining-logo-final.png";
import AuthenticationButton from "./AuthenticationButton.tsx";
import NavBarDropdown from "./NavBarDropdown.tsx";
import { Link } from "react-router-dom";

const HeaderNavigation = () => {
  return (
    <div className="grid grid-cols-3 border-b-4 border-red-400 bg-slate-050 shadow-lg">
      <div>
        <Link to="/">
          <img src={eTrainingIcon} className="h-14 sm:h-20" />
        </Link>
      </div>
      <div className="col-span-2 flex flex-wrap items-center justify-between px-1">
        <Link
          to="/"
          className="w-18 rounded-lg border-2 border-slate-600 bg-slate-050 px-2 py-1 text-sm font-bold text-slate-800 hover:bg-slate-200  lg:w-28 lg:text-lg"
        >
          Home
        </Link>
        <NavBarDropdown />
        <AuthenticationButton />
      </div>
    </div>
  );
};

export default HeaderNavigation;
