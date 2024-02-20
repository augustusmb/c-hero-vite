import { useContext } from "react";
import { LoggedInUserContext } from "../MainPanelLayout.tsx";

export const useLoggedInUserContext = () => {
  const loggedInUserContext = useContext(LoggedInUserContext);

  if (!loggedInUserContext) {
    throw new Error(
      "useLoggedInUserContext has to be used within <CurrentUserContext.Provider>",
    );
  }

  return loggedInUserContext;
};
