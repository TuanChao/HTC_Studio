import { endpoint } from 'src/const/endpoint';
import httpRequest from 'src/utilities/services/httpRequest';

export interface TeamDto {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  position: string;
  linkX?: string;
  disabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamDto {
  name: string;
  description?: string;
  position: string;
  linkX?: string;
  disabled?: boolean;
}

export interface UpdateTeamDto {
  name?: string;
  description?: string;
  position?: string;
  linkX?: string;
  disabled?: boolean;
}

export interface PaginatedTeamResult {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  datas: TeamDto[];
}

export function getTeams(page: number = 1, per_page: number = 10) {
  return httpRequest.get<PaginatedTeamResult>(`${endpoint.team}?page=${page}&per_page=${per_page}`);
}

export function getActiveTeams() {
  return httpRequest.get<TeamDto[]>(`${endpoint.team}/active`).catch(error => {
    console.error('API Error in getActiveTeams:', error);
    throw error;
  });
}

export function getTeam(id: string) {
  return httpRequest.get<TeamDto>(`${endpoint.team}/${id}`);
}

export function createTeam(formData: FormData) {
  return httpRequest.post<TeamDto>(endpoint.team, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function updateTeam(id: string, formData: FormData) {
  return httpRequest.put<TeamDto>(`${endpoint.team}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function deleteTeam(id: string) {
  return httpRequest.delete<{ message: string }>(`${endpoint.team}/${id}`);
}