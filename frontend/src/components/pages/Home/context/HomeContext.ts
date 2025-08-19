import React from "react";
import { HomeKOLs, HomePets } from "../Home.type";

export interface HomeContextProps {
  listKol: HomeKOLs[][];
  scrollPosition: number;
  listPet: HomePets[][];
}

export const HomeContext = React.createContext<HomeContextProps>({} as HomeContextProps);
export const HomeContextProvider = HomeContext.Provider;
