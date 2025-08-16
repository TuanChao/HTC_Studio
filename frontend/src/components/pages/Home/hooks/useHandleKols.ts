import { useCallback, useEffect, useState } from "react";
import { HomeKOLs } from "../Home.type";
import { useAppDispatch } from "src/app/appHooks";
import { setState } from "src/slices/appSlice";
import { getAllKols } from "src/apis/kols/getKol";

export const useHandleKols = () => {
  const dispatch = useAppDispatch();
  const chunkCount = 3;

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

  return { listKol };
};
