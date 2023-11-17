import eTrainingIcon from "./assets/ETraining.png";
import AuthenticationButton from "./AuthenticationButton";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const HeaderNavigation = ({ toggleSidebar }) => {
  return (
    <div className="border-double border-4 border-sky-500">
      <button onClick={toggleSidebar}>click me</button>
      <Link to="/">
        <img src={eTrainingIcon} />
      </Link>
      <AuthenticationButton />
    </div>
  );
};

HeaderNavigation.propTypes = {
  toggleSidebar: PropTypes.func,
};

export default HeaderNavigation;
