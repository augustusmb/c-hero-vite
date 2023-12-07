import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-2 border-b-2 border-orange-700 hover:border-orange-500 rounded"
      onClick={() => loginWithRedirect()}
    >
      Log In
    </button>
  );
};

export default LoginButton;
