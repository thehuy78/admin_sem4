import React, { useState } from 'react'

export default function Navbar() {
  const [showLogout, setShowLogout] = useState(false)
  return (
    <div className='navbar_P'>
      <div className='left'></div>
      <div className='right'>
        <div className='account_login'>
          <div className='acount_login_container'>
            <img src={"https://tinyurl.com/4eb2aab6"} alt='' />
            <div className='b_name' onClick={() => {
              setShowLogout((prev) => !prev)
            }}>
              <p>Nguyen The Huy</p>
              <i class="fa-solid fa-sort-down"></i>
            </div>
            {
              showLogout && (
                <div className={showLogout ? 'abso_account' : 'abso_account hide'}>
                  <p>Log out</p>
                </div>
              )
            }

          </div>
        </div>
      </div>
    </div>
  )
}
