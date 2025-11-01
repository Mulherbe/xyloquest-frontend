import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DragDropContext,
  Droppable,
  Draggable,
} from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  LinearProgress,
  Tooltip,
  Chip,
  Grid,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  AccessTime as ClockIcon,
  Flag as FlagIcon,
  InfoOutlined as InfoIcon,
} from '@mui/icons-material';
import Header from '../../components/global/Header';
import dayjs from 'dayjs';
import TaskDetailModal from '../../components/tasks/TaskDetailModal';

interface Task {
  id: number;
  title: string;
  description: string;
  task_status_id: number;
  due_date: string;
}

interface TaskStatus {
  id: number;
  name: string;
  order: number;
}

interface Column {
  id: number;
  name: string;
  tasks: Task[];
}

interface Project {
  id: number;
  name: string;
  description: string;
  goal_points: number;
  current_points: number;
}

const TaskBoard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = id;
  const navigate = useNavigate();
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [editForm, setEditForm] = useState<Partial<Project>>({});
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const token = localStorage.getItem('token');
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const sortTasksByDueDate = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      // Mettre les tâches sans date à la fin
      if (!a.due_date && !b.due_date) return 0;
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      
      // Comparer les dates
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });
  };

  // Charger les données du projet
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!projectId) return;
        const [statusRes, tasksRes, projectRes] = await Promise.all([
          axios.get('http://xyloquest-backend.test/api/task-status', { headers }),
          axios.get(`http://xyloquest-backend.test/api/projects/${projectId}/tasks`, { headers }),
          axios.get(`http://xyloquest-backend.test/api/projects/${projectId}`, { headers }),
        ]);
        const statuses: TaskStatus[] = statusRes.data.data;
        const tasks: Task[] = tasksRes.data.data;
        const columnsData: Column[] = statuses.map((status) => {
          const columnTasks = tasks.filter((task) => task.task_status_id === status.id);
          // Trier les tâches par date d'échéance uniquement pour "À faire" et "En cours"
          const sortedTasks = (status.id === 1 || status.id === 2) 
            ? sortTasksByDueDate(columnTasks)
            : columnTasks;
          
          return {
            id: status.id,
            name: status.name,
            tasks: sortedTasks,
          };
        });
        setColumns(columnsData);
        setProject(projectRes.data.data);
        setEditForm(projectRes.data.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId, headers]);

  const handleSave = async () => {
    try {
      await axios.put(`http://xyloquest-backend.test/api/projects/${projectId}`, editForm, { headers });
      setProject(editForm as Project);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };
  
  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    const sourceColIndex = columns.findIndex((col) => col.id.toString() === source.droppableId);
    const destColIndex = columns.findIndex((col) => col.id.toString() === destination.droppableId);
    if (sourceColIndex === -1 || destColIndex === -1) return;
    const sourceCol = columns[sourceColIndex];
    const destCol = columns[destColIndex];
    const draggedTaskIndex = source.index;
    const draggedTask = sourceCol.tasks[draggedTaskIndex];
    const updatedSourceTasks = Array.from(sourceCol.tasks);
    updatedSourceTasks.splice(draggedTaskIndex, 1);
    let updatedDestTasks = Array.from(destCol.tasks);
    
    // Si la colonne de destination est "À faire" ou "En cours", trier les tâches après l'ajout
    if (destCol.id === 1 || destCol.id === 2) {
      updatedDestTasks.push(draggedTask);
      updatedDestTasks = sortTasksByDueDate(updatedDestTasks);
    } else {
      updatedDestTasks.splice(destination.index, 0, draggedTask);
    }

    const updatedColumns = [...columns];
    updatedColumns[sourceColIndex] = {
      ...sourceCol,
      tasks: updatedSourceTasks,
    };
    updatedColumns[destColIndex] = {
      ...destCol,
      tasks: updatedDestTasks,
    };
    setColumns(updatedColumns);
    
    if (sourceCol.id !== destCol.id) {
      try {
        await axios.put(
          `http://xyloquest-backend.test/api/tasks/${draggableId}`,
          { task_status_id: destCol.id },
          { headers }
        );
      } catch {
        // Erreur ignorée
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Header />
      <Box sx={{ mb: 4 }}>
        {loading ? (
          <CircularProgress />
        ) : editMode ? (
          <Stack spacing={2}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="h5" color="#fff">Modifier le projet</Typography>
              <Box>
                <IconButton onClick={handleSave} sx={{ color: '#4caf50' }}>
                  <SaveIcon />
                </IconButton>
                <IconButton onClick={() => setEditMode(false)} sx={{ color: '#f44336' }}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
            <TextField
              label="Nom du projet"
              value={editForm.name || ''}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              fullWidth
              sx={{ 
                input: { color: '#fff' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#333' },
                  '&:hover fieldset': { borderColor: '#9146FF' },
                  '&.Mui-focused fieldset': { borderColor: '#9146FF' },
                },
                '& .MuiInputLabel-root': { color: '#aaa' },
              }}
            />
            <TextField
              label="Description"
              value={editForm.description || ''}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              multiline
              rows={3}
              fullWidth
              sx={{ 
                textarea: { color: '#fff' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#333' },
                  '&:hover fieldset': { borderColor: '#9146FF' },
                  '&.Mui-focused fieldset': { borderColor: '#9146FF' },
                },
                '& .MuiInputLabel-root': { color: '#aaa' },
              }}
            />
            <TextField
              label="Points objectif"
              type="number"
              value={editForm.goal_points || ''}
              onChange={(e) => setEditForm({ ...editForm, goal_points: parseInt(e.target.value) || 0 })}
              fullWidth
              sx={{ 
                input: { color: '#fff' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#333' },
                  '&:hover fieldset': { borderColor: '#9146FF' },
                  '&.Mui-focused fieldset': { borderColor: '#9146FF' },
                },
                '& .MuiInputLabel-root': { color: '#aaa' },
              }}
            />
          </Stack>
        ) : (
          <Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Box display="flex" alignItems="center" gap={1}>
                <IconButton 
                  onClick={() => navigate('/projects')} 
                  sx={{ color: '#9146FF' }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5" color="#fff">
                  {project?.name}
                </Typography>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{ 
                    mr: 2,
                    backgroundColor: '#9146FF',
                    '&:hover': { backgroundColor: '#7c2ced' }
                  }}
                  onClick={() => navigate(`/projects/${id}/tasks/create`)}
                >
                  Nouvelle tâche
                </Button>
                <IconButton onClick={() => setEditMode(true)} sx={{ color: '#9146FF' }}>
                  <EditIcon />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ backgroundColor: '#222', p: 2, borderRadius: 2, mb: 3 }}>
              <Typography color="#aaa" mb={2}>
                {project?.description || 'Aucune description'}
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Box flex={1}>
                  <Typography color="#aaa" variant="body2" mb={1}>
                    Progression des points
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={((project?.current_points || 0) / (project?.goal_points || 1)) * 100}
                    sx={{
                      backgroundColor: '#2a2a2a',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#9146FF',
                      },
                      height: 8,
                      borderRadius: 4,
                    }}
                  />
                  <Typography color="#fff" variant="body2" mt={1}>
                    {project?.current_points || 0} / {project?.goal_points || 0} points
                  </Typography>
                </Box>
                <Box borderLeft="1px solid #333" pl={2}>
                  <Typography variant="body2" color="#aaa">
                    Tâches totales: {columns.reduce((acc, col) => acc + col.tasks.length, 0)}
                  </Typography>
                  {columns.map(col => (
                    <Typography key={col.id} variant="body2" color="#aaa">
                      {col.name}: {col.tasks.length}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      
      <Box display="flex" gap={2} flexWrap="wrap">
        <DragDropContext onDragEnd={onDragEnd}>
          {columns.map((column) => (
            <Paper 
              key={column.id} 
              sx={{ 
                backgroundColor: '#181818',
                p: 2,
                minWidth: 300,
                flex: 1,
                borderRadius: 2,
                border: '1px solid #333',
              }}
            >
              <Typography 
                color="#9146FF" 
                variant="subtitle1" 
                fontWeight="bold"
                sx={{ mb: 2 }}
              >
                {column.name} ({column.tasks.length})
              </Typography>
              <Droppable droppableId={column.id.toString()}>
                {(provided) => (
                  <Stack
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    spacing={1}
                    sx={{ minHeight: 100 }}
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
                        {(provided) => (
                          <Paper
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              backgroundColor: '#222',
                              p: 2,
                              borderRadius: 2,
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: '#2a2a2a',
                                transform: 'translateY(-2px)',
                                transition: 'all 0.2s',
                              },
                            }}
                            onClick={() => setSelectedTaskId(task.id)}
                          >
                            <Typography color="#fff" mb={1}>{task.title}</Typography>
                            {task.description && (
                              <Typography color="#aaa" variant="body2" noWrap>
                                {task.description}
                              </Typography>
                            )}
                            {task.due_date && (
                              <Box display="flex" alignItems="center" gap={1} mt={1}>
                                <ClockIcon sx={{ color: '#666', fontSize: 16 }} />
                                <Typography color="#666" variant="caption">
                                  {dayjs(task.due_date).format('DD/MM/YYYY')}
                                </Typography>
                              </Box>
                            )}
                          </Paper>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Stack>
                )}
              </Droppable>
            </Paper>
          ))}
        </DragDropContext>
      </Box>

      <TaskDetailModal
        open={selectedTaskId !== null}
        onClose={() => setSelectedTaskId(null)}
        taskId={selectedTaskId}
        projectId={Number(projectId)}
      />
    </Box>
  );
};

export default TaskBoard;
