import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      className="bg-orange-200 hover:bg-orange-300 text-white font-bold w-18 lg:w-28 text-sm lg:text-lg py-2 px-2 rounded"
      onClick={() => loginWithRedirect()}
    >
      Log In
    </button>
  );
};

export default LoginButton;
