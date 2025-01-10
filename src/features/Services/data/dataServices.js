import styled from "styled-components";

export const ServicePage = styled.div`

  padding:0 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  .sec1 {
    display: flex;
    justify-content: space-between;
    .left {
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
      .button_view {
        height: 2.5rem;
        width: 2.5rem;
        display: flex;
        cursor: pointer;
        justify-content: center;
        align-items: center;
        background-color: white;
        border-radius: 0.3rem;
        border: 1px solid var(--shadow-black);
        box-shadow: 0 0 2px var(--shadow-black);
      }
    }
  }
  .sec2 {
    .b_table {
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
              height: 62px;
              padding: 0 0.5rem;
              text-align: center;
              font-size: var(--fz_small);
              width: max-content;
              white-space: nowrap;
              div {
                display: flex;
                justify-content: center;
                p {
                  width: fit-content;
                  padding: 0.2rem 1rem;
                  font-size: var(--fz_smallmax);

                  border-radius: 0.5rem;
                  cursor: pointer;
                  color: white;
                  text-transform: capitalize;
                }
                .active {
                  background-color: green;
                  cursor: pointer;
                }
                .deactive {
                  background-color: orange;
                  cursor: pointer;
                }
                i {
                  cursor: pointer;
                }
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
                    padding: 0.4rem;
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
  .moc_up_service {
    position: fixed;
    z-index: 5;
    background-color: rgba(0, 0, 0, 0.516);
    inset: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    form {
      background-color: white;
      padding: 2rem;
      border-radius: 0.5rem;
      box-shadow: 0 0 0.5rem var(--shadow-black);
      position: relative;
      .title {
        text-align: center;
        font-size: var(--fz_medium);
        font-weight: 700;
        padding: 0.5rem 0 1rem 0;
      }
      .close {
        position: absolute;
        background-color: var(--shadow-black);
        right: 0.5rem;
        top: 0.5rem;
        // padding: 0.5rem;
        cursor: pointer;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        text-align: center;
      }
      div {
        display: flex;
        flex-direction: column;
        padding: 0.5rem 0;
        width: 20rem;
        label {
          font-size: var(--fz_small);
          text-transform: uppercase;
          font-weight: 700;
          padding: 0.2rem 0;
          color: var(--gray);
        }
        input {
          width: 100%;
          line-height: 1.2rem;
          padding: 0.7rem 0.5rem;
          border: none;
          outline: none;
          min-height: 3rem;
          border-radius: 0.3rem;
          border: 0.05rem solid var(--shadow-black);
          box-shadow: 0 0 2px var(--shadow-black);

          &:focus {
            border: 1px solid var(--active);
          }
        }
        button {
          background-color: var(--cl_3);
          padding: 0.5rem 0;
          color: white;
          border: none;
          outline: none;
          border-radius: 0.3rem;
          box-shadow: 0 0 0.3rem var(--shadow-black);
        }
      }
    }
  }


`;