import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

const SelectServicePage = styled.div`
  width: 100%;
  padding: 1rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 4rem;
  align-items: center;
  .title {
    font-size: var(--fz_max);
    font-weight: 800;
  }
  .grid_ {
    display: grid;
    width: 80%;
    margin: auto;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    .link_tag {
      width: 100%;
    }
    @keyframes hoveShake {
      0% {
        transform: scale(1.02);
      }
      50% {
        transform: scale(0.98);
      }
      100% {
        transform: scale(1.02);
      }
    }
    .item {
      background-color: var(--cl_2);
      width: 80%;
      margin: auto;
      padding: 1.5rem 0;
      color: var(--white);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.5rem;
      box-shadow: 0 0 0.2rem var(--shadow-black);
      gap: 2rem;
      cursor: pointer;
      i {
        font-size: var(--fz_max);
      }
      p {
        font-size: var(--fz_medium);
        font-weight: 800;
      }
    }
    .item:hover {
      animation: hoveShake infinite 0.8s;
    }
  }
`;

export default function SelectService() {
  const { code } = useParams();
  const navigate = useNavigate();
  return (
    code && (
      <SelectServicePage>
        <section className="brums_nav" style={{ width: "100%" }}>
          <span
            onClick={() => {
              navigate(-1);
            }}
          >
            <i class="fa-solid fa-arrow-left"></i> Back
          </span>
        </section>
        <div className="title">Select Service Hospital</div>
        <div className="grid_">
          <Link className="link_tag" to={`/admin/hospital/${code}/department`}>
            <div className="item">
              <i class="fa-solid fa-stethoscope"></i>
              <p>Department</p>
            </div>
          </Link>
          <Link className="link_tag" to={`/admin/hospital/${code}/testing`}>
            <div className="item">
              <i class="fa-solid fa-vial"></i>
              <p>Testing</p>
            </div>
          </Link>
          <Link className="link_tag" to={`/admin/hospital/${code}/package`}>
            <div className="item">
              <i class="fa-solid fa-briefcase"></i>
              <p>Package</p>
            </div>
          </Link>
          <Link className="link_tag" to={`/admin/hospital/${code}/vaccine`}>
            <div className="item">
              <i class="fa-solid fa-syringe"></i>
              <p>Vaccine</p>
            </div>
          </Link>
        </div>
      </SelectServicePage>
    )
  );
}
