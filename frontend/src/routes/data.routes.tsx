import MainLayout from "src/components/layouts/MainLayout";
import AboutPage from "src/components/pages/About";
import GalleryPage from "src/components/pages/Gallery";
import HomePage from "src/components/pages/Home";
import OrderPage from "src/components/pages/Order";
import routesName from "./enum.routes";
import { IRouterData } from "./type.routes";
<<<<<<< HEAD
import RoadMap from "src/components/pages/RoadMap";
import RoadMapPage from "src/components/pages/RoadMap";
=======
>>>>>>> origin/master

export const routesData: IRouterData[] = [
  {
    path: routesName.ROOT,
    layout: MainLayout,
    component: () => <HomePage />,
  },
  {
    path: routesName.GALLERY,
    layout: MainLayout,
    component: () => <GalleryPage />,
  },
  {
    path: routesName.ABOUT,
    layout: MainLayout,
    component: () => <AboutPage />,
  },
  {
    path: routesName.ORDER,
    layout: MainLayout,
    component: () => <OrderPage />,
  },
<<<<<<< HEAD
  {
    path: routesName.ROADMAP,
    layout: MainLayout,
    component: () => <RoadMapPage />,
  },
=======
>>>>>>> origin/master
];
