import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Trip from './pages/Trip'

import { AuthProvider } from './context/AuthContext'
import Register from './pages/Register'
import SingleTrip from './pages/SingleTrip'
import Reservation from './pages/Reservation'


function App() {

  return (
    
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/trip' element={<Trip />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/trip/:tripId' element={<SingleTrip />} />
            <Route path="/reservations/:tripId" element={<Reservation />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    
  )
}

export default App
