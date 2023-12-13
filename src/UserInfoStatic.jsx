import { PropTypes } from "prop-types";
import { labels } from "./messages";

const UserInfoStatic = ({ userInfo: user }) => {
  const infoMissing = (
    <span className="italic text-slate-400">info missing</span>
  );

  return (
    <div className="grid grid-cols-4">
      <div className="flex flex-col items-start">
        {labels.map((label) => (
          <label htmlFor={label} key={label}>
            {label[0].toUpperCase() + label.slice(1)}:
          </label>
        ))}
      </div>
      <div className="flex flex-col items-start col-span-3">
        <p>{user.name || infoMissing}</p>
        <p>{user.email || infoMissing}</p>
        <p>{user.phone || infoMissing}</p>
        <p>{user.title || infoMissing}</p>
        <p>{user.company || infoMissing}</p>
        <p>{user.vessel || infoMissing}</p>
        <p>{user.port || infoMissing}</p>
      </div>
    </div>
  );
};

UserInfoStatic.propTypes = {
  userInfo: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    title: PropTypes.string,
    company: PropTypes.string,
    vessel: PropTypes.string,
    port: PropTypes.string,
    id: PropTypes.number,
    phone: PropTypes.string,
  }),
};

export default UserInfoStatic;
