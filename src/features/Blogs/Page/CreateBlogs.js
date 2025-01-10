import React, { useCallback, useState } from 'react'
import InputComponent from '../../../shared/component/InputData/InputComponent'
import InputImageCrop from '../../../shared/component/InputData/InputImageCrop'
import RichTextEditor from '../../../shared/component/InputData/RichTextEditor'
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import { apiRequestAutherizeForm } from '../../../shared/hook/Api/ApiAuther';
import { useAdminContext } from '../../../shared/hook/ContextToken';
import { jwtDecode } from 'jwt-decode';
import { createNotification } from '../../../shared/Config/Notifications';
import LoadingPage from '../../../shared/Config/LoadingPage';
export default function CreateBlogs() {
  const Navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [valueForm, setValueForm] = useState({
    title: "",
    description: "",
    imageFile: null
  })
  const [ErrorForm, setErrorForm] = useState({
    title: "",
    description: "",
    imageFile: ""
  })
  const { token } = useAdminContext()
  const handleInputLogo = useCallback((file, img) => {
    if (file) {
      setValueForm((prev) => ({ ...prev, imageFile: file }))
      setErrorForm((prev) => ({ ...prev, imageFile: '' }))
    }
    else {
      setValueForm((prev) => ({ ...prev, imageFile: null }))
      setErrorForm((prev) => ({ ...prev, imageFile: 'Image is required' }))
    }
  }, [])


  const validForm = () => {
    try {
      var valid = true;
      if (ErrorForm.description !== "" || ErrorForm.title !== "" || ErrorForm.imageFile !== "") {
        valid = false;
      } if (valueForm.description.trim() === "") {
        setErrorForm((prev) => ({
          ...prev,
          description: "Content is required"
        }))
        valid = false;
      }
      if (valueForm.title.trim() === "") {
        setErrorForm((prev) => ({
          ...prev,
          title: "Title is required"
        }))
        valid = false;
      }
      if (valueForm.imageFile === null) {
        setErrorForm((prev) => ({
          ...prev,
          imageFile: "Image is required"
        }))
        valid = false;
      }
      if (valid) {
        return true
      } else {
        return false;
      }

    } catch (error) {
      console.log(error);
      return false;
    }
  }


  const handleCreate = async (e) => {
    try {
      e.preventDefault();
      console.log(valueForm);
      console.log(ErrorForm);

      if (token) {
        if (!validForm()) {
          swal("Valid", "Data invalid!", "error")
          return
        }
        setIsLoading(true)
        var jwt = jwtDecode(token)
        var blog = new FormData();
        blog.append("title", valueForm.title)
        blog.append("description", valueForm.description)
        blog.append("idUser", jwt.id)
        if (valueForm.imageFile !== null) {
          blog.append("imageFile", valueForm.imageFile);
        }
        var rs = await apiRequestAutherizeForm("POST", "news/create", token, blog)
        console.log(rs);
        if (rs && rs.data && rs.data.status === 200) {
          // createNotification("success", "Create hospital success", "Success")();
          swal("Create", "Create Blog Successfuly!", "success").then((result) => {
            if (result) {
              Navigate("/admin/blogs")
            }
          });

        } else {
          swal("Create", rs.data.message, "error");
        }
      }
    } catch (error) {
      swal("Valid", "Data invalid!", "error").then((result) => {
        if (result) {
          Navigate("/admin/hospital")
        }
      });
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='createBlogs'>
      <LoadingPage key={1} isloading={isLoading} />
      <p className='appbar_title'>Create New Blogs</p>
      <div className='container_form'>
        <form onSubmit={handleCreate}>

          <InputComponent
            Textlabel={"Title"}
            isRequire={true}
            typeInput={"Text"}
            err={ErrorForm.title}
            fnChange={(e) => {
              var title = e.target.value
              setValueForm((prev) => ({
                ...prev,
                title: title.trim()
              }))
              if (title && title.trim() !== "") {
                setErrorForm((prev) => ({
                  ...prev,
                  title: ""
                }))
              } else {
                setErrorForm((prev) => ({
                  ...prev,
                  title: "Title is required"
                }))
              }
            }}
          />
          <RichTextEditor
            Textlabel={"Content"}
            isRequire={true}
            err={ErrorForm.description}
            defaultValue={valueForm.description}
            fnChange={(e) => {
              var description = e
              console.log(description);
              setValueForm((prev) => ({
                ...prev,
                description: description
              }))
              if (description && description !== "") {
                setErrorForm((prev) => ({
                  ...prev,
                  description: ""
                }))
              } else {
                setErrorForm((prev) => ({
                  ...prev,
                  description: "Content is required"
                }))
              }
            }}

          />

          <InputImageCrop
            fnChange={handleInputLogo}
            Textlabel={"Image"}
            isRequire={true}
            aspectWH={1 / 1}
            err={ErrorForm.imageFile}
          />
          <div className='box_btn'>
            <button type='reset'>Reset</button>
            <button type='submit'>Submit</button>
          </div>
        </form>
      </div>
    </div>
  )
}

