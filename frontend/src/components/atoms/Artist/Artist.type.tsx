export type DetailArtist = {
  id: string;
  name: string;
  linkX: string;
  style: string;
  avatar: string;
  xTag: string;
  totalImage: number;
  disabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type DetailMember = {
  id: string;
  name: string;
  description: string;
  avatar: string;
  position: string;
};
