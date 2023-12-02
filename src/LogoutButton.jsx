import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

  return (
    <button
      className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-4 border-b-4 border-orange-700 hover:border-orange-500 rounded"
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
