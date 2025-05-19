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
  onDayClick: (day: Dayjs) => void;
}

const MonthlyGrid = ({
  currentMonth,
  events,
  onPrev,
  onNext,
  onEventClick,
  onDayClick,
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

  const getBorderColor = (status?: string) => {
    switch (status) {
      case 'done': return '#4caf50';
      case 'skipped': return '#f44336';
      default: return '#9146FF66';
    }
  };

  return (
    <Box sx={{ px: 3 }}>
      {/* Navigation */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} px={1}>
        <IconButton onClick={onPrev} sx={{ color: '#9146FF' }}><ArrowBackIcon /></IconButton>
        <Typography color="#fff" variant="h6">
          {currentMonth.format('MMMM YYYY')}
        </Typography>
        <IconButton onClick={onNext} sx={{ color: '#9146FF' }}><ArrowForwardIcon /></IconButton>
      </Stack>

      {/* Jours de la semaine */}
      <Grid container spacing={2} sx={{ mb: 1 }}>
        {weekdays.map((dayName) => (
          <Grid item xs={12 / 7} key={dayName}>
            <Typography align="center" sx={{ color: '#bbb' }}>{dayName}</Typography>
          </Grid>
        ))}
      </Grid>

      {/* Grille du mois */}
      <Grid container spacing={2}>
        {days.map((day) => {
          const dayEvents = events
            .filter((e): e is EventItem => !!e && typeof e.date === 'string')
            .filter((e) => dayjs(e.date).isValid() && dayjs(e.date).isSame(day, 'day'));

          const isCurrentMonth = day.month() === currentMonth.month();
          const isToday = day.isSame(dayjs(), 'day');

          return (
            <Grid item xs={12 / 7} key={day.toString()}>
              <Paper
                elevation={2}
                onClick={(e) => {
                  if ((e.target as HTMLElement).dataset.event === 'true') return;
                  onDayClick(day);
                }}
                sx={{
                  height: 180,
                  backgroundColor: isToday
                    ? '#29164a'
                    : isCurrentMonth ? '#1e1e1e' : '#151515',
                  border: isToday ? '2px solid #9146FF' : '1px solid #333',
                  borderRadius: 2,
                  p: 1,
                  color: '#fff',
                  overflowY: 'auto',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#252525',
                  },
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
                      data-event="true"
                      variant="body2"
                      onClick={() => onEventClick(event)}
                      sx={{
                        border: `1px solid ${getBorderColor(event.status)}`,
                        backgroundColor: `${event.color ?? '#9146FF'}4D`,
                        color: '#fff',
                        borderRadius: 1,
                        px: 1,
                        py: 0.5,
                        mb: 0.5,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        '&:hover': {
                          backgroundColor: `${event.color ?? '#9146FF'}33`,
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
