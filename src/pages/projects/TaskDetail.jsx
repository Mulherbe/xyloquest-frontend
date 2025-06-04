import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  MenuItem,
  Stack,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import CommentSection from './CommentSection';
import Header from '../../components/global/Header';

const TaskDetail = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activityTypeId, setActivityTypeId] = useState('');
  const [activityTypes, setActivityTypes] = useState([]);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchTask = () => {
    axios.get(`http://xyloquest-backend.test/api/tasks/${taskId}`, { headers }).then(res => {
      setTask(res.data.data);
    });
  };

  useEffect(() => {
    fetchTask();
    axios.get('http://xyloquest-backend.test/api/activity-types', { headers }).then(res => {
      setActivityTypes(res.data.data);
    });
  }, [taskId]);

  const handleLinkActivity = () => {
    axios
      .post(`http://xyloquest-backend.test/api/tasks/${taskId}/link-activity`, {
        start_date: startDate,
        end_date: endDate,
        activity_type_id: activityTypeId,
      }, { headers })
      .then(() => {
        setShowForm(false);
        fetchTask();
      });
  };

  if (!task) return null;

  return (
    <Box sx={{ p: 4 }}>
      <Header />

      <Paper sx={{ backgroundColor: '#181818', p: 3, mb: 4 }}>
        <Typography variant="h5" color="#9146FF" gutterBottom>
          {task.title}
        </Typography>
        <Typography color="#aaa" gutterBottom>
          {task.description}
        </Typography>
        <Typography variant="body2" color="#666">
          Statut : {task.status?.name ?? task.task_status_id}
        </Typography>
        <Typography variant="body2" color="#666">
          Échéance : {task.due_date}
        </Typography>

        <Stack direction="row" spacing={2} mt={2}>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#9146FF', color: '#fff' }}
            onClick={() => navigate(`/projects/${task.project_id}/tasks/${task.id}/edit`)}
          >
            Éditer
          </Button>
          <Button
            variant="outlined"
            sx={{ color: '#9146FF', borderColor: '#9146FF' }}
            onClick={() => navigate(-1)}
          >
            Retour
          </Button>
        </Stack>
      </Paper>

      {/* Bouton lier activité */}
      {!task.activité_id && (
        <Paper sx={{ backgroundColor: '#232323', p: 3, mb: 4 }}>
          {!showForm ? (
            <Button
              variant="contained"
              sx={{ backgroundColor: '#2ecc71' }}
              onClick={() => setShowForm(true)}
            >
              Lier à une activité
            </Button>
          ) : (
            <Stack spacing={2}>
              <Typography variant="h6" color="#fff">Créer une activité liée</Typography>
              <TextField
                type="datetime-local"
                label="Date de début"
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
              <TextField
                type="datetime-local"
                label="Date de fin"
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
              <TextField
                select
                label="Type d'activité"
                value={activityTypeId}
                onChange={e => setActivityTypeId(e.target.value)}
              >
                {activityTypes.map(type => (
                  <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#2ecc71' }}
                onClick={handleLinkActivity}
              >
                Créer et lier
              </Button>
            </Stack>
          )}
        </Paper>
      )}

      <CommentSection taskId={task.id} />
    </Box>
  );
};

export default TaskDetail;
