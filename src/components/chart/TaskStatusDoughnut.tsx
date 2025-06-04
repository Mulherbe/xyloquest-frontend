import { Box, Typography } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const statusLabels = ['À faire', 'En cours', 'Fait'];
const statusColors = ['#f44336', '#ff9800', '#4caf50'];

// Mapping des id de statut vers l'ordre [À faire, En cours, Fait]
const statusIdMap: Record<number, number> = {
  1: 0, // À faire
  2: 1, // En cours
  3: 2, // Fait
};

interface TaskStatusDoughnutProps {
  projectId?: string | number;
}

const TaskStatusDoughnut = ({ projectId }: TaskStatusDoughnutProps) => {
  const [counts, setCounts] = useState([0, 0, 0]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    axios
      .get(projectId
        ? `http://xyloquest-backend.test/api/projects/${projectId}/tasks`
        : 'http://xyloquest-backend.test/api/tasks', { headers })
      .then((res) => {
        const tasks = res.data.data as { task_status_id?: number }[];
        const newCounts = [0, 0, 0];
        tasks.forEach((t) => {
          const idx = t.task_status_id !== undefined ? statusIdMap[t.task_status_id] : undefined;
          if (idx !== undefined) newCounts[idx]++;
        });
        setCounts(newCounts);
      });
  }, [projectId]);

  const data = {
    labels: statusLabels,
    datasets: [
      {
        data: counts,
        backgroundColor: statusColors,
        borderWidth: 2,
      },
    ],
  };

  return (
    <Box sx={{ width: 260, background: '#181818', borderRadius: 3, p: 2, color: '#fff' }}>
      <Typography variant="subtitle1" align="center" sx={{ mb: 1 }}>
        Avancement des tâches
      </Typography>
      <Doughnut data={data} options={{ plugins: { legend: { labels: { color: '#fff' } } } }} />
    </Box>
  );
};

export default TaskStatusDoughnut;
