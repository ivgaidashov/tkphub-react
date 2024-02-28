import React, { useState, useEffect } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import httpClient from "../utils/ApiRequests";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useRecoilState } from "recoil";
import { userState } from "../atoms/ModalAtoms";

import { DataAcc } from "../Interfaces";

const TaxAgencyNtf = () => {
  const navigate = useNavigate();

  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.post(`//${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKENDPORT}/@me`, {
          page: 1,
        });
        setUser(resp.data?.login_id);
        refresh();
      } catch (error) {
        console.log("Not authenticated");
        navigate("/");
      }
    })();
  }, []);

  const [account, setAccount] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const [accError, setAccError] = useState<string>("");
  const [dateError, setDateError] = useState<string>("");

  const [data, setData] = useState<DataAcc>({ acc: "", date: "" });
  const [latestRecords, setLatestRecords] = useState<DataAcc[] | null>(null);

  const reg_acc = new RegExp("^[0-9]{20}$");
  const reg_date = new RegExp(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);

  /*const latestRecords: DataAcc[] = [
    {
      acc: "60305810600000000954",
      date: "20.01.2013",
    },
    {
      acc: "40802840300012004098",
      date: "31.12.2002",
    },
    {
      acc: "40817810300000004098",
      date: "14.02.1995",
    },
  ];*/

  const handleAccount = (event: any) => {
    setAccount(event.target.value);
    if (reg_acc.test(account)) {
      setData({
        ...data,
        acc: account,
      });
    };
  };

  const handleDate = (event: any) => {
    setDate(event.target.value);
    if (reg_date.test(date)) {
      setData({
        ...data,
        date,
      });

  };}

  const notifySuccess = () =>
    toast.success(`Счёт ${data.acc} с датой ${data.date} успешно добавлен`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const notifyError = () =>
    toast.error("Ошибка. Данные не обновлены", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const upload = async () => {
    

    if (reg_acc.test(account) && reg_date.test(date)) {
      setData({
        acc: account,
        date,
      });

      try {
        const resp = await httpClient.post(
          `//${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKENDPORT}/tax_agency_upload`,
          {acc: account,
          date: date}
        );
        notifySuccess();

        console.log(data);
        console.log(resp.data);
      } catch (e: any) {
        /*if (e.response.status == 401) */
        console.log(e);
        notifyError();
      }

      setDateError("");
      setAccError("");
    } else {
      notifyError();
      if (!reg_acc.test(account)) {
        setAccError("Неверный формат");
      } else {
        setAccError("");
      }
      if (!reg_date.test(date)) {
        setDateError("Неверный формат");
      } else {
        setDateError("");
      }
    }

    console.log(data);
  };

  const refresh = async () => {
    const resp = await httpClient.post(
      `//${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKENDPORT}/tax_agency_notif_update`
    );
    setLatestRecords(resp.data);
  };

  return (
    <div className="mt-2">
      <div className="flex flex-col items-center h-screen">
        <div className="relative w-full h-1/3 bg-color-info-light border-2 rounded-xl border-color-light shadow-sm flex flex-col">
          <h2 className="text-3xl mt-10 mb-2 text-center">
            Обновление дат уведомлений Налоговой
          </h2>

          <div className="flex justify-center items-start ">
            <form className="flex flex-col items-center w-1/2 px-14">
              <label className="text-xl mt-5">Номер счёта</label>
              <input
                value={account}
                onChange={handleAccount}
                className="w-3/4 mt-2 customInputField"
                type="text"
                placeholder="20 знаков"
              />

              <label className="text-sm text-color-danger">{accError}</label>
            </form>

            <form className="flex flex-col items-center w-1/2 px-14">
              <label className="text-xl mt-5">Дата уведомления</label>
              <input
                value={date}
                onChange={handleDate}
                className="w-3/4 mt-2 customInputField"
                type="text"
                placeholder="дд.мм.гггг"
              />

              <label className="text-sm text-color-danger">{dateError}</label>
            </form>
          </div>

          <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2">
            <button className="customButton" onClick={upload}>
              Загрузить
            </button>
          </div>
        </div>

        <div className=" w-1/2 mt-10 flex flex-col justify-center items-center">
          <div className="flex w-4/5 mb-5 justify-around">
            <h2 className="text-2xl text-center font-normal">
              Последние добавленные счета
            </h2>
            <ArrowPathIcon
              className="w-6 ml-2 hover:rotate-45 ease-in-out duration-200 cursor-pointer"
              onClick={refresh}
            />
          </div>

          <table className="w-4/5 m-auto border-separate">
            <thead>
              <tr className="bg-color-light text-xl shadow-sm font-normal">
                <th className="rounded-l-xl font-normal">Счёт</th>
                <th className="rounded-r-xl font-normal">Дата</th>
              </tr>
            </thead>
            <tbody className="text-center text-xl ">
              {latestRecords?.map((map, i) => (
                <tr className="mt-2" key={i}>
                  <td>{map.acc}</td>
                  <td>{map.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 italic">Последние 5 добавленных счетов</p>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default TaxAgencyNtf;
