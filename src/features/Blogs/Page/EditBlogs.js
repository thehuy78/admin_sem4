import React, { useCallback, useEffect, useState } from 'react'
import InputComponent from '../../../shared/component/InputData/InputComponent'
import InputImageCrop from '../../../shared/component/InputData/InputImageCrop'
import RichTextEditor from '../../../shared/component/InputData/RichTextEditor'
import swal from 'sweetalert';
import { useNavigate, useParams } from 'react-router-dom';
import { apiRequestAutherize, apiRequestAutherizeForm } from '../../../shared/hook/Api/ApiAuther';
import { useAdminContext } from '../../../shared/hook/ContextToken';
import { jwtDecode } from 'jwt-decode';
import { createNotification } from '../../../shared/Config/Notifications';
import LoadingPage from '../../../shared/Config/LoadingPage';
export default function EditBlogs() {
  const Navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [valueForm, setValueForm] = useState({
    id: null,
    title: "",
    description: "",
    image: "",
    imageFile: null
  })
  const [ErrorForm, setErrorForm] = useState({
    title: "",
    description: "",
    imageFile: ""
  })

  const { token } = useAdminContext()
  const { id } = useParams()


  const [blog, setBlog] = useState();
  const fetchData = useCallback(async () => {
    try {
      if (token && id) {
        setIsLoading(true)
        var rs = await apiRequestAutherize("GET", `news/get/${id}`, token)
        console.log(rs.data);
        if (rs && rs.data && rs.data.status === 200) {
          setBlog(rs.data.data)
          var bloga = rs.data.data
          setValueForm((prev) => (
            {
              ...prev,
              id: bloga.id,
              title: bloga.title,
              description: bloga.description,
              image: bloga.image,
            }))

        }
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        createNotification("warning", "Your role is not accessible", "Warning")()
      } else if (error.response && error.response.status === 401) {
        createNotification("error", "Login session expired", "Error")()
      } else {
        createNotification("error", error.message && error.message, "Error")()
      }
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 400);
    }
  }, [id, token],);
  useEffect(() => {
    fetchData()
  }, [fetchData]);




  const handleInputLogo = useCallback((file, img) => {

    if (file === null && img === null) {

      setValueForm((prev) => ({ ...prev, imageFile: null, image: img }))
      setErrorForm((prev) => ({ ...prev, imageFile: 'Image not null' }))
    }
    else {

      setValueForm((prev) => ({ ...prev, imageFile: file, image: img }))
      setErrorForm((prev) => ({ ...prev, imageFile: '' }))

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
      <p className='appbar_title'>Edit Blogs</p>
      <div className='container_form'>
        <form onSubmit={handleCreate}>

          <InputComponent
            Textlabel={"Title"}
            isRequire={true}
            defaultValue={valueForm.title}
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
            defaultImg={valueForm.image}
            aspectWH={1 / 1}
            err={ErrorForm.imageFile}
          />
          <div className='box_btn'>
            <button type='reset'>Reset</button>
            <button type='submit'>Update</button>
          </div>
        </form>
      </div>
    </div>
  )
}

