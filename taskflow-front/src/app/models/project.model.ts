export interface Project {
  id: number;
  name: string;
  description: string;
  color: string;
  tasks_count?: number;
  created_at: string;
}