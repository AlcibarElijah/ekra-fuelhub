/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { useCallback } from 'react';
import { formatDateToInputReadableString } from '../../../functions/utils';

/* ------------------------------- components ------------------------------- */
import Calendar from '../../../components/calendar/Calendar';

/* ---------------------------------- hooks --------------------------------- */
import { useFuelTankDeliveryService } from '../../../hooks/useFuelTankDeliveryService';
import { useNavigate } from 'react-router-dom';

/* --------------------------------- styles --------------------------------- */
import './FuelDeliveryList.css';

// Edit button component for each row
// const EditButton = ({ onClick, disabled }) => (
//   <button
//     className='btn btn-primary btn-sm'
//     onClick={onClick}
//     disabled={disabled}
//   >
//     Edit
//   </button>
// );

const FuelDeliveryList = () => {
  const navigate = useNavigate();

  const { getFuelDeliveries } = useFuelTankDeliveryService();

  /* ------------------------------- functions ------------------------------ */
  const onFetch = useCallback(async (startDate, endDate) => {
    const { deliveries } = await getFuelDeliveries({
      startDate,
      endDate,
    });

    const parsedDeliveries = deliveries.map((delivery) => {
      const getType = (status) => {
        switch (status) {
          case 'delivered':
            return 'success';
          case 'pending':
            return 'warning';
          case 'approved':
            return 'primary';
          case 'cancelled':
            return 'danger';
          default:
            return 'info';
        }
      };

      return {
        id: delivery._id,
        date: formatDateToInputReadableString(delivery.deliveryDate),
        title: 'Fuel Delivery',
        type: getType(delivery.status),
      };
    });
    return parsedDeliveries;
  }, []);

  const handleEventClick = useCallback((delivery) => {
    navigate(`/fuel/delivery/edit/${delivery.id}`);
  }, []);

  const handleDateClick = useCallback((date) => {
    navigate(
      `/fuel/delivery/create?dateOrdered=${formatDateToInputReadableString(
        date
      )}`
    );
  }, []);

  /* ------------------------------ useEffects ------------------------------ */

  return (
    <div>
      <h3 className='mb-4'>Fuel Delivery Calendar</h3>

      {/* Legend */}
      <div className='mb-3'>
        <span className='badge bg-success me-2'>Delivered</span>
        <span className='badge bg-warning me-2'>Pending</span>
        <span className='badge bg-primary me-2'>Approved</span>
        <span className='badge bg-danger me-2'>Cancelled</span>
      </div>

      {/* Calendar with mock events */}
      <Calendar
        onFetch={onFetch}
        onDateClick={handleDateClick}
        onEventClick={handleEventClick}
        selectedDate={new Date()}
        showWeekNumbers={true}
        className='fuel-delivery-calendar'
        debounceDelay={700}
      />
    </div>
  );
};

export default FuelDeliveryList;
