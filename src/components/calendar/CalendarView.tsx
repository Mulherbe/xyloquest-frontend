// CalendarView.tsx
import {
  Box, Typography, ToggleButton, ToggleButtonGroup,
  IconButton, Stack, CircularProgress, Modal, Backdrop, Fade
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/fr';
import axios from 'axios';

import WeeklyCards from './WeeklyCards';
import MonthlyGrid from './MonthlyGrid';

dayjs.locale('fr');

export interface EventItem {
  id: number;
  title: string;
  date: string;
  description?: string;
  type?: string;
  completed_at?: string | null;
  status?: string;
}

const CalendarView = () => {
  const [mode, setMode] = useState<'weekly' | 'monthly'>('weekly');
  const [referenceDate, setReferenceDate] = useState<Dayjs>(dayjs());
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://xyloquest-backend.test/api/activities', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEvents(
          res.data.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            date: item.start_date,
            status: item.status,
            type: item.activity_type?.name ?? 'Autre',
            completed_at: item.completed_at,
          }))
        );
      } catch (err) {
        console.error('Erreur fetch activities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const handleModeChange = (_: any, newMode: any) => {
    if (newMode) setMode(newMode);
  };

  const handlePrev = () => {
    setReferenceDate(prev =>
      mode === 'weekly' ? prev.subtract(7, 'day') : prev.subtract(1, 'month')
    );
  };

  const handleNext = () => {
    setReferenceDate(prev =>
      mode === 'weekly' ? prev.add(7, 'day') : prev.add(1, 'month')
    );
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <Box mt={6}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Typography variant="h6" color="#fff">
          {mode === 'weekly'
            ? `Semaine du ${referenceDate.format('D MMM YYYY')}`
            : referenceDate.format('MMMM YYYY')}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1}>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleModeChange}
            size="small"
            sx={{
              backgroundColor: '#1e1e1e',
              border: '1px solid #9146FF66',
              '& .Mui-selected': {
                backgroundColor: '#9146FF',
                color: '#fff',
              },
            }}
          >
            <ToggleButton value="weekly">7 jours</ToggleButton>
            <ToggleButton value="monthly">Mois</ToggleButton>
          </ToggleButtonGroup>
          <IconButton onClick={handlePrev} sx={{ color: '#9146FF' }}><ArrowBackIcon /></IconButton>
          <IconButton onClick={handleNext} sx={{ color: '#9146FF' }}><ArrowForwardIcon /></IconButton>
        </Stack>
      </Stack>

      {loading ? (
        <Box textAlign="center" py={4}>
          <CircularProgress sx={{ color: '#9146FF' }} />
        </Box>
      ) : mode === 'weekly' ? (
        <WeeklyCards
          referenceDate={referenceDate}
          events={events}
          onPrev={handlePrev}
          onNext={handleNext}
          onEventClick={setSelectedEvent}
        />
      ) : (
        <MonthlyGrid
          currentMonth={referenceDate}
          events={events}
          onPrev={handlePrev}
          onNext={handleNext}
          onEventClick={setSelectedEvent}
        />
      )}

      {/* Modal uniforme pour tous les modes */}
      <Modal open={!!selectedEvent} onClose={handleCloseModal} closeAfterTransition slots={{ backdrop: Backdrop }} slotProps={{ backdrop: { timeout: 500 } }}>
        <Fade in={!!selectedEvent}>
          <Box sx={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: '#2a2a2a', color: '#fff',
            boxShadow: 24, p: 4, borderRadius: 2,
            minWidth: 300, maxWidth: 400
          }}>
            <Typography variant="h6" mb={1}>
              {selectedEvent?.title}
            </Typography>
            <Typography variant="body2" mb={2}>
              {selectedEvent?.description || 'Aucune description.'}
            </Typography>
            <Typography variant="caption">
              Statut : <strong style={{ color: '#9146FF' }}>{selectedEvent?.status || 'non défini'}</strong>
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default CalendarView;
