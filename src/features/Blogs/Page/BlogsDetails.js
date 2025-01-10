import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAdminContext } from '../../../shared/hook/ContextToken';
import { apiRequestAutherize } from '../../../shared/hook/Api/ApiAuther';
import { createNotification } from '../../../shared/Config/Notifications';
import LoadingPage from '../../../shared/Config/LoadingPage';
import { formatDateBlogDetail } from '../../../shared/function/FomatDate';
import GetImageFireBase from '../../../shared/function/GetImageFireBase';

export default function BlogsDetails() {
  const { id } = useParams()


  const [blog, setBlog] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAdminContext();
  const fetchData = useCallback(async () => {
    try {
      if (token && id) {

        setIsLoading(true)
        var rs = await apiRequestAutherize("GET", `news/get/${id}`, token)
        console.log(rs.data);
        if (rs && rs.data && rs.data.status === 200) {
          setBlog(rs.data.data)
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
  return blog && (
    <div className='blogDetails'>
      <LoadingPage key={"ltt"} isloading={isLoading} />
      <div className='content_left'>
        <p className='title'>Title: {blog.title}</p>
        <div className='row'>
          <p className='date'>Create Date: {formatDateBlogDetail(blog.createDate)}</p>
          <p className='author'>Author:<span> {blog.firstName} {blog.lastName}</span></p>
        </div>

        <div className='content' dangerouslySetInnerHTML={{ __html: blog.description }}>

        </div>
      </div>
      <div className='content_right'>
        <img style={{ width: "100%" }} alt='' src={GetImageFireBase(blog.image)} />
      </div>
    </div>
  )
}
