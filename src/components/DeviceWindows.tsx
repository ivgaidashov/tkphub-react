import React, { useState } from "react";
import uuid from "react-uuid";
import httpClient from "../utils/ApiRequests";
import LabelInput from "./LabelInput";
import Modal from "../components/Modal";
import DropdownFilterable from "./DropdownFilterable";
import RadioButtons from "./RadioButtons";
import CheckButtons from "./CheckButtons";
import { idTitleList, devicePassport } from "../Interfaces";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface iProps {
  allDevices?: devicePassport[] | null;
  setModules: (value: boolean) => void;
  branchesToShow: idTitleList | null;
  devicesToShow: idTitleList | null;
  techProcToShow: idTitleList | null;
  device: devicePassport;
  setDevice: (inputEv: any) => void;
  usersABStoShow: idTitleList | null;
  dptsToShow: idTitleList | null;
  osToShow: idTitleList | null;
  APILink: string;
  devicesModifier: (input: any) => void;
}

const DeviceWindows = ({
  allDevices,
  setModules,
  branchesToShow,
  devicesToShow,
  techProcToShow,
  device,
  setDevice,
  usersABStoShow,
  dptsToShow,
  osToShow,
  APILink,
  devicesModifier
}: iProps) => {
  const [clicked, setClicked] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDropHide = (e: any) => {
    e.preventDefault();
    clicked !== null && e.target.id !== "no" && setClicked(null);
  };

  const handleInputDevice = (e: any) => {
    e.preventDefault();
    const fieldName = e.target.getAttribute("name");
    const fieldValue = e.target.value;
    const newDeviceObject = { ...device };
    newDeviceObject[fieldName as keyof typeof device] = fieldValue;
    setDevice(newDeviceObject);
  };

  const handleMultipleInputDevice = (input: any, fieldname: string) => {
    const newDeviceObject = { ...device };
    newDeviceObject[fieldname as keyof typeof device] = input;
    setDevice(newDeviceObject);
  };

  
  const saveDevice = () => {
    // @ts-ignore
    if (!/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(device.IP_ADDRESS)) {  
        setError('Неверный формат IP-адреса');
        return;
    }

    if (APILink === 'device_upload' && allDevices && device.ASSET_NMB && allDevices.filter((e) => e.ASSET_NMB===device.ASSET_NMB).length > 0){
      setError(`Устройство с инвентарным номером ${device.ASSET_NMB} уже существует`);
      return;
    }

    if (!device.CATEGORY){
      setError(`Выберите вид устройства`);
      return;
    }
    
    if (device.RAM && isNaN(+device.RAM)) {
      setError('Объём ОЗУ должен быть числом');
      return;
    }

    if (device.HARD_DRIVE && isNaN(+device.HARD_DRIVE)) {
      setError('Объём жесткого диска должен быть числом');
      return;
    }
    
    if (device.BRANCH == '0') {
      if (device.DEPARTMENT === "") {
        setError('Выберите подразделение в Головном офисе');
        return;
      }
      if (device.DEPARTMENT == '0') {
        setError('В Головном офисе подразделение не может принимать значение ДО');
        return;
      }
    }
    
    for (var key of Object.keys(device)) {
        if (key !== 'NOTES' && (device[key as keyof typeof device] == null || device[key as keyof typeof device] === "" && !warning ) )
        {  
          setWarning('Есть незаполненные поля. Всё равно отправить?');
          setError(null);
          return
        }
        else {
          setWarning(null);
        }
    }

    if (device.processNumber && device.processNumber?.length == 0 && !warning) {
        setWarning('Не выбраны технологические процессы. Всё равно отправить?');
        setError(null);
        return
    }
    else {
      setWarning(null);
    }
   
    setError(null);
    sendDeviceToDB()
  };

  const sendDeviceToDB = async () =>
  {
    try {
      const URL = `//${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKENDPORT}/${APILink}`
        const resp = await httpClient.post(
          URL,
          {data: device,}
        );
        
        if (resp.data.response === 'Successfully updated '+device.id || resp.data.response === 'Successfully uploaded')
        {
          devicesModifier(device.id)
        }
        else {
          toast.error(`Ошибка добавления устройства `+ resp.data.response, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } catch (e: any) {
        toast.error(`Ошибка добавления устройства ` + e, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.log(e);
      }
  }

  

  return (
    <div onClick={handleDropHide} className="h-full">
      <Modal setModules={setModules} height="h-[900px]" width="w-[600px]" paddingy="py-8">
        <div className="w-full h-fit pt-3 text-lg font-bold flex justify-center align-middle">
            { APILink === "device_update" ? 'Редактирование устройства' : 'Добавление нового устройства' }
        </div>
        <div className="w-full h-fit relative px-4 mt-4">
          <form className=" w-full h-full mb-4 ">
            <LabelInput
              labels={{
                label: device.ASSET_NMB,
                title: "Инв. номер",
                attributeName: "ASSET_NMB",
                placeholder: "",
              }}
              handleInputDevice={handleInputDevice}
            />

            <LabelInput
              labels={{
                label: device.TITLE,
                title: "Имя уст-ва",
                attributeName: "TITLE",
                placeholder: "Например, comp107.oper.tkpb.ru",
              }}
              handleInputDevice={handleInputDevice}
            />

            <DropdownFilterable
              title="Тип"
              clicked={clicked}
              setClicked={setClicked}
              data={devicesToShow}
              initialValues={device.TYPE_NMB}
              device={device}
              handleInputDevice={handleInputDevice}
              attributeName={"TYPE_NMB"}
            />

            <RadioButtons
              title={"Вид"}
              labels={[
                { id: 1, title: "Физический" },
                { id: 2, title: "Виртуальный" },
              ]}
              handleInputDevice={handleInputDevice}
              initialValues={device.CATEGORY}
              attributeName={"CATEGORY"}
            />

            <DropdownFilterable
              title="ОС"
              clicked={clicked}
              setClicked={setClicked}
              data={osToShow}
              initialValues={device.OS}
              device={device}

              handleInputDevice={handleInputDevice}
              attributeName={"OS"}
            />

            <LabelInput
              labels={{
                label: device.IP_ADDRESS,
                title: "IP-адрес",
                attributeName: "IP_ADDRESS",
                placeholder: "XXX.XXX.XXX.XXX",
              }}
              handleInputDevice={handleInputDevice}
            />

            <LabelInput
              labels={{
                label: device.MOTHERBOARD,
                title: "Мат. плата",
                attributeName: "MOTHERBOARD",
                placeholder: "",
              }}
              handleInputDevice={handleInputDevice}
            />

            <LabelInput
              labels={{
                label: device.CPU,
                title: "Процессор",
                attributeName: "CPU",
                placeholder: "",
              }}
              handleInputDevice={handleInputDevice}
            />

            <LabelInput
              labels={{
                label: device.RAM,
                title: "ОЗУ (Гб)",
                attributeName: "RAM",
                placeholder: "",
              }}
              handleInputDevice={handleInputDevice}
            />

            <LabelInput
              labels={{
                label: device.HARD_DRIVE,
                title: "Память (Гб)",
                attributeName: "HARD_DRIVE",
                placeholder: "",
              }}
              handleInputDevice={handleInputDevice}
            />

            <DropdownFilterable
              title="Отделение"
              clicked={clicked}
              setClicked={setClicked}
              data={branchesToShow}
              initialValues={device.BRANCH}
              device={device}

              handleInputDevice={handleInputDevice}
              attributeName={"BRANCH"}
            />

            <DropdownFilterable
              title="Подраз-ние"
              clicked={clicked}
              setClicked={setClicked}
              data={dptsToShow}
              initialValues={device.DEPARTMENT}
              device={device}

              handleInputDevice={handleInputDevice}
              attributeName={"DEPARTMENT"}
            />

            <DropdownFilterable
              title="Пользователь"
              clicked={clicked}
              setClicked={setClicked}
              data={usersABStoShow}
              initialValues={device.USR}
              device={device}

              handleInputDevice={handleInputDevice}
              attributeName={"USR"}
            />

            <CheckButtons
              title={"Тех. проц."}
              labels={techProcToShow}
              initialValues={device.processNumber}
              handleMultipleInputDevice={handleMultipleInputDevice}
              attributeName={"processNumber"}
            />

            <LabelInput
              labels={{
                label: device.NOTES,
                title: "Комментарий",
                attributeName: "NOTES",
                placeholder: "",
              }}
              handleInputDevice={handleInputDevice}
            />

            
          </form>
         
          <div className="flex w-full h-fit justify-center gap-2">
            <button className={warning ? 'customButtonTransparent': 'customButton'} onClick={saveDevice} >
              Загрузить
            </button>
            {warning &&<button className='customButtonNoWdt' onClick={saveDevice} >
              Да
            </button>}
          </div>

          <div className="flex justify-center mt-2 text-color-danger">
            {warning && <p>{warning}</p>}
            {error && <p>{error}</p>}
          </div>

        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default DeviceWindows;
