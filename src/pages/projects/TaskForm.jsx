import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TaskForm = () => {
  const { id, taskId } = useParams();
  const isEdit = Boolean(taskId);
  const navigate = useNavigate();
  const [statuses, setStatuses] = useState([]);
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    task_status_id: '', 
    due_date: '',
    points: 0,
  });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get('http://xyloquest-backend.test/api/task-status', { headers }).then(res => setStatuses(res.data.data));
    if (isEdit) {
      axios.get(`http://xyloquest-backend.test/api/tasks/${taskId}`, { headers }).then(res => {
        const t = res.data.data;
        setForm({
          title: t.title,
          description: t.description,
          task_status_id: t.task_status_id,
          due_date: t.due_date?.substring(0, 10) ?? '',
          points: t.points || 0,
        });
      });
    }
  }, [taskId]);

  const handleSubmit = () => {
    const method = isEdit ? axios.put : axios.post;
    const url = isEdit ? `http://xyloquest-backend.test/api/tasks/${taskId}` : 'http://xyloquest-backend.test/api/tasks';
    const payload = { ...form, project_id: id };
    method(url, payload, { headers }).then(() => navigate(`/projects/${id}`));
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#0f0f0f', minHeight: '100vh' }}>
      <Box sx={{ backgroundColor: '#181818', p: 3, borderRadius: 2, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h5" color="#fff" gutterBottom mb={3}>
          {isEdit ? 'Modifier la tâche' : 'Créer une tâche'}
        </Typography>
        <TextField
          label="Titre"
          fullWidth
          sx={{ 
            mb: 2,
            input: { color: '#fff' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#333' },
              '&:hover fieldset': { borderColor: '#9146FF' },
              '&.Mui-focused fieldset': { borderColor: '#9146FF' },
            },
            '& .MuiInputLabel-root': { color: '#aaa' },
          }}
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={3}
          sx={{ 
            mb: 2,
            textarea: { color: '#fff' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#333' },
              '&:hover fieldset': { borderColor: '#9146FF' },
              '&.Mui-focused fieldset': { borderColor: '#9146FF' },
            },
            '& .MuiInputLabel-root': { color: '#aaa' },
          }}
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
        <Box display="flex" gap={2} mb={2}>
          <TextField
            select
            label="Statut"
            fullWidth
            sx={{ 
              select: { color: '#fff' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#333' },
                '&:hover fieldset': { borderColor: '#9146FF' },
                '&.Mui-focused fieldset': { borderColor: '#9146FF' },
              },
              '& .MuiInputLabel-root': { color: '#aaa' },
              '& .MuiMenuItem-root': { color: '#fff' },
            }}
            value={form.task_status_id}
            onChange={e => setForm({ ...form, task_status_id: e.target.value })}
          >
            <MenuItem value="">Choisir un statut</MenuItem>
            {statuses.map(status => (
              <MenuItem key={status.id} value={status.id}>
                {status.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Points"
            type="number"
            sx={{ 
              minWidth: 120,
              input: { color: '#fff' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#333' },
                '&:hover fieldset': { borderColor: '#9146FF' },
                '&.Mui-focused fieldset': { borderColor: '#9146FF' },
              },
              '& .MuiInputLabel-root': { color: '#aaa' },
            }}
            value={form.points}
            onChange={e => setForm({ ...form, points: parseInt(e.target.value) || 0 })}
          />
        </Box>
        <TextField
          label="Date d'échéance"
          fullWidth
          type="date"
          sx={{ 
            mb: 3,
            input: { color: '#fff' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#333' },
              '&:hover fieldset': { borderColor: '#9146FF' },
              '&.Mui-focused fieldset': { borderColor: '#9146FF' },
            },
            '& .MuiInputLabel-root': { color: '#aaa' },
          }}
          InputLabelProps={{ shrink: true }}
          value={form.due_date}
          onChange={e => setForm({ ...form, due_date: e.target.value })}
        />
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            sx={{ 
              backgroundColor: '#9146FF', 
              color: '#fff',
              '&:hover': { backgroundColor: '#7c2ced' },
            }}
            onClick={handleSubmit}
          >
            {isEdit ? 'Mettre à jour' : 'Créer'}
          </Button>
          <Button
            variant="outlined"
            sx={{ 
              color: '#9146FF', 
              borderColor: '#9146FF',
              '&:hover': { borderColor: '#7c2ced', color: '#7c2ced' },
            }}
            onClick={() => navigate(`/projects/${id}`)}
          >
            Annuler
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TaskForm;
