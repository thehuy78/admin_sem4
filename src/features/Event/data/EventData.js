import styled from "styled-components";



export const status = [
  { value: "", label: "All" },
  { value: "active", label: "Active" },
  { value: "deactive", label: "Deactive" }
]

export const EventPage = styled.div`
width: 100%;
display: flex;
flex-direction: column;
gap: 0.5rem;


.section_filter {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  .left {
    display: flex;
    gap: 1rem;
    button {
        height: 2.5rem;
        padding: 0 2rem;
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
min-height:31rem;
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
          height:58px;
            padding: 0 0.5rem;
            text-align: center;
            font-size: var(--fz_small);
            width: max-content;
            white-space: nowrap;
            
          }
        }
      }
    }
  }
}
`;

export const EventVaccineDetailsPage = styled.div`
  .top_content {
    .name__ {
      padding: 1rem;
      background-color: var(--cl_2);
      font-size: var(--fz_medium);
      font-weight: 800;
      color: var(--cl_2);
      text-align: center;
      color: var(--white);
    }
  }
  .bottom_content {
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: 1rem;
  }
  .left_content,
  .right_content {
    background-color: var(--white);
    width: 100%;
    padding: 1rem;
  }
  .right_content {
    .code__ {
      font-weight: 800;
      color: orange;
      font-size: var(--fz_small);
    }
    .user__ {
      font-size: var(--fz_smallmax);
      font-weight: 800;
      color: var(--cl_2);
    }
    .description__ {
      padding: 0 1rem;
    }
  }
  .left_content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    .box_hospital__ {
      padding: 0.5rem 1rem;
      background-color: var(--cl_2);
      color: var(--white);
      border-radius: 0.5rem;
      .name {
        font-weight: 800;
        color: orange;
      }
      .code {
        font-size: var(--fz_small);
      }
      .box_vaccine__list {
        padding-top: 0.5rem;
        display: flex;
        width: 100%;
        flex-direction: column;

        gap: 0.5rem;

        .box_vaccine__ {
          background-color: var(--white);
          color: var(--cl_2);
          padding: 0.5rem;
          .v_name {
            font-weight: 800;
          }
          .row__ {
            display: grid;
            grid-template-columns: 1fr 1fr;
            p {
              width: 100%;
            }
          }
            .v_status_accept {
  padding: 0.2rem 2rem;
  background-color: green;
  font-size: var(--fz_smallmax);
  color: white;
  cursor: pointer;
}
.v_status_denied {
  padding: 0.2rem 2rem;
  background-color: red;
  font-size: var(--fz_smallmax);
  color: white;
  cursor: pointer;
}
        }
      }
    }
  }
`;