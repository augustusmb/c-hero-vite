import { PropTypes } from "prop-types";
import parsePhoneNumber from "libphonenumber-js";

const UserInfoStatic = ({ userInfo: user }) => {
  const infoMissing = (
    <span className="italic text-slate-400">info missing</span>
  );

  if (Object.keys(user).length === 0) {
    return (
      <p className="h-52 px-12 text-2xl italic text-slate-400">
        Please select a user to begin editing
      </p>
    );
  }

  let phoneNumber = null;

  if (Object.keys(user).length)
    phoneNumber = parsePhoneNumber(user.phone, "US");

  return (
    <div className="grid h-60 grid-cols-1">
      <div className="col-span-1 flex flex-col items-start">
        <p className="text-2xl text-indigo-500 lg:text-4xl">
          {user.name || infoMissing}
        </p>
        <p className="text-lg italic text-slate-600 lg:indent-2 lg:text-xl">
          {user.email || infoMissing}
        </p>
        <p className="text-lg italic text-slate-600 lg:indent-2 lg:text-xl">
          {phoneNumber?.formatInternational() || infoMissing}
        </p>
      </div>
      <div className="col-span-1 mt-2 flex flex-col items-start lg:mt-4">
        <p className="text-xl text-indigo-500 lg:text-3xl">
          {user.title || infoMissing}
        </p>
        <p className="text-lg italic text-slate-600 lg:indent-2 lg:text-xl">
          {user.company || infoMissing}
        </p>
        <p className="text-lg italic text-slate-600 lg:indent-2 lg:text-xl">
          {user.vessel || infoMissing}
        </p>
        <p className="text-lg italic text-slate-600 lg:lg:indent-2 lg:text-xl">
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
