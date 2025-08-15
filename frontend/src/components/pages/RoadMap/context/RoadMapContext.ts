import React from "react";

export interface RoadMapContextProps {
  loading: boolean;
  scrollPosition: number;
}

export const RoadMapContext = React.createContext<RoadMapContextProps>({} as RoadMapContextProps);

export const RoadMapContextProvider = RoadMapContext.Provider;