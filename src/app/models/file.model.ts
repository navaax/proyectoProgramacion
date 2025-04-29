export interface File {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  folderId?: string;
  userId: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}