import {
  Box, Typography, ToggleButton, ToggleButtonGroup,
  IconButton, Stack, CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/fr';

import WeeklyCards from './WeeklyCards';
import MonthlyGrid from './MonthlyGrid';
import ActivityModal from './ActivityModal';
import CreateActivityModal from './CreateActivityModal';
import { useActivities } from '../../contexts/ActivityContext';

dayjs.locale('fr');

const CalendarView = () => {
  const [mode, setMode] = useState<'weekly' | 'monthly'>('weekly');
  const [referenceDate, setReferenceDate] = useState<Dayjs>(dayjs());
  const [selectedEvent, setSelectedEvent] = useState<null | any>(null);
  const [createDate, setCreateDate] = useState<Dayjs | null>(null);

  const { events, loading, refetch } = useActivities();

  const handleModeChange = (_: unknown, newMode: 'weekly' | 'monthly') => {
    if (newMode) setMode(newMode);
  };

  const handlePrev = () => {
    setReferenceDate((prev) =>
      mode === 'weekly' ? prev.subtract(7, 'day') : prev.subtract(1, 'month')
    );
  };

  const handleNext = () => {
    setReferenceDate((prev) =>
      mode === 'weekly' ? prev.add(7, 'day') : prev.add(1, 'month')
    );
  };

  const handleDayClick = (day: Dayjs) => {
    setCreateDate(day);
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
          <IconButton onClick={handlePrev} sx={{ color: '#9146FF' }}>
            <ArrowBackIcon />
          </IconButton>
          <IconButton onClick={handleNext} sx={{ color: '#9146FF' }}>
            <ArrowForwardIcon />
          </IconButton>
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
          onDayClick={handleDayClick}
        />
      ) : (
        <MonthlyGrid
          currentMonth={referenceDate}
          events={events}
          onPrev={handlePrev}
          onNext={handleNext}
          onEventClick={setSelectedEvent}
          onDayClick={handleDayClick}
        />
      )}

      <ActivityModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      <CreateActivityModal
        open={!!createDate}
        defaultDate={createDate!}
        onClose={() => setCreateDate(null)}
        onCreated={() => {
          refetch();
          setCreateDate(null);
        }}
      />
    </Box>
  );
};

export default CalendarView;
