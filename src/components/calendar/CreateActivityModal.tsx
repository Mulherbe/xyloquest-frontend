import {
  Modal, Backdrop, Fade, Box, Typography, Stack,
  TextField, MenuItem, Button
} from '@mui/material';
import { useState, useEffect } from 'react';
import { Dayjs } from 'dayjs';
import axios from 'axios';
import type { EventItem } from './types';
import { transformRawActivity } from '../../contexts/ActivityContext';

interface Props {
  open: boolean;
  onClose: () => void;
  defaultDate: Dayjs | null;
  onCreated?: (event: EventItem) => void;
}

const CreateActivityModal = ({ open, onClose, defaultDate, onCreated }: Props) => {
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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activityTypes, setActivityTypes] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    if (defaultDate) {
      const base = defaultDate.format('YYYY-MM-DD');
      setForm((prev) => ({
        ...prev,
        start_date: `${base}T09:00`,
        end_date: `${base}T10:00`,
      }));
    }
  }, [defaultDate]);

  useEffect(() => {
    const fetchTypes = async () => {
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
    fetchTypes();
  }, []);

  const handleChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const handleSubmit = async () => {
    setErrors({});
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      const payload = {
        ...form,
        user_id: userId,
        is_recurring: !!form.recurrence_rule,
      };

      const res = await axios.post('http://xyloquest-backend.test/api/activities', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newEvent = transformRawActivity(res.data.data);
      onCreated?.(newEvent);
      onClose();
    } catch (err: any) {
      if (err.response?.status === 422) {
        const fieldErrors = err.response.data.errors;
        const mappedErrors: Record<string, string> = {};
        Object.keys(fieldErrors).forEach((field) => {
          mappedErrors[field] = fieldErrors[field][0];
        });
        setErrors(mappedErrors);
      } else {
        console.error('Erreur création activité', err);
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}>
      <Fade in={open}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: '#2a2a2a', color: '#fff', p: 4,
          borderRadius: 2, minWidth: 400
        }}>
          <Typography variant="h6" mb={2}>Créer une activité</Typography>
          <Stack spacing={2}>
            <TextField
              label="Titre"
              fullWidth
              value={form.title}
              onChange={handleChange('title')}
              error={!!errors.title}
              helperText={errors.title}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={2}
              value={form.description}
              onChange={handleChange('description')}
              error={!!errors.description}
              helperText={errors.description}
            />
            <TextField
              label="Début"
              type="datetime-local"
              fullWidth
              value={form.start_date}
              onChange={handleChange('start_date')}
              InputLabelProps={{ shrink: true }}
              error={!!errors.start_date}
              helperText={errors.start_date}
            />
            <TextField
              label="Fin"
              type="datetime-local"
              fullWidth
              value={form.end_date}
              onChange={handleChange('end_date')}
              InputLabelProps={{ shrink: true }}
              error={!!errors.end_date}
              helperText={errors.end_date}
            />
            <TextField
              select
              label="Type d’activité"
              fullWidth
              value={form.activity_type_id}
              onChange={handleChange('activity_type_id')}
              error={!!errors.activity_type_id}
              helperText={errors.activity_type_id}
            >
              {activityTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Statut"
              fullWidth
              value={form.status}
              onChange={handleChange('status')}
              error={!!errors.status}
              helperText={errors.status}
            >
              <MenuItem value="">⏳ En attente</MenuItem>
              <MenuItem value="done">✅ Terminé</MenuItem>
              <MenuItem value="skipped">❌ Non réalisé</MenuItem>
            </TextField>
            <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
              Créer
            </Button>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
};

export default CreateActivityModal;
