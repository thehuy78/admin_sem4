import React from 'react'
import { useCookies } from 'react-cookie';

export default function Aboutus() {
  const [, , removeCookie] = useCookies(["token"]);
  const handleLogoout = () => {
    removeCookie("token");
  }



  return (
    <div>
      <button onClick={handleLogoout}>Logout</button>
    </div>
  )
}
