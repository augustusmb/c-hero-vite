import eTrainingIcon from "./assets/c-hero-etraining-logo-final.png";
import AuthenticationButton from "./AuthenticationButton";
import NavBarDropdown from "./NavBarDropdown.jsx";
import { Link } from "react-router-dom";

const HeaderNavigation = () => {
  return (
    <div className="border-solid border-2 border-slate-300 grid grid-cols-3 bg-slate-300">
      <div>
        <Link to="/">
          <img src={eTrainingIcon} className="h-14 sm:h-20" />
        </Link>
      </div>
      <div className="flex flex-wrap justify-between col-span-2 items-center">
        <Link
          to="/"
          className="bg-slate-500 hover:bg-slate-400 text-white font-bold py-2 px-2 border-b-2 border-slate-700 hover:border-slate-500 rounded"
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
