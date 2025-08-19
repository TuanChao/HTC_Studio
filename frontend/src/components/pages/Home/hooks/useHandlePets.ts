import { useCallback, useEffect, useState } from "react";
import { HomePets } from "../Home.type";
import { useAppDispatch } from "src/app/appHooks";
import { setState } from "src/slices/appSlice";
import { getAllPets } from "src/apis/pets/getPet";

export const useHandlePets = () => {
  const dispatch = useAppDispatch();
  const chunkCount = 1;

  const [listPet, setListPet] = useState<HomePets[][]>([]);

  const splitArrayIntoChunks = (array: HomePets[], chunkCount: number) => {
    const result: HomePets[][] = [];
    const chunkSize = Math.ceil(array.length / chunkCount);

    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }

    return result;
  };

  const handleGetListPet = useCallback(() => {
    dispatch(setState({ loading: true }));
    getAllPets()
      .then((res) => {
        setListPet(splitArrayIntoChunks(res, chunkCount));
      })
      .finally(() => dispatch(setState({ loading: false })));
  }, [dispatch]);

  useEffect(() => {
    handleGetListPet();
  }, [handleGetListPet]);

  return { listPet };
};