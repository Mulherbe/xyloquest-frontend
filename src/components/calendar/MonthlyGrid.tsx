// MonthlyGrid.tsx
import {
  Typography, Paper, Grid, Stack, IconButton, Box
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import dayjs, { Dayjs } from 'dayjs';
import type { EventItem } from './types';

interface MonthlyGridProps {
  currentMonth: Dayjs;
  events: EventItem[];
  onPrev: () => void;
  onNext: () => void;
  onEventClick: (event: EventItem) => void;
}

const MonthlyGrid = ({
  currentMonth,
  events,
  onPrev,
  onNext,
  onEventClick,
}: MonthlyGridProps) => {
  const startOfGrid = currentMonth.startOf('month').startOf('week');
  const endOfGrid = currentMonth.endOf('month').endOf('week');
  const days: Dayjs[] = [];

  let day = startOfGrid;
  while (day.isBefore(endOfGrid) || day.isSame(endOfGrid)) {
    days.push(day);
    day = day.add(1, 'day');
  }

  const weekdays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} px={1}>
        <IconButton onClick={onPrev} sx={{ color: '#9146FF' }}><ArrowBackIcon /></IconButton>
        <Typography color="#fff" variant="h6">
          {currentMonth.format('MMMM YYYY')}
        </Typography>
        <IconButton onClick={onNext} sx={{ color: '#9146FF' }}><ArrowForwardIcon /></IconButton>
      </Stack>

      <Grid container spacing={2} sx={{ mb: 1 }}>
        {weekdays.map((dayName) => (
          <Grid item xs={12 / 7} key={dayName}>
            <Typography align="center" sx={{ color: '#bbb' }}>{dayName}</Typography>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        {days.map((day) => {
          const dayEvents = events.filter((e) => dayjs(e.date).isSame(day, 'day'));
          const isCurrentMonth = day.month() === currentMonth.month();
          const isToday = day.isSame(dayjs(), 'day');

          return (
            <Grid item xs={12 / 7} key={day.toString()}>
              <Paper
                elevation={2}
                sx={{
                  height: 120,
                  backgroundColor: isToday
                    ? '#29164a'
                    : isCurrentMonth ? '#1e1e1e' : '#151515',
                  border: isToday ? '2px solid #9146FF' : '1px solid #333',
                  borderRadius: 2,
                  p: 1,
                  color: '#fff',
                  overflowY: 'auto',
                }}
              >
                <Typography
                  variant="subtitle2"
                  color={isCurrentMonth ? '#9146FF' : '#666'}
                  sx={{ mb: 1 }}
                >
                  {day.format('D MMM')}
                </Typography>

                {dayEvents.length > 0 ? (
                  dayEvents.map((event) => (
                    <Typography
                      key={event.id}
                      variant="caption"
                      onClick={() => onEventClick(event)}
                      sx={{
                        display: 'block',
                        fontSize: '0.75rem',
                        backgroundColor:
                          event.status === 'done'
                            ? '#2e7d32'
                            : event.status === 'failed'
                            ? '#c62828'
                            : '#9146FF22',
                        color:
                          event.status === 'done'
                            ? '#a5d6a7'
                            : event.status === 'failed'
                            ? '#ef9a9a'
                            : '#ccc',
                        px: 0.5,
                        borderRadius: 1,
                        mb: 0.5,
                        cursor: 'pointer',
                        '&:hover': {
                          opacity: 0.8,
                        },
                      }}
                    >
                      {event.title}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="caption" color="#555">—</Typography>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default MonthlyGrid;
