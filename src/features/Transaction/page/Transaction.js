import React, { useCallback, useEffect, useState } from "react";
import { NotificationContainer } from "react-notifications";
import LoadingPage from "../../../shared/Config/LoadingPage";
import RangeDateInput from "../../../shared/component/InputFilter/RangeDateInput";
import { theadTopic, TransactionPage, typeTransaction } from "../data/dataTransaction";
import { formatDate, formatDateNotTime } from "../../../shared/function/FomatDate";
import { renderPagination } from "../../../shared/function/Pagination";
import { useAdminContext } from "../../../shared/hook/ContextToken";
import { apiRequestAutherize } from "../../../shared/hook/Api/ApiAuther";
import { createNotification } from "../../../shared/Config/Notifications";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { formatNumberWithDot } from "../../../shared/function/FomatNumber";
import SelectInput from "../../../shared/component/InputFilter/SelectInput";
export default function Transaction() {
  const today = new Date();
  const endDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59,
    999
  );
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 90);
  const startDate = new Date(
    thirtyDaysAgo.getFullYear(),
    thirtyDaysAgo.getMonth(),
    thirtyDaysAgo.getDate(),
    0,
    0,
    0,
    0
  );
  const [dateRange, setDateRange] = useState([startDate, endDate]);
  const navigate = useNavigate();
  const [, , removeCookie] = useCookies(["authorize_token_admin"]);
  const [isLoading, setIsLoading] = useState(true);
  const [transaction, setTransaction] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState({
    page: 0,
    size: 10,
  });
  const [type, setType] = useState("")
  const handlePage = (value) => {
    setPage((prev) => ({
      ...prev,
      page: value - 1,
    }));
  };
  const { token } = useAdminContext();
  useEffect(() => {
    setPage((prev) => ({ ...prev, page: 0 }));
  }, [dateRange, type]);

  const fetchData = useCallback(async () => {
    try {
      if (token) {
        var data = {
          type: type,
          page: page.page,
          size: page.size,
          startDate: dateRange[0].toISOString(),
          endDate: dateRange[1].toISOString(),
        };
        var rs = await apiRequestAutherize(
          "POST",
          "transaction/getall",
          token,
          data
        );
        console.log(rs);
        if (rs && rs.data && rs.data.status === 200) {
          setTransaction(rs.data.data.content);
          setTotalPage(rs.data.data.totalPages);
        } else {
          createNotification("warning", rs.data.message, "Warning")();
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        createNotification(
          "warning",
          "Your role is not accessible",
          "Warning"
        )();
      } else if (error.response && error.response.status === 401) {
        createNotification("error", "Login session expired", "Error")();
        setTimeout(() => {
          removeCookie("authorize_token_admin", { path: "/admin_sem4" });
        }, 1000);
      } else {
        createNotification("error", error.message && error.message, "Error")();
      }
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, page, token, removeCookie, type]);



  const exportFile = async () => {
    try {
      if (token) {
        var data = {
          type: type,
          page: page.page,
          size: page.size,
          startDate: dateRange[0].toISOString(),
          endDate: dateRange[1].toISOString(),
        };
        var rs = await apiRequestAutherize(
          "POST",
          "transaction/export",
          token,
          data
        );
        console.log(rs);
        if (rs && rs.data && rs.data.status === 200) {
          const byteCharacters = atob(rs.data.data);
          const byteNumbers = Array.from(byteCharacters, (char) =>
            char.charCodeAt(0)
          );
          const byteArray = new Uint8Array(byteNumbers);

          // Tạo file blob
          const blob = new Blob([byteArray], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          // Tạo link download
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `transaction_${formatDateNotTime(dateRange[0].toISOString())}_${formatDateNotTime(dateRange[1].toISOString())}.xlsx`);
          document.body.appendChild(link);
          link.click();
          link.remove();
          createNotification('success', "Export File Success", "Success")()
        } else {
          createNotification('error', "Export File Fails", "Export Fails")()
        }
      }
    } catch (error) {
      createNotification('error', "Export File Fails", "Export Fails")()
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <TransactionPage>
      <NotificationContainer />
      <LoadingPage isloading={isLoading} />

      <section className="section_filter">
        <div className="left">
          <SelectInput
            defaultVl={typeTransaction.find((option) => option.value === type)}
            options={typeTransaction}
            multi={false}
            fnChangeOption={(selected) => {
              setType(selected.value)
            }}
          />
        </div>
        <div className="right">
          <RangeDateInput
            defaultValue={dateRange}
            fnChangeValue={(e) => {
              setDateRange(e);
            }}
          />
          <div className="r_b_filter_column">
            <div
              className="b_filter_column"
              onClick={exportFile}
            >
              <i className="fa-solid fa-download"></i>
            </div>
          </div>
        </div>
      </section>
      <section className="section_list">
        <div className="data_table">
          <table className="table_">
            <thead>
              {theadTopic &&
                theadTopic.length > 0 &&
                theadTopic.map((item, index) => (
                  <th className={item} key={index}>
                    {item}
                  </th>
                ))}
            </thead>
            <tbody>
              {transaction && transaction.length > 0 ? (
                transaction.map((item, index) => (
                  <tr key={index}>
                    <td>{item.email}</td>
                    <td
                      style={{
                        color: item.traded > 0 ? "green" : "red",
                        fontWeight: "800",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {formatNumberWithDot(item.traded)} vnđ
                    </td>
                    <td>{item.description}</td>
                    <td>{formatDate(item.createDate)}</td>
                    <td>{formatDate(item.updateDate)}</td>
                    <td>
                      <p
                        className={
                          item.status && item.status.toLowerCase() === "active"
                            ? "active"
                            : "deactive"
                        }
                      >
                        {item.status}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={theadTopic.length + 1}
                    style={{ textAlign: "center" }}
                  >
                    Not data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div>
          {totalPage > 0 && (
            <div className="pagination">
              <button
                onClick={() => {
                  setPage((prev) => ({ ...prev, page: page.page - 1 }));
                }}
                disabled={page.page + 1 === 1}
              >
                Prev
              </button>
              {renderPagination(page.page + 1, totalPage, handlePage)}
              <button
                onClick={() => {
                  setPage((prev) => ({ ...prev, page: page.page + 1 }));
                }}
                disabled={page.page + 1 === totalPage}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </TransactionPage>
  );
}
