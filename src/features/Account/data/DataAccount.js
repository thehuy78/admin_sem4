import styled from "styled-components";

export const dataaccountadmin = [
  {
    email: "huy@gmail.com",
    avatar: "",
    firstName: "Huy",
    lastName: "Nguyễn",
    role: "customer",
    verify: "yes",
    hospital: "Bệnh Viện Chợ Rẫy",
    createDate: "12/12/2024 12:11",
    updateDate: "12/12/2024 12:11",
    status: "active",
  },
];

export const theadTopicCus = [
  "email",
  "avatar",
  "firstName",
  "lastName",
  "role",
  "verify",
  "balance",
  "createDate",
  "updateDate",
  "status",
];

export const theadTopicAd = [
  "email",
  "avatar",
  "firstName",
  "lastName",
  "hospital",
  "verify",
  "role",
  "createDate",
  "updateDate",
  "status",
];

export const ListAccountPage = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding:0 0 1rem 0;

  .section_filter {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;

    .left {
      display: flex;
      gap: 0.5rem;
      button {
        height: 2.5rem;
       width:2.5rem;
        outline: none;
        border: none;
        background-color: green;
        color: white;
        font-weight: 700;
        border-radius: 0.3rem;
        box-shadow: 0 0 0.2rem var(--shadow-black);
      }
    }
    .right {
      display: flex;
      gap: 0.5rem;
      .r_b_filter_column {
        position: relative;
        .b_filter_column {
          height: 2.5rem;
          width: 2.5rem;
          cursor: pointer;
          background-color: white;
          aspect-ratio: 1/1;
          border-radius: 0.3rem;
          border: 1px solid var(--shadow-black);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .overlay {
          position: absolute;
          right: 0;
          padding-top: 0.5rem;

          .triangle {
            position: absolute;
            top: 10px; /* Adjust this value to change the vertical position */
            right: 0.6rem; /* Move the triangle to the left of the overlay */
            /* Adjusts the distance from the overlay */
            z-index: 0;
            top: 0;
            height: 0;
            border-left: 0.5rem solid transparent; /* Left border */
            border-right: 0.5rem solid transparent; /* Right border */
            border-bottom: 0.5rem solid var(--white); /* Bottom border color */
          }
          .list_action {
            background-color: var(--cl_1);
            border-radius: 0.3rem;
            border: 1px solid var(--white);
            padding: 1rem;
            width: max-content;
            display: flex;
            flex-direction: column;
            gap: 0.6rem;
            div {
              display: flex;
              gap: 0.5rem;
            }
          }
        }
      }
    }
  }
  .section_list {
    width: 100%;
    display: flex;
    flex-direction: column;
    .data_table {
      overflow-x: auto;
      scrollbar-width: thin;
      min-height: 30rem;
      .table_ {
        border-collapse: collapse;
        width: 100%;
        thead {
          background-color: var(--cl_3);
          th {
            padding: 0.5rem 0.3rem;
            color: white;
            font-size: 1rem;
            font-weight: 700;
            text-transform: capitalize;
          }
        }

        tbody {
          background-color: white;

          tr {
            border-bottom: 0.05rem solid var(--shadow-black);
            td {
              height: 60px;
              padding: 0.3rem 0.5rem;
              text-align: center;
              font-size: var(--fz_small);
              width: max-content;
              white-space: nowrap;
              .active {
                padding: 0.2rem;
                font-size: var(--fz_smallmax);
                background-color: green;
                border-radius: 0.5rem;
                cursor: pointer;
                color: white;
                 text-transform: capitalize;
              }
              .deactive {
                padding: 0.2rem;
                font-size: var(--fz_smallmax);
                background-color: orange;
                border-radius: 0.5rem;
                cursor: pointer;
                color: white;
                 text-transform: capitalize;
              }
                .b_action___ {
                display: flex;
                gap: 1rem;
                justify-content: center;
                .link_tag {
                  i {
                    display: flex;
                    align-items: center;
                    background-color: var(--cl_1);
                    justify-content: center;
                    padding:0.4rem ;
                    border-radius: 0.2rem;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
export const status = [
  { value: "", label: "All" },
  { value: "active", label: "Active" },
  { value: "deactive", label: "Deactive" },
];


export const CreateAccountPage = styled.div`

  padding:0 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  .sec1 {
    width: 100%;
    form {
      padding: 1rem;
      width: 100%;
      max-width: 800px;
      margin: auto;
      background-color: white;
      border-radius: 0.5rem;
      box-shadow: 0 0 0.2rem var(--shadow-black);
      .title {
        text-align: center;
        font-size: var(--fz_medium);
        font-weight: 750;
        padding-bottom: 1rem;
      }
      .form_input_container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 1rem;
      }
      .box_btn {
        display: flex;
        justify-content: center;
        button {
          padding: 0.5rem 3rem;
          outline: none;
          border: none;
          border-radius: 0.3rem;
          background-color: var(--cl_4);
          color: white;
          font-weight: 750;
          box-shadow: 0 0 0.2rem var(--shadow-black);
        }
      }
    }
  }


`;
