import { PropTypes } from "prop-types";
import parsePhoneNumber from "libphonenumber-js";

const UserInfoStatic = ({ userInfo: user }) => {
  const infoMissing = (
    <span className="italic text-slate-400">info missing</span>
  );

  if (Object.keys(user).length === 0) {
    return (
      <p className="text-2xl text-slate-400 italic">Please select a user</p>
    );
  }

  let phoneNumber = null;

  if (Object.keys(user).length)
    phoneNumber = parsePhoneNumber(user.phone, "US");

  return (
    <div className="grid grid-cols-4">
      <div className="flex col-span-2 items-start flex-col">
        <p className="text-3xl text-slate-950">{user.name || infoMissing}</p>
        <p className="text-lg text-slate-600 italic indent-2">
          {user.email || infoMissing}
        </p>
        <p className="text-lg text-slate-600 italic indent-2">
          {phoneNumber?.formatNational() || infoMissing}
        </p>
      </div>
      <div className="flex col-span-2 items-start flex-col">
        <p className="text-2xl text-slate-800">{user.title || infoMissing}</p>
        <p className="text-md text-slate-600 italic indent-2">
          {user.company || infoMissing}
        </p>
        <p className="text-md text-slate-600 italic indent-2">
          {user.vessel || infoMissing}
        </p>
        <p className="text-md text-slate-600 italic indent-2">
          {user.port || infoMissing}
        </p>
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
