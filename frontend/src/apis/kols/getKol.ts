import { HomeKOLs } from "src/components/pages/Home/Home.type";
import { endpoint } from "src/const/endpoint";
import httpRequest from "src/utilities/services/httpRequest";

export function getAllKols() {
  return httpRequest.get<HomeKOLs[]>(endpoint.kol);
}
