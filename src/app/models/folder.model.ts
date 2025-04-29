export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  userId: string;
  filesCount?: number;
  createdAt: Date;
  updatedAt: Date;
}