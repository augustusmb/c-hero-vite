import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

  return (
    <button
      className="text-slate-950 w-18 rounded bg-orange-200 px-2 py-2 text-sm font-bold hover:bg-orange-300 hover:text-slate-050 lg:w-28 lg:text-lg"
      onClick={() =>
        logout({
          clientId: clientId,
          logoutParams: { returnTo: window.location.origin },
        })
      }
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
