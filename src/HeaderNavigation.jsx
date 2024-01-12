import eTrainingIcon from "./assets/c-hero-etraining-logo-final.png";
import AuthenticationButton from "./AuthenticationButton";
import NavBarDropdown from "./NavBarDropdown.jsx";
import { Link } from "react-router-dom";

const HeaderNavigation = () => {
  return (
    <div className="border-b-2 border-orange-400 grid grid-cols-3 bg-indigo-300">
      <div>
        <Link to="/">
          <img src={eTrainingIcon} className="h-14 sm:h-20" />
        </Link>
      </div>
      <div className="flex flex-wrap justify-between col-span-2 items-center">
        <Link
          to="/"
          className="bg-indigo-700 hover:bg-indigo-600 text-slate-050 font-bold w-28 py-2 px-3 rounded"
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
