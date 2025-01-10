
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { apiRequest } from '../../../shared/hook/ApiChat/ApiChatService';
import { apiRequestAutherize } from '../../../shared/hook/ApiChat/ApiAutherChatService';
import GetImageFireBase from '../../../shared/function/GetImageFireBase';
import { listenForNotifications } from '../../../shared/Config/firebaseConfig';
import { useAdminContext } from '../../../shared/hook/ContextToken';
import DropdownItem from '../../../shared/component/codeBlock/DropdownItem';
import styled from 'styled-components';

export default function Chat() {

  const [messages, setMessages] = useState([]);
  const [client, setClient] = useState(null);
  // const userEmail = "admin@gmail.com"
  // var[user,setUser] = useState('')
  const { token, user } = useAdminContext()


  const messagesEndRef = useRef(null);
  const [listStompClientMess, setListStompClientMess] = useState([])
  const [listClient, setListClient] = useState([])
  const [listClientSave, setListClientSave] = useState([])
  const [StompCurrent, setStompCurrent] = useState('')
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  useEffect(() => {
    const sock = new SockJS('http://103.12.77.74:8082/ws'); // WebSocket URL
    const stompClient = new Client({
      webSocketFactory: () => sock,
      debug: (str) => { console.log(str); },
      onConnect: () => {
        listClient && listClient.forEach(item => {
          stompClient.subscribe(`/topic/messages/${item.email}`, (message) => {

            fetchStompClient()
            if (item.email === StompCurrent) {
              fetchMessage()
            }
            // const parsedMessage = JSON.parse(message.body); // Parse message JSON
            // setMessages((prevMessages) => [...prevMessages, parsedMessage]);
          });
        })

      },
      onDisconnect: () => {
        console.log('Disconnected');
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, [listClient, StompCurrent]);

  const sendMessage = (e) => {
    e.preventDefault()
    try {
      var mes = document.getElementById("message").value.trim()
      const message = {
        senderEmail: user?.sub,
        receiverEmail: StompCurrent,
        content: mes,
        stompClients: StompCurrent
      };
      if (client) {
        client.publish({
          destination: '/app/sendMessage',
          body: JSON.stringify(message), // Convert object to JSON
        });

      }
      e.target.reset()
    } catch (error) {
      console.log(error);
    }
  };


  const [notification, setNotification] = useState('');
  const fetchMessage = useCallback(async () => {
    try {
      if (StompCurrent) {
        var rs = await apiRequestAutherize("GET", `getMessage/${StompCurrent}`, user.sub)
        console.log(rs);
        setMessages(rs?.data?.data ? rs.data.data : [])
      }
    } catch (error) {
    }
  }, [StompCurrent])


  useEffect(() => {
    const userId = 'Status'; // ID của người dùng mà bạn muốn theo dõi thông báo
    listenForNotifications(userId, setNotification);
  }, []);

  const fetchStompClient = useCallback(async () => {
    try {
      var rs = await apiRequest("GET", "getStompClient")

      if (rs?.data?.status === 200) {
        setListStompClientMess(rs.data.data)
      }
      console.log(rs);
    } catch (error) {

    }
  }, [])


  const fetchClientAll = useCallback(async () => {
    try {
      var rs = await apiRequest("GET", "getAll")
      if (rs?.data?.status === 200) {
        setListClient(rs.data.data)

      }
      console.log(rs);
    } catch (error) {

    }
  }, [])

  const fetchClientAllSave = useCallback(async () => {
    try {
      var rs = await apiRequest("GET", "getAll")
      if (rs?.data?.status === 200) {
        setListClientSave(rs.data.data)

      }
      console.log(rs);
    } catch (error) {

    }
  }, [])





  useEffect(() => {
    fetchClientAll()
  }, [fetchClientAll]);


  useEffect(() => {
    fetchClientAllSave()
  }, [notification]);

  useEffect(() => {
    fetchStompClient()
  }, [fetchStompClient]);

  useEffect(() => {
    fetchMessage()
  }, [fetchMessage]);


  // Hàm để cập nhật thời gian tin nhắn
  const updateMessageTimes = () => {
    setMessages(prevMessages => {
      return prevMessages.map(msg => ({
        ...msg,
        formattedTimestamp: formatDate(msg.timestamp), // Cập nhật lại thời gian
      }));
    });
  };

  // Cập nhật thời gian mỗi giây
  useEffect(() => {
    const intervalId = setInterval(updateMessageTimes, 10000);
    return () => clearInterval(intervalId); // Dọn dẹp khi component unmount
  }, []);


  const fnCallback = (email) => {
    setStompCurrent(email)
  }

  return (
    <ChatPage>
      <div className='left'>
        <div className='top'>
          <div className='b_1'>
            <p className='title'>Đoạn Chat</p>
            <div>
              <DropdownItem
                data={listClient}
                fnCallback={fnCallback}
              />
            </div>
          </div>
          <div className='b_2'>
            <div className='b_search'>
              <i class="fa-solid fa-magnifying-glass"></i>
              <input />
            </div>
          </div>
        </div>
        <div className='bottom'>
          <div className='box_stompClient'>
            {listStompClientMess && listStompClientMess.length > 0 && listStompClientMess.map((item, index) => (
              <div className='item' onClick={() => { setStompCurrent(item[0].email) }}>
                <div className='b_left_item'>
                  <img alt='' src={GetImageFireBase(item[0].avatar)} />
                  {checkStatus(listClientSave, item[0].email).toLowerCase() === "online" && (
                    <span className='_circleOnline'></span>
                  )}
                </div>
                <div className='b_right_item'>
                  <p className='name_hos'>{item[0].hospital}</p>
                  <p className='name'>{item[0].firstName} {item[0].lastName}</p>

                  <div className='last_message'>
                    <span>{item[1].senderEmail === item[0].email ? item[0].lastName : "You"}: </span>
                    <span>{item[1].content} </span>
                    <span className='time_'>{item[1].formattedTimestamp || formatDate(item[1].timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
      {StompCurrent && (
        <div className='right'>
          <div className='top'>
            <div className='c_1'>
              <img alt='' src={GetImageFireBase(listClientSave.find(u => u.email === StompCurrent)?.avatar)} />
              <div className='b_client'>
                <p className='name'>{listClientSave.find(u => u.email === StompCurrent)?.firstName} {listClientSave.find(u => u.email === StompCurrent)?.lastName}</p>
                <p className='status'>
                  {checkStatus(listClientSave, StompCurrent).toLowerCase() === "online" && (
                    <span className='_circleOnline'></span>
                  )}
                  {checkStatus(listClientSave, StompCurrent)}</p>
              </div>
            </div>
          </div>
          <div className='center'>
            <div className='b_message_list'>
              {messages && messages.length > 0 && messages.slice().reverse().map((msg, index) => (

                <div className={msg.senderEmail !== StompCurrent ? "box_item_me" : "box_item_you"}>
                  {msg.senderEmail === StompCurrent && (
                    <img alt='' src={GetImageFireBase(msg.stompClients.avatar)} />
                  )}
                  <div className={msg.senderEmail !== StompCurrent ? "me" : "you"}>
                    {msg.senderEmail === StompCurrent ? (<p></p>) : msg.senderEmail === user?.sub ? (<p></p>) : (<p style={{ color: "white" }}>{msg.senderEmail}</p>)}
                    <p className='contentMessage'>{msg.content}</p>
                    <p className='time'>{msg.formattedTimestamp || formatDate(msg.timestamp)}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />

            </div>
          </div>
          <div className='bottom'>
            <form onSubmit={sendMessage}>
              <input id='message' />
              <button>Send</button>
            </form>

          </div>
        </div>
      )}

    </ChatPage>
  )
}


const checkStatus = (data, current) => {
  var user = data.find(op => op.email === current);

  // Kiểm tra trạng thái là "active"
  if (user?.status === "active") {
    return "Online";
  } else {
    const date = new Date(user?.updateDate);
    const now = new Date();

    // Tính toán sự chênh lệch giữa ngày hiện tại và ngày cập nhật
    const diffInSeconds = Math.floor((now - date) / 1000);

    // Nếu thời gian chênh lệch dưới 1 phút, hiển thị "Online"
    if (diffInSeconds < 60) {
      return "Online";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    // Nếu ngày truyền vào là ngày hiện tại
    if (diffInDays === 0) {
      if (diffInHours > 0) {
        return `${diffInHours} giờ trước`;
      }
      if (diffInMinutes > 0) {
        return `${diffInMinutes} phút trước`;
      }
      return `${diffInSeconds} giây trước`;
    }

    // Nếu ngày truyền vào trong tuần (vượt quá ngày hôm nay nhưng không quá 7 ngày)
    if (diffInDays <= 7) {
      return `${diffInDays} ngày trước`;
    }

    // Nếu ngày đã vượt quá 7 ngày, hiển thị theo định dạng ngày/tháng/năm
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Trả về theo định dạng ngày/tháng/năm giờ:phút
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
};


const formatDate = (datetimeStr) => {
  const date = new Date(datetimeStr);
  const now = new Date();

  // Tính toán sự chênh lệch giữa ngày hiện tại và ngày truyền vào
  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // Nếu ngày truyền vào là ngày hiện tại
  if (diffInDays === 0) {
    if (diffInHours > 0) {
      return `${diffInHours} giờ trước`;
    }
    if (diffInMinutes > 0) {
      return `${diffInMinutes} phút trước`;
    }
    return `${diffInSeconds} giây trước`;
  }

  // Nếu ngày truyền vào trong tuần (vượt quá ngày hôm nay nhưng không quá 7 ngày)
  if (diffInDays <= 7) {
    return `${diffInDays} ngày trước`;
  }

  // Nếu ngày đã vượt quá 7 ngày, hiển thị theo định dạng ngày/tháng/năm
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // Trả về theo định dạng ngày/tháng/năm giờ:phút
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};




const ChatPage = styled.div`
background-color: var(--cl_1);
  overflow: hidden;
  border-radius: 0.5rem;
  box-shadow: 0 0 0.2rem var(--shadow-black);
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 0.1rem;
  color: var(--cl_2);
  ::-webkit-scrollbar-track {
    background: var(--cl_1);
    /* Màu nền của phần track */
  }

  ::-webkit-scrollbar-thumb {
    background-image: linear-gradient(to bottom, var(--cl_1), var(--cl_2));
    /* Màu của thanh cuộn */
    //border-radius: 6px;
    // border: 0.01rem solid black;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-image: linear-gradient(to bottom, var(--cl_1), var(--cl_2));
    /* Màu của thanh cuộn */
  }
  .left,
  .right {
    width: 100%;
    background-color: var(--cl_1);
  }
  .left {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    border-right: 0.1rem solid var(--cl_2);
    .top {
      display: flex;
      flex-direction: column;

      gap: 0.5rem;
      padding: 1rem 1rem 0;
      .b_1 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title {
          font-size: 18px;
          font-weight: 700;
        }
        i {
          font-size: 18px;
        }
      }
      .b_2 {
        .b_search {
          background-color: white;
          position: relative;
          border-radius: 0.3rem;
          overflow: hidden;
          input {
            outline: none;
            border: none;
            width: 100%;
            background-color: white;
            height: 2.5rem;
            padding: 0 0.5rem 0 2.2rem;
          }
          i {
            position: absolute;
            top: 50%;
            left: 0;
            font-size: 1.2rem;

            transform: translate(50%, -50%);
            color: var(--shadow-black);
          }
        }
      }
    }
    .bottom {
      padding-bottom: 1rem;
      .box_stompClient {
        padding: 0 1rem 1rem;
        height: 30rem;
        overflow-y: scroll;
        scrollbar-width: initial;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        .item {
          display: flex;
          transition: 0.3s ease-in;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          // background-color: var(--cl_3);
          border-radius: 0.3rem;

          padding: 0.3rem 0.5rem;
          .b_left_item {
            width: 15%;
            position: relative;
            img {
              width: 100%;
              aspect-ratio: 1/1;
              border-radius: 50%;
            }
            ._circleOnline {
              position: absolute;
              bottom: 0;
              transform: translate(-20%, -20%);
              right: 0;
              width: 0.6rem;
              height: 0.6rem;
              display: inline-block;
              padding-left: 0.5rem;
              border-radius: 50%;
              background-color: greenyellow;
            }
          }
          .b_right_item {
            .name_hos {
              font-size: var(--fz_small);
              color: var(--cl_4);
              font-weight: 700;
            }
            .name {
              font-weight: 700;
            }
            .last_message {
              display: flex;
              gap: 0.5rem;
              align-items: center;
              span {
                font-size: var(--fz_small);
              }
              .time_ {
                font-size: var(--fz_smallmax);
              }
            }
          }
        }
        .item:hover {
          background-color: var(--cl_3);
        }
      }
    }
  }
  .right {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .top {
      padding: 0.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0.1rem 0 0.1rem var(--shadow-white);
      .c_1 {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        img {
          width: 40px;
          aspect-ratio: 1/1;
          object-fit: cover;
          border-radius: 50%;
        }
        .b_client {
          .name {
            font-weight: 700;
          }
          .status {
            font-size: var(--fz_smallmax);
            display: flex;
            align-items: center;
            gap: 0.3rem;
            padding-top: 0.2rem;
            ._circleOnline {
              width: 0.6rem;
              height: 0.6rem;
              display: inline-block;
              padding-left: 0.5rem;
              border-radius: 50%;
              background-color: greenyellow;
            }
          }
        }
      }
    }
    .center {
      padding: 1rem 0;
      .b_message_list {
        height: 26rem;
        overflow-y: scroll;
        padding: 0 1rem;
        scrollbar-width: initial;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        .me,
        .you {
          max-width: 450px;
          background-color: white;
          padding: 10px;
          min-width: 300px;
          border-radius: 0.3rem;
          .send {
            font-size: 13px;
            // background-color: red;
            font-weight: 700;
            color: white;
          }
          .contentMessage {
            color: white;
            padding: 0.2rem 0;
          }
          .time {
            color: white;
            text-align: right;
            font-size: 10px;
          }
        }
        .me {
          background-color: rgb(15, 75, 255);
        }
        .you {
          background-color: white;
          p {
            color: rgb(0, 53, 83) !important;
          }
        }
        .box_item_me {
          display: flex;
          justify-content: right;
          gap: 0.5rem;

          img {
            width: 40rem;
            aspect-ratio: 1/1;
            border-radius: 50%;
          }
        }
        .box_item_you {
          display: flex;
          justify-content: left;
          gap: 0.5rem;
          align-items: center;
          img {
            width: 40px;
            height: fit-content;
            aspect-ratio: 1/1;
            border-radius: 50%;
          }
        }
      }
    }
    .bottom {
      padding-bottom: 0.5rem;
      form {
        display: flex;
        padding: 0 0.5rem;
        justify-content: space-between;
        input {
          width: 80%;
          height: 2.5rem;

          outline: none;
          border: none;
          padding: 0 0.5rem;
        }
        button {
          width: 20%;
          height: 2.5rem;
          outline: none;
          border: none;
          background-color: var(--cl_4);
          font-weight: 700;
          color: white;
        }
      }
    }
  }
`;
