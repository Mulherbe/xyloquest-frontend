import { Box, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import type { EventItem } from './types';

dayjs.extend(utc);

interface MonthlyGridProps {
  referenceDate: Dayjs;
  events: EventItem[];
  onEventClick: (event: EventItem) => void;
  onDayClick: (day: Dayjs) => void;
}

const MonthlyGrid = ({
  referenceDate,
  events,
  onEventClick,
  onDayClick,
}: MonthlyGridProps) => {
  const startOfMonth = referenceDate.startOf('month');
  const startDay = startOfMonth.startOf('week');
  const days = Array.from({ length: 42 }, (_, i) => startDay.add(i, 'day')); // 6 semaines × 7 jours

  const getEventsForDay = (day: Dayjs) =>
    events.filter((e) => dayjs.utc(e.start_date).local().isSame(day, 'day'));

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 1,
        px: 2,
        width: '100%',
      }}
    >
      {days.map((day) => {
        const isToday = day.isSame(dayjs(), 'day');
        const isCurrentMonth = day.month() === referenceDate.month();
        const eventsOfDay = getEventsForDay(day);

        return (
          <Box
            key={day.toISOString()}
            sx={{
              backgroundColor: isCurrentMonth ? '#1e1e1e' : '#121212',
              border: '1px solid #333',
              borderRadius: 2,
              padding: 1,
              minHeight: 100,
              cursor: 'pointer',
              position: 'relative',
              '&:hover': {
                backgroundColor: '#2a2a2a',
              },
            }}
            onClick={() => onDayClick(day)}
          >
            <Typography
              variant="caption"
              sx={{
                color: isToday ? '#9146FF' : '#aaa',
                fontWeight: isToday ? 'bold' : 'normal',
              }}
            >
              {day.format('D')}
            </Typography>

            {eventsOfDay.map((event) => (
              <Box
                key={event.id}
                data-event="true"
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick(event);
                }}
                sx={{
                  mt: 0.5,
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  backgroundColor: event.color || '#9146FF',
                  color: '#fff',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  border: `2px solid ${
                    event.status === 'done'
                      ? '#4caf50'
                      : event.status === 'skipped'
                      ? '#f44336'
                      : '#9146FFAA'
                  }`,
                  boxShadow: '0 0 4px #000',
                  '&:hover': {
                    opacity: 0.9,
                  },
                }}
              >
                {event.title}
              </Box>
            ))}
          </Box>
        );
      })}
    </Box>
  );
};

export default MonthlyGrid;
