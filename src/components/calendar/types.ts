export interface EventItem {
  id: number;
  title: string;
  date: string;
  description?: string;
  type?: string;
  color?: string;
  completed_at?: string | null;
  status?: string;
}
