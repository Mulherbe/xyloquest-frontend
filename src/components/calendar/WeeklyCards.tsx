// WeeklyCards.tsx
import {
  Box, Typography, Paper, IconButton, Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import dayjs, { Dayjs } from 'dayjs';
import type { EventItem } from './types';

interface WeeklyCardsProps {
  referenceDate: Dayjs;
  events: EventItem[];
  onPrev: () => void;
  onNext: () => void;
  onEventClick: (event: EventItem) => void;
}

const WeeklyCards = ({
  referenceDate,
  events,
  onPrev,
  onNext,
  onEventClick,
}: WeeklyCardsProps) => {
  const days = Array.from({ length: 7 }, (_, i) =>
    referenceDate.startOf('week').add(i, 'day')
  );

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} px={1}>
        <IconButton onClick={onPrev} sx={{ color: '#9146FF' }}><ArrowBackIcon /></IconButton>
        <Typography color="#fff">
          Semaine du {referenceDate.startOf('week').format('D MMM YYYY')}
        </Typography>
        <IconButton onClick={onNext} sx={{ color: '#9146FF' }}><ArrowForwardIcon /></IconButton>
      </Stack>

      <Stack direction="row" spacing={2}>
        {days.map((day) => {
          const dayEvents = events.filter((e) => dayjs(e.date).isSame(day, 'day'));
          const isToday = day.isSame(dayjs(), 'day');

          return (
            <Paper
              key={day.toISOString()}
              elevation={3}
              sx={{
                backgroundColor: isToday ? '#29164a' : '#1e1e1e',
                border: isToday ? '2px solid #9146FF' : '1px solid #9146FF66',
                flex: 1, borderRadius: 2, p: 2, textAlign: 'center', color: '#fff'
              }}
            >
              <Typography variant="subtitle2" color="#aaa">{day.format('dddd')}</Typography>
              <Typography variant="h6" color="#9146FF">{day.format('D MMM')}</Typography>

              <Box mt={2}>
                {dayEvents.length > 0 ? (
                  dayEvents.map((event) => (
                    <Typography
                      key={event.id}
                      variant="body2"
                      onClick={() => onEventClick(event)}
                      sx={{
                        backgroundColor: '#9146FF22',
                        borderRadius: 1,
                        px: 1,
                        py: 0.5,
                        mb: 1,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: '#9146FF44' },
                      }}
                    >
                      {event.title}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="caption" color="#777">Rien de prévu</Typography>
                )}
              </Box>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
};

export default WeeklyCards;
