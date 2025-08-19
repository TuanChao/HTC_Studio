import { HomePets } from "src/components/pages/Home/Home.type";
import { endpoint } from "src/const/endpoint";
import httpRequest from "src/utilities/services/httpRequest";

export interface PetDto {
  id: string;
  name: string;
  linkX?: string;
  avatar?: string;
  disabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePetDto {
  name: string;
  linkX?: string;
  disabled?: boolean;
}

export interface UpdatePetDto {
  name?: string;
  linkX?: string;
  disabled?: boolean;
}

export interface PaginatedPetResult {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  datas: PetDto[];
}

export function getPets(page: number = 1, per_page: number = 10) {
  return httpRequest.get<PaginatedPetResult>(`${endpoint.pet}?page=${page}&per_page=${per_page}`);
}

export function getPet(id: string) {
  return httpRequest.get<PetDto>(`${endpoint.pet}/${id}`);
}

export function createPet(formData: FormData) {
  return httpRequest.post<PetDto>(endpoint.pet, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function updatePet(id: string, formData: FormData) {
  return httpRequest.put<PetDto>(`${endpoint.pet}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function deletePet(id: string) {
  return httpRequest.delete<{ message: string }>(`${endpoint.pet}/${id}`);
}

export async function getAllPets(): Promise<HomePets[]> {
  try {
    const response = await httpRequest.get<PaginatedPetResult>(`${endpoint.pet}?page=1&per_page=100`);
    console.log('Pet API Response:', response);
    
    if (!response.datas || !Array.isArray(response.datas)) {
      console.error('Invalid Pet data structure:', response);
      return [];
    }
    
    const mappedPets = response.datas
      .filter(pet => !pet.disabled)
      .map(pet => ({
        id: parseInt(pet.id),
        name: pet.name,
        link_x: pet.linkX || '',
        avatar: pet.avatar ? (pet.avatar.startsWith('http') ? pet.avatar : `http://localhost:5001${pet.avatar}`) : '/placeholder-avatar.jpg'
      }));
      
    console.log('Mapped Pets:', mappedPets);
    return mappedPets;
  } catch (error) {
    console.error('Error fetching Pets:', error);
    return [];
  }
}