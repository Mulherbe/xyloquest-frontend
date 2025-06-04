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
  const [form, setForm] = useState({ title: '', description: '', task_status_id: '', due_date: '' });

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
    <Box sx={{ p: 4 }}>
      <Typography variant="h6" color="#fff" gutterBottom>
        {isEdit ? 'Modifier la tâche' : 'Créer une tâche'}
      </Typography>
      <TextField
        label="Titre"
        fullWidth
        sx={{ mb: 2 }}
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
      />
      <TextField
        label="Description"
        fullWidth
        multiline
        rows={3}
        sx={{ mb: 2 }}
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
      />
      <TextField
        select
        label="Statut"
        fullWidth
        sx={{ mb: 2 }}
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
        label="Date d'échéance"
        fullWidth
        type="date"
        sx={{ mb: 2 }}
        InputLabelProps={{ shrink: true }}
        value={form.due_date}
        onChange={e => setForm({ ...form, due_date: e.target.value })}
      />
      <Button
        variant="contained"
        sx={{ backgroundColor: '#9146FF', color: '#fff' }}
        onClick={handleSubmit}
      >
        {isEdit ? 'Mettre à jour' : 'Créer'}
      </Button>
    </Box>
  );
};

export default TaskForm;
