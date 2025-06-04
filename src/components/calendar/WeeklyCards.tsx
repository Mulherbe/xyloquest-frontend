import { Box, Typography, Stack } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import type { EventItem } from './types';

dayjs.extend(utc);

interface WeeklyCardsProps {
  referenceDate: Dayjs;
  events: EventItem[];
  onPrev: () => void;
  onNext: () => void;
  onEventClick: (event: EventItem) => void;
  onDayClick: (day: Dayjs) => void;
}

const HOUR_HEIGHT = 30;
const START_HOUR = 6;
const END_HOUR = 23;
const HOURS = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => i + START_HOUR);
const totalHeight = HOURS.length * HOUR_HEIGHT;

const WeeklyCards = ({
  referenceDate,
  events,
  onEventClick,
  onDayClick,
}: WeeklyCardsProps) => {
  const days = Array.from({ length: 7 }, (_, i) =>
    referenceDate.startOf('week').add(i, 'day')
  );

  const getEventsForDay = (day: Dayjs) =>
    events.filter((e) => dayjs.utc(e.start_date).local().isSame(day, 'day'));

  const getTopOffset = (rawStart: string) => {
    const start = dayjs.utc(rawStart);
    const hour = start.hour();
    const minute = start.minute();
    if (hour < START_HOUR || hour > END_HOUR) return -9999;
    return (hour - START_HOUR) * HOUR_HEIGHT + (minute / 60) * HOUR_HEIGHT;
  };

  const getEventHeight = (rawStart: string, rawEnd: string) => {
    let start = dayjs.utc(rawStart);
    let end = dayjs.utc(rawEnd);

    if (start.hour() < START_HOUR) start = start.set('hour', START_HOUR).set('minute', 0);
    if (end.hour() > END_HOUR) end = end.set('hour', END_HOUR + 1).set('minute', 0);

    const minutes = end.diff(start, 'minute');
    return (minutes / 60) * HOUR_HEIGHT;
  };

  return (
    <Box
      sx={{
        width: '90vw',
        position: 'relative',
        left: '50%',
        marginLeft: '-45vw',
        px: 2,
        mb: 4,
        overflowX: 'auto',
        overflowY: 'hidden',
      }}
    >
      <Stack direction="row" spacing={1} alignItems="flex-start">
        {/* Colonne des heures */}
        <Box sx={{ width: 60, pt: 6, pr: 1, color: '#777' }}>
          {HOURS.map((h) => (
            <Box
              key={h}
              sx={{
                height: HOUR_HEIGHT,
                fontSize: '0.75rem',
                textAlign: 'right',
                pr: 1,
                borderTop: '1px solid #2a2a2a',
              }}
            >
              {`${h.toString().padStart(2, '0')}h`}
            </Box>
          ))}
        </Box>

        {/* Colonnes des jours */}
        {days.map((day) => {
          const isToday = day.isSame(dayjs(), 'day');
          const eventsOfDay = getEventsForDay(day);

          return (
            <Box
              key={day.toISOString()}
              sx={{
                flex: 1,
                borderLeft: '1px solid #333',
                borderRight: '1px solid #333',
                backgroundColor: '#1e1e1e',
                borderRadius: 2,
                minWidth: 140,
                cursor: 'pointer',
              }}
              onClick={() => onDayClick(day)}
            >
              {/* En-tête du jour */}
              <Box sx={{ textAlign: 'center', py: 1 }}>
                <Typography variant="caption" color="#aaa">
                  {day.format('dddd')}
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: isToday ? '#9146FF' : '#fff',
                    fontWeight: isToday ? 'bold' : 'normal',
                  }}
                >
                  {day.format('D MMM')}
                </Typography>
              </Box>

              {/* Conteneur relatif lignes + events */}
              <Box sx={{ position: 'relative', height: totalHeight }}>
                {/* Lignes horaires */}
                {HOURS.map((h, i) => (
                  <Box
                    key={h}
                    sx={{
                      height: HOUR_HEIGHT,
                      borderTop: '0.1px solid rgba(42, 42, 42, 0.27)',
                      width: '100%',
                      // backgroundColor: i % 2 === 0 ? '#1b1b1b' : 'transparent', // Optionnel
                    }}
                  />
                ))}

                {/* Événements */}
                {eventsOfDay.map((event) => {
                  const top = getTopOffset(event.start_date);
                  const height = getEventHeight(event.start_date, event.end_date);
                  if (top < 0 || height <= 0) return null;

                  return (
                    <Box
                      key={event.id}
                      data-event="true"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      sx={{
                        position: 'absolute',
                        top,
                        left: '10%',
                        width: '80%',
                        height,
                        backgroundColor: event.color || '#9146FF',
                        borderRadius: '12px',
                        padding: '4px 8px',
                        fontSize: '0.75rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: '#fff',
                        border: `2px solid ${
                          event.status === 'done'
                            ? '#4caf50'
                            : event.status === 'skipped'
                            ? '#f44336'
                            : '#9146FFAA'
                        }`,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                        '&:hover': {
                          opacity: 0.9,
                        },
                      }}
                    >
                      {event.title}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default WeeklyCards;
