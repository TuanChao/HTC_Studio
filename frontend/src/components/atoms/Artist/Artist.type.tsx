export type DetailArtist = {
  id: string;
  name: string;
  link_x: string;
  style: string;
  avatar: string;
  x_tag: string;
  total_image: number;
  disabled?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type DetailMember = {
  id: string;
  name: string;
  description: string;
  avatar: string;
  position: string;
};
