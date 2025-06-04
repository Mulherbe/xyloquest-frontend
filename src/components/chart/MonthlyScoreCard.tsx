import { Box, Typography, CircularProgress } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useEffect, useState } from 'react';
import axios from 'axios';

const MonthlyScoreCard = () => {
  const [goal, setGoal] = useState<number | null>(null);
  const [earned, setEarned] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://xyloquest-backend.test/api/summary', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
          console.log(res)
        
        setGoal(res.data.goal_points ?? 0);
        setEarned(res.data.earned_points ?? 0);
      } catch (error) {
        console.error('Erreur lors du chargement du score mensuel', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Box
      sx={{
        mt: 4,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <EmojiEventsIcon sx={{ fontSize: 40, color: '#FFD700', mr: 2 }} />
      <Box>
        <Typography variant="h6">Objectif du mois</Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          {earned} / {goal} points
        </Typography>
      </Box>
    </Box>
  );
};

export default MonthlyScoreCard;
