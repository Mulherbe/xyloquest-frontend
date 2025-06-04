import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  Chip,
} from '@mui/material';
import axios from 'axios';

const TagManager = () => {
  const [tags, setTags] = useState([]);
  const [form, setForm] = useState({ name: '', color: '#9146FF' });
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get('http://xyloquest-backend.test/api/tags', { headers }).then(res => setTags(res.data.data));
  }, []);

  const addTag = () => {
    axios.post('http://xyloquest-backend.test/api/tags', form, { headers }).then(() => {
      setForm({ name: '', color: '#9146FF' });
      axios.get('http://xyloquest-backend.test/api/tags', { headers }).then(res => setTags(res.data.data));
    });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" color="#fff" gutterBottom>
        Gestion des étiquettes
      </Typography>
      <Stack spacing={2} maxWidth={400}>
        <TextField
          label="Nom"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <TextField
          label="Couleur"
          value={form.color}
          onChange={e => setForm({ ...form, color: e.target.value })}
          type="color"
        />
        <Button
          variant="contained"
          onClick={addTag}
          sx={{ backgroundColor: '#9146FF', color: '#fff' }}
        >
          Ajouter
        </Button>
      </Stack>
      <Stack direction="row" gap={1} mt={4} flexWrap="wrap">
        {tags.map(tag => (
          <Chip key={tag.id} label={tag.name} sx={{ backgroundColor: tag.color, color: '#fff' }} />
        ))}
      </Stack>
    </Box>
  );
};

export default TagManager;
