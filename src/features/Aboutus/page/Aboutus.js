import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useAdminContext } from '../../../shared/hook/ContextToken';
import { NotificationContainer } from 'react-notifications';
import { createNotification } from '../../../shared/Config/Notifications';
import { apiRequestAutherize } from '../../../shared/hook/Api/ApiAuther';
import { convertExcelFile } from '../../../shared/function/CreateExcel';


export default function Aboutus() {
  const [, , removeCookie] = useCookies(["authorize_token_admin"]);
  const { token, user } = useAdminContext();

  // Function to handle logout
  const handleLogout = () => {
    removeCookie("authorize_token_admin");
    createNotification('success', "Logout successful", "You have been logged out")();
  };

  // Function to handle notifications
  const handleNoti = () => {
    createNotification('success', "Login OK", "You are successfully logged in")();
  };

  // Function to fetch Excel data and download
  const fetchExcel = async () => {
    try {
      if (token) {
        const startDate = new Date(2024, 9, 15); // October (9) starts from 0
        const endDate = new Date(2024, 9, 28);

        // Format dates to ISO string
        const requestData = {
          type: '',
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        };

        const rs = await apiRequestAutherize("POST", "booking/excel", token, requestData);
        console.log(rs);

        if (rs && rs.data && rs.data.status === 200) {
          // Assuming rs.data is the array of BookingRes objects
          convertExcelFile(rs.data.data, 'Amls')
          createNotification('success', "Excel data fetched", "Data has been fetched successfully")();
        } else {
          createNotification('error', "Fetch error", "Failed to fetch Excel data")();
        }
      }
    } catch (error) {
      console.error("Error fetching Excel data:", error);
      createNotification('error', "Fetch error", "An error occurred while fetching Excel data")();
    }
  };

  useEffect(() => {
    // Log the token and user for debugging
    console.log("Token:", token);
    console.log("User:", user);
  }, [token, user]); // Log whenever token or user changes

  return (
    <div>
      <NotificationContainer />
      <button onClick={handleNoti}>Notify</button>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={fetchExcel}>Get Excel</button>
    </div>
  );
}
