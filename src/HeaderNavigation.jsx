import eTrainingIcon from "./assets/ETraining.png";
import AuthenticationButton from "./AuthenticationButton";
import PropTypes from "prop-types";

const HeaderNavigation = ({ toggleSidebar }) => {
  return (
    <div className="border-double border-4 border-sky-500">
      <button onClick={toggleSidebar}>click me</button>
      <img src={eTrainingIcon} />
      <AuthenticationButton />
    </div>
  );
};

HeaderNavigation.propTypes = {
  toggleSidebar: PropTypes.func,
};

export default HeaderNavigation;
