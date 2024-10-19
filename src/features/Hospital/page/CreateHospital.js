import React, { useCallback, useEffect, useState } from 'react'
import InputComponent from '../../../shared/component/InputData/InputComponent'
import "../style/CreateHospital.scss"

import SelectOption from '../../../shared/component/InputData/SelectOption';
import TextArea from '../../../shared/component/InputData/TextArea';
import InputImageCrop from '../../../shared/component/InputData/InputImageCrop';
import MultiInputImageCrop from '../../../shared/component/InputData/MultiInputImage';
import { ValidateRegex } from "../../../shared/function/ValidationInput"
import Provinces from "../../../shared/data/Provinces.json"


const typehospital = [

  { value: 'BV CÔNG', label: 'Bệnh Viện Công' },
  { value: 'BV TƯ', label: 'Bệnh Viện Tư' },
  { value: 'Phòng Khám', label: 'Phòng Khám' },
  { value: 'Trung Tâm Tiêm Chủng', label: 'Trung Tâm Tiêm Chủng' },
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
  const [errorForm, setErrorForm] = useState({
    name: "",
    code: '',
    logo: '',
    img: '',
    province: '',
    district: ''
  })
  const [valueForm, setValueForm] = useState({
    type: '',
    code: '',
    workday: '',
    logo: null,
    img: [],
    province: '',
    district: ''
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
    const regex = /^[A-Za-z\s]{5,15}$/;
    setValueForm((prev) => ({
      ...prev,
      name: value.trim()
    }))
    var valid = ValidateRegex(regex, value.trim(), "Name must be 5-15 character")
    console.log(valid);
    if (valid.status) {
      setErrorForm((prev) => ({
        ...prev,
        name: ""
      }))
      return true;
    } else {
      setErrorForm((prev) => ({
        ...prev,
        name: valid.message
      }))
      return false;
    }
  }
  const handleChangeCode = (e) => {
    var value = e.target.value;
    const regex = /^[A-Z0-9]{4,5}$/;
    setValueForm((prev) => ({
      ...prev,
      code: value.trim()
    }))
    var valid = ValidateRegex(regex, value.trim(), "VD: [4-5] number and character")
    console.log(valid);
    if (valid.status) {
      setErrorForm((prev) => ({
        ...prev,
        code: ""
      }))
      return true;
    } else {
      setErrorForm((prev) => ({
        ...prev,
        code: valid.message
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

  useEffect(() => {
    console.log(valueForm);
  }, [valueForm]);


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




  return (
    <div className='createHospital_P'>

      <form>
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
                err={errorForm.name}
                key={1}
                defaultVl={typehospital.find(type => type.value === valueForm.type)}
                multi={false}
                nameLabel={"label"}
                nameValue={"value"}
                options={typehospital}
                fnChangeOption={(selected) => {
                  setValueForm((prev) => ({ ...prev, type: selected.value }));
                }}
              />
            </div>
            <div className='b_2'>
              {/* <InputComponent
                Textlabel={"District"}
                Textplacehoder={"Input District hospital"}
                isRequire={true}
                err={errorForm.name}
                key={"district"}
                typeInput={"text"}
                fnChange={handleChangeName}
              /> */}

              <SelectOption
                Textlabel={"Province"}
                Textplacehoder={"Select Province..."}
                isRequire={true}
                err={errorForm.province}
                key={1}
                //defaultVl={Provinces.find(type => type.name === valueForm.province)}
                multi={false}
                nameLabel={"name"}
                nameValue={"name"}
                options={Provinces}
                fnChangeOption={(selected) => {
                  setValueForm((prev) => ({ ...prev, province: selected.name }));
                }}
              />

              <SelectOption
                Textlabel={"District"}
                Textplacehoder={"Select District..."}
                isRequire={true}
                err={errorForm.district}
                key={1}
                //defaultVl={Provinces.find(type => type.name === valueForm.province)}
                multi={false}
                nameLabel={"name"}
                nameValue={"name"}
                options={districts}
                fnChangeOption={(selected) => {
                  setValueForm((prev) => ({ ...prev, district: selected.name }));
                }}
              />
              {/* <InputComponent
                Textlabel={"Province"}
                Textplacehoder={"Input Province hospital"}
                isRequire={true}
                err={errorForm.name}
                key={"province"}
                typeInput={"text"}
                fnChange={handleChangeName}
              /> */}
              <InputComponent
                Textlabel={"Address"}
                Textplacehoder={"Input address hospital"}
                isRequire={true}
                err={errorForm.name}
                key={"address"}
                typeInput={"text"}
                fnChange={handleChangeName}
              />
            </div>
            <div className='b_3'>
              <InputComponent
                Textlabel={"Open Hours"}
                Textplacehoder={""}
                isRequire={true}
                err={errorForm.name}
                key={"name"}
                typeInput={"time"}
                fnChange={handleChangeName}
              />
              <InputComponent
                Textlabel={"Close Hours"}
                Textplacehoder={""}
                isRequire={true}
                err={''}
                key={"name"}
                typeInput={"time"}
                fnChange={handleChangeName}
              />
              <SelectOption
                Textlabel={"Workday"}
                Textplacehoder={"Select workday..."}
                isRequire={true}
                err={errorForm.name}
                key={1}
                nameLabel={"label"}
                nameValue={"value"}
                defaultVl={workday.find(type => type.value === valueForm.workday)}
                multi={true}
                options={workday}
                fnChangeOption={(selected) => {
                  setValueForm((prev) => ({ ...prev, workday: selected.value }));
                }}
              />
            </div>
            <TextArea
              Textlabel={"Description"}
              Textplacehoder={""}
              isRequire={true}
              err={errorForm.name}
              key={"name"}
              typeInput={"text"}
              fnChange={handleChangeName}
            />
            <div className='b_4'>
              <InputImageCrop Textlabel={"Logo Hospital"} aspectWH={1 / 1} isRequire={true} err={errorForm.logo} fnChange={handleInputLogo} />
              <MultiInputImageCrop GirdColumn={3} Textlabel={"Image Hospital"} aspectWH={1 / 1} isRequire={true} err={errorForm.img} fnChange={handleInputImage} />
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
