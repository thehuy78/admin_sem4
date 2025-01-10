import React, { useState } from 'react';
import LoadingPage from '../../../shared/Config/LoadingPage';
import { useAdminContext } from '../../../shared/hook/ContextToken';
import { apiRequestAutherize } from '../../../shared/hook/Api/ApiAuther';
import swal from 'sweetalert';
import styled from 'styled-components';

export default function UpdatePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const { token, user } = useAdminContext();
  const [errors, setErrors] = useState({
    passold: false,
    passnew: false,
    passcf: false,
  });

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    let valid = true;
    let tempErrors = {
      passold: false,
      passnew: false,
      passcf: false,
    };

    // Lấy giá trị từ các input
    const passold = document.getElementById("pwdold").value.trim();
    const passnew = document.getElementById("pwdnew").value.trim();
    const passcf = document.getElementById("pwdcf").value.trim();

    // Kiểm tra các trường không được để trống
    if (!passold || !passnew || !passcf) {
      valid = false;
      if (!passold) tempErrors.passold = true;
      if (!passnew) tempErrors.passnew = true;
      if (!passcf) tempErrors.passcf = true;
    }

    // Kiểm tra độ dài của mật khẩu mới (ví dụ: ít nhất 6 ký tự)
    if (passnew.length < 6) {
      valid = false;
      tempErrors.passnew = true;
      swal("Validate", "New password must be at least 6 characters long!", "error");
    }

    // Kiểm tra mật khẩu xác nhận khớp với mật khẩu mới
    if (passcf !== passnew) {
      valid = false;
      tempErrors.passcf = true;
      swal("Validate", "Password Confirm is not match!", "error");
    }

    // Cập nhật lỗi vào state
    setErrors(tempErrors);

    // Nếu tất cả kiểm tra hợp lệ, tiếp tục xử lý yêu cầu
    if (valid && token) {
      const id = user.id;
      const dto = {
        id: id,
        passwordOld: passold,
        passwordNew: passnew,
      };

      setIsLoading(true);
      try {
        const rs = await apiRequestAutherize("POST", "auth/updatePassword", token, dto);
        setIsLoading(false);
        if (rs?.data?.status === 200) {
          swal("Update Password", "Update Password Successfully!", "success");
          e.target.reset()
        } else {
          swal("Update Password", rs.data.message, "error");
        }
      } catch (error) {
        setIsLoading(false);
        swal("Error", "An error occurred. Please try again later.", "error");
      }
    }
  };


  var [showPass, setShowPass] = useState([false, false, false])

  const handelShowPass = (index) => {
    setShowPass((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  return (
    <UpdateAccountPage>
      <LoadingPage isloading={isLoading} />
      <div className='box_form'>
        <p className='title'>Update Password</p>
        <form onSubmit={handleUpdatePassword}>
          <div className='form_Group'>
            <label>Password Old <span> *</span></label>
            <div>
              <input
                id='pwdold'
                type={showPass[0] ? "text" : "password"}


                style={{ borderColor: errors.passold ? 'red' : '' }} // Thêm border đỏ khi có lỗi
              />
              <i className={!showPass[0] ? "fa-regular fa-eye" : "fa-regular fa-eye-slash"} onClick={() => handelShowPass(0)}></i>
            </div>
          </div>
          <div className='form_Group'>
            <label>Password New <span> *</span></label>
            <div>
              <input
                id='pwdnew'
                type={showPass[1] ? "text" : "password"}

                style={{ borderColor: errors.passnew ? 'red' : '' }} // Thêm border đỏ khi có lỗi
              />
              <i className={!showPass[1] ? "fa-regular fa-eye" : "fa-regular fa-eye-slash"} onClick={() => handelShowPass(1)}></i>
            </div>
          </div>
          <div className='form_Group'>
            <label>Password Confirm <span> *</span></label>
            <div>
              <input
                id='pwdcf'
                type={showPass[2] ? "text" : "password"}

                style={{ borderColor: errors.passcf ? 'red' : '' }} // Thêm border đỏ khi có lỗi
              />
              <i className={!showPass[2] ? "fa-regular fa-eye" : "fa-regular fa-eye-slash"} onClick={() => handelShowPass(2)}></i>
            </div>
          </div>
          <div className='b_button'>
            <button type='submit'>Update</button>
            <button type='reset'>Reset</button>
          </div>
        </form>
      </div>
    </UpdateAccountPage>
  );
}


const UpdateAccountPage = styled.div`

  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 1rem;
  .box_form {
    padding: 2rem;
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 0 0.2rem var(--shadow-black);
    .title {
      text-align: center;
      padding: 0 0 1rem;
      font-size: var(--fz_medium);
      font-weight: 750;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      .form_Group {
        display: flex;
        flex-direction: column;
        label {
          font-size: var(--fz_small);
          text-transform: capitalize;
          font-weight: 700;
          padding: 0.2rem 0;
          color: var(--gray);
          span {
            color: red;
            font-size: var(--fz_smallmax);
          }
        }
        div {
          position: relative;
          input {
            width: 100%;
            line-height: 1.2rem;
            padding: 0.7rem 0.5rem;
            border: none;
            outline: none;
            min-width: 400px;
            min-height: 3rem;
            border-radius: 0.3rem;
            border: 0.05rem solid var(--shadow-black);
            box-shadow: 0 0 2px var(--shadow-black);

            &:focus {
              border: 1px solid var(--active);
            }
          }
          i {
            position: absolute;
            right: 0;
            top: 50%;
            cursor: pointer;
            transform: translate(-50%, -50%);
          }
        }
      }
      .b_button {
        display: flex;
        justify-content: center;
        gap: 1rem;
        button {
          padding: 0.5rem 2.5rem;
          outline: none;
          border: none;
          border-radius: 0.3rem;
          box-shadow: 0 0 0.2rem var(--shadow-black);
          color: white;
          font-weight: 750;
        }
        button[type="submit"] {
          background-color: green;
        }
        button[type="reset"] {
          background-color: orange;
        }
      }
    }
  }

`