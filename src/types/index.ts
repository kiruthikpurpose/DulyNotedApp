export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export interface User {
  name: string;
  avatar: string;
  isOnline: boolean;
  timeSpent: number;
}