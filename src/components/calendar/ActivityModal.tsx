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
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import type { EventItem } from './types';
import { useActivities } from '../../contexts/ActivityContext';

interface ActivityModalProps {
  event: EventItem | null;
  onClose: () => void;
}

const ActivityModal = ({ event, onClose }: ActivityModalProps) => {
  const [editMode, setEditMode] = useState(false);
  const { refetch } = useActivities();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activityTypes, setActivityTypes] = useState<{ id: number; name: string }[]>([]);

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: '',
    start_date: '',
    end_date: '',
    activity_type_id: '',
  });

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://xyloquest-backend.test/api/activity-types', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActivityTypes(res.data.data);
      } catch (err) {
        console.error('Erreur chargement types d’activité', err);
      }
    };
    fetchTypes();
  }, []);

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title ?? '',
        description: event.description ?? '',
        status: event.status ?? '',
        start_date: event.start_date?.slice(0, 16) ?? '',
        end_date: event.end_date?.slice(0, 16) ?? '',
        activity_type_id: event.activity_type_id ? String(event.activity_type_id) : '',
      });
    }
  }, [event]);

  const handleChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const handleSave = async () => {
    if (!event) return;
    setErrors({});
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://xyloquest-backend.test/api/activities/${event.id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await refetch();
      setEditMode(false);
      onClose();
    } catch (err: any) {
      if (err.response?.status === 422) {
        const mappedErrors: Record<string, string> = {};
        for (const field in err.response.data.errors) {
          mappedErrors[field] = err.response.data.errors[field][0];
        }
        setErrors(mappedErrors);
      } else {
        console.error('Erreur mise à jour activité :', err);
      }
    }
  };

  const handleDelete = async () => {
    if (!event) return;
    if (!window.confirm('Supprimer cette activité ?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://xyloquest-backend.test/api/activities/${event.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await refetch();
      onClose();
    } catch (err) {
      console.error('Erreur suppression activité :', err);
    }
  };

  return (
    <Modal open={!!event} onClose={onClose} closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}>
      <Fade in={!!event}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: '#2a2a2a', color: '#fff', p: 4,
          borderRadius: 2, minWidth: 400,
        }}>
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
              <Stack spacing={2}>
                <TextField label="Titre" fullWidth value={form.title} onChange={handleChange('title')} error={!!errors.title} helperText={errors.title} />
                <TextField label="Description" fullWidth multiline rows={2} value={form.description} onChange={handleChange('description')} error={!!errors.description} helperText={errors.description} />
                <TextField label="Début" type="datetime-local" fullWidth value={form.start_date} onChange={handleChange('start_date')} InputLabelProps={{ shrink: true }} error={!!errors.start_date} helperText={errors.start_date} />
                <TextField label="Fin" type="datetime-local" fullWidth value={form.end_date} onChange={handleChange('end_date')} InputLabelProps={{ shrink: true }} error={!!errors.end_date} helperText={errors.end_date} />
                <TextField select label="Type d’activité" fullWidth value={form.activity_type_id} onChange={handleChange('activity_type_id')} error={!!errors.activity_type_id} helperText={errors.activity_type_id}>
                  {activityTypes.map((type) => (
                    <MenuItem key={type.id} value={String(type.id)}>{type.name}</MenuItem>
                  ))}
                </TextField>
                <TextField select label="Statut" fullWidth value={form.status} onChange={handleChange('status')} error={!!errors.status} helperText={errors.status}>
                  <MenuItem value="pending">⏳ En attente</MenuItem>
                  <MenuItem value="done">✅ Terminé</MenuItem>
                  <MenuItem value="skipped">❌ Non réalisé</MenuItem>
                </TextField>
              </Stack>
            ) : (
              <>
                <Typography variant="body2" mb={2}>
                  {event?.description || 'Aucune description.'}
                </Typography>
              <Typography variant="caption" display="block" mb={1}>
                Début : <strong>{event?.start_date
                  ? dayjs.utc(event.start_date).format('DD/MM/YYYY HH:mm')
                  : ''}</strong>
              </Typography>
              <Typography variant="caption" display="block" mb={1}>
                Fin : <strong>{event?.end_date
                  ? dayjs.utc(event.end_date).format('DD/MM/YYYY HH:mm')
                  : ''}</strong>
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

          {!editMode && (
            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDelete}
                sx={{
                  borderColor: '#f44336',
                  color: '#f44336',
                  fontSize: '0.85rem',
                  py: 0.5,
                  px: 1.5,
                  minWidth: 0,
                  textTransform: 'none',
                }}
                startIcon={<DeleteIcon sx={{ fontSize: 18 }} />}
                size="small"
              >
                Supprimer
              </Button>
            </Box>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default ActivityModal;
