import { Box, Typography } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import axios from 'axios';

const COLORS = ['#9146FF', '#2a2a2a'];

const MonthlyScoreChart = () => {
  const [goal, setGoal] = useState(1); // minimum à 1 pour affichage
  const [earned, setEarned] = useState(0);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://xyloquest-backend.test/api/summary', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const goalVal = res.data.goal_points ?? 0;
        const earnedVal = res.data.earned_points ?? 0;

        setGoal(goalVal > 0 ? goalVal : 1); // empêche le donut vide
        setEarned(earnedVal);
      } catch (error) {
        console.error('Erreur chargement camembert score', error);
      }
    };

    fetchScore();
  }, []);

  const data = [
    { name: 'Gagné', value: Math.min(earned, goal) },
    { name: 'Restant', value: Math.max(goal - earned, 0) },
  ];

  return (
    <Box
      sx={{
        backgroundColor: '#181818',
        borderRadius: 4,
        p: 4,
        mt: 4,
        color: '#fff',
        textAlign: 'center',
        boxShadow: '0 0 20px rgba(145,70,255,0.1)',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Progression du mois
      </Typography>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            paddingAngle={2}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <Typography variant="body2" color="#aaa">
        {earned} / {goal} points
      </Typography>
    </Box>
  );
};

export default MonthlyScoreChart;
