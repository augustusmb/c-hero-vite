import eTrainingIcon from "./assets/c-hero-etraining-logo-final.png";
import AuthenticationButton from "./AuthenticationButton.tsx";
import NavBarDropdown from "./NavBarDropdown.tsx";
import { Link } from "react-router-dom";

const HeaderNavigation = () => {
  return (
    <div
      className="grid grid-cols-3 border-b-2 border-orange-400 bg-indigo-300"
      style={{ backgroundImage: "linear-gradient(to right, #98AEEB, #4055A8)" }}
    >
      <div>
        <Link to="/">
          <img src={eTrainingIcon} className="h-14 sm:h-20" />
        </Link>
      </div>
      <div className="col-span-2 flex flex-wrap items-center justify-between px-1">
        <Link
          to="/"
          className="w-18 rounded bg-indigo-700 px-3 py-2 text-sm font-bold text-slate-050 hover:bg-indigo-600 lg:w-28 lg:text-lg"
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
