import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  DeleteOutline as DeleteIcon,
  StarBorder as StarIcon,
  Star as StarFilledIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/global/Header';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://xyloquest-backend.test/api/projects', { headers });
      setProjects(res.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (e, projectId) => {
    e.stopPropagation();
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;

    try {
      await axios.delete(`http://xyloquest-backend.test/api/projects/${projectId}`, { headers });
      await fetchProjects();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#0f0f0f', minHeight: '100vh' }}>
      <Header />

      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4" color="#fff">
          Mes Projets
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: '#9146FF',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#7c2ced',
            },
          }}
          onClick={() => navigate('/projects/create')}
        >
          Nouveau projet
        </Button>
      </Box>

      <Grid container spacing={3}>
        {projects.map(project => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Card
              sx={{
                backgroundColor: '#181818',
                color: '#fff',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 20px rgba(145,70,255,0.2)',
                },
              }}
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {project.name}
                    </Typography>
                    <Typography variant="body2" color="#aaa" sx={{ mb: 2 }}>
                      {project.description || 'Aucune description'}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      sx={{ color: '#9146FF' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/projects/${project.id}/edit`);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{ color: '#f44336' }}
                      onClick={(e) => handleDelete(e, project.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Box mt="auto">
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="#aaa">
                      Objectif: {project.goal_points || 0} pts
                    </Typography>
                    <Chip
                      label={project.is_completed ? 'Terminé' : 'En cours'}
                      size="small"
                      sx={{
                        backgroundColor: project.is_completed ? '#4caf50' : '#ff9800',
                        color: '#fff',
                      }}
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={((project.current_points || 0) / (project.goal_points || 1)) * 100}
                    sx={{
                      backgroundColor: '#2a2a2a',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#9146FF',
                      },
                    }}
                  />
                  <Typography variant="caption" color="#aaa" sx={{ mt: 1, display: 'block' }}>
                    {project.current_points || 0} / {project.goal_points || 0} points
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProjectList;
