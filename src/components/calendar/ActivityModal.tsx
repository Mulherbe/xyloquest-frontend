import {
  Box,
  Typography,
  Modal,
  Backdrop,
  Fade,
  IconButton,
  TextField,
  MenuItem,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import axios from 'axios';
import type { EventItem } from './types';
import { transformRawActivity, useActivities } from '../../contexts/ActivityContext';

interface ActivityModalProps {
  event: EventItem | null;
  onClose: () => void;
}

const ActivityModal = ({ event, onClose }: ActivityModalProps) => {
  const [editMode, setEditMode] = useState(false);
  const { refetch } = useActivities();

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: '',
    start_date: '',
  });

  const [initial, setInitial] = useState(form);

  useEffect(() => {
    if (event) {
      const initForm = {
        title: event.title || '',
        description: event.description || '',
        status: event.status || '',
        start_date: event.date?.slice(0, 10) || '',
      };
      setForm(initForm);
      setInitial(initForm);
    }
  }, [event]);

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSave = async () => {
    if (!event) return;

    const hasChanged = Object.keys(form).some(
      (key) => (form as any)[key] !== (initial as any)[key]
    );

    if (!hasChanged) {
      setEditMode(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await axios.put(
        `http://xyloquest-backend.test/api/activities/${event.id}`,
        {
          title: form.title,
          description: form.description,
          status: form.status,
          start_date: form.start_date,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await refetch(); // ⬅ recharge toutes les activités depuis l'API
      setEditMode(false);
    } catch (err) {
      console.error('Erreur mise à jour activité :', err);
    }
  };

  return (
    <Modal
      open={!!event}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={!!event}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: '#2a2a2a',
            color: '#fff',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            minWidth: 300,
            maxWidth: 400,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {editMode ? 'Modifier une activité' : event?.title}
            </Typography>
            <Stack direction="row" spacing={1}>
              {editMode ? (
                <>
                  <IconButton onClick={handleSave} size="small" sx={{ color: '#4caf50' }}>
                    <SaveIcon />
                  </IconButton>
                  <IconButton onClick={() => setEditMode(false)} size="small" sx={{ color: '#f44336' }}>
                    <CloseIcon />
                  </IconButton>
                </>
              ) : (
                <IconButton onClick={() => setEditMode(true)} size="small" sx={{ color: '#9146FF' }}>
                  <EditIcon />
                </IconButton>
              )}
            </Stack>
          </Stack>

          <Box mt={2}>
            {editMode ? (
              <>
                <TextField
                  fullWidth
                  label="Titre"
                  variant="outlined"
                  size="small"
                  value={form.title}
                  onChange={handleChange('title')}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  variant="outlined"
                  size="small"
                  value={form.description}
                  onChange={handleChange('description')}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  type="date"
                  label="Date"
                  variant="outlined"
                  size="small"
                  value={form.start_date}
                  onChange={handleChange('start_date')}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  select
                  fullWidth
                  label="Statut"
                  variant="outlined"
                  size="small"
                  value={form.status}
                  onChange={handleChange('status')}
                >
                  <MenuItem value="pending">⏳ En attente</MenuItem>
                  <MenuItem value="done">✅ Terminé</MenuItem>
                  <MenuItem value="skipped">❌ Non réalisé</MenuItem>
                </TextField>
              </>
            ) : (
              <>
                <Typography variant="body2" mb={2}>
                  {event?.description || 'Aucune description.'}
                </Typography>
                <Typography variant="caption" display="block" mb={1}>
                  Date : <strong>{form.start_date}</strong>
                </Typography>
                <Typography variant="caption">
                  Statut :{' '}
                  <strong style={{ color: '#9146FF' }}>
                    {event?.status === 'done'
                      ? '✅ Terminé'
                      : event?.status === 'skipped'
                      ? '❌ Non réalisé'
                      : '⏳ En attente'}
                  </strong>
                </Typography>
              </>
            )}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ActivityModal;
