<<<<<<< HEAD
import { useCallback, useEffect, useState } from "react";
=======
import { useCallback, useEffect, useState, useRef } from "react";
>>>>>>> origin/master
import { HomeKOLs } from "../Home.type";
import { useAppDispatch } from "src/app/appHooks";
import { setState } from "src/slices/appSlice";
import { getAllKols } from "src/apis/kols/getKol";
<<<<<<< HEAD
=======
import { Avatar } from "antd";
import Image from "src/assets/images/Avatar.png";
>>>>>>> origin/master

export const useHandleKols = () => {
  const dispatch = useAppDispatch();
  const chunkCount = 3;

<<<<<<< HEAD
  const [listKol, setListKol] = useState<HomeKOLs[][]>([]);

  const splitArrayIntoChunks = (array: HomeKOLs[], chunkCount: number) => {
    const result: HomeKOLs[][] = [];
    const chunkSize = Math.ceil(array.length / chunkCount);

    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }

    return result;
  };

  const handleGetListKol = useCallback(() => {
    dispatch(setState({ loading: true }));
    getAllKols()
      .then((res) => {
        setListKol(splitArrayIntoChunks(res, chunkCount));
      })
      .finally(() => dispatch(setState({ loading: false })));
  }, [dispatch]);

  useEffect(() => {
    handleGetListKol();
  }, [handleGetListKol]);
=======
const listKol :HomeKOLs[][]= [[{avatar: "", name: "name1", id: 0, link_x: "x.com"}]];



  
>>>>>>> origin/master

  return { listKol };
};
