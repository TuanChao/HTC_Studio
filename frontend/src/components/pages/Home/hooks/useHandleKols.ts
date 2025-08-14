import { useCallback, useEffect, useState, useRef } from "react";
import { HomeKOLs } from "../Home.type";
import { useAppDispatch } from "src/app/appHooks";
import { setState } from "src/slices/appSlice";
import { getAllKols } from "src/apis/kols/getKol";
import { Avatar } from "antd";
import Image from "src/assets/images/Avatar.png";

export const useHandleKols = () => {
  const dispatch = useAppDispatch();
  const chunkCount = 3;

const listKol :HomeKOLs[][]= [[{avatar: "", name: "name1", id: 0, link_x: "x.com"}]];



  

  return { listKol };
};
