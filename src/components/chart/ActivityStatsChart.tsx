import { Box, Typography } from '@mui/material';
import { useActivities } from '../../contexts/ActivityContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';

interface MonthData {
  month: string;
  done: number;
  skipped: number;
}

const ActivityStatsChart = () => {
  const { events } = useActivities();

  const statsByMonth: Record<string, { done: number; skipped: number }> = {};

  events.forEach((activity) => {
    if (activity.status === 'pending') return;

    const monthKey = dayjs(activity.date).format('YYYY-MM');
    if (!statsByMonth[monthKey]) {
      statsByMonth[monthKey] = { done: 0, skipped: 0 };
    }

    if (activity.status === 'done') statsByMonth[monthKey].done += 1;
    if (activity.status === 'skipped') statsByMonth[monthKey].skipped += 1;
  });

  const chartData: MonthData[] = Object.entries(statsByMonth)
    .map(([month, counts]) => ({
      month: dayjs(month).format('MMM YYYY'),
      ...counts,
    }))
    .sort((a, b) => dayjs(a.month).isAfter(dayjs(b.month)) ? 1 : -1);

  return (
    <Box mt={6} p={3} borderRadius={2} sx={{ backgroundColor: '#181818', boxShadow: '0 0 20px rgba(145,70,255,0.1)' }}>
      <Typography variant="h6" color="#fff" gutterBottom>
        Évolution des activités terminées et non réalisées
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="month" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip />
          <Legend />
          <Bar dataKey="done" fill="#4caf50" name="✅ Terminé" />
          <Bar dataKey="skipped" fill="#f44336" name="❌ Non réalisé" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ActivityStatsChart;
