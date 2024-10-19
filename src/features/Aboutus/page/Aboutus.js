import React from 'react'
import { useCookies } from 'react-cookie';
import { useAdminContext } from '../../../shared/hook/ContextToken';

export default function Aboutus() {
  const [, , removeCookie] = useCookies(["authorize_token_admin"]);
  const handleLogoout = () => {
    removeCookie("authorize_token_admin");
  }

  const { token, user } = useAdminContext();
  console.log(token);
  console.log(user);

  return (
    <div>
      <button onClick={handleLogoout}>Logout</button>
    </div>
  )
}
