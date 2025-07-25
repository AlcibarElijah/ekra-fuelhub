/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { Routes, Route } from 'react-router-dom';

/* ------------------------------- components ------------------------------- */
import SidebarNav from '../../components/nav/SidebarNav';
import MainContent from '../../components/MainContent';
import FuelDeliveryForm from './components/FuelDeliveryForm';
import FuelDeliveryList from './components/FuelDeliveryList';

const FuelDeliveryManagement = () => {
  const sidebarItems = [
    {
      label: 'Create Fuel Delivery',
      path: '/fuel/delivery/create',
    },
    {
      label: 'Manage Fuel Deliveries',
      path: '/fuel/delivery/list',
    },
  ];

  return (
    <div className='container mt-4'>
      <div className='row'>
        <SidebarNav items={sidebarItems} />
        <MainContent>
          <Routes>
            <Route path='/create' element={<FuelDeliveryForm />} />
            <Route path='/list' element={<FuelDeliveryList />} />
            <Route path='/edit/:id' element={<FuelDeliveryForm />} />
          </Routes>
        </MainContent>
      </div>
    </div>
  );
};

export default FuelDeliveryManagement;
