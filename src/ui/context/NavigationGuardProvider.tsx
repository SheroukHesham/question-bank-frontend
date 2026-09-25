import { useState, useCallback } from "react";
import { NavigationGuardContext } from "./NavigationGuardContext";

export function NavigationGuardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isBlocked, setIsBlocked] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<
    (() => void) | null
  >(null);

  const requestNavigation = useCallback(
    (fn: () => void) => {
      if (isBlocked) {
        setPendingNavigation(() => fn);
      } else {
        fn();
      }
    },
    [isBlocked],
  );

  const confirmNavigation = useCallback(() => {
    pendingNavigation?.();
    setPendingNavigation(null);
    setIsBlocked(false);
  }, [pendingNavigation]);

  const cancelNavigation = useCallback(() => {
    setPendingNavigation(null);
  }, []);

  return (
    <NavigationGuardContext.Provider
      value={{
        isBlocked,
        setIsBlocked,
        requestNavigation,
        pendingNavigation,
        confirmNavigation,
        cancelNavigation,
      }}
    >
      {children}
    </NavigationGuardContext.Provider>
  );
}
