import {
  Modal, Backdrop, Fade, Box, Typography, Stack,
  TextField, MenuItem, Button
} from '@mui/material';
import { useState, useEffect } from 'react';
import { Dayjs } from 'dayjs';
import axios from 'axios';
import type { EventItem } from './types'; // adapte le chemin
import { transformRawActivity } from '../../contexts/ActivityContext'; // adapte le chemin

interface Props {
  open: boolean;
  onClose: () => void;
  defaultDate: Dayjs;
  onCreated?: (event: EventItem) => void;
}

const CreateActivityModal = ({ open, onClose, defaultDate, onCreated }: Props) => {
  useEffect(() => {
    if (defaultDate) {
      setForm((prev) => ({
        ...prev,
        start_date: defaultDate.format('YYYY-MM-DD'),
      }));
    }
  }, [defaultDate]);
    const [form, setForm] = useState({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        is_recurring: false,
        recurrence_rule: '',
        completed_at: '',
        activity_type_id: '',
        status: '',
    });

  const [activityTypes, setActivityTypes] = useState<{ id: number; name: string }[]>([]);
  const userId = localStorage.getItem('userId');

    console.log(userId);
  useEffect(() => {
    const fetchActivityTypes = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://xyloquest-backend.test/api/activity-types', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActivityTypes(res.data.data);
      } catch (err) {
        console.error('Erreur récupération types d’activité :', err);
      }
    };

    fetchActivityTypes();
  }, []);

  const handleChange = (key: string) => (e: any) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await axios.post(
        'http://xyloquest-backend.test/api/activities',
        {
          ...form,
          user_id: userId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newEvent = transformRawActivity(res.data.data);
      onCreated?.(newEvent);
      onClose();
    } catch (err) {
      console.error('Erreur création activité', err);
    }
  };
  return (
    <Modal open={open} onClose={onClose} closeAfterTransition
      slots={{ backdrop: Backdrop }} slotProps={{ backdrop: { timeout: 500 } }}>
      <Fade in={open}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: '#2a2a2a', color: '#fff', p: 4, borderRadius: 2, minWidth: 400,
        }}>
          <Typography variant="h6" mb={2}>Créer une activité</Typography>
          <Stack spacing={2}>
            <TextField label="Titre" fullWidth value={form.title} onChange={handleChange('title')} />
            <TextField label="Description" fullWidth multiline rows={2} value={form.description} onChange={handleChange('description')} />
            <TextField label="Date de début" type="date" fullWidth value={form.start_date} onChange={handleChange('start_date')} InputLabelProps={{ shrink: true }} />
            <TextField select label="Type d’activité" fullWidth value={form.activity_type_id} onChange={handleChange('activity_type_id')}>
              {activityTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField select label="Statut" fullWidth value={form.status} onChange={handleChange('status')}>
              <MenuItem value="">⏳ En attente</MenuItem>
              <MenuItem value="done">✅ Terminé</MenuItem>
              <MenuItem value="skipped">❌ Non réalisé</MenuItem>
            </TextField>
            <Button variant="contained" sx={{ mt: 1 }} onClick={handleSubmit}>Créer</Button>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
};

export default CreateActivityModal;
