import { useAuth0 } from "@auth0/auth0-react";
import { strings } from "./utils/strings.ts";

type ButtonVariant = "header" | "body";
type AuthButtonProps = {
  variant?: ButtonVariant;
};

const buttonStyles = {
  header:
    "rounded bg-orange-200 p-1 text-lg font-bold text-slate-950 hover:bg-orange-300 lg:p-6 lg:text-2xl",
  body: "rounded bg-orange-200 p-1 text-lg font-bold text-slate-950 hover:bg-orange-300 lg:px-10 lg:py-4 lg:text-2xl w-full",
};

const AuthenticationButton = ({ variant = "body" }: AuthButtonProps) => {
  const { isAuthenticated } = useAuth0();

  return (
    <div>
      {isAuthenticated ? <LogoutButton /> : <LoginButton variant={variant} />}
    </div>
  );
};

const LoginButton = ({ variant = "body" }: AuthButtonProps) => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      className={buttonStyles[variant]}
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
      className="rounded-lg bg-slate-050 p-1 text-lg font-bold text-slate-950 hover:bg-slate-800 hover:text-slate-050 lg:p-6 lg:text-2xl"
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
