import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';

import { jwtDecode } from 'jwt-decode';

import { NotificationContainer } from 'react-notifications';
import { createNotification } from '../Config/Notifications';
import LoadingPage from '../Config/LoadingPage';
import { apiRequestAutherize } from '../hook/Api/ApiAuther';

import { Link } from 'react-router-dom';
import SearchInput from '../component/InputFilter/SearchInput';
import CheckBoxTogle from '../component/CheckBox/CheckBoxTogle';

export default function Navbar() {

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


  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "theme") {
        setTheme(event.newValue);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);



  const handleChange = () => {
    var btn = document.getElementById("checked_theme")
    const newTheme = btn.checked ? "dark" : "light";

    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);

  }

  useEffect(() => {
    if (theme === "dark") {
      console.log("ok");
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

  }, [theme]);

  return (
    <div className='navbar_P'>
      <NotificationContainer />
      <LoadingPage key={1} isloading={isLoading} />
      <div className='left'>
        <div className='logo_company'>
          <Link className='link_tag' to={"/admin/dashboad"}>
            <img alt='' src={require("../../assets/images/logo/logo1blue.png")} />
          </Link>
        </div>
        {/* <SearchInput minwidth={"350px"} /> */}
      </div>
      <div className='right'>
        <div className='box_icon'>
          <div style={{ scale: "0.7" }}>
            <CheckBoxTogle handleChange={handleChange} theme={theme} />
          </div>
          <Link className='link_tag' to={"/admin/chat"}><i className="fa-solid fa-comment"></i></Link>
          {/* <Link className='link_tag'><i className="fa-solid fa-bell"></i></Link> */}
          <Link className='link_tag' to={"/admin/setting"}><i className="fa-solid fa-gear"></i></Link>


        </div>
        <div className='account_login'>
          <div className='acount_login_container'>
            <img src={"https://tinyurl.com/4eb2aab6"} alt='' />
            <div className='b_name'>
              <p>{user && user.firstname} {user && user.lastname}</p>
              <i onClick={handleLogoout} className="fa-solid fa-share-from-square"></i>
            </div>


          </div>
        </div>
      </div>
    </div>
  )
}
