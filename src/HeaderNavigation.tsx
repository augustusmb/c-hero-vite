import eTrainingIcon from "./assets/c-hero-etraining-logo-final.png";
import AuthenticationButton from "./AuthenticationButton.tsx";
import NavBarDropdown from "./NavBarDropdown.tsx";
import { Link } from "react-router-dom";
import { strings } from "./utils/strings.ts";

const HeaderNavigation = () => {
  return (
    <div className="grid grid-cols-3 border-b-4 border-red-400 bg-slate-050 shadow-lg lg:h-28">
      <div>
        <Link to="/">
          <img src={eTrainingIcon} className="m-1 h-14 lg:m-4 lg:h-20" />
        </Link>
      </div>
      <div className="col-span-2 flex flex-wrap items-center justify-around px-1">
        <Link
          to="/"
          className="rounded-lg bg-slate-050 p-1 text-xl font-bold text-slate-800 hover:bg-slate-200 lg:p-6 lg:text-3xl"
        >
          {strings["common.home"]}
        </Link>
        <NavBarDropdown />
        <AuthenticationButton variant="header" />
      </div>
    </div>
  );
};

export default HeaderNavigation;
