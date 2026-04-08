import { BrowserRouter, Routes, Route } from "react-router-dom";




// Core Pages (Block 2)

import { BookAppointment } from "./pages/BookAppointment";
import { AppointmentDetails } from "./pages/AppointmentDetails";
// Core Pages (Block 3)


export function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        

        {/* Dashboard Routes */}
        
          
          <Route path="/book" element={<BookAppointment />} />
          <Route path="/appointments/:id" element={<AppointmentDetails />} />
          

        
      </Routes>
    </BrowserRouter>
  );
}
