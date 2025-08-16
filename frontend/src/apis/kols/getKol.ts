import { HomeKOLs } from "src/components/pages/Home/Home.type";
import { endpoint } from "src/const/endpoint";
import httpRequest from "src/utilities/services/httpRequest";

interface PaginatedKolResult {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  datas: {
    id: string;
    name: string;
    linkX?: string;
    avatar?: string;
    disabled: boolean;
    createdAt: string;
    updatedAt: string;
  }[];
}

export async function getAllKols(): Promise<HomeKOLs[]> {
  try {
    const response = await httpRequest.get<PaginatedKolResult>(`${endpoint.kol}?page=1&per_page=100`);
    console.log('KOL API Response:', response);
    
    if (!response.datas || !Array.isArray(response.datas)) {
      console.error('Invalid KOL data structure:', response);
      return [];
    }
    
    const mappedKols = response.datas
      .filter(kol => !kol.disabled)
      .map(kol => ({
        id: parseInt(kol.id),
        name: kol.name,
        link_x: kol.linkX || '',
        avatar: kol.avatar ? (kol.avatar.startsWith('http') ? kol.avatar : `http://localhost:5000${kol.avatar}`) : '/placeholder-avatar.jpg'
      }));
      
    console.log('Mapped KOLs:', mappedKols);
    return mappedKols;
  } catch (error) {
    console.error('Error fetching KOLs:', error);
    return [];
  }
}
