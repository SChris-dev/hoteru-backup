import React from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

// css
import './Global.css';

// imports
import Master from './Master';
import NotFoundPage from './pages/NotFound';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

// user imports
import Dashboard from './pages/Dashboard';
import RoomsPage from './pages/RoomsPage';
import Reservations from './pages/Reservations';
import ReservationsHistory from './pages/ReservationsHistory';
import Transactions from './pages/Transactions';
import TransactionsHistory from './pages/TransactionsHistory';
import TransactionsDetail from './pages/TransactionsDetail';
import UpdateProfile from './pages/UpdateProfile';

// admin imports
import Admin from './Admin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminRooms from './pages/admin/AdminRooms';
import AdminReservations from './pages/admin/AdminReservations';
import AdminTransactions from './pages/admin/AdminTransactions';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='' element={<Master/>}>
            <Route path='' element={<LandingPage/>}></Route>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/register' element={<Register/>}></Route>
            <Route path='/dashboard' element={<Dashboard/>}></Route>
            <Route path='/dashboard/updateprofile' element={<UpdateProfile/>}></Route>
            <Route path='/rooms' element={<RoomsPage/>}></Route>
            <Route path='/reservations' element={<ReservationsHistory/>}></Route>
            <Route path='/transactions' element={<TransactionsHistory/>}></Route>
            <Route path='/reservations/:id' element={<Reservations/>}></Route>
            <Route path='/transactions/:id' element={<Transactions/>}></Route>
            <Route path='/transactions/details/:transactionId' element={<TransactionsDetail/>}></Route>
            <Route path='/*' element={<NotFoundPage/>}></Route>
          </Route>
          <Route path='/admin' element={<Admin/>}>
            <Route path='dashboard' element={<AdminDashboard/>}></Route>
            <Route path='users' element={<AdminUsers/>}></Route>
            <Route path='rooms' element={<AdminRooms/>}></Route>
            <Route path='reservations' element={<AdminReservations/>}></Route>
            <Route path='transactions' element={<AdminTransactions/>}></Route>
          </Route>
          
        </Routes>
      </Router>
    </>
  )
}

export default App
