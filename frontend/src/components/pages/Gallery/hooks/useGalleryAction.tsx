import { useState } from "react";
import { getListArtistImage } from "src/apis/artists/getArtist";
import { getListGalleryImage } from "src/apis/galleries/getGallery";
import { useAppDispatch } from "src/app/appHooks";
import { DetailArtist } from "src/components/atoms/Artist/Artist.type";
import { setState } from "src/slices/appSlice";
import { ModalPreviewState } from "../Gallery.type";

export const useGalleryAction = () => {
  const dispatch = useAppDispatch();

  const [tab, setTab] = useState<string>("Gallery");
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [modalPreview, setModalPreview] = useState<ModalPreviewState>({
    isShow: false,
    imageList: [],
    detailArtist: {} as DetailArtist,
  });
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleChangeTab = (tab: string) => {
    setTab(tab);
    setPage(1);
    setTotalPage(1);
  };

  const onSelectArtist = (id: string) => {
    dispatch(setState({ loading: true }));
    getListArtistImage({ id })
      .then((res) => {
        setModalPreview(() => {
          setSelectedIndex(0);
          return { isShow: true, imageList: res.pictures, detailArtist: res.artist };
        });
      })
      .finally(() => dispatch(setState({ loading: false })));
  };

  const onSelectGallery = (id: string) => {
    console.log('onSelectGallery called with id:', id);
    dispatch(setState({ loading: true }));
    getListGalleryImage({ id })
      .then((res) => {
        console.log('getListGalleryImage response:', res);
        setModalPreview(() => {
          const index = res.pictures.findIndex((item) => item?.id?.toString() === id);
          setSelectedIndex(index === -1 ? 0 : index ?? 0);
          const newState = { isShow: true, imageList: res.pictures, detailArtist: res.artist };
          console.log('Setting modal state:', newState);
          return newState;
        });
      })
      .catch((error) => {
        console.error('Error in getListGalleryImage:', error);
      })
      .finally(() => dispatch(setState({ loading: false })));
  };

  const onCloseModal = () => {
    setModalPreview((prev) => {
      return { ...prev, isShow: false };
    });
  };

  return {
    tab,
    page,
    totalPage,
    selectedIndex,
    modalPreview,
    onCloseModal,
    onSelectArtist,
    onSelectGallery,
    handleChangeTab,
    handleChangePage: setPage,
    handleChangeTotal: setTotalPage,
  };
};
