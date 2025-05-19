import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

export interface EventItem {
  id: number;
  title: string;
  description?: string;
  date: string;
  status?: string;
  type?: string;
  color?: string;
  completed_at?: string | null;
}

interface RawActivity {
  id: number;
  title: string;
  description?: string;
  start_date: string;
  status?: string;
  completed_at?: string | null;
  activity_type?: {
    name?: string;
    color?: string;
  };
}

export const transformRawActivity = (raw: RawActivity): EventItem => ({
  id: raw.id,
  title: raw.title,
  description: raw.description,
  date: raw.start_date,
  status: raw.status,
  completed_at: raw.completed_at,
  type: raw.activity_type?.name ?? 'Autre',
  color: raw.activity_type?.color ?? '#9146FF',
});

interface ActivityContextType {
  events: EventItem[];
  loading: boolean;
  refetch: () => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider = ({ children }: { children: React.ReactNode }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get<{ data: RawActivity[] }>(
        'http://xyloquest-backend.test/api/activities',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = res.data.data
        .filter((item) => item.start_date)
        .map(transformRawActivity);

      setEvents(data);
    } catch (err) {
      console.error('Erreur chargement activités :', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <ActivityContext.Provider value={{ events, loading, refetch: fetchActivities }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivities = () => {
  const context = useContext(ActivityContext);
  if (!context) throw new Error('useActivities must be used within ActivityProvider');
  return context;
};
