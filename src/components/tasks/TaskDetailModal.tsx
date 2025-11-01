import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Stack,
  Chip,
  Box,
  Button,
  Grid,
  TextField,
  MenuItem,
  DialogTitle
} from '@mui/material';
import { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';
import CommentSection from '../../pages/projects/CommentSection';

interface TaskDetailModalProps {
  open: boolean;
  onClose: () => void;
  taskId: number | null;
  projectId: number;
}

const TaskDetailModal = ({ open, onClose, taskId, projectId }: TaskDetailModalProps) => {
  const [task, setTask] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activityTypeId, setActivityTypeId] = useState('');
  const [activityTypes, setActivityTypes] = useState([]);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchTask = () => {
    if (!taskId) return;
    axios.get(`http://xyloquest-backend.test/api/tasks/${taskId}`, { headers }).then(res => {
      setTask(res.data.data);
    });
  };

  useEffect(() => {
    if (open && taskId) {
      fetchTask();
      axios.get('http://xyloquest-backend.test/api/activity-types', { headers }).then(res => {
        setActivityTypes(res.data.data);
      });
    }
  }, [taskId, open]);

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
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#181818',
          backgroundImage: 'none'
        }
      }}
    >
      <DialogTitle sx={{ p: 0 }}>
        <Stack 
          direction="row" 
          justifyContent="flex-end" 
          sx={{ p: 1 }}
        >
          <IconButton onClick={onClose} sx={{ color: '#666' }}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={3}>
          <Typography 
            variant="h4" 
            color="#fff" 
            fontWeight="bold"
            sx={{ 
              fontSize: { xs: '1.5rem', sm: '2rem' },
              wordBreak: 'break-word'
            }}
          >
            {task.title}
          </Typography>

          <Box sx={{ 
            backgroundColor: '#232323', 
            p: { xs: 2, sm: 3 }, 
            borderRadius: 1
          }}>
            <Typography 
              color="#fff" 
              sx={{ 
                mb: 3,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}
            >
              {task.description}
            </Typography>
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2}
              sx={{
                '& > *': { 
                  flex: { xs: '1', sm: '0 1 auto' }
                }
              }}
            >
              <Chip
                icon={<AssignmentIcon />}
                label={task.status?.name ?? task.task_status_id}
                sx={{
                  backgroundColor: '#333',
                  color: '#fff',
                  '& .MuiChip-icon': { color: '#9146FF' },
                  '& .MuiChip-label': {
                    whiteSpace: 'normal',
                    height: 'auto',
                    padding: '8px'
                  }
                }}
              />
              <Chip
                icon={<CalendarTodayIcon />}
                label={`Échéance: ${task.due_date}`}
                sx={{
                  backgroundColor: '#333',
                  color: '#fff',
                  '& .MuiChip-icon': { color: '#9146FF' },
                  '& .MuiChip-label': {
                    whiteSpace: 'normal',
                    height: 'auto',
                    padding: '8px'
                  }
                }}
              />
              <Chip
                icon={<StarIcon />}
                label={`${task.points || 0} points`}
                sx={{
                  backgroundColor: '#333',
                  color: '#fff',
                  '& .MuiChip-icon': { color: '#9146FF' },
                  '& .MuiChip-label': {
                    whiteSpace: 'normal',
                    height: 'auto',
                    padding: '8px'
                  }
                }}
              />
            </Stack>
          </Box>

          {!task.activité_id && (
            <Box sx={{ 
              backgroundColor: '#232323', 
              p: { xs: 2, sm: 3 }, 
              borderRadius: 1
            }}>
              {!showForm ? (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#2ecc71',
                    '&:hover': { backgroundColor: '#27ae60' }
                  }}
                  onClick={() => setShowForm(true)}
                >
                  Lier à une activité
                </Button>
              ) : (
                <Stack spacing={3}>
                  <Stack 
                    direction="row" 
                    justifyContent="space-between" 
                    alignItems="center"
                  >
                    <Typography variant="h6" color="#fff">
                      Créer une activité liée
                    </Typography>
                    <IconButton
                      onClick={() => setShowForm(false)}
                      sx={{ color: '#666' }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Stack>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="datetime-local"
                        label="Date de début"
                        InputLabelProps={{ shrink: true }}
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                            '&:hover fieldset': { borderColor: '#9146FF' },
                            '&.Mui-focused fieldset': { borderColor: '#9146FF' }
                          },
                          '& .MuiInputLabel-root': { color: '#aaa' }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="datetime-local"
                        label="Date de fin"
                        InputLabelProps={{ shrink: true }}
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                            '&:hover fieldset': { borderColor: '#9146FF' },
                            '&.Mui-focused fieldset': { borderColor: '#9146FF' }
                          },
                          '& .MuiInputLabel-root': { color: '#aaa' }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        select
                        label="Type d'activité"
                        value={activityTypeId}
                        onChange={e => setActivityTypeId(e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                            '&:hover fieldset': { borderColor: '#9146FF' },
                            '&.Mui-focused fieldset': { borderColor: '#9146FF' }
                          },
                          '& .MuiInputLabel-root': { color: '#aaa' },
                          '& .MuiMenuItem-root': { color: '#000' }
                        }}
                      >
                        {activityTypes.map(type => (
                          <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>

                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#2ecc71',
                      '&:hover': { backgroundColor: '#27ae60' },
                      alignSelf: 'flex-start'
                    }}
                    onClick={handleLinkActivity}
                  >
                    Créer et lier
                  </Button>
                </Stack>
              )}
            </Box>
          )}

          <Box sx={{ 
            backgroundColor: '#232323', 
            p: { xs: 2, sm: 3 }, 
            borderRadius: 1
          }}>
            <CommentSection taskId={task.id} />
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailModal;
