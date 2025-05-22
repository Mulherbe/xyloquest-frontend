import {
  Box,
  Typography,
  Stack,
  IconButton,
  TextField,
  Button,
  Paper,
  Container
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Header from '../components/global/Header';

interface ActivityType {
  id: number;
  name: string;
  color: string;
  default_points_per_hour: number;
}

const ActivityTypesPage = () => {
  const [types, setTypes] = useState<ActivityType[]>([]);
  const [newType, setNewType] = useState({
    name: '',
    color: '#9146FF',
    default_points_per_hour: 1,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<Partial<ActivityType>>({});

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchTypes = async () => {
    const res = await axios.get('http://xyloquest-backend.test/api/activity-types', { headers });
    setTypes(res.data.data);
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleAdd = async () => {
    if (!newType.name.trim()) return;
    await axios.post('http://xyloquest-backend.test/api/activity-types', newType, { headers });
    setNewType({ name: '', color: '#9146FF', default_points_per_hour: 1 });
    fetchTypes();
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`http://xyloquest-backend.test/api/activity-types/${id}`, { headers });
    fetchTypes();
  };

  const handleEdit = (type: ActivityType) => {
    setEditingId(type.id);
    setEditingData(type);
  };

  const handleSave = async () => {
    if (!editingId) return;
    await axios.put(
      `http://xyloquest-backend.test/api/activity-types/${editingId}`,
      editingData,
      { headers }
    );
    setEditingId(null);
    fetchTypes();
  };

  return (
    <Box sx={{ backgroundColor: '#0f0f0f', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">

      <Header />

      <Typography variant="h4" sx={{ mb: 3 }}>Types d'activité</Typography>

      {/* Formulaire d'ajout */}
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <TextField
          label="Nom"
          value={newType.name}
          onChange={(e) => setNewType({ ...newType, name: e.target.value })}
          sx={{ input: { color: '#fff' } }}
          InputLabelProps={{ style: { color: '#ccc' } }}
        />
        <TextField
          type="color"
          label="Couleur"
          value={newType.color}
          onChange={(e) => setNewType({ ...newType, color: e.target.value })}
          InputLabelProps={{ shrink: true, style: { color: '#ccc' } }}
          sx={{ width: 100 }}
        />
        <TextField
          label="Points/h"
          type="number"
          value={newType.default_points_per_hour}
          onChange={(e) => setNewType({ ...newType, default_points_per_hour: parseInt(e.target.value) || 0 })}
          sx={{ input: { color: '#fff' }, width: 100 }}
          InputLabelProps={{ style: { color: '#ccc' } }}
        />
        <Button
          variant="outlined"
          sx={{ mt: 3, color: '#9146FF', borderColor: '#9146FF' }}
          onClick={handleAdd}
        >
          Ajouter
        </Button>
      </Stack>

      {/* Liste */}
      <Stack spacing={2}>
        {types.map((type) => (
          <Paper key={type.id} sx={{ p: 2, backgroundColor: '#1e1e1e' }}>
            {editingId === type.id ? (
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  value={editingData.name}
                  onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
                  sx={{ input: { color: '#fff' } }}
                />
                <TextField
                  type="color"
                  value={editingData.color}
                  onChange={(e) => setEditingData({ ...editingData, color: e.target.value })}
                  sx={{ width: 80 }}
                />
                <TextField
                  label="Points/h"
                  type="number"
                  value={editingData.default_points_per_hour}
                  onChange={(e) =>
                    setEditingData({
                      ...editingData,
                      default_points_per_hour: parseInt(e.target.value) || 0,
                    })
                  }
                  sx={{ input: { color: '#fff' }, width: 100 }}
                  InputLabelProps={{ style: { color: '#ccc' } }}
                />
                <IconButton onClick={handleSave} sx={{ color: 'green' }}><SaveIcon /></IconButton>
                <IconButton onClick={() => setEditingId(null)} sx={{ color: 'red' }}><CloseIcon /></IconButton>
              </Stack>
            ) : (
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{ width: 16, height: 16, backgroundColor: type.color, borderRadius: '50%' }}
                  />
                  <Typography sx={{ color: '#fff' }}>
                    {type.name} — {type.default_points_per_hour} pt/h
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <IconButton onClick={() => handleEdit(type)} sx={{ color: '#9146FF' }}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(type.id)} sx={{ color: '#f44336' }}><DeleteIcon /></IconButton>
                </Stack>
              </Stack>
            )}
          </Paper>
        ))}
      </Stack>
  </Container >

    </Box>
  );
};

export default ActivityTypesPage;
