import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SelectOption from "../../../shared/component/InputData/SelectOption";
import InputComponent from "../../../shared/component/InputData/InputComponent";
import { useAdminContext } from "../../../shared/hook/ContextToken";
import { apiRequestAutherize, apiRequestAutherizeForm } from "../../../shared/hook/Api/ApiAuther";
import LoadingPage from "../../../shared/Config/LoadingPage";
import { createNotification } from "../../../shared/Config/Notifications";
import swal from 'sweetalert';
import { CreateAccountPage } from "../data/DataAccount";
export default function CreateAccount() {
  const navigate = useNavigate();
  const { token } = useAdminContext();
  const [isLoading, setIsLoading] = useState(false);
  const [hospitalOption, setHospitalOption] = useState([]);
  const fetchHospital = useCallback(async () => {
    try {
      setIsLoading(true);
      if (token) {
        var rs = await apiRequestAutherize("get", "hospital/getname", token);
        if (rs && rs.data && rs.data.status === 200) {
          const result = rs.data.data;
          setHospitalOption([...result]);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [token]);

  useEffect(() => {
    fetchHospital();
  }, [fetchHospital]);

  // Lưu trữ lỗi trong form
  const [errorForm, setErrorForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    hospitalcode: '',
    password: '',
    passwordConfirm: ''
  });

  // Lưu trữ giá trị của form
  const [valueForm, setValueForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    hospitalcode: '',
    password: '',
    passwordConfirm: ''
  });

  // Các hàm validate (kiểm tra regex)
  const validateName = (name) => /^[a-zA-Z\s]+$/.test(name);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateHospitalCode = (code) => /^[a-zA-Z0-9]+$/.test(code);
  const validatePassword = (password) =>
    /^[a-zA-Z0-9]{8,}$/.test(password);
  const validatePasswordConfirm = (password, passwordConfirm) => password === passwordConfirm;



  useEffect(() => {
    console.log(valueForm);
  }, [valueForm]);

  // Kiểm tra form và gửi khi người dùng nhấn Register
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Kiểm tra từng giá trị trong form
      let valid = true;
      const errors = {};

      if (!validateName(valueForm.firstname)) {
        valid = false;
        errors.firstname = 'Invalid first name';
      } else {
        errors.firstname = '';
      }
      if (!validateName(valueForm.lastname)) {
        valid = false;
        errors.lastname = 'Invalid last name';
      } else {
        errors.lastname = '';
      }
      if (!validateEmail(valueForm.email)) {
        valid = false;
        errors.email = 'Invalid email';
      } else {
        errors.email = '';
      }

      if (!validateHospitalCode(valueForm.hospitalcode)) {
        valid = false;
        errors.hospitalcode = 'Invalid hospital code';
      } else {
        errors.hospitalcode = '';
      }
      if (!validatePassword(valueForm.password)) {
        valid = false;
        errors.password = 'Password must be at least 8 characters and include a mix of letters, numbers, and symbols.';
      } else {
        errors.password = '';
      }
      if (!validatePasswordConfirm(valueForm.password, valueForm.passwordConfirm)) {
        valid = false;
        errors.passwordConfirm = 'Passwords do not match';
      } else {
        errors.passwordConfirm = '';
      }
      setErrorForm(errors);
      if (valid) {
        var register = new FormData();
        register.append("firstName", valueForm.firstname)
        register.append("lastName", valueForm.lastname)
        register.append("email", valueForm.email)
        register.append("password", valueForm.passwordConfirm)
        register.append("hospitalCode", valueForm.hospitalcode)
        register.append("role", "admin")
        setIsLoading(true)
        var rs = await apiRequestAutherizeForm("POST", "auth/register", token, register)
        setTimeout(() => {
          setIsLoading(false)
        }, 500);
        if (rs && rs.data && rs.data.status === 200) {
          swal("Create", "Create account Successfuly!", "success").then((result) => {
            if (result) {
              navigate("/admin/account/admin")
            }
          });
        }
        console.log(rs);
        swal("Create", rs.data.message, "error")

      }
    } catch (error) {
      createNotification("error", "Create hospital fails", "Error")();
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 500);
    }
  };

  return (
    <CreateAccountPage>
      <LoadingPage isloading={isLoading} />
      <section className="brums_nav">
        <span
          onClick={() => {
            navigate(-1);
          }}
        >
          <i className="fa-solid fa-arrow-left"></i> Back
        </span>
      </section>
      <section className="sec1">
        <form onSubmit={handleSubmit}>
          <p className="title">Register Account</p>
          <div className="form_input_container">
            <InputComponent
              Textlabel={"First name:"}
              isRequire={true}
              Textplacehoder={"Input"}
              typeInput={"text"}

              err={errorForm.firstname}
              fnChange={(e) => {
                setValueForm((prev) => ({
                  ...prev,
                  firstname: e.target.value
                }))
              }}
            />
            <InputComponent
              Textlabel={"Last name:"}
              isRequire={true}
              Textplacehoder={"Input"}
              typeInput={"text"}

              err={errorForm.lastname}
              fnChange={(e) => {
                setValueForm((prev) => ({
                  ...prev,
                  lastname: e.target.value
                }))
              }}
            />
            <InputComponent
              Textlabel={"Email:"}
              isRequire={true}
              Textplacehoder={"Input"}
              typeInput={"email"}
              err={errorForm.email}
              fnChange={(e) => {
                setValueForm((prev) => ({
                  ...prev,
                  email: e.target.value
                }))
              }}
            />
            <SelectOption
              Textlabel={"Hospital:"}
              Textplacehoder={"Choice Hospital..."}
              multi={false}
              isRequire={true}
              nameLabel={"name"}
              nameValue={"code"}

              err={errorForm.hospitalcode}
              options={hospitalOption}
              fnChangeOption={(e) => {
                setValueForm((prev) => ({
                  ...prev,
                  hospitalcode: e.code
                }))
              }}
            />
            <InputComponent
              Textlabel={"Password:"}
              isRequire={true}
              Textplacehoder={"Input"}
              typeInput={"password"}

              err={errorForm.password}
              fnChange={(e) => {
                setValueForm((prev) => ({
                  ...prev,
                  password: e.target.value
                }))
              }}
            />
            <InputComponent
              Textlabel={"Password Confirm:"}
              isRequire={true}
              Textplacehoder={"Input"}
              typeInput={"password"}

              err={errorForm.passwordConfirm}
              fnChange={(e) => {
                setValueForm((prev) => ({
                  ...prev,
                  passwordConfirm: e.target.value
                }))
              }}
            />
          </div>
          <div className="box_btn">
            <button type="submit">Register</button>
          </div>
        </form>
      </section>
    </CreateAccountPage>
  );
}
