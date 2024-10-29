import styled from "styled-components";

export const departmentjson = [
  {
    "codehospital": "BVCG1",
    "name": "Khoa Tim Mạch",
    "floor": "8",
    "zone": "C",
    "doctorCount": 18,
    "status": "active",
    "doctor": 1
  },
  {
    "codehospital": "BVCG2",
    "name": "Khoa Nội Tiết",
    "floor": "5",
    "zone": "A",
    "doctorCount": 12,
    "status": "deactive",
    "doctor": 2
  },
  {
    "codehospital": "BVCG3",
    "name": "Khoa Da Liễu",
    "floor": "3",
    "zone": "B",
    "doctorCount": 8,
    "status": "active",
    "doctor": 3
  },
  {
    "codehospital": "BVCG4",
    "name": "Khoa Nhi",
    "floor": "6",
    "zone": "D",
    "doctorCount": 15,
    "status": "active",
    "doctor": 4
  },
  {
    "codehospital": "BVCG5",
    "name": "Khoa Sản",
    "floor": "7",
    "zone": "C",
    "doctorCount": 20,
    "status": "deactive",
    "doctor": 5
  },
  {
    "codehospital": "BVCG6",
    "name": "Khoa Ngoại",
    "floor": "4",
    "zone": "B",
    "doctorCount": 17,
    "status": "active",
    "doctor": 6
  },
  {
    "codehospital": "BVCG7",
    "name": "Khoa Chấn Thương Chỉnh Hình",
    "floor": "9",
    "zone": "A",
    "doctorCount": 22,
    "status": "active",
    "doctor": 7
  },
  {
    "codehospital": "BVCG8",
    "name": "Khoa Thần Kinh",
    "floor": "8",
    "zone": "D",
    "doctorCount": 14,
    "status": "deactive",
    "doctor": 8
  },
  {
    "codehospital": "BVCG9",
    "name": "Khoa Hô Hấp",
    "floor": "5",
    "zone": "C",
    "doctorCount": 11,
    "status": "active",
    "doctor": 9
  },
  {
    "codehospital": "BVCG10",
    "name": "Khoa Tiêu Hóa",
    "floor": "6",
    "zone": "B",
    "doctorCount": 16,
    "status": "deactive",
    "doctor": 10
  },
  {
    "codehospital": "BVCG11",
    "name": "Khoa Mắt",
    "floor": "3",
    "zone": "A",
    "doctorCount": 9,
    "status": "active",
    "doctor": 11
  },
  {
    "codehospital": "BVCG12",
    "name": "Khoa Tai Mũi Họng",
    "floor": "7",
    "zone": "D",
    "doctorCount": 13,
    "status": "deactive",
    "doctor": 12
  },
  {
    "codehospital": "BVCG13",
    "name": "Khoa Dinh Dưỡng",
    "floor": "4",
    "zone": "C",
    "doctorCount": 10,
    "status": "active",
    "doctor": 13
  },
  {
    "codehospital": "BVCG14",
    "name": "Khoa Lão Khoa",
    "floor": "2",
    "zone": "B",
    "doctorCount": 7,
    "status": "deactive",
    "doctor": 14
  },
  {
    "codehospital": "BVCG15",
    "name": "Khoa Cấp Cứu",
    "floor": "1",
    "zone": "A",
    "doctorCount": 25,
    "status": "active",
    "doctor": 15
  }
];

export const statusDeparment = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'deactive', label: 'Deactive' },

];

export const ListDepartmentPage = styled.div`
width: 100%;
display: flex;
flex-direction: column;
gap: 0.5rem;
padding: 1rem 0;

.section_filter {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  .left {
    display: flex;
    gap: 1rem;
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
min-height:28rem;
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
            padding: 1rem 0.5rem;
            text-align: center;
            font-size: var(--fz_small);
            width: max-content;
            white-space: nowrap;
            .active {
padding: 0.2rem;
font-size: var(--fz_smallmax);
color: green;
border-radius: 0.5rem;
cursor: pointer;
   font-weight: 700;
text-transform: capitalize;
}
.deactive {
padding: 0.2rem;
font-size: var(--fz_smallmax);
color: orange;
border-radius: 0.5rem;
cursor: pointer;
  font-weight: 700;
text-transform: capitalize;

}
          }
        }
      }
    }
  }
}
`;

export const headerjson = ["code hospital", "name hospital", "code", "name", "floor", "zone", "doctorCount", "create", "status"]
