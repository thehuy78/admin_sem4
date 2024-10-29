import React, { useCallback, useEffect, useState } from 'react'
import InputComponent from '../../../shared/component/InputData/InputComponent'
import "../style/CreateHospital.scss"

import SelectOption from '../../../shared/component/InputData/SelectOption';
import TextArea from '../../../shared/component/InputData/TextArea';
import InputImageCrop from '../../../shared/component/InputData/InputImageCrop';
import MultiInputImageCrop from '../../../shared/component/InputData/MultiInputImage';
import { ValidateRegex } from "../../../shared/function/ValidationInput"
import Provinces from "../../../shared/data/Provinces.json"
import { apiRequestAutherizeForm } from '../../../shared/hook/Api/ApiAuther';
import { useAdminContext } from '../../../shared/hook/ContextToken';
import { NotificationContainer } from 'react-notifications';
import LoadingPage from '../../../shared/Config/LoadingPage';
import { createNotification } from '../../../shared/Config/Notifications';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';


const typehospital = [

  { value: 1, label: 'Bệnh Viện Công' },
  { value: 2, label: 'Bệnh Viện Tư' },
  { value: 3, label: 'Phòng Khám' },
  { value: 4, label: 'Trung Tâm Tiêm Chủng' },
];

const workday = [
  { value: 'T2', label: 'Monday' },
  { value: 'T3', label: 'Tuesday' },
  { value: 'T4', label: 'Wednesday' },
  { value: 'T5', label: 'Thursday' },
  { value: 'T6', label: 'Friday' },
  { value: 'T7', label: 'Saturday' },
  { value: 'CN', label: 'Sunday' },
];


export default function CreateHospital() {
  const { token, user } = useAdminContext()
  const [isLoading, setIsLoading] = useState(false)
  const [, , removeCookie] = useCookies(["authorize_token_admin"]);
  const Navigate = useNavigate()
  const [errorForm, setErrorForm] = useState({
    name: "",
    code: '',
    logo: '',
    img: '',
    province: '',
    district: '',
    address: '',
    opentime: '',
    closetime: '',
    type: '',
    workday: ''
  })
  const [valueForm, setValueForm] = useState({
    type: null,
    code: '',
    workday: [],
    logo: null,
    img: [],
    province: '',
    district: '',
    address: '',
    opentime: null,
    closetime: null,
    name: ''

  })
  const [districts, setDistricts] = useState([])

  useEffect(() => {
    if (!valueForm.province !== '') {

      setDistricts([])
    }
    var selectedProvinceData = Provinces.find((province) => province.name === valueForm.province);

    setDistricts(selectedProvinceData ? selectedProvinceData.districts : [])
  }, [valueForm.province]);



  const handleChangeName = (e) => {
    var value = e.target.value;
    const regex = /^.{6,}$/;
    var valid = ValidateRegex(regex, value.trim(), "Name must be 5-15 character")
    console.log(valid);
    if (valid.status) {
      setErrorForm((prev) => ({
        ...prev,
        name: ""
      }))
      setValueForm((prev) => ({
        ...prev,
        name: value.trim()
      }))
      return true;
    } else {
      setErrorForm((prev) => ({
        ...prev,
        name: valid.message
      }))
      setValueForm((prev) => ({
        ...prev,
        name: ''
      }))
      return false;
    }
  }
  const handleChangeCode = (e) => {
    var value = e.target.value;
    const regex = /^[A-Z0-9]{4,5}$/;
    var valid = ValidateRegex(regex, value.trim(), "VD: [4-5] number and character")
    console.log(valid);
    if (valid.status) {
      setErrorForm((prev) => ({
        ...prev,
        code: ""
      }))
      setValueForm((prev) => ({
        ...prev,
        code: value.trim()
      }))
      return true;
    } else {
      setErrorForm((prev) => ({
        ...prev,
        code: valid.message
      }))
      setValueForm((prev) => ({
        ...prev,
        code: ''
      }))
      return false;
    }
  }
  const handleChangeAddress = (e) => {
    var value = e.target.value;
    if (value.trim() !== '') {
      setErrorForm((prev) => ({
        ...prev,
        address: ""
      }))
      setValueForm((prev) => ({
        ...prev,
        address: value.trim()
      }))
      return true;
    } else {
      setErrorForm((prev) => ({
        ...prev,
        address: 'Address not null'
      }))
      setValueForm((prev) => ({
        ...prev,
        address: ''
      }))
      return false;
    }
  }
  const handleInputLogo = useCallback((file) => {
    if (file) {
      setValueForm((prev) => ({ ...prev, logo: file }))
      setErrorForm((prev) => ({ ...prev, logo: '' }))
    }
    else {
      setValueForm((prev) => ({ ...prev, logo: null }))
      setErrorForm((prev) => ({ ...prev, logo: 'Logo not null' }))
    }
  }, [])
  const handleInputImage = useCallback((file) => {
    if (file && file.length > 0) {
      setValueForm((prev) => ({ ...prev, img: file }))
      setErrorForm((prev) => ({ ...prev, img: '' }))
    }
    else {
      setValueForm((prev) => ({ ...prev, img: [] }))
      setErrorForm((prev) => ({ ...prev, img: 'logo not null' }))
    }
  }, [])
  const handleChangeOpenTime = (e) => {
    setValueForm((prev) => ({ ...prev, opentime: e.target.value }))
    if (valueForm.closetime && valueForm.closetime === e.target.value) {
      setErrorForm((prev) => ({ ...prev, opentime: 'Error' }))
      return true
    } else {
      setErrorForm((prev) => ({ ...prev, opentime: '', closetime: '' }))
      return false
    }
  }
  const handleChangeCloseTime = (e) => {
    setValueForm((prev) => ({ ...prev, closetime: e.target.value }))
    if (valueForm.opentime && valueForm.opentime === e.target.value) {
      setErrorForm((prev) => ({ ...prev, closetime: 'Error' }))
      return true
    } else {
      setErrorForm((prev) => ({ ...prev, closetime: '', opentime: '' }))
      return false
    }
  }
  const handleChangeType = (e) => {
    setValueForm((prev) => ({ ...prev, type: e.value }))
    setErrorForm((prev) => ({ ...prev, type: '' }))
  }
  const handleChangeWorkday = (e) => {
    setValueForm((prev) => ({
      ...prev,
      workday: e ? e.map(option => option.value) : [],
    }));
    if (e.length <= 0) {
      setErrorForm((prev) => ({ ...prev, workday: "Choose at least 1 day" }))
    } else {
      setErrorForm((prev) => ({ ...prev, workday: "" }))
    }
  }
  const handleChangeDistrict = (e) => {
    setValueForm((prev) => ({ ...prev, district: e.name }))
    setErrorForm((prev) => ({ ...prev, district: '' }))
  }

  const handleChangeProvince = (e) => {
    setValueForm((prev) => ({ ...prev, province: e.name }))
    setErrorForm((prev) => ({ ...prev, province: '' }))
  }

  useEffect(() => {
    console.log(valueForm);
  }, [valueForm]);


  const validdationForm = () => {
    var check = true;
    if (valueForm.name === '') {
      check = false
      if (errorForm.name === '') {
        setErrorForm((prev) => ({ ...prev, name: "Name not null" }))
      }

    }
    if (valueForm.code === '') {
      check = false
      if (errorForm.code === '') {
        setErrorForm((prev) => ({ ...prev, code: "Code not null" }))
      }

    }
    if (valueForm.type === null) {
      check = false
      if (errorForm.type === '') {
        setErrorForm((prev) => ({ ...prev, type: "Type not null" }))
      }
    }
    if (valueForm.province === '') {
      check = false
      if (errorForm.province === '') {
        setErrorForm((prev) => ({ ...prev, province: "Province not null" }))
      }
    }
    if (valueForm.district === '') {
      check = false
      if (errorForm.district === '') {
        setErrorForm((prev) => ({ ...prev, district: "District not null" }))
      }
    }
    if (valueForm.address === '') {
      check = false
      if (errorForm.address === '') {
        setErrorForm((prev) => ({ ...prev, address: "Address not null" }))
      }
    }
    if (valueForm.opentime === null) {
      check = false
      if (errorForm.opentime === '') {
        setErrorForm((prev) => ({ ...prev, opentime: "Open not null" }))
      }
    }
    if (errorForm.opentime !== '') {
      check = false
    }
    if (valueForm.closetime === null) {
      check = false
      if (errorForm.closetime === '') {
        setErrorForm((prev) => ({ ...prev, closetime: "Close not null" }))
      }
    }
    if (errorForm.closetime !== '') {
      check = false
    }
    if (valueForm.workday.length <= 0) {
      check = false
      setErrorForm((prev) => ({ ...prev, workday: "Choose at least 1 day" }))
    }
    if (valueForm.logo === null) {
      check = false
      setErrorForm((prev) => ({ ...prev, logo: "Logo is not null" }))
    }
    if (!check) {

      return false
    }
    return true
  }

  const sortWorkdays = (workdays) => {
    const weekdaysOrder = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    workdays.sort((a, b) => weekdaysOrder.indexOf(a) - weekdaysOrder.indexOf(b));

    return workdays;
  }



  const CreateHospital = async (e) => {
    e.preventDefault();
    try {
      if (validdationForm()) {
        var sort = sortWorkdays(valueForm.workday);
        var workday = sort[0] + '';
        if (sort.length > 1) {
          for (let index = 1; index < sort.length; index++) {
            workday += "-" + sort[index];
          }
        }
        var hospital = new FormData();
        hospital.append("code", valueForm.code)
        hospital.append("name", valueForm.name)
        hospital.append("type", valueForm.type)
        hospital.append("province", valueForm.province)
        hospital.append("district", valueForm.district)
        hospital.append("address", valueForm.address)
        hospital.append("openTime", valueForm.opentime.toString())
        hospital.append("closeTime", valueForm.closetime.toString())
        hospital.append("user", user.id)
        hospital.append("workDay", workday)
        if (valueForm.logo !== null) {
          console.log(valueForm.logo);
          hospital.append("photoFile", valueForm.logo);
        }
        setIsLoading(true)
        var rs = await apiRequestAutherizeForm("POST", "hospital/create", token, hospital)
        console.log(rs);
        if (rs && rs.data && rs.data.status === 200) {
          createNotification("success", "Create hospital success", "Success")();
          Navigate("/admin/hospital")
        } else {
          createNotification("error", "Create hospital fails", "Error")();
        }
      }

    } catch (error) {
      if (error.response && error.response.status === 403) {
        createNotification("warning", "Your role is not accessible", "Warning")()
      } else if (error.response && error.response.status === 401) {
        createNotification("error", "Login session expired", "Error")()
        setTimeout(() => {
          removeCookie("authorize_token_admin", { path: '/admin_sem4' });
        }, 1000);

      } else {
        createNotification("error", error.message && error.message, "Error")()
      }
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 500);
    }



  }

  return (
    <div className='createHospital_P'>
      <NotificationContainer />
      <LoadingPage key={1} isloading={isLoading} />
      <section className="brums_nav" style={{ width: "100%", paddingBottom: "1rem" }}>
        <span
          onClick={() => {
            Navigate(-1);
          }}
        >
          <i class="fa-solid fa-arrow-left"></i> Back
        </span>
      </section>
      <form onSubmit={CreateHospital}>
        <p className='title'>Create Hospital</p>
        <div className='container'>
          <div className='left'>
            <InputComponent
              Textlabel={"Name"}
              Textplacehoder={"Input name hospital"}
              isRequire={true}
              err={errorForm.name}
              key={"name"}
              typeInput={"text"}
              fnChange={handleChangeName}
            />
            <div className='b_1'>
              <InputComponent
                Textlabel={"Code"}
                Textplacehoder={"Input Code hospital"}
                isRequire={true}
                typeInput={"text"}
                err={errorForm.code}
                key={"code"}
                fnChange={handleChangeCode}
              />
              <SelectOption
                Textlabel={"Type Hospital"}
                Textplacehoder={"Select type..."}
                isRequire={true}
                err={errorForm.type}
                key={"type"}
                defaultVl={typehospital.find(type => type.value === valueForm.type)}
                multi={false}
                nameLabel={"label"}
                nameValue={"value"}
                options={typehospital}
                fnChangeOption={handleChangeType}
              />
            </div>
            <div className='b_2'>


              <SelectOption
                Textlabel={"Province"}
                Textplacehoder={"Select Province..."}
                isRequire={true}
                err={errorForm.province}
                key={"province"}
                //defaultVl={Provinces.find(type => type.name === valueForm.province)}
                multi={false}
                nameLabel={"name"}
                nameValue={"name"}
                options={Provinces}
                fnChangeOption={handleChangeProvince}
              />

              <SelectOption
                Textlabel={"District"}
                Textplacehoder={"Select District..."}
                isRequire={true}
                err={errorForm.district}
                key={"district"}
                //defaultVl={Provinces.find(type => type.name === valueForm.province)}
                multi={false}
                nameLabel={"name"}
                nameValue={"name"}
                options={districts}
                fnChangeOption={handleChangeDistrict}
              />

              <InputComponent
                Textlabel={"Address"}
                Textplacehoder={"Input address hospital"}
                isRequire={true}
                err={errorForm.address}
                key={"address"}
                typeInput={"text"}
                fnChange={handleChangeAddress}
              />
            </div>
            <div className='b_3'>
              <InputComponent
                Textlabel={"Open Hours"}
                Textplacehoder={""}
                isRequire={true}
                err={errorForm.opentime}
                key={"openhours"}
                typeInput={"time"}
                fnChange={handleChangeOpenTime}
              />
              <InputComponent
                Textlabel={"Close Hours"}
                Textplacehoder={""}
                isRequire={true}
                err={errorForm.closetime}
                key={"closehours"}
                typeInput={"time"}
                fnChange={handleChangeCloseTime}
              />
              <SelectOption
                Textlabel={"Workday"}
                Textplacehoder={"Select workday..."}
                isRequire={true}
                err={errorForm.workday}
                key={"workday"}
                nameLabel={"label"}
                nameValue={"value"}
                defaultVl={workday.filter(type => valueForm.workday.includes(type.value))} // Đảm bảo giá trị ban đầu là một mảng khi multi-select
                multi={true}
                options={workday}
                fnChangeOption={handleChangeWorkday}
              />
            </div>
            <TextArea
              Textlabel={"Description"}
              Textplacehoder={""}
              isRequire={true}
              err={errorForm.name}
              key={"desciption"}
              typeInput={"text"}
              fnChange={handleChangeName}
            />
            <div className='b_4'>
              <InputImageCrop key={"logo"} Textlabel={"Logo Hospital"} aspectWH={1 / 1} isRequire={true} err={errorForm.logo} fnChange={handleInputLogo} />
              <MultiInputImageCrop key={"image"} GirdColumn={3} Textlabel={"Image Hospital"} aspectWH={1 / 1} isRequire={true} err={errorForm.img} fnChange={handleInputImage} />
            </div>
            {/* <InputMap /> */}
          </div>
          <div className='right'>
            <button type='submit' className='btn_submit'>Create</button>
            <button type='reset' className='btn_reset'>Reset</button>
          </div>
        </div>
      </form>
    </div>
  )
}
