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
} from '@mui/material';
import Header from '../../components/global/Header';

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

const TaskBoard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = id;
  const navigate = useNavigate();
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!projectId) return;
        const [statusRes, tasksRes] = await Promise.all([
          axios.get('http://xyloquest-backend.test/api/task-status', { headers }),
          axios.get(`http://xyloquest-backend.test/api/projects/${projectId}/tasks`, { headers }),
        ]);
        const statuses: TaskStatus[] = statusRes.data.data;
        const tasks: Task[] = tasksRes.data.data;
        const columnsData: Column[] = statuses.map((status) => ({
          id: status.id,
          name: status.name,
          tasks: tasks.filter((task) => task.task_status_id === status.id),
        }));
        setColumns(columnsData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId, headers]);

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
    const updatedDestTasks = Array.from(destCol.tasks);
    updatedDestTasks.splice(destination.index, 0, draggedTask);
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
    <Box sx={{ p: 4, backgroundColor: '#0f0f0f', minHeight: '100vh' }}>
      <Header />
      <Typography variant="h5" color="#fff" gutterBottom>
        Tâches du projet
      </Typography>
      <Button
        variant="contained"
        sx={{ mb: 2, backgroundColor: '#9146FF', color: '#fff' }}
        onClick={() => navigate(`/projects/${id}/tasks/create`)}
      >
        Nouvelle tâche
      </Button>
      <Box display="flex" gap={2} flexWrap="wrap">
        <DragDropContext onDragEnd={onDragEnd}>
          {columns.map((column) => (
            <Paper key={column.id} sx={{ backgroundColor: '#181818', p: 2, minWidth: 250, flex: 1 }}>
              <Typography color="#9146FF">{column.name}</Typography>
              <Droppable droppableId={column.id.toString()}>
                {(provided) => (
                  <Stack
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    spacing={1}
                    mt={1}
                    sx={{ minHeight: 100 }}
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
                        {(provided) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{ backgroundColor: '#222', p: 1, borderRadius: 2, color: '#fff', cursor: 'pointer' }}
                            onClick={() => navigate(`/tasks/${task.id}`)}
                          >
                            <Typography>{task.title}</Typography>
                          </Box>
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
    </Box>
  );
};

export default TaskBoard;
