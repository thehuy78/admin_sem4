//lib
import { CookiesProvider, useCookies } from "react-cookie";
import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect } from "react";
import 'react-notifications/lib/notifications.css';
//provider
import ProtectedRoute from "./shared/function/ProtectedRoute";
import { LayoutProvider } from "./shared/hook/Layout/LayoutContext";
import LayoutSwitch from "./shared/hook/Layout/LayoutSwitch";
import { ContextToken } from "./shared/hook/ContextToken";
//page
import Dashboard from "./features/Dashboard/page/Dashboard";
import Aboutus from "./features/Aboutus/page/Aboutus";
import FileNotFound from "./shared/Config/FileNotFound";
import Auth from "./features/Auth/page/Auth";
import ListHospital from "./features/Hospital/page/ListHospital";
import CreateHospital from "./features/Hospital/page/CreateHospital";
//css
import "./shared/layout/style/Main.scss"
import ListDepartment from "./features/Department/page/ListDepartment";
import ListDoctor from "./features/Doctor/page/ListDoctor";
import ListBooking from "./features/Booking/page/ListBooking";



import "./Test.scss"
import ListAccountCustomer from "./features/Account/page/ListAccountCustomer";
import ListAccountAdmin from "./features/Account/page/ListAccountAdmin";
import SelectService from "./features/Hospital/page/SelectService";
import ListPackage from "./features/Package/page/ListPackage";
import ListTesting from "./features/Testing/page/ListTesting";
import ListVaccine from "./features/Vaccine/page/ListVaccine";
import BookingDetails from "./features/Booking/page/BookingDetails";
import Analysis from "./features/Analysis/page/Analysis";




function App() {
  const [cookies] = useCookies(["authorize_token_admin"]);
  return (

    < CookiesProvider > {/* Cung cấp context cho cookies */}
      < LayoutProvider >
        <LayoutSwitch>
          <Routes>
            {/* Protected admin routes */}
            <Route path="/admin/*" element={<ContextToken><ProtectedRoute /></ContextToken>}>
              <Route index element={<Dashboard />} />
              <Route path="hospital/*">
                <Route index element={<ListHospital />} />
                <Route path=":code/service" element={<SelectService />} />
                <Route path="create" element={<CreateHospital />} />
                <Route path=":code/department" element={<ListDepartment />} />
                <Route path=":code/package" element={<ListPackage />} />
                <Route path=":code/testing" element={<ListTesting />} />
                <Route path=":code/vaccine" element={<ListVaccine />} />
                <Route path=":code/department/:codedeparment/doctor" element={<ListDoctor />} />
              </Route>
              <Route path="booking/:type/:id" element={<ListBooking />} />
              <Route path="booking/detail/:id" element={<BookingDetails />} />
              <Route path="account/customer" element={<ListAccountCustomer />} />
              <Route path="account/admin" element={<ListAccountAdmin />} />

              <Route path="about" element={<Aboutus />} />

              <Route path="analysis" element={<Analysis />} />

              <Route path="*" element={<FileNotFound />} />
            </Route>

            {/* Public routes */}
            <Route path="/" element={
              cookies && !cookies.authorize_token_admin ? (
                <Auth />
              ) : (
                <Navigate to="/admin" />
              )
            } />
          </Routes>
        </LayoutSwitch>
      </LayoutProvider >
    </CookiesProvider >
  );
}

export default App;
