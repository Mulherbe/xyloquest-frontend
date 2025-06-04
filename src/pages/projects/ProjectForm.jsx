import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/global/Header';

const ProjectForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '' });
  

  const [errors, setErrors] = useState({});
  
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  useEffect(() => {
    if (isEdit) {
      axios.get(`http://xyloquest-backend.test/api/projects/${id}`, { headers }).then(res => {
        setForm({
          name: res.data.data.name,
          description: res.data.data.description,
          goal_points: res.data.data.goal_points || '',
        });
      });
    }
  }, [id]);

  const handleSubmit = () => {
    let newErrors = {};
    if (!form.goal_points) {
      newErrors.goal_points = "The goal points field is required.";
    }
    if (!form.name) {
      newErrors.name = "The name field is required.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const method = isEdit ? axios.put : axios.post;
    const url = isEdit ? `http://xyloquest-backend.test/api/projects/${id}` : 'http://xyloquest-backend.test/api/projects';
    method(url, form, { headers }).then(() => navigate('/projects'));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Header />
      <Typography variant="h5" color="#fff" gutterBottom>
        {isEdit ? 'Modifier le projet' : 'Créer un projet'}
      </Typography>
      <Stack spacing={2} sx={{ maxWidth: 600 }}>
        <TextField
          label="Nom"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          fullWidth
          required
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          label="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          fullWidth
          multiline
        />
        <TextField
          label="Objectif de points"
          type="number"
          value={form.goal_points || ''}
          onChange={e => setForm({ ...form, goal_points: e.target.value })}
          fullWidth
          required
          error={!!errors.goal_points}
          helperText={errors.goal_points}
        />
        <Button
          variant="contained"
          sx={{ backgroundColor: '#9146FF', color: '#fff', width: 'fit-content' }}
          onClick={handleSubmit}
        >
          {isEdit ? 'Mettre à jour' : 'Créer'}
        </Button>
      </Stack>
    </Box>
  );
};

export default ProjectForm;
