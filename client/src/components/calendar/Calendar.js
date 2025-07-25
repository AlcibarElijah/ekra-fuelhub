import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { debounce } from 'lodash';
import './calendar.css';

/**
 * Calendar - A flexible and feature-rich calendar component for displaying events
 *
 * @param {Object} props - Component props
 * @param {Array} [props.events] - Array of event objects to display (alternative to onFetch)
 * @param {Function} [props.onFetch] - Function to fetch events for a date range (startDate, endDate)
 * @param {Function} [props.onDateClick] - Callback when a date is clicked
 * @param {Function} [props.onEventClick] - Callback when an event is clicked
 * @param {Date} [props.selectedDate=new Date()] - Currently selected date
 * @param {boolean} [props.showWeekNumbers=false] - Whether to show week numbers
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {Function} [props.eventRenderer] - Custom event renderer function
 * @param {boolean} [props.isLoading=false] - External loading state
 * @param {number} [props.debounceDelay=1000] - Debounce delay for navigation fetch calls in milliseconds
 * @returns {JSX.Element} Calendar component
 */

const Calendar = ({
  events,
  onFetch,
  onDateClick,
  onEventClick,
  selectedDate = new Date(),
  showWeekNumbers = false,
  className = '',
  eventRenderer = null,
  isLoading = false,
  debounceDelay = 1000,
}) => {
  /* ------------------------------------------------------------------------ */
  /*                                  errors                                  */
  /* ------------------------------------------------------------------------ */
  if (events === null && onFetch === null)
    throw new Error(
      'Either "events" or "onFetch" must be provided to the Calendar component.'
    );

  const [currentMonth, setCurrentMonth] = useState(selectedDate);
  const [fetchedEvents, setFetchedEvents] = useState(null);
  const [stateIsLoading, setStateIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Calculate calendar grid
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  }, [currentMonth]);

  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped = {};
    const currentEvents = events || fetchedEvents || [];
    currentEvents.forEach((event) => {
      const dateKey = format(new Date(event.date), 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    return grouped;
  }, [events, fetchedEvents]);

  // Navigation handlers
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  // Event handlers
  const handleDateClick = (date) => {
    if (onDateClick) {
      onDateClick(date);
    }
  };

  const handleEventClick = (event, e) => {
    e.stopPropagation();
    if (onEventClick) {
      onEventClick(event);
    }
  };

  // Regular fetchEvents function for initial load
  const fetchEvents = useCallback(
    async (startDate, endDate) => {
      try {
        setStateIsLoading(true);
        if (onFetch) {
          const fetched = await onFetch(startDate, endDate);
          setFetchedEvents(fetched);
        }
      } catch (error) {
        console.error('Calendar fetch error:', error);
      } finally {
        setStateIsLoading(false);
      }
    },
    [onFetch]
  );

  // Create debounced fetchEvents function for navigation
  const debouncedFetchEvents = useCallback(
    debounce(async (startDate, endDate) => {
      try {
        setStateIsLoading(true);
        if (onFetch) {
          const fetched = await onFetch(startDate, endDate);
          setFetchedEvents(fetched);
        }
      } catch (error) {
        console.error('Calendar fetch error:', error);
      } finally {
        setStateIsLoading(false);
      }
    }, debounceDelay),
    [onFetch, debounceDelay]
  );

  useEffect(() => {
    if (onFetch && calendarDays.length > 0) {
      if (isInitialLoad) {
        // Use regular fetch for initial load
        fetchEvents(calendarDays[0], calendarDays[calendarDays.length - 1]);
        setIsInitialLoad(false);
      } else {
        // Use debounced fetch for navigation
        debouncedFetchEvents(
          calendarDays[0],
          calendarDays[calendarDays.length - 1]
        );
      }
    }
  }, [currentMonth, calendarDays, isInitialLoad]);

  // Render individual day cell
  const renderDay = (day) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const dayEvents = eventsByDate[dateKey] || [];
    const isCurrentMonth = isSameMonth(day, currentMonth);
    const isSelected = isSameDay(day, selectedDate);
    const isTodayDate = isToday(day);

    return (
      <div
        key={day.toString()}
        className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${
          isSelected ? 'selected' : ''
        } ${isTodayDate ? 'today' : ''}`}
        onClick={() => handleDateClick(day)}
      >
        <div className='day-number'>{format(day, 'd')}</div>
        <div className='day-events'>
          {dayEvents.map((event, index) => (
            <div
              key={event.id || index}
              className={`event ${event.type || 'default'}`}
              onClick={(e) => handleEventClick(event, e)}
              title={event.title}
            >
              {eventRenderer ? (
                eventRenderer(event)
              ) : (
                <span className='event-title'>{event.title}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`calendar ${className}`}>
      {/* Calendar Header */}
      <div className='calendar-header'>
        <button
          className='nav-button'
          onClick={prevMonth}
          title='Previous Month'
        >
          &#8249;
        </button>
        <h2 className='month-year'>
          {format(currentMonth, 'MMMM yyyy')}
          {/* Loading Indicator */}
          {(isLoading || stateIsLoading) && (
            <span className='loading-indicator' title='Loading events...'>
              <div className='loading-dot'></div>
            </span>
          )}
        </h2>
        <button className='nav-button' onClick={nextMonth} title='Next Month'>
          &#8250;
        </button>
        <button className='today-button' onClick={goToToday}>
          Today
        </button>
      </div>

      {/* Days of Week Header */}
      <div className='calendar-grid'>
        <div
          className={`days-header ${
            showWeekNumbers ? 'with-week-numbers' : ''
          }`}
        >
          {showWeekNumbers && <div className='week-number-header'>Wk.</div>}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className='day-header'>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Body */}
        <div className='days-grid'>
          {Array.from(
            { length: Math.ceil(calendarDays.length / 7) },
            (_, weekIndex) => (
              <div
                key={weekIndex}
                className={`week-row ${
                  showWeekNumbers ? 'with-week-numbers' : ''
                }`}
              >
                {showWeekNumbers && (
                  <div className='week-number'>
                    {format(calendarDays[weekIndex * 7], 'w')}
                  </div>
                )}
                {calendarDays
                  .slice(weekIndex * 7, (weekIndex + 1) * 7)
                  .map(renderDay)}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
