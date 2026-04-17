import parsePhoneNumber from "libphonenumber-js";
import { Mail, Phone, Building2, Anchor, MapPin, UserCircle2 } from "lucide-react";
import { UserType } from "./types/types";
import { strings } from "./utils/strings";

const UserInfoStatic = ({
  userInfoToEdit: userInfo,
}: {
  userInfoToEdit: UserType;
}) => {
  const infoMissing = (
    <span className="text-slate-400">{strings["info.missing"]}</span>
  );

  if (userInfo?.first_name?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <UserCircle2 className="h-10 w-10 text-slate-400" strokeWidth={1.5} />
        <span className="mt-2 text-base text-slate-500 lg:text-lg">
          {strings["select.user.editing"]}
        </span>
      </div>
    );
  }

  const phoneNumber =
    userInfo && Object.keys(userInfo).length
      ? parsePhoneNumber(userInfo.phone, "US")
      : null;

  const fullName =
    userInfo?.first_name || userInfo?.last_name
      ? `${userInfo?.first_name ?? ""} ${userInfo?.last_name ?? ""}`.trim()
      : null;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-2xl font-bold text-slate-900 lg:text-3xl">
          {fullName ?? infoMissing}
        </h3>
        {userInfo?.position && (
          <span className="mt-1 inline-block rounded-full bg-orange-100 px-3 py-0.5 text-xs font-medium uppercase tracking-wide text-orange-700 lg:text-sm">
            {userInfo.position}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 border-t border-slate-200 pt-4">
        <InfoRow icon={<Mail className="h-4 w-4" />}>
          {userInfo?.email || infoMissing}
        </InfoRow>
        <InfoRow icon={<Phone className="h-4 w-4" />}>
          {phoneNumber?.formatInternational() || infoMissing}
        </InfoRow>
      </div>

      <div className="flex flex-col gap-2 border-t border-slate-200 pt-4">
        <InfoRow icon={<Building2 className="h-4 w-4" />}>
          {userInfo?.company || infoMissing}
        </InfoRow>
        <InfoRow icon={<Anchor className="h-4 w-4" />}>
          {userInfo?.vessel || infoMissing}
        </InfoRow>
        <InfoRow icon={<MapPin className="h-4 w-4" />}>
          {userInfo?.port || infoMissing}
        </InfoRow>
      </div>
    </div>
  );
};

const InfoRow = ({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="flex items-center gap-2 text-sm text-slate-700 lg:text-base">
    <span className="text-slate-500">{icon}</span>
    <span>{children}</span>
  </div>
);

export default UserInfoStatic;
