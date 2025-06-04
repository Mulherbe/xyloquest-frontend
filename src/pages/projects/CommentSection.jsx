import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import axios from 'axios';

const CommentSection = ({ taskId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchComments = () => {
    axios.get(`http://xyloquest-backend.test/api/tasks/${taskId}/task-comments`, { headers }).then(res => setComments(res.data.data));
  };

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  const addComment = () => {
    axios.post('http://xyloquest-backend.test/api/task-comments', { task_id: taskId, content: text }, { headers }).then(() => {
      setText('');
      fetchComments();
    });
  };

  return (
    <Box mt={4}>
      <Typography variant="h6" color="#fff" gutterBottom>
        Commentaires
      </Typography>
      <Stack spacing={2}>
        {comments.map(c => (
          <Box key={c.id} sx={{ color: '#ccc' }}>
            <Typography variant="body2">{c.user?.name ?? 'Utilisateur'} :</Typography>
            <Typography variant="body1">{c.content}</Typography>
          </Box>
        ))}
        <TextField
          multiline
          rows={3}
          fullWidth
          label="Ajouter un commentaire"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <Button onClick={addComment} variant="contained" sx={{ backgroundColor: '#9146FF', color: '#fff' }}>
          Commenter
        </Button>
      </Stack>
    </Box>
  );
};

export default CommentSection;
