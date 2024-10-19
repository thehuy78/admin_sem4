import React, { useState } from 'react'
import { useCookies } from 'react-cookie';
import "../style/Auth.scss"
import { Link, useNavigate } from 'react-router-dom';

export default function Auth() {
  const [, setCookie] = useCookies(["authorize_token_admin"]);
  const navigate = useNavigate()
  const handlesetCookie = (e) => {
    e.preventDefault();
    var exp = new Date()
    exp.setDate(exp.getDate() + 1);
    setCookie("authorize_token_admin", "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodXkiLCJpZCI6MjAsImZ1bGxuYW1lIjoiVGhlIEh1eSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyOTIyMzUwNywiZXhwIjoxNzI5MjU5NTA3fQ.1DeIdSmkphGReKAjCzMB95-0eVNmb3RbXImIz155dIc", { expires: exp })
    navigate("/admin")
  }
  const [showpass, setShowpass] = useState(false)
  const handleShowPassword = () => {
    setShowpass((prev) => !prev);
  }
  return (
    <div className='auth_P'>
      <div className='b_logo'>
        <img src={require('../../../assets/images/logo/logo-05.png')} alt='' />
      </div>
      <form className='form_login' onSubmit={handlesetCookie}>
        <p className='tilte'>Welcome</p>
        <p className='description'>PLEASE LOGIN TO ADMIN DASHBOARD</p>
        <div className='form_group'>

          <div className='b_item'>
            <i class="fa-solid fa-user icon_input"></i>
            <input />
          </div>
          <span className='error'>* ádsdsd</span>
        </div>
        <div className='form_group'>

          <div className='b_item_pw'>
            <i class="fa-solid fa-key icon_input"></i>
            <div className='b_input'>
              <input type={showpass ? 'text' : 'password'} />
              <i class={!showpass ? "fa-regular fa-eye" : "fa-regular fa-eye-slash"} onClick={handleShowPassword}></i>
            </div>
          </div>
          <span className='error'></span>
        </div>
        <button className='btn_submit' type='submit'>Login</button>
        <Link className='link_tag'><p>Forgot your password?</p></Link>
      </form>
    </div>
  )
}
