import { useAuth0 } from "@auth0/auth0-react";
import { strings } from "./utils/strings.ts";

const AuthenticationButton = () => {
  const { isAuthenticated } = useAuth0();

  return <div>{isAuthenticated ? <LogoutButton /> : <LoginButton />}</div>;
};

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      className="rounded bg-orange-200 p-6 text-sm font-bold text-slate-950 hover:bg-orange-300 lg:text-2xl"
      onClick={() => loginWithRedirect()}
    >
      {strings["common.login"]}
    </button>
  );
};

const LogoutButton = () => {
  const { logout } = useAuth0();

  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

  return (
    <button
      className="rounded-lg bg-slate-050 p-6 text-sm font-bold text-slate-950 hover:bg-slate-200 hover:text-slate-050 lg:text-2xl"
      onClick={() =>
        logout({
          clientId: clientId,
          logoutParams: { returnTo: window.location.origin },
        })
      }
    >
      {strings["common.logout"]}
    </button>
  );
};

export default AuthenticationButton;
