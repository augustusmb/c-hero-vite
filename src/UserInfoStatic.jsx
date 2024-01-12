import { PropTypes } from "prop-types";
import parsePhoneNumber from "libphonenumber-js";

const UserInfoStatic = ({ userInfo: user }) => {
  const infoMissing = (
    <span className="italic text-slate-400">info missing</span>
  );

  if (Object.keys(user).length === 0) {
    return (
      <p className="px-12 text-2xl italic text-slate-400">
        Please select a user to begin editing
      </p>
    );
  }

  let phoneNumber = null;

  if (Object.keys(user).length)
    phoneNumber = parsePhoneNumber(user.phone, "US");

  return (
    <div className="grid h-40 grid-cols-2">
      <div className="col-span-1 flex flex-col items-start">
        <p className="text:lg text-slate-950 lg:text-3xl">
          {user.name || infoMissing}
        </p>
        <p className="text-sm italic text-slate-600 lg:indent-2 lg:text-lg">
          {user.email || infoMissing}
        </p>
        <p className="text-sm italic text-slate-600 lg:indent-2 lg:text-lg">
          {phoneNumber?.formatNational() || infoMissing}
        </p>
      </div>
      <div className="col-span-1 flex flex-col items-start">
        <p className="text-md text-slate-800 lg:text-2xl">
          {user.title || infoMissing}
        </p>
        <p className="text-sm italic text-slate-600 lg:indent-2 lg:text-lg">
          {user.company || infoMissing}
        </p>
        <p className="text-sm italic text-slate-600 lg:indent-2 lg:text-lg">
          {user.vessel || infoMissing}
        </p>
        <p className="text-sm italic text-slate-600 lg:lg:indent-2 lg:text-lg">
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
