import * as React from "react";
import type { SidebarContextProps } from "../components/ui/sidebar";

export const SidebarContext = React.createContext<SidebarContextProps | null>(
  null,
);
