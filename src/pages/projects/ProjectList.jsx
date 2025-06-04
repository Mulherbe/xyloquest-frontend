import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/global/Header';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get('http://xyloquest-backend.test/api/projects', { headers }).then(res => {
      setProjects(res.data.data);
    });
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Header />
      <Typography variant="h4" color="#fff" gutterBottom>
        Mes Projets
      </Typography>
      <Button
        variant="outlined"
        sx={{ mb: 2, color: '#9146FF', borderColor: '#9146FF' }}
        onClick={() => navigate('/projects/create')}
      >
        Nouveau projet
      </Button>
      <Stack spacing={2}>
        {projects.map(project => (
          <Card
            key={project.id}
            sx={{
              backgroundColor: '#181818',
              color: '#fff',
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#222' },
            }}
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            <CardContent>
              <Typography variant="h6">{project.name}</Typography>
              <Typography variant="body2" color="#aaa">
                {project.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default ProjectList;
