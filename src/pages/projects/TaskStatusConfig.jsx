import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import axios from 'axios';

const TaskStatusConfig = () => {
  const [statuses, setStatuses] = useState([]);
  const [newStatus, setNewStatus] = useState('');
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get('http://xyloquest-backend.test/api/task-status', { headers }).then(res => setStatuses(res.data.data));
  }, []);

  const addStatus = () => {
    axios.post('http://xyloquest-backend.test/api/task-status', { name: newStatus }, { headers }).then(() => {
      setNewStatus('');
      axios.get('http://xyloquest-backend.test/api/task-status', { headers }).then(res => setStatuses(res.data.data));
    });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" color="#fff" gutterBottom>
        Gestion des statuts de tâches
      </Typography>
      <Stack spacing={2} mt={2} maxWidth={400}>
        {statuses.map(status => (
          <TextField key={status.id} value={status.name} disabled />
        ))}
        <TextField
          label="Nouveau statut"
          value={newStatus}
          onChange={e => setNewStatus(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={addStatus}
          sx={{ backgroundColor: '#9146FF', color: '#fff' }}
        >
          Ajouter
        </Button>
      </Stack>
    </Box>
  );
};

export default TaskStatusConfig;
