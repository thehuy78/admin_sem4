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
import Notification from "./features/Notification/page/Notification";
import Services from "./features/Services/page/Services";
import CreateAccount from "./features/Account/page/CreateAccount";
import UpdateHospital from "./features/Hospital/page/UpdateHospital";
import ForgotPassword from "./features/Auth/page/ForgotPassword";
import UpdatePassword from "./features/Auth/page/UpdatePassword";
import Chat from "./features/Chat/page/Chat";
import MapApi from "./shared/component/InputData/MapApi";
import Transaction from "./features/Transaction/page/Transaction";

import BlogList from "./features/Blogs/Page/BlogList";
import EventList from "./features/Event/page/EventList";
import EventDetails from "./features/Event/page/EventDetails";
import BlogsDetails from "./features/Blogs/Page/BlogsDetails";
import CreateBlogs from "./features/Blogs/Page/CreateBlogs";
import EditBlogs from "./features/Blogs/Page/EditBlogs";
import Accountant from "./features/Accountant/page/Accountant";

function App() {
  const [cookies] = useCookies(["authorize_token_admin"]);


  return (

    < CookiesProvider > {/* Cung cấp context cho cookies */}
      < LayoutProvider >
        <LayoutSwitch>
          <Routes>
            {/* Protected admin routes */}
            <Route path="/admin/*" element={<ContextToken><ProtectedRoute /></ContextToken>}>
              <Route path="dashboad" element={<Dashboard />} />
              <Route path="hospital/*">
                <Route index element={<ListHospital />} />
                <Route path=":code/service" element={<SelectService />} />
                <Route path="create" element={<CreateHospital />} />
                <Route path="update/:id" element={<UpdateHospital />} />
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
              <Route path="account/create" element={<CreateAccount />} />
              <Route path="about" element={<Aboutus />} />
              <Route path="chat" element={<Chat />} />
              <Route path="notification" element={<Notification />} />
              <Route path="transaction" element={<Transaction />} />
              <Route path="services" element={<Services />} />
              <Route path="analysis" element={<Analysis />} />
              <Route path="setting" element={<UpdatePassword />} />
              <Route path="blogs" element={<BlogList />} />
              <Route path="blogs/details/:id" element={<BlogsDetails />} />
              <Route path="blogs/create" element={<CreateBlogs />} />
              <Route path="finance" element={<Accountant />} />
              <Route path="event" element={<EventList />} />
              <Route path="event/details/:id" element={<EventDetails />} />
              <Route path="test" element={<MapApi />} />
              <Route path="*" element={<FileNotFound />} />
            </Route>

            {/* Public routes */}
            <Route path="/" element={
              cookies && !cookies.authorize_token_admin ? (
                <Auth />
              ) : (
                <Navigate to="/admin/dashboad" />
              )
            } />
            <Route path="/forgotpassword" element={
              cookies && !cookies.authorize_token_admin ? (
                <ForgotPassword />
              ) : (
                <Navigate to="/admin/dashboad" />
              )
            } />


          </Routes>
        </LayoutSwitch>
      </LayoutProvider >
    </CookiesProvider >
  );
}

export default App;
