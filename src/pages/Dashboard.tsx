import {
  Box,
  Container,
  Typography,
  Fade,
  IconButton,
  Button,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useActivities } from '../contexts/ActivityContext';
import logo from '../assets/images/logo.png';
import LogoutIcon from '@mui/icons-material/Logout';
import CalendarView from '../components/calendar/CalendarView';
import { useNavigate } from 'react-router-dom';
import ActivityStatsChart from '../components/chart/ActivityStatsChart';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { events: activities, loading: loadingActivities } = useActivities();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <Box sx={{ backgroundColor: '#0f0f0f', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <img
            src={logo}
            alt="Logo Xyloquest"
            style={{
              maxWidth: '220px',
              filter: 'drop-shadow(0 0 16px #9146FF)',
            }}
          />
          <IconButton onClick={handleLogout} sx={{ color: '#9146FF' }}>
            <LogoutIcon />
          </IconButton>
        </Box>

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
        <ActivityStatsChart />

      </Container>
    </Box>
  );
};

export default Dashboard;
