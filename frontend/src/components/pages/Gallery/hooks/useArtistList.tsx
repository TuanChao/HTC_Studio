import { useEffect, useState } from "react";
import { getListArtist } from "src/apis/artists/getArtist";
import { useAppDispatch } from "src/app/appHooks";
import { DetailArtist } from "src/components/atoms/Artist/Artist.type";
import { setState } from "src/slices/appSlice";

type Props = {
  tab: string;
  page: number;
  totalPage: number;
  isFirstMount: React.MutableRefObject<{
    gallery: boolean;
    artist: boolean;
  }>;
  handleChangePage: React.Dispatch<React.SetStateAction<number>>;
  handleChangeTotal: React.Dispatch<React.SetStateAction<number>>;
};

export const useArtistList = ({ tab, page, totalPage, isFirstMount, handleChangeTotal }: Props) => {
  const dispatch = useAppDispatch();

  const [listArtist, setListArtist] = useState<DetailArtist[]>([]);
  const [totalArtist, setTotalArtist] = useState<number>(0);

  const getListArtistFnc = (currPage: number) => {
    dispatch(setState({ loading: true }));
    getListArtist({ page: currPage })
      .then((res) => {
        setListArtist((prev) => {
          tab === "Artist" && handleChangeTotal(res.total_pages);
          setTotalArtist(res.total_records ?? 0);

          return currPage === 1 ? res.datas : [...prev, ...res.datas];
        });
      })
      .finally(() => dispatch(setState({ loading: false })));
  };

  useEffect(() => {
    if ((tab === "Artist" && page <= totalPage) || isFirstMount.current.artist) {
      getListArtistFnc(page);

      if (isFirstMount.current.artist) isFirstMount.current = { ...isFirstMount.current, artist: false };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, tab]);

  return { listArtist, totalArtist };
};
