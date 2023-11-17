import eTrainingIcon from "./assets/c-hero-etraining-logo-final.png";
import AuthenticationButton from "./AuthenticationButton";
import NavBarDropdown from "./NavBarDropdown.jsx";
import { Link } from "react-router-dom";

const HeaderNavigation = () => {
  return (
    <div className="border-double border-4 border-sky-500 grid grid-cols-3">
      <div>
        <Link to="/">
          <img src={eTrainingIcon} className="h-28" />
        </Link>
      </div>
      <div className="grid grid-cols-4 col-span-2 justify-items-center">
        <Link to="/">Home</Link>
        <Link to="/certification">Certification</Link>
        <NavBarDropdown />
        <AuthenticationButton />
      </div>
    </div>
  );
};

export default HeaderNavigation;
