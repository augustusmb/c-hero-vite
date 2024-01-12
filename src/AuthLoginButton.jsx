import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      className="text-slate-950 w-18 rounded bg-orange-200 px-2 py-2 text-sm font-bold hover:bg-orange-300 lg:w-28 lg:text-lg"
      onClick={() => loginWithRedirect()}
    >
      Log In
    </button>
  );
};

export default LoginButton;
