import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import uuid from "react-uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeviceWindows from "../components/DeviceWindows";
import { useRecoilState } from "recoil";
import { userState } from "../atoms/ModalAtoms";
import httpClient from "../utils/ApiRequests";
import { devicePassport, idTitleList } from "../Interfaces";
import AllDevices from "../components/AllDevices";

const DeviceSpec = () => {
  const navigate = useNavigate();

  const [user, setUser] = useRecoilState(userState);
  const [newDevice, setNewDevice] = useState<devicePassport>({
    id: uuid().toString().replace(/-/g, ""),
    ASSET_NMB: "",
    TYPE_NMB: null /* комп, сервер, т.п.*/,
    CATEGORY: "" /*физический, виртуальный */,
    processNumber:
      [] /* с 1 по 11, передаем строкой, а на фласке делаем list  */,
    USR: "",
    TITLE: "",
    OS: "",
    IP_ADDRESS: "",
    BRANCH: "",
    DEPARTMENT: "",
    MOTHERBOARD: "",
    CPU: "",
    RAM: "",
    HARD_DRIVE: "",
    NOTES: "",
  });

  const [editDevice, setEditDevice] = useState<devicePassport>({
    id: uuid().toString().replace(/-/g, ""),
    ASSET_NMB: "",
    TYPE_NMB: null /* комп, сервер, т.п.*/,
    CATEGORY: "" /*физический, виртуальный */,
    processNumber:
      [] /* с 1 по 11, передаем строкой, а на фласке делаем list  */,
    USR: "",
    TITLE: "",
    OS: "",
    IP_ADDRESS: "",
    BRANCH: "",
    DEPARTMENT: "",
    MOTHERBOARD: "",
    CPU: "",
    RAM: "",
    HARD_DRIVE: "",
    NOTES: "",
  });

  const [branches, setBranches] = useState<idTitleList | null>([]);
  const [dvsTypes, setDvcTypes] = useState<idTitleList | null>([]);
  const [techProc, settechProc] = useState<idTitleList | null>([]);
  const [usersABS, setUsersABS] = useState<idTitleList | null>([]);
  const [departments, setDepartments] = useState<idTitleList | null>([]);
  const [osList, setOSList] = useState<idTitleList | null>([]);
  const [allDevices, setAllDevices] = useState<devicePassport[]>([]);

  const [modules, setModules] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.post(
          `//${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKENDPORT}/@me`,
          {
            page: 4,
          }
        );
        setUser(resp.data?.login_id);

        try {
          const resp = await httpClient.post(
            `//${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKENDPORT}/get_all_devices`
          );
          setAllDevices(resp.data);
          console.log(resp.data);
        } catch (error) {
          console.log(error);
          console.log("Не удалось получить паспорта устройств :с");
        }

        try {
          const resp = await httpClient.post(
            `//${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKENDPORT}/get_brnchs`
          );
          setBranches(resp.data);
          console.log(resp.data);
        } catch (error) {
          console.log(error);
          console.log("Не удалось получить список подразделений :с");
        }

        try {
          const resp = await httpClient.post(
            `//${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKENDPORT}/get_dvc_types`
          );
          setDvcTypes(resp.data);
          console.log(resp.data);
        } catch (error) {
          console.log(error);
          console.log("Не удалось получить типы устройств :с");
        }

        try {
          const resp = await httpClient.post(
            `//${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKENDPORT}/get_tech_proc`
          );
          settechProc(resp.data);
          console.log(resp.data);
        } catch (error) {
          console.log(error);
          console.log("Не удалось получить технологические процессы :с");
        }

        try {
          const resp = await httpClient.post(
            `//${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKENDPORT}/get_abs_users`
          );
          setUsersABS(resp.data);
          console.log(resp.data);
        } catch (error) {
          console.log(error);
          console.log("Не удалось получить список пользователей :с");
        }

        try {
          const resp = await httpClient.post(
            `//${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKENDPORT}/get_dpts`
          );
          setDepartments(resp.data);
          console.log(resp.data);
        } catch (error) {
          console.log(error);
          console.log("Не удалось получить список вн. подразделений :с");
        }

        try {
          const resp = await httpClient.post(
            `//${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKENDPORT}/get_os`
          );
          setOSList(resp.data);
          console.log(resp.data);
        } catch (error) {
          console.log(error);
          console.log("Не удалось получить список ОС :с");
        }
      } catch (error) {
        console.log("Not authenticated");
        navigate("/");
      }
    })();
  }, []);

  const itemSuccessInserted = (id: string) => {
    if (allDevices) {
      setAllDevices([newDevice, ...allDevices]);
    } else {
      setAllDevices([newDevice]);
    }

    setNewDevice({
      id: uuid().toString().replace(/-/g, ""),
      ASSET_NMB: "",
      TYPE_NMB: null /* комп, сервер, т.п.*/,
      CATEGORY: "" /*физический, виртуальный */,
      processNumber:
        [] /* с 1 по 11, передаем строкой, а на фласке делаем list  */,
      USR: "",
      TITLE: "",
      OS: "",
      IP_ADDRESS: "",
      BRANCH: "",
      DEPARTMENT: "",
      MOTHERBOARD: "",
      CPU: "",
      RAM: "",
      HARD_DRIVE: "",
      NOTES: "",
    });

    toast.success(`Устройство успешно добавлено`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const itemSuccessfullyUpdated = (id: string) => {
    let updatedList =
      allDevices &&
      allDevices.map((item) => {
        if (item.id == id) {
          return { ...editDevice }; //gets everything that was already in item, and updates "done"
        }
        return item; // else return unmodified item
      });

    setAllDevices(updatedList);
    toast.success(`Устройство успешно отредактировано`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const itemDeleted = (id: string, status: boolean = true) => {
    if (status) {
      toast.success(`Устройство успешно удалено`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      let deviceListRemoved =
        allDevices &&
        allDevices.filter(function (device) {
          return device.id !== id;
        });

      setAllDevices(deviceListRemoved);
    }

    if (!status) {
      toast.error(`Ошибка удаления устройства ${id}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="h-full">
 

      <div className="flex items-center mt-8 mb-4 h-16 gap-2">
        
        
        <button className="customButtonNoWdt text-xl" onClick={() => setModules(true)}>
          Добавить
        </button>
        <h2 className=" font-normal text-color-dark text-3xl flex-1 text-center">
          Реестр паспортов программно-вычислительных устройств АО Банк «ТКПБ»
        </h2>
      </div>

      {allDevices?.length > 0 && (
        <AllDevices
          allDevices={allDevices}
          users={usersABS}
          devicesTypes={dvsTypes}
          editDevice={editDevice}
          setEditDevice={setEditDevice}
          branchesToShow={branches}
          devicesToShow={dvsTypes}
          techProcToShow={techProc}
          usersABStoShow={usersABS}
          dptsToShow={departments}
          osToShow={osList}
          devicesModifier={itemSuccessfullyUpdated}
          itemDeleted={itemDeleted}
        />
      )}

      {modules && (
        <DeviceWindows
          device={newDevice}
          allDevices={allDevices}
          setDevice={setNewDevice}
          setModules={setModules}
          branchesToShow={branches}
          devicesToShow={dvsTypes}
          techProcToShow={techProc}
          usersABStoShow={usersABS}
          dptsToShow={departments}
          osToShow={osList}
          APILink={"device_upload"}
          devicesModifier={itemSuccessInserted}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default DeviceSpec;
