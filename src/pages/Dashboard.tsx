import {
  Box,
  Container,
  Typography,
  Fade,
  Button,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useActivities } from '../contexts/ActivityContext';
import CalendarView from '../components/calendar/CalendarView';
import { useNavigate } from 'react-router-dom';
import ActivityStatsChart from '../components/chart/ActivityStatsChart';
import MonthlyScoreCard from '../components/chart/MonthlyScoreCard';
import MonthlyScoreChart from '../components/chart/MonthlyScoreChart';
import Header from '../components/global/Header';
const Dashboard = () => {
  const { user } = useAuth();
  const { events: activities, loading: loadingActivities } = useActivities();
  const navigate = useNavigate();


  return (
    <Box sx={{ backgroundColor: '#0f0f0f', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* HEADER */}
       <Header />

        {/* BIENVENUE */}
        <Fade in={!loadingActivities}>
          <Box
            sx={{
              backgroundColor: '#181818',
              borderRadius: 4,
              p: 4,
              mt: 4,
              boxShadow: '0 0 20px rgba(145,70,255,0.1)',
            }}
          >
            <Typography variant="h4" color="#fff" gutterBottom>
              Bienvenue, {user?.name ?? 'Fred'} 👋
            </Typography>
            <Typography variant="body2" color="#aaa">
              Tu as {activities.length} activité{activities.length > 1 ? 's enregistrées' : ' enregistrée'}.
            </Typography>
            <MonthlyScoreCard />

          </Box>
        </Fade>

        {/* CALENDRIER */}
        <Box mt={4}>
          <CalendarView events={activities} loading={loadingActivities} />
        </Box>

        {/* BOUTON GESTION TYPE D'ACTIVITÉ */}
        <Button
          variant="outlined"
          sx={{ mt: 3, color: '#9146FF', borderColor: '#9146FF' }}
          onClick={() => navigate('/activity-types')}
        >
          Gérer les types d'activité
        </Button>
       <Box mt={4} display="flex" gap={2} flexWrap="wrap">
        <ActivityStatsChart />
        <MonthlyScoreChart />
      </Box>


      </Container>
    </Box>
  );
};

export default Dashboard;
