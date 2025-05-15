import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Fade,
  Divider,
  IconButton,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import logo from '../assets/images/logo.png';
import LogoutIcon from '@mui/icons-material/Logout';
import CalendarView from '../components/calendar/CalendarView';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

interface DashboardData {
  activities: number;
  activityTypes: number;
  schedules: number;
  logs: number;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [activitiesRes, typesRes, schedulesRes, logsRes] = await Promise.all([
        axios.get('http://xyloquest-backend.test/api/activities', { headers }),
        axios.get('http://xyloquest-backend.test/api/activity-types', { headers }),
        axios.get('http://xyloquest-backend.test/api/schedules', { headers }),
        axios.get('http://xyloquest-backend.test/api/logs', { headers }),
      ]);

      setData({
        activities: activitiesRes.data.data.length,
        activityTypes: typesRes.data.data.length,
        schedules: schedulesRes.data.data.length,
        logs: logsRes.data.data.length,
      });
    } catch (err) {
      console.error('Erreur chargement dashboard :', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const chartData = [
    { name: 'Activités', value: data?.activities ?? 0 },
    { name: 'Types', value: data?.activityTypes ?? 0 },
    { name: 'Plannings', value: data?.schedules ?? 0 },
    { name: 'Logs', value: data?.logs ?? 0 },
  ];

  const fakeWeeklyData = [
    { week: 'S1', plannings: 3 },
    { week: 'S2', plannings: 5 },
    { week: 'S3', plannings: 2 },
    { week: 'S4', plannings: 6 },
  ];

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
          
        <Fade in={!loading}>
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
              Bienvenue, {user?.name ?? 'Utilisateur'} 👋
            </Typography>
            <Typography variant="subtitle1" color="#aaa" sx={{ mb: 4 }}>
              Connecté avec : {user?.email}
            </Typography>
          </Box>
        </Fade>
              <CalendarView />

      </Container>
    </Box>
  );
};


export default Dashboard;
