import MainLayout from "src/components/layouts/MainLayout";
import AdminLayout from "src/components/layouts/AdminLayout";
import ProtectedRoute from "src/components/layouts/ProtectedRoute";
import AboutPage from "src/components/pages/About";
import GalleryPage from "src/components/pages/Gallery";
import HomePage from "src/components/pages/Home";
import OrderPage from "src/components/pages/Order";
import RoadMapPage from "src/components/pages/RoadMap";
import AdminLogin from "src/components/pages/Admin/AdminLogin";
import AdminDashboard from "src/components/pages/Admin/AdminDashboard";
import AdminArtists from "src/components/pages/Admin/AdminArtists";
import AdminGalleries from "src/components/pages/Admin/AdminGalleries";
import AdminKols from "src/components/pages/Admin/AdminKols";
import AdminPets from "src/components/pages/Admin/AdminPets";
import AdminTeams from "src/components/pages/Admin/AdminTeams";
import AdminEarthMap from "src/components/pages/Admin/AdminEarthMap";
import routesName from "./enum.routes";
import { IRouterData } from "./type.routes";

export const routesData: IRouterData[] = [
  // Public routes
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
  {
    path: routesName.ROADMAP,
    layout: MainLayout,
    component: () => <RoadMapPage />,
  },

  // Admin routes
  {
    path: routesName.ADMIN_LOGIN,
    component: () => <AdminLogin />,
  },
  {
    path: routesName.ADMIN_DASHBOARD,
    layout: AdminLayout,
    component: () => (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: routesName.ADMIN_ARTISTS,
    layout: AdminLayout,
    component: () => (
      <ProtectedRoute>
        <AdminArtists />
      </ProtectedRoute>
    ),
  },
  {
    path: routesName.ADMIN_GALLERIES,
    layout: AdminLayout,
    component: () => (
      <ProtectedRoute>
        <AdminGalleries />
      </ProtectedRoute>
    ),
  },
  {
    path: routesName.ADMIN_KOLS,
    layout: AdminLayout,
    component: () => (
      <ProtectedRoute>
        <AdminKols />
      </ProtectedRoute>
    ),
  },
  {
    path: routesName.ADMIN_PETS,
    layout: AdminLayout,
    component: () => (
      <ProtectedRoute>
        <AdminPets />
      </ProtectedRoute>
    ),
  },
  {
    path: routesName.ADMIN_TEAMS,
    layout: AdminLayout,
    component: () => (
      <ProtectedRoute>
        <AdminTeams />
      </ProtectedRoute>
    ),
  },
  {
    path: routesName.ADMIN_EARTH_MAP,
    layout: AdminLayout,
    component: () => (
      <ProtectedRoute>
        <AdminEarthMap />
      </ProtectedRoute>
    ),
  },
];
