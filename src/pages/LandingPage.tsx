import React, {useEffect, useState} from "react";
import ToolCard from "../components/ToolCard";
import {modalState, userState} from "../atoms/ModalAtoms";
import { useRecoilState } from "recoil";
import Login from "../components/Login";
import httpClient from "../utils/ApiRequests";
import { ModulesType } from "../Interfaces";



const LandingPage: React.FC = () => {
    const [open, setOpen] = useRecoilState(modalState);
    const [user, setUser] = useRecoilState(userState);
    const [modules, setModules] = useState<ModulesType[] | null>(null)
    
    const data = [
    {
      id: 1,
      title: "12211212",
      description:
        "Внесение даты уведомления Налоговой об открытии счета, заведенного до 2015 года.",
      icon: "BellIcon",
      available: 0,
      link: "tax_agency_notification",
    },
    {
      id: 2,
      title: "Познай своего клиента",
      description:
        "Напоминаем о необходимости предоставления отчетности для консолидации и передачи в НСПК.",
      icon: "UserIcon",
      available: 0,
      link: "learn_your_client",
    },
    {
      id: 3,
      title: "Неизвестные тарифы",
      description:
        "Обращаю особое внимание на требование по наименованию присылаемого файла: ",
      icon: "BanknotesIcon",
      available: 0,
      link: "mysterious_rates",
    }
  ];

    useEffect(() => {      
        (async () => {
          try { 
            const resp = await httpClient.post(`//${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKENDPORT}/@me`, {
              page: -1, /*значит что заходим с главной страницы*/
            });
            console.log(resp.data)
            setUser(resp.data?.login_id)
            setOpen(false);
          } catch (error:any) {
            console.log(error.response.status)
            if (!modules) {setModules(data)}

          }
        })();

      }, []);

      useEffect(() => {
        const fetchData = async () => {
            const data = await httpClient.post(`//${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKENDPORT}/getmodules`, {
             login: user
           });
           setModules(data?.data);
         }
        
         {!modules && user && fetchData();}
      }, [user])




  return (
    <div className="w-full h-full">
      <div className="flex  flex-wrap justify-center mb-10">
        {open  && <Login modules={modules} setModules={setModules}/>}
        <img
          src="/images/banner2.png"
          className="object-contain" 
          alt="..."
        />
      </div>
      <div className="grid w-full h-full grid-cols-3 gap-5 pb-10">
        {modules && modules.map((map, i) => (
          <ToolCard info={map} key={map.id} />
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
