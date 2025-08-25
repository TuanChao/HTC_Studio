import { axiosInstance } from '../../utilities/services/initRequest';

export interface Project {
  id: string;
  projectName: string;
  description: string;
  xLink: string;
  logo: string;
  lat: number;
  lng: number;
  size: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface CreateProjectRequest {
  projectName: string;
  description: string;
  xLink: string;
  logo: string;
  lat: number;
  lng: number;
  size: number;
  isActive: boolean;
}

export interface UpdateProjectRequest extends CreateProjectRequest {}

class ProjectsApi {
  private baseUrl = '/api/projects';

  // Get all projects for admin
  async getAllProjects(): Promise<Project[]> {
    const response = await axiosInstance.get(this.baseUrl);
    return response as unknown as Project[];
  }

  // Get public projects for display
  async getPublicProjects(): Promise<Project[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/public`);
    return response as unknown as Project[];
  }

  // Get project by id
  async getProjectById(id: string): Promise<Project> {
    const response = await axiosInstance.get(`${this.baseUrl}/${id}`);
    return response as unknown as Project;
  }

  // Create new project
  async createProject(formData: FormData): Promise<Project> {
    const response = await axiosInstance.post(this.baseUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response as unknown as Project;
  }

  // Update project
  async updateProject(id: string, formData: FormData): Promise<void> {
    await axiosInstance.put(`${this.baseUrl}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Delete project
  async deleteProject(id: string): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`);
  }

  // Upload logo
  async uploadLogo(file: File): Promise<{ url: string; fileName: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axiosInstance.post('/api/upload/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response as unknown as { url: string; fileName: string };
  }

  // Delete logo
  async deleteLogo(fileName: string): Promise<void> {
    await axiosInstance.delete(`/api/upload/logo/${fileName}`);
  }
}

export const projectsApi = new ProjectsApi();