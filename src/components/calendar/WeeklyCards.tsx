import {
  Box,
  Typography,
  Paper,
  Stack,
} from '@mui/material';

import dayjs, { Dayjs } from 'dayjs';
import type { EventItem } from './types';

interface WeeklyCardsProps {
  referenceDate: Dayjs;
  events: EventItem[];
  onPrev: () => void;
  onNext: () => void;
  onEventClick: (event: EventItem) => void;
  onDayClick: (day: Dayjs) => void;
}

const WeeklyCards = ({
  referenceDate,
  events,
  onEventClick,
  onDayClick,
}: WeeklyCardsProps) => {
  const days = Array.from({ length: 7 }, (_, i) =>
    referenceDate.startOf('week').add(i, 'day')
  );

  const getBorderColor = (status?: string) => {
    switch (status) {
      case 'done':
        return '#4caf50';
      case 'skipped':
        return '#f44336';
      default:
        return '#9146FF66';
    }
  };

  return (
<Box
  sx={{
    width: '90vw',         // toute la largeur de la fenêtre
    position: 'relative',
    left: '50%',
    right: '50%',
    marginLeft: '-45vw',    // recentre à gauche
    marginRight: '-45vw',   // recentre à droite
    px: 4,                  // padding intérieur pour respirer
    mb: 4,
  }}
>
  <Stack direction="row" spacing={2}>
    {days.map((day) => {
      const dayEvents = events
        .filter((e): e is EventItem => !!e && typeof e.date === 'string')
        .filter((e) => dayjs(e.date).isValid() && dayjs(e.date).isSame(day, 'day'));

      const isToday = day.isSame(dayjs(), 'day');

      return (
        <Paper
          key={day.toISOString()}
          elevation={3}
          onClick={(e) => {
            if ((e.target as HTMLElement).dataset?.event === 'true') return;
            onDayClick(day);
          }}
          sx={{
            backgroundColor: isToday ? '#29164a' : '#1e1e1e',
            border: isToday ? '2px solid #9146FF' : '1px solid #9146FF66',
            flex: 1,
            minHeight: 380,
            borderRadius: 3,
            p: 3,
            textAlign: 'center',
            color: '#fff',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#252525',
            },
          }}
        >
          <Typography variant="subtitle2" color="#aaa">
            {day.format('dddd')}
          </Typography>
          <Typography variant="h6" color="#9146FF" sx={{ mb: 1 }}>
            {day.format('D MMM')}
          </Typography>

          <Box mt={2}>
            {dayEvents.length > 0 ? (
              dayEvents.map((event) => (
                <Typography
                  key={event.id}
                  data-event="true"
                  variant="body2"
                  onClick={() => onEventClick(event)}
                  sx={{
                    border: `1px solid ${getBorderColor(event.status)}`,
                    backgroundColor: `${event.color ?? '#9146FF'}`,
                    color: '#fff',
                    borderRadius: 1,
                    px: 1,
                    py: 0.5,
                    mb: 1,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: `${event.color ?? '#9146FF'}33`,
                    },
                  }}
                >
                  {event.title}
                </Typography>
              ))
            ) : (
              <Typography variant="caption" color="#777">
                Rien de prévu
              </Typography>
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
