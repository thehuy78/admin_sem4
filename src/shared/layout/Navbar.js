import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useAdminContext } from '../hook/ContextToken';
import { jwtDecode } from 'jwt-decode';
import { apiRequest } from '../hook/Api/Api';
import { NotificationContainer } from 'react-notifications';
import { createNotification } from '../Config/Notifications';
import LoadingPage from '../Config/LoadingPage';
import { apiRequestAutherize } from '../hook/Api/ApiAuther';

export default function Navbar() {
  const [showLogout, setShowLogout] = useState(false)
  const [user, setUser] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [cookies, , removeCookie] = useCookies(["authorize_token_admin"]);
  const handleLogoout = async () => {
    try {
      setIsLoading(true)
      var rs = await apiRequestAutherize("POST", "auth/logout", cookies.authorize_token_admin, cookies.authorize_token_admin)
      console.log(rs);
      setTimeout(() => {
        setIsLoading(false)
      }, 200);
      if (rs && rs.data && rs.data.status === 200) {
        createNotification("success", "LogOut success", "Logout")()

        removeCookie("authorize_token_admin", { path: '/admin_sem4' });

      } else {
        createNotification("error", "LogOut fails", "Logout")()
      }

    } catch (error) {
      createNotification("error", "LogOut fails", "Logout")()
      setTimeout(() => {
        setIsLoading(false)
      }, 200);
    }

  }

  useEffect(() => {
    if (cookies.authorize_token_admin) {
      setUser(jwtDecode(cookies.authorize_token_admin));
    }
  }, [cookies.authorize_token_admin]);

  return (
    <div className='navbar_P'>
      <NotificationContainer />
      <LoadingPage key={1} isloading={isLoading} />
      <div className='left'></div>
      <div className='right'>
        <div className='account_login'>
          <div className='acount_login_container'>
            <img src={"https://tinyurl.com/4eb2aab6"} alt='' />
            <div className='b_name' onClick={() => {
              setShowLogout((prev) => !prev)
            }}>
              <p>{user && user.firstname} {user && user.lastname}</p>
              <i className="fa-solid fa-sort-down"></i>
            </div>
            {
              showLogout && (
                <div className={showLogout ? 'abso_account' : 'abso_account hide'}>
                  <p onClick={handleLogoout}>Log out</p>
                </div>
              )
            }

          </div>
        </div>
      </div>
    </div>
  )
}
