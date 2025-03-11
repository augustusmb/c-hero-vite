import parsePhoneNumber from "libphonenumber-js";
import MailIcon from "./assets/icons/icon-mail.svg?react";
import PhoneIcon from "./assets/icons/icon-phone-incoming-call.svg?react";
import FactoryIcon from "./assets/icons/icon-factory.svg?react";
import BuoyIcon from "./assets/icons/icon-buoy.svg?react";
import MapIcon from "./assets/icons/icon-map.svg?react";
import UserIcon from "./assets/icons/icon-user-circle.svg?react";
import { UserType } from "./types/types";
import { strings } from "./utils/strings";

const UserInfoStatic = ({
  userInfoToEdit: userInfo,
}: {
  userInfoToEdit: UserType;
}) => {
  const infoMissing = (
    <span className="italic text-slate-400">{strings["info.missing"]}</span>
  );

  if (userInfo?.first_name?.length === 0) {
    return (
      <div className="mb-4 flex items-center justify-center">
        <UserIcon className="h-8 w-8 fill-red-050 stroke-red-500 stroke-1 lg:h-10 lg:w-10" />
        <span className="ml-2 text-center text-lg italic text-slate-400 lg:ml-4 lg:text-2xl">
          {strings["select.user.editing"]}
        </span>
      </div>
    );
  }

  let phoneNumber = null;

  if (userInfo && Object.keys(userInfo).length)
    phoneNumber = parsePhoneNumber(userInfo.phone, "US");

  return (
    <div className="grid h-60 grid-cols-1">
      <div className="col-span-1 flex flex-col items-start">
        <span className="text-2xl text-red-400 lg:text-4xl">
          {`${userInfo?.first_name} ${userInfo?.last_name}` || infoMissing}
        </span>
        <div className="flex items-center">
          <MailIcon className="h-5 w-5 fill-indigo-050 stroke-indigo-600" />
          <span className="ml-2 text-lg italic text-slate-600 lg:indent-2 lg:text-xl">
            {userInfo?.email || infoMissing}
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
        <span className="text-xl text-red-400 lg:text-3xl">
          {userInfo?.position || infoMissing}
        </span>
        <div className="flex items-center">
          <FactoryIcon className="h-5 w-5 fill-indigo-050 stroke-indigo-600" />

          <span className="ml-2 text-lg italic text-slate-600 lg:indent-2 lg:text-xl">
            {userInfo?.company || infoMissing}
          </span>
        </div>
        <div className="flex items-center">
          <BuoyIcon className="h-5 w-5 fill-indigo-050 stroke-indigo-600" />

          <span className="ml-2 text-lg italic text-slate-600 lg:indent-2 lg:text-xl">
            {userInfo?.vessel || infoMissing}
          </span>
        </div>
        <div className="flex items-center">
          <MapIcon className="h-5 w-5 fill-indigo-050 stroke-indigo-600" />

          <span className="ml-2 text-lg italic text-slate-600 lg:indent-2 lg:text-xl">
            {userInfo?.port || infoMissing}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserInfoStatic;
