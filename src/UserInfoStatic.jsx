import { PropTypes } from "prop-types";
import parsePhoneNumber from "libphonenumber-js";
import MailIcon from "./assets/icons/icon-mail.svg?react";
import PhoneIcon from "./assets/icons/icon-phone-incoming-call.svg?react";
import FactoryIcon from "./assets/icons/icon-factory.svg?react";
import BuoyIcon from "./assets/icons/icon-buoy.svg?react";
import MapIcon from "./assets/icons/icon-map.svg?react";
import UserIcon from "./assets/icons/icon-user-circle.svg?react";

const UserInfoStatic = ({ userInfo: user }) => {
  const infoMissing = (
    <span className="italic text-slate-400">info missing</span>
  );

  if (Object.keys(user).length === 0) {
    return (
      <div className="mb-4 flex items-center justify-center">
        <UserIcon className="fill-red-050 stroke-red-500 h-8 w-8 stroke-1 lg:h-10 lg:w-10" />
        <span className="ml-2 text-center text-lg italic text-slate-400 lg:ml-4 lg:text-2xl">
          Please select a user to begin editing
        </span>
      </div>
    );
  }

  let phoneNumber = null;

  if (Object.keys(user).length)
    phoneNumber = parsePhoneNumber(user.phone, "US");

  return (
    <div className="grid h-60 grid-cols-1">
      <div className="col-span-1 flex flex-col items-start">
        <span className="text-red-400 text-2xl lg:text-4xl">
          {user.name || infoMissing}
        </span>
        <div className="flex items-center">
          <MailIcon className="h-5 w-5 fill-indigo-050 stroke-indigo-600" />
          <span className="ml-2 text-lg italic text-slate-600 lg:indent-2 lg:text-xl">
            {user.email || infoMissing}
          </span>
        </div>
        <div className="flex items-center">
          <PhoneIcon className="h-5 w-5 fill-indigo-050 stroke-indigo-600" />
          <span className="ml-2 text-lg italic text-slate-600 lg:indent-2 lg:text-xl">
            {phoneNumber?.formatInternational() || infoMissing}
          </span>
        </div>
      </div>
      <div className="col-span-1 mt-2 flex flex-col items-start lg:mt-4">
        <span className="text-red-400 text-xl lg:text-3xl">
          {user.title || infoMissing}
        </span>
        <div className="flex items-center">
          <FactoryIcon className="h-5 w-5 fill-indigo-050 stroke-indigo-600" />

          <span className="ml-2 text-lg italic text-slate-600 lg:indent-2 lg:text-xl">
            {user.company || infoMissing}
          </span>
        </div>
        <div className="flex items-center">
          <BuoyIcon className="h-5 w-5 fill-indigo-050 stroke-indigo-600" />

          <span className="ml-2 text-lg italic text-slate-600 lg:indent-2 lg:text-xl">
            {user.vessel || infoMissing}
          </span>
        </div>
        <div className="flex items-center">
          <MapIcon className="h-5 w-5 fill-indigo-050 stroke-indigo-600" />

          <span className="ml-2 text-lg italic text-slate-600 lg:indent-2 lg:text-xl">
            {user.port || infoMissing}
          </span>
        </div>
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
