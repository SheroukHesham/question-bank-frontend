import { createContext, useContext, type RefObject } from "react";

interface ModalContextValue {
  dialogContentRef: RefObject<HTMLDivElement | null>;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({
  children,
  dialogContentRef,
}: {
  children: React.ReactNode;
  dialogContentRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <ModalContext.Provider value={{ dialogContentRef }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModalContext() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModalContext must be used inside a Modal");
  }

  return context;
}
