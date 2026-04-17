import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useAuth0 } from "@auth0/auth0-react";
import { LogOut } from "lucide-react";
import { useLoggedInUserContext } from "./hooks/useLoggedInUserContext.ts";
import { strings } from "./utils/strings.ts";

const AuthenticationButton = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <AuthSlotSkeleton />;
  if (!isAuthenticated) return <LoginButton />;
  return <UserMenu />;
};

const AuthSlotSkeleton = () => (
  <div className="h-10 w-10 animate-pulse rounded-full bg-slate-700 lg:h-11 lg:w-11" />
);

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      className="inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-slate-050 shadow-sm transition-colors hover:bg-orange-600 lg:text-base"
      onClick={() => loginWithRedirect()}
    >
      {strings["common.login"]}
    </button>
  );
};

const UserMenu = () => {
  const { logout } = useAuth0();
  const { loggedInUserInfo } = useLoggedInUserContext();

  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

  const initials =
    loggedInUserInfo?.first_name && loggedInUserInfo?.last_name
      ? `${loggedInUserInfo.first_name[0]}${loggedInUserInfo.last_name[0]}`.toUpperCase()
      : "•";

  const displayName =
    loggedInUserInfo?.first_name && loggedInUserInfo?.last_name
      ? `${loggedInUserInfo.first_name} ${loggedInUserInfo.last_name}`
      : "Signed in";

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button
        className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold text-slate-050 shadow-sm ring-transparent transition-all hover:bg-indigo-400 hover:ring-2 hover:ring-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 lg:h-11 lg:w-11 lg:text-base"
        aria-label="User menu"
      >
        {initials}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-slate-050 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="border-b border-slate-200 px-4 py-3">
            <p className="truncate text-sm font-semibold text-slate-800">
              {displayName}
            </p>
            {loggedInUserInfo?.email && (
              <p className="truncate text-xs text-slate-500">
                {loggedInUserInfo.email}
              </p>
            )}
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() =>
                    logout({
                      clientId,
                      logoutParams: { returnTo: window.location.origin },
                    })
                  }
                  className={`flex w-full items-center gap-2 px-4 py-2 text-sm ${
                    active ? "bg-slate-100 text-slate-900" : "text-slate-700"
                  }`}
                >
                  <LogOut className="h-4 w-4" />
                  {strings["common.logout"]}
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default AuthenticationButton;
