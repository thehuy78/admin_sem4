import React, { useCallback, useEffect, useState } from 'react'
import InputComponent from '../../../shared/component/InputData/InputComponent'
import "../style/CreateHospital.scss"

import SelectOption from '../../../shared/component/InputData/SelectOption';
import TextArea from '../../../shared/component/InputData/TextArea';
import InputImageCrop from '../../../shared/component/InputData/InputImageCrop';
import MultiInputImageCrop from '../../../shared/component/InputData/MultiInputImage';
import { ValidateRegex } from "../../../shared/function/ValidationInput"
import Provinces from "../../../shared/data/Provinces.json"
import { apiRequestAutherize, apiRequestAutherizeForm } from '../../../shared/hook/Api/ApiAuther';
import { useAdminContext } from '../../../shared/hook/ContextToken';
import { NotificationContainer } from 'react-notifications';
import LoadingPage from '../../../shared/Config/LoadingPage';
import { createNotification } from '../../../shared/Config/Notifications';
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import swal from 'sweetalert';
import RichTextEditor from '../../../shared/component/InputData/RichTextEditor';


const workday = [
  { value: 'T2', label: 'Monday' },
  { value: 'T3', label: 'Tuesday' },
  { value: 'T4', label: 'Wednesday' },
  { value: 'T5', label: 'Thursday' },
  { value: 'T6', label: 'Friday' },
  { value: 'T7', label: 'Saturday' },
  { value: 'CN', label: 'Sunday' },
];




export default function UpdateHospital() {
  const formattedOptions = (options) => {
    return options.map(option => ({
      value: option.id,
      label: option.name
    }));
  }

  const { id } = useParams()

  const { token } = useAdminContext()
  const [isLoading, setIsLoading] = useState(false)
  const [typeHospital, setTypeHospital] = useState([])
  const [, , removeCookie] = useCookies(["authorize_token_admin"]);
  const Navigate = useNavigate()
  const [errorForm, setErrorForm] = useState({
    name: "",
    code: '',
    logo: '',
    img: '',
    province: '',
    district: '',
    description: '',
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
    logoOld: '',
    imgOld: '',

    img: [],
    province: '',
    district: '',
    description: '',
    address: '',
    opentime: null,
    closetime: null,
    name: '',


  })
  const findType = (typehospital, typename) => {
    var hos = typehospital.find(type => type.name === typename)
    if (hos) {
      console.log(hos.id);
      return hos.id
    }
  }

  const [districts, setDistricts] = useState([])
  const [hospital, setHospital] = useState()

  const fetchdata = useCallback(async () => {
    try {
      if (token) {

        var rs = await apiRequestAutherize("GET", "type/getTypeHospital", token)
        var result = await apiRequestAutherize("GET", `hospital/getbyid/${id}`, token)
        console.log(result);
        if (rs && rs.data && rs.data.status === 200) {
          setTypeHospital(rs.data.data)

        }
        if (result?.data?.status === 200) {
          var hospital = result.data.data

          setHospital(result.data.data)
          setValueForm((prev) => (
            {
              ...prev,
              province: hospital.province,
              address: hospital.address,
              closetime: hospital.closeTime,
              code: hospital.code,
              description: hospital.description,
              district: hospital.district,
              imgOld: hospital.image,
              logoOld: hospital.logo,
              name: hospital.name,
              opentime: hospital.openTime,
              type: findType(rs.data.data, hospital.typeName),
              workday: splitString(hospital.workDay),
            }))
        }
      }

    } catch (error) {

    }
  }, [token, id])




  useEffect(() => {
    fetchdata()
  }, [fetchdata]);


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
  const handleInputLogo = useCallback((file, img) => {

    if (file === null && img === null) {

      setValueForm((prev) => ({ ...prev, logo: null, logoOld: img }))
      setErrorForm((prev) => ({ ...prev, logo: 'Logo not null' }))
    }
    else {

      setValueForm((prev) => ({ ...prev, logo: file, logoOld: img }))
      setErrorForm((prev) => ({ ...prev, logo: '' }))

    }
  }, [])
  const handleInputImage = useCallback((file, defaultImg) => {

    var imgdefault = ''

    if (defaultImg && defaultImg.length > 0) {
      defaultImg.forEach(img => {
        imgdefault += img + "; "
      });
    }
    console.log(imgdefault);
    if (file && file.length <= 0 && defaultImg && defaultImg.length <= 0) {
      setValueForm((prev) => ({ ...prev, img: [], imgOld: imgdefault }))
      setErrorForm((prev) => ({ ...prev, img: 'image not null' }))

    }
    else {
      setValueForm((prev) => ({ ...prev, img: file, imgOld: imgdefault }))
      setErrorForm((prev) => ({ ...prev, img: '' }))
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
    setValueForm((prev) => ({ ...prev, province: e.name, district: '' }))
    setErrorForm((prev) => ({ ...prev, province: '' }))
  }




  const validdationForm = () => {
    var check = true;
    if (valueForm.name === '') {
      check = false
      if (errorForm.name === '') {
        setErrorForm((prev) => ({ ...prev, name: "Name not null" }))
      }

    }
    if (valueForm.description === '') {
      check = false
      if (errorForm.description === '') {
        setErrorForm((prev) => ({ ...prev, description: "Description not null" }))
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
    if (valueForm.logo === null && valueForm.logoOld === null) {
      check = false

      setErrorForm((prev) => ({ ...prev, logo: "Logo is not null" }))
    }
    if (valueForm.imgOld === '' && valueForm.img.length <= 0) {
      check = false
      setErrorForm((prev) => ({ ...prev, img: "Img is not null" }))
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

  useEffect(() => {
    console.log(valueForm.district);
    console.log(districts);
  }, [valueForm.district, districts]);



  const CreateHospital = async (e) => {
    e.preventDefault();
    try {
      console.log(valueForm);
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
        hospital.append("id", id)
        hospital.append("name", valueForm.name)
        hospital.append("type", valueForm.type)
        hospital.append("province", valueForm.province)
        hospital.append("district", valueForm.district)
        hospital.append("address", valueForm.address)
        hospital.append("openTime", valueForm.opentime.toString())
        hospital.append("closeTime", valueForm.closetime.toString())
        hospital.append("workDay", workday)
        hospital.append("description", valueForm.description || '')
        hospital.append("logoOld", valueForm.logoOld)
        hospital.append("imgOld", valueForm.imgOld)
        console.log(workday);
        // Append multiple image files
        if (valueForm.img && valueForm.img.length > 0) {
          valueForm.img.forEach((file) => {
            hospital.append("photoImage", file); // Key can remain same for multiple files
          });
        }

        if (valueForm.logo !== null) {

          hospital.append("photoFile", valueForm.logo);
        }
        console.log(hospital);
        setIsLoading(true)
        var rs = await apiRequestAutherizeForm("POST", "hospital/update", token, hospital)
        console.log(rs);
        if (rs && rs.data && rs.data.status === 200) {
          // createNotification("success", "Create hospital success", "Success")();
          swal("Update", "Update Hospital Successfuly!", "success").then((result) => {
            if (result) {
              Navigate("/admin/hospital")
            }
          });

        } else if (rs && rs.data && rs.data.status === 202) {
          swal("Create", rs.data.message, "error");
        } else {
          createNotification("error", "Update hospital fails", "Error")();
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

  const splitString = (inputString) => {
    return inputString.split('-');
  }
  return hospital && (
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
      <div className='box_form'>
        <form onSubmit={CreateHospital}>
          <p className='title'>Update Hospital</p>
          <div className='container'>
            <div className='left'>
              <div className='b_1'>
                <InputComponent
                  Textlabel={"Name"}
                  Textplacehoder={"Input name hospital"}
                  isRequire={true}
                  err={errorForm.name}
                  key={"name"}
                  typeInput={"text"}
                  defaultValue={hospital.name}
                  fnChange={handleChangeName}
                />
                <InputComponent
                  Textlabel={"Code"}
                  Textplacehoder={"Input Code hospital"}
                  isRequire={true}
                  typeInput={"text"}
                  err={errorForm.code}
                  key={"code"}
                  defaultValue={hospital.code}
                  fnChange={handleChangeCode}
                />
              </div>





              <div className='b_2'>


                <SelectOption
                  Textlabel={"Province"}
                  Textplacehoder={"Select Province..."}
                  isRequire={true}
                  err={errorForm.province}
                  key={"province"}
                  defaultVl={Provinces.find((province) => province.name === hospital.province)}
                  value={Provinces.find((province) => province.name === valueForm.province)}
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
                  defaultVl={districts.find((district) => district.name === hospital.district)}
                  value={districts.find((district) => district.name === valueForm.district)}
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
                  defaultValue={hospital.address}
                  fnChange={handleChangeAddress}
                />
              </div>
              <div className='b_3'>
                <SelectOption
                  Textlabel={"Type Hospital"}
                  Textplacehoder={"Select type..."}
                  isRequire={true}
                  err={errorForm.type}
                  key={"type"}
                  defaultVl={formattedOptions(typeHospital).find(type => type.label === hospital.typeName)}
                  multi={false}
                  nameLabel={"label"}
                  nameValue={"value"}
                  options={formattedOptions(typeHospital)}
                  fnChangeOption={handleChangeType}
                />
                <InputComponent
                  Textlabel={"Open Hours"}
                  Textplacehoder={""}
                  isRequire={true}
                  err={errorForm.opentime}
                  key={"openhours"}
                  typeInput={"time"}
                  defaultValue={hospital.openTime}
                  fnChange={handleChangeOpenTime}
                />
                <InputComponent
                  Textlabel={"Close Hours"}
                  Textplacehoder={""}
                  isRequire={true}
                  err={errorForm.closetime}
                  key={"closehours"}
                  typeInput={"time"}
                  defaultValue={hospital.closeTime}
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
                  defaultVl={workday.filter(type => valueForm.workday.includes(type.value))}
                  value={workday.filter(type => valueForm.workday.includes(type.value))} // Đảm bảo giá trị ban đầu là một mảng khi multi-select
                  multi={true}
                  options={workday}
                  fnChangeOption={handleChangeWorkday}
                />
              </div>
              <RichTextEditor
                Textlabel={"Description"}
                defaultValue={valueForm.description}
                isRequire={true}
                err={errorForm.description}
                typeInput={"Text"}
                fnChange={(value) => {
                  console.log(value);
                  var description = value
                  setValueForm((prev) => ({
                    ...prev,
                    description: description
                  }))
                  if (description.trim() !== '') {
                    setErrorForm((prev) => ({
                      ...prev,
                      description: ''
                    }))
                  } else {
                    setErrorForm((prev) => ({
                      ...prev,
                      description: 'description is required'
                    }))
                  }

                }}
              />
              {/* <TextArea
                Textlabel={"Description"}
                Textplacehoder={""}
                isRequire={false}
                defaultValue={hospital.description}
                // err={errorForm.name}

                key={"desciption"}
                typeInput={"text"}
                fnChange={(e) => { setValueForm((prev) => ({ ...prev, description: e.target.value })) }}
              /> */}
              <div className='b_4'>
                <InputImageCrop defaultImg={valueForm.logoOld} key={"logo"} Textlabel={"Logo Hospital"} aspectWH={1 / 1} isRequire={true} err={errorForm.logo} fnChange={handleInputLogo} />
                <MultiInputImageCrop defaultImage={valueForm.imgOld} key={"image"} GirdColumn={5} Textlabel={"Image Hospital"} aspectWH={1 / 1} isRequire={true} err={errorForm.img} fnChange={handleInputImage} />
              </div>
              {/* <InputMap /> */}
            </div>
            <div className='right'>
              <button type='submit' className='btn_submit'>Update</button>

            </div>
          </div>
        </form >
      </div >
    </div >
  )
}
