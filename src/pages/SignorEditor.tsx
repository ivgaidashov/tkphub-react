import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import httpClient from "../utils/ApiRequests";
import Signors from "../components/Signors";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useRecoilState } from "recoil";
import { userState } from "../atoms/ModalAtoms";

import { userReports, reportData, responseSignors } from "../Interfaces";

export const SignorEditor = () => {
  const navigate = useNavigate();

  const [user, setUser] = useRecoilState(userState);

  const [selected, setSelected] = useState<string>("n/a");
  const [reports, setReports] = useState<userReports>({
    available_reports: ["Загрузка...", "...", "..."],
  });

  const [response, setResponse] = useState<responseSignors[] | null> (null)

  const [reportSet, setReportSet] = useState<reportData[]|null>(null);

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.post(`//${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKENDPORT}/@me`, {
          page: 3,
        });
        refresh();
      } catch (error) {
        console.log("Not authenticated");
        navigate("/");
      }
    })();
  }, []);

  const refresh = async () => {
    const resp = await httpClient.post(`//${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKENDPORT}/modify_signors`);
    setReports(resp.data);
    console.log(resp.data.available_reports);
    setSelected(resp.data.available_reports[0]);
  };

  /*const handleChangeOfDropDown = (event: any) => {
    setSelected(event.target.value);
  
    setReportSet(null);
    showSignors()
  };*/

  useEffect(() => {
    setReportSet(null);
    showSignors()

  }, [selected]);

  const showSignors = async () => {
    const resp = await httpClient.post(`//${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKENDPORT}/show_signors`, {
      report: selected,
    });
    setReportSet(resp.data);
    console.log(resp.data);
  };

  const handleInput = (inputEv:any, index:any, type:string) => {
    const value = inputEv.target.value;
    if (type === 'position')
    { 
      setReportSet(
        reportSet!.map(
          object => {
            if (object.id === index) {
              return {...object, CTITLE: value};
            }
            return object;
          }
        )
      )
    }

    if (type === 'name'){
      setReportSet(
        reportSet!.map(
          object => {
            if (object.id === index) {
              return {...object, CNAME: value};
            }
            return object;
          }
        )
      )
    }
  };

  const notifySuccess = () =>
    toast.success(`Данные обновлены`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const notifyError = (text: string) =>
    toast.error(text, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  useEffect(() => {
    response?.map((row) =>
    {row.result.includes("Ошибка:") ? notifyError(row.result): notifySuccess() }
    )

  }, [response]);

  const update = async () => {
    const resp = await httpClient.post(`//${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKENDPORT}/update_signors`, {
      reportSet,
    });
    setResponse(resp.data)
  };

  return (
    <div className="h-screen">
      <div className="flex w-full h-32 justify-start items-center">
        <div className="text-xl">
          Выберите отчёт для редактирования подписантов
        </div>
        <div className="ml-5">
          <select
            className="p-2.5 border border-color-warning bg-transparent rounded-md shadow-sm outline-none text-center text-xl"
            onChange={event => setSelected(event.target.value)}
          >
            {reports?.available_reports.map((report, i) => (
              <option key={i}>{report}</option>
            ))}
          </select>
          
        </div>
        {/*<div className="ml-5">
          <button className="customButton" onClick={showSignors}>
            Отобразить
          </button>
            </div>*/}
      </div>
   
        
        {/*the block of signors */}
         <div className="grid grid-cols-2 gap-5 ">
         {reportSet && reportSet.map((info, i) => (
          
          <Signors i={i} id={info.id} name={info.CNAME} position={info.CTITLE} handleInput={handleInput}/>
          /*<div className="border-2 border-my-slate rounded-md p-5 hover:border-off-white hover:shadow-lg hover:border-4 ease-in-out duration-200">
            <form className="flex items-center w-full mb-4 relative" >
              <p className="absolute -top-11 -left-2 bg-whitish p-2 italic">Позиция: {i+1}</p>
              <label className="text-xl w-32">Должность</label>
              <input
                value={info.CTITLE}
                onChange={(e) => handleInput(e, info.id, 'position')}
                className="flex-1 customInputField mr-3"
                type="text"
                placeholder="Загрузка..."
              />
            </form>
            <form className="flex items-center w-full" >
              <label className="text-xl w-32">ФИО</label>
              <input
                value={info.CNAME}
                onChange={(e) => handleInput(e, info.id, 'name')}
                className="flex-1 customInputField mr-3"
                type="text"
                placeholder="Загрузка..."
              />
            </form>
          </div>)*/)
          

          
         )}
        

          
        </div>
        {reportSet && <div className="w-full mt-10"><button className="customButtonTransparent" onClick={update}>
            Обновить
          </button></div>}
          <ToastContainer />
    </div>
  );
};

export default SignorEditor;
