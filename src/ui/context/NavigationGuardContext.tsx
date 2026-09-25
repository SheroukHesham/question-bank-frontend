import { createContext, useContext } from "react";

export interface NavigationGuardContextValue {
  isBlocked: boolean;
  setIsBlocked: (blocked: boolean) => void;
  requestNavigation: (fn: () => void) => void;
  pendingNavigation: (() => void) | null;
  confirmNavigation: () => void;
  cancelNavigation: () => void;
}

export const NavigationGuardContext =
  createContext<NavigationGuardContextValue | null>(null);

export const useNavigationGuard = () => {
  const ctx = useContext(NavigationGuardContext);
  if (!ctx)
    throw new Error(
      "useNavigationGuard must be used within NavigationGuardProvider",
    );
  return ctx;
};
