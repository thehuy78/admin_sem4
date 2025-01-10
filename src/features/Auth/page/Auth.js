import React, { useState } from 'react'
import { useCookies } from 'react-cookie';
import "../style/Auth.scss"
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../../../shared/hook/Api/Api';
import { NotificationContainer } from 'react-notifications';
import { createNotification } from '../../../shared/Config/Notifications';
import LoadingPage from '../../../shared/Config/LoadingPage';
import { apiRequestAutherize } from '../../../shared/hook/Api/ApiAuther';

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false)
  const [, setCookie] = useCookies(["authorize_token_admin"]);
  const navigate = useNavigate()



  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      var emailvalue = document.getElementById("email").value
      var passwordvalue = document.getElementById("password").value
      if (emailvalue.trim() !== "" && passwordvalue.trim() !== "") {
        var loginRes = {
          email: emailvalue.trim(),
          password: passwordvalue.trim()
        }
        setIsLoading(true)
        var rs = await apiRequest("POST", "auth/login", loginRes)

        setTimeout(() => {
          setIsLoading(false)
        }, 300);
        if (rs && rs.data && rs.data.status) {
          switch (rs.data.status) {
            case 200:
              createNotification("success", "Login Success", "Login")();
              var exp = new Date()
              exp.setHours(exp.getHours() + 10);
              setCookie("authorize_token_admin", rs.data.data, { expires: exp, path: '/admin_sem4' })
              setTimeout(() => {
                navigate("/admin/dashboad")
              }, 300);
              break;
            case 201:
              createNotification("error", "Password wrong", "Login")();
              break;
            case 202:
              createNotification("error", "User not found", "Login")();
              break;
            default:
              break;
          }
        }
        console.log(rs);
      } else {
        createNotification("warning", "Input your account", "Login")();
      }
    } catch (error) {
      setTimeout(() => {
        setIsLoading(false)
      }, 300);
      createNotification("error", "Login Fails", "Login")();
    } finally {
      e.target.reset()
    }
  }
  const [showpass, setShowpass] = useState(false)
  const handleShowPassword = () => {
    setShowpass((prev) => !prev);
  }
  return (
    <div className='auth_P'>
      <NotificationContainer />
      <LoadingPage key={1} isloading={isLoading} />
      <div className='b_logo'>
        <img src={require('../../../assets/images/logo/logo-05.png')} alt='' />
      </div>
      <form className='form_login' onSubmit={handleLogin}>
        <p className='tilte'>Welcome</p>
        <p className='description'>PLEASE LOGIN TO ADMIN DASHBOARD</p>
        <div className='form_group'>

          <div className='b_item'>
            <i className="fa-solid fa-user icon_input"></i>
            <input id='email' placeholder='Input email...' />
          </div>
          <span className='error'></span>
        </div>
        <div className='form_group'>

          <div className='b_item_pw'>
            <i className="fa-solid fa-key icon_input"></i>
            <div className='b_input'>
              <input type={showpass ? 'text' : 'password'} id='password' placeholder='Input password ...' />
              <i className={!showpass ? "fa-regular fa-eye" : "fa-regular fa-eye-slash"} onClick={handleShowPassword}></i>
            </div>
          </div>
          <span className='error'></span>
        </div>
        <button className='btn_submit' type='submit'>Login</button>
        <Link className='link_tag' to={"/forgotpassword"}><p>Forgot your password?</p></Link>
      </form>
    </div>
  )
}
