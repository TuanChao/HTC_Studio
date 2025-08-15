import React from "react";
import { HomeKOLs } from "../Home.type";

export interface HomeContextProps {
  listKol: HomeKOLs[][];
  scrollPosition: number;
}

export const HomeContext = React.createContext<HomeContextProps>({} as HomeContextProps);
export const HomeContextProvider = HomeContext.Provider;
