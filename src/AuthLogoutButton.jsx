import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

  return (
    <button
      className="bg-orange-300 hover:bg-orange-500 hover:text-slate-050 text-slate-950 font-bold py-2 px-2 w-18 text-sm lg:text-lg lg:w-28 rounded"
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
