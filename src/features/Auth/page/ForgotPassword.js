import React, { useEffect, useState } from 'react'
import LoadingPage from '../../../shared/Config/LoadingPage'
import { NotificationContainer } from 'react-notifications'
import { apiRequest } from '../../../shared/hook/Api/Api'
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert';
import styled from 'styled-components'

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState(false)
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const [countdownStart, setCountdownStart] = useState(false)
  const [countDown, setCountDown] = useState(59)

  useEffect(() => {
    if (countdownStart) {
      const intervalId = setInterval(() => {
        setCountDown(prev => {
          if (prev <= 1) {
            clearInterval(intervalId)
            setCountdownStart(false) // Dừng countdown khi hết thời gian
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(intervalId) // Clear interval khi component unmount
    }
  }, [countdownStart])

  const checkAccount = async (e) => {
    e.preventDefault()
    try {
      const emailElement = document.getElementById("email")
      if (emailElement.value.trim() === '') {
        return
      }
      setIsLoading(true)
      const rs = await apiRequest("POST", "auth/forgot", { email: emailElement.value.trim() })
      setTimeout(() => setIsLoading(false), 500)

      if (rs?.data?.status === 200) {
        e.target.reset()
        setEmail(rs.data.data.email)
        setForm(true)
        setCountdownStart(true)
        setCountDown(60) // Bắt đầu đếm ngược từ 60 giây
      } else {
        swal("Reset Password", rs.data.message, "error")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => setIsLoading(false), 500)
    }
  }

  const resetPassword = async (e) => {
    e.preventDefault()
    try {
      const codeElement = document.getElementById("code_verify")
      if (codeElement.value.trim() === '') {
        return
      }
      setIsLoading(true)
      const rs = await apiRequest("POST", "auth/resetpassword", { code: codeElement.value.trim().toString(), email })
      setTimeout(() => setIsLoading(false), 500)

      if (rs?.data?.status === 200) {
        swal("Reset Password", "Reset Password Successfully!", "success").then((result) => {
          if (result) navigate("/")
        })
      } else {
        swal("Reset Password", rs.data.message, "error")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => setIsLoading(false), 500)
    }
  }

  const reSendCode = async () => {

    try {

      setIsLoading(true)
      const rs = await apiRequest("POST", "auth/forgot", { email: email })
      setTimeout(() => setIsLoading(false), 500)
      if (rs?.data?.status === 200) {
        setEmail(rs.data.data.email)
        setForm(true)
        setCountdownStart(true)
        setCountDown(59) // Bắt đầu đếm ngược từ 60 giây
      } else {
        swal("Reset Password", rs.data.message, "error")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => setIsLoading(false), 500)
    }
  }

  return (
    <div className='auth_P'>
      <BacktoLogin onClick={() => { navigate("/") }}><i class="fa-solid fa-reply"></i></BacktoLogin>
      <NotificationContainer />
      <LoadingPage key={1} isloading={isLoading} />
      <div className='b_logo'>
        <img src={require('../../../assets/images/logo/logo-05.png')} alt='' />
      </div>
      {form ? (
        <form className='form_login' onSubmit={resetPassword}>
          <p className='tilte'>VERIFY</p>
          <p className='description'>Enter your code</p>
          <div className='form_group'>
            <div className='b_item'>
              <i className="fa-solid fa-key icon_input"></i>
              <input id='code_verify' defaultValue={""} type='number' required />
            </div>
            <DivReSend>
              {countDown > 0 ? (
                <span>{countDown}s</span>
              ) : (
                <LinkRe onClick={reSendCode}>Gửi lại <i className="fa-solid fa-rotate-right"></i></LinkRe>
              )}
            </DivReSend>
          </div>
          <button className='btn_submit' type='submit'>Verify</button>
        </form>
      ) : (
        <form className='form_login' onSubmit={checkAccount}>
          <p className='tilte'>RESET</p>
          <p className='description'>Verify Email to reset password</p>
          <div className='form_group'>
            <div className='b_item'>
              <i className="fa-solid fa-user icon_input"></i>
              <input id='email' placeholder='Input email...' required />
            </div>
            <span className='error'></span>
          </div>
          <button className='btn_submit' type='submit'>Check</button>
        </form>
      )}
    </div>
  )
}

const DivReSend = styled.div`
 display: flex;
  justify-content: right;
  gap: 0.5rem;
  padding: 0.5rem 0 0;
  align-items: center;
`;

const LinkRe = styled.span`
color: red;
  font-size: var(--fz_small);
  font-weight:400;
  cursor: pointer;
  i {
    font-size: var(--fz_smallmax);
    padding-left: 0.3rem;
  }
`;

const BacktoLogin = styled.p`
position: fixed;
  inset: 0;
  width: 3rem;
  height: 3rem;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
   cursor: pointer;
  `;
