import React from "react";
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { modalState, userState } from "../atoms/ModalAtoms";
import { ToastContainer, toast } from "react-toastify";
import httpClient from "../utils/ApiRequests";
import { ModulesType } from "../Interfaces";

interface ChildProps  {
    setModules: (value: ModulesType[]) => void,
    modules: ModulesType[] | null
};

const Login =  ({setModules, modules}: ChildProps) => {
  const [login, setLogin] = useState<string>("");
  const [pass, setPass] = useState<string>("");

  const [open, setOpen] = useRecoilState(modalState);
  const [user, setUser] = useRecoilState(userState);

  const data = [
    {
      id: 1,
      title: "12211212",
      description:
        "Внесение даты уведомления Налоговой об открытии счета, заведенного до 2015 года.",
      icon: "BellIcon",
      available: 1,
      link: "tax_agency_notification",
    },
    {
      id: 2,
      title: "Познай своего клиента",
      description:
        "Напоминаем о необходимости предоставления отчетности для консолидации и передачи в НСПК.",
      icon: "UserIcon",
      available: 1,
      link: "learn_your_client",
    },
    {
      id: 3,
      title: "Неизвестные тарифы",
      description:
        "Обращаю особое внимание на требование по наименованию присылаемого файла: ",
      icon: "BanknotesIcon",
      available: 1,
      link: "mysterious_rates",
    },
  ];

  const notifyError = () =>
    toast.error("Неверный логин или пароль", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const HandleSignIn = async () => {
    try {
      const resp = await httpClient.post(`//${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKENDPORT}/login`, {
        login,
        password: pass,
      });
      setModules(resp.data.avalableTables);
      console.log(resp.data.avalableTables);

      setOpen(false);
      setUser(login);
    } catch (e: any) {
      if (e.response.status == 401) notifyError();
    }
  };

  return (
    <div className="fixed inset-0 bg-color-dark bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
      <ToastContainer />
      <div className="bg-color-info-light p-2 rounded-lg flex flex-col justify-center items-center w-1/5 h-1/3 shadow-md">
        <h1 className="font-semibold text-center text-xl text-gray-700">
          Введите логин и пароль 
        </h1>

        <div className="flex flex-col mt-10 mb-5">
          <input
            type="text"
            value={login}
            className="customInputField mb-3"
            placeholder="Логин"
            onChange={(event) => setLogin(event.target.value.toUpperCase())}
          />
          <input
            type="password"
            value={pass}
            className="customInputField"
            placeholder="Пароль"
            onChange={(event) => setPass(event.target.value)}
          />
        </div>
        <div className="text-center">
          <button className="customButton" onClick={HandleSignIn}>
            Вход
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
