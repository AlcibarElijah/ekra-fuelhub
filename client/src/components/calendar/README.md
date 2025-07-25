# Calendar Component Documentation

## Overview
The Calendar component is a generic, reusable calendar that displays events and provides interactive date navigation. It's built with React and uses `date-fns` for date manipulation.

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `events` | Array | `[]` | No | Array of event objects to display on the calendar |
| `onDateClick` | Function | `undefined` | No | Callback function when a date is clicked |
| `onEventClick` | Function | `undefined` | No | Callback function when an event is clicked |
| `selectedDate` | Date | `new Date()` | No | Currently selected date |
| `showWeekNumbers` | Boolean | `false` | No | Whether to show week numbers |
| `className` | String | `''` | No | Additional CSS classes |
| `eventRenderer` | Function | `null` | No | Custom function to render events |

## Events Array Structure

The `events` prop should be an array of event objects. Each event object should follow this structure:

### Required Properties

```javascript
{
  id: String | Number,    // Unique identifier for the event
  date: String,           // Date in 'YYYY-MM-DD' format (ISO 8601)
  title: String           // Display title for the event
}
```

### Optional Properties

```javascript
{
  type: String,           // Event type for styling (see Event Types below)
  status: String,         // Event status for additional context
  description: String,    // Additional event description
  time: String,          // Time information (e.g., "09:00 AM")
  duration: Number,      // Duration in minutes
  location: String,      // Event location
  category: String,      // Event category
  priority: String,      // Event priority level
  // ... any other custom properties
}
```

## Event Types (for styling)

The `type` property determines the color scheme of the event badge:

| Type | Color | Use Case |
|------|-------|----------|
| `'default'` | Gray | Default/neutral events |
| `'primary'` | Blue | Important/primary events |
| `'secondary'` | Gray | Secondary events |
| `'success'` | Green | Completed/successful events |
| `'danger'` | Red | Urgent/error events |
| `'warning'` | Yellow | Warning/pending events |
| `'info'` | Cyan | Informational events |
| `'light'` | Light gray | Light emphasis events |
| `'dark'` | Dark gray | Dark emphasis events |

## Example Events Array

```javascript
const events = [
  {
    id: 1,
    date: '2025-08-16',
    title: 'Fuel Delivery - Diesel',
    type: 'success',
    status: 'delivered',
    description: 'Regular diesel delivery completed',
    time: '09:00 AM',
    duration: 120,
    location: 'Tank A-1',
    category: 'delivery',
    priority: 'medium'
  },
  {
    id: 2,
    date: '2025-08-18',
    title: 'Tank Reading',
    type: 'info',
    status: 'scheduled',
    description: 'Monthly tank level reading',
    time: '02:00 PM',
    duration: 30,
    location: 'All Tanks',
    category: 'maintenance',
    priority: 'low'
  },
  {
    id: 3,
    date: '2025-08-20',
    title: 'Emergency Delivery',
    type: 'danger',
    status: 'urgent',
    description: 'Emergency fuel delivery required',
    time: 'ASAP',
    location: 'Tank B-2',
    category: 'emergency',
    priority: 'high'
  },
  {
    id: 4,
    date: '2025-08-22',
    title: 'Maintenance Check',
    type: 'warning',
    status: 'pending',
    description: 'Routine maintenance and inspection',
    time: '10:00 AM',
    duration: 180,
    location: 'Pump Station',
    category: 'maintenance',
    priority: 'medium'
  }
];
```

## Callback Functions

### onDateClick Function
```javascript
const handleDateClick = (date) => {
  // date is a JavaScript Date object
  console.log('Selected date:', date);
  // Example: Navigate to day view, show events for this date, etc.
};
```

### onEventClick Function
```javascript
const handleEventClick = (event) => {
  // event is the complete event object
  console.log('Clicked event:', event);
  // Example: Open event details, navigate to edit form, etc.
};
```

## Custom Event Renderer

You can provide a custom function to render events with the `eventRenderer` prop:

```javascript
const customEventRenderer = (event) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return '✓';
      case 'pending': return '⏳';
      case 'urgent': return '🚨';
      default: return '';
    }
  };

  return (
    <span className="custom-event">
      <span className="event-icon">{getStatusIcon(event.status)}</span>
      <span className="event-text">{event.title}</span>
      {event.time && <span className="event-time">@{event.time}</span>}
    </span>
  );
};
```

## Usage Examples

### Basic Usage
```javascript
import Calendar from './components/calendar/Calendar';

const MyComponent = () => {
  const events = [
    {
      id: 1,
      date: '2025-08-16',
      title: 'Meeting',
      type: 'primary'
    }
  ];

  return <Calendar events={events} />;
};
```

### Advanced Usage
```javascript
import Calendar from './components/calendar/Calendar';

const MyComponent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    // Load events for this date
  };

  const handleEventClick = (event) => {
    // Navigate to event details
    navigate(`/events/${event.id}`);
  };

  const customRenderer = (event) => (
    <div className="event-card">
      <strong>{event.title}</strong>
      <small>{event.time}</small>
    </div>
  );

  return (
    <Calendar
      events={events}
      selectedDate={selectedDate}
      onDateClick={handleDateClick}
      onEventClick={handleEventClick}
      showWeekNumbers={true}
      eventRenderer={customRenderer}
      className="my-custom-calendar"
    />
  );
};
```

## Date Format Requirements

- **Event dates** must be in `'YYYY-MM-DD'` format (ISO 8601 date string)
- **selectedDate** should be a JavaScript Date object
- **Internal processing** uses `date-fns` library for date manipulation

## CSS Customization

The calendar uses CSS classes that can be customized:

- `.calendar` - Main calendar container
- `.calendar-header` - Header with navigation
- `.calendar-day` - Individual day cells
- `.event` - Event badges
- `.event.{type}` - Event styling based on type

## Accessibility Features

- Keyboard navigation support
- Screen reader friendly
- Proper ARIA labels
- Focus management
- High contrast support

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires ES6+ support
- Uses CSS Grid (IE11+ with polyfill)

---

*For more examples and advanced usage, check the component source code and test files.*
