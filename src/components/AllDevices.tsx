import React, { useState, useEffect, useReducer } from "react";
import DeleteDevice from "../components/DeleteDevice";
import DeviceWindows from "./DeviceWindows";
import { devicePassport, idTitleList } from "../Interfaces";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import MultipleSelect from "./MultipleSelect";
import SearchBar from "./SearchBar";
import { utils, writeFile } from "xlsx"
import uuid from "react-uuid";
import httpClient from "../utils/ApiRequests";
import TechProcesses from "./TechProcesses";

interface myProps {
  allDevices: devicePassport[] | null;
  users: idTitleList | null;
  devicesTypes: idTitleList | null;
  editDevice: devicePassport;
  setEditDevice: (inputEv: any) => void;
  branchesToShow: idTitleList | null;
  devicesToShow: idTitleList | null;
  techProcToShow: idTitleList | null;
  usersABStoShow: idTitleList | null;
  dptsToShow: idTitleList | null;
  osToShow: idTitleList | null;
  devicesModifier: (input: any) => void;
  itemDeleted: (id: string) => void;
}

export type useReducerSearchState = {
  fildteredDevicesList: devicePassport[] | null | undefined;
  techProcesses: number[] | null;
  searchBar: string | null;
};

export type useReducerSearchAction =
  | { type: "IpOrAssetOrUser"; payload: string }
  | { type: "techProc"; payload: number[] | null };

const truncate = (input: string | null) =>
  input /*проверяем есть ли что-нибудь*/ && input!.length > 25
    ? `${input!.substring(0, 25)}...`
    : input;

const AllDevices = ({
  allDevices,
  users,
  devicesTypes,
  editDevice,
  setEditDevice,
  branchesToShow,
  devicesToShow,
  techProcToShow,
  usersABStoShow,
  dptsToShow,
  osToShow,
  devicesModifier,
  itemDeleted,
}: myProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const initialState: useReducerSearchState = {
    fildteredDevicesList: allDevices,
    techProcesses: null,
    searchBar: null,
  };

  function reducer(
    state: useReducerSearchState,
    action: useReducerSearchAction
  ): useReducerSearchState {
    const filterFunctionArray = (
      device: devicePassport,
      data: number[] | null
    ) => {
      let returnValue = false;
      data?.map((value) => {
        if (device.processNumber?.includes(value)) {
          returnValue = true;
        }
      });
      return returnValue;
    };

    const filterFunctionString = (
      device: devicePassport,
      data: string
    ): boolean => {
      let returnValue = false;

      if (device.ASSET_NMB) {
        if (device.ASSET_NMB.includes(data)) {
          returnValue = true;
        }
      }

      if (device.USR) {
        const userNameArray =
          usersABStoShow &&
          usersABStoShow.filter(function (element) {
            return element.id === Number(device.USR);
          });
          console.log("userName1");

        let userName
        if (userNameArray && userNameArray.length ==0) {
          userName = 'Уволенный сотрудник';
        } else {userName = userNameArray && userNameArray[0].title;}
        
        console.log(userName);
        console.log("userName2");

        if (
          userName
            ?.toUpperCase()
            .replace(")", "")
            .replace("(", "")
            .includes(data.toUpperCase())
        ) {
          returnValue = true;
        }
      }

      if (device.IP_ADDRESS) {
        if (device.IP_ADDRESS.includes(data)) {
          returnValue = true;
        }
      }
      return returnValue;
    };

    switch (action.type) {
      case "techProc":
        let newDeviceList: devicePassport[] | null | undefined = [];
        setCurrentPage(1);
        if (action.payload && action.payload.length > 0) {
          allDevices?.map((device) => {
            if (state.searchBar) {
              /*если есть заполненное значение поисковой строки */
              filterFunctionArray(device, action.payload) &&
                filterFunctionString(device, state.searchBar) &&
                !newDeviceList?.includes(device) &&
                newDeviceList?.push(device);
            } /*иначе не учитываем поисковую строку */ else {
              console.log(filterFunctionArray(device, action.payload));
              filterFunctionArray(device, action.payload) &&
                !newDeviceList?.includes(device) &&
                newDeviceList?.push(device);
            }
          });
        } else {
          newDeviceList = allDevices;
        }

        return {
          fildteredDevicesList: newDeviceList,
          techProcesses: action.payload,
          searchBar: state.searchBar,
        };

      case "IpOrAssetOrUser":
        let newDeviceList2: devicePassport[] | null | undefined = [];
        setCurrentPage(1);

        allDevices?.map((device) => {
          if (state.techProcesses && state.techProcesses.length > 0) {
            console.log("techProcesses");
            /*если есть заполненное значение фильтра */
            filterFunctionArray(device, state.techProcesses) &&
              filterFunctionString(device, action.payload) &&
              !newDeviceList2?.includes(device) &&
              newDeviceList2?.push(device);
          } /*иначе не учитываем фильтр */ else {
            console.log("string");
            filterFunctionString(device, action.payload) &&
              !newDeviceList2?.includes(device) &&
              newDeviceList2?.push(device);
          }
        });

        return {
          fildteredDevicesList: newDeviceList2,
          techProcesses: state.techProcesses,
          searchBar: action.payload,
        };

      default:
        return state;
    }
  }

  const [useReducerState, dispatch] = useReducer(reducer, initialState);
  const recordsPerPage = 20;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = useReducerState.fildteredDevicesList?.slice(
    firstIndex,
    lastIndex
  );
  const npage = Math.ceil(
    useReducerState.fildteredDevicesList!.length / recordsPerPage
  );
  const numbers = [...Array(npage + 1).keys()].slice(1);
  const [modules, setModules] = useState<boolean>(false);
  const [moduleAreYouSure, setModuleAreYouSure] = useState<boolean>(false);
  const [showTPTitles, setShowTPTitles] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const [tpTitle, setTpTitle] = useState<idTitleList>();

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.post( `//${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKENDPORT}/get_tech_proc_titles`)
        setTpTitle(resp.data);
        console.log(resp.data);
      }
      catch (e:any) {
        console.log(e);
        console.log("Не удалось получить названия тех. процессов :с");
      }
    })();
  }, [])
  
  useEffect(() => {
    if (allDevices) {
      dispatch({ type: "techProc", payload: useReducerState.techProcesses });
    }
  }, [allDevices]);

  const prevPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const changeCurPage = (n: number) => {
    setCurrentPage(n);
  };

  const nextPage = () => {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleEditMode = (device: devicePassport) => {
    setEditDevice(device);
    setModules(true);
  };

  const handleDeleteMode = (id: string | null) => {
    id && setDeleteId(id);
    id && setModuleAreYouSure(true);
  };

  const handleXLSXExport = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    let devicesToXLSX: any[][] = [['Инвентарный номер', 'Тип', 'Вид', 'Пользователь в (АБС)', 'Технологические процессы', 'Название', 'ОС', 'IP-адрес', 'Отделение', 'Подразделение', 'Мат. плата', 'Процессор', 'ОЗУ (Гб)', 'Память (ГБ)', 'Комментарий']]

    useReducerState.fildteredDevicesList && useReducerState.fildteredDevicesList.map((device) => {
      const device_asset_nmb = device.ASSET_NMB;
      const device_type = device.TYPE_NMB ? devicesTypes?.filter(function (myType) {return myType.id == device.TYPE_NMB})[0].title : '';
      const device_category = device.CATEGORY ? device.CATEGORY == '1' ? 'Физический' : device.CATEGORY == '2' ? 'Виртуальный' : 'Не определён' : '';
      const device_user = device.USR ? usersABStoShow?.filter(function (employee) {return employee.id == Number(device.USR)})[0].title : '';
      
      let dev_tech_proc: string[] = []
      device.processNumber && device.processNumber.length > 0 && tpTitle?.map( (tech_process) => { device.processNumber?.includes(tech_process.id) && dev_tech_proc.push(tech_process.title) });

      const device_techpr = dev_tech_proc.join(", ")

      const device_title = device.TITLE;
      const device_os = device.OS ? osToShow?.filter(function (os) {return os.id == Number(device.OS)})[0].title : '';
      const device_ipaddress = device.IP_ADDRESS;
      const device_branch = device.BRANCH ? branchesToShow?.filter(function (branch) {return branch.id == Number(device.BRANCH)})[0].title : '';
      const device_dpt = device.DEPARTMENT ? dptsToShow?.filter(function (dpt) {return dpt.id == Number(device.DEPARTMENT)})[0].title : '';
      const device_mtbd = device.MOTHERBOARD;
      const device_cpu = device.CPU;
      const device_ram = device.RAM;
      const device_storage = device.HARD_DRIVE;
      const device_notes = device.NOTES;

      const device_formatted = [device_asset_nmb, device_type, device_category, device_user, device_techpr, device_title, device_os, device_ipaddress, device_branch, device_dpt, device_mtbd, device_cpu, device_ram, device_storage, device_notes]

      devicesToXLSX.push(device_formatted)

    })

    const currentDate = mm + '/' + dd + '/' + yyyy;

    const wb = utils.book_new();
    const ws = useReducerState.fildteredDevicesList && utils.aoa_to_sheet(devicesToXLSX);

    const filetitle = allDevices && useReducerState.fildteredDevicesList && useReducerState.fildteredDevicesList.length < allDevices?.length ? `Устройства ТКПБ - ${currentDate} - с фильтром.xlsx` : `Устройства ТКПБ - ${currentDate}.xlsx`;
    
    ws && utils.book_append_sheet(wb, ws, 'Паспорта');
    writeFile(wb, filetitle);
  }

  const getTitle = (id: string | number | null, data: idTitleList | null) => {
    let returnValue = "";
    data!.forEach(function (item) {
      if (item.id == id) returnValue = item.title;
    });
    return returnValue;
  };

  return (
    <div className=" pb-3 min-h-screen" key={allDevices && allDevices[0].id}>
      <div className="flex gap-2 justify-center ">
        <MultipleSelect
          techProcToShow={techProcToShow}
          stateValue={useReducerState}
          searchDispatch={dispatch}
        />
        <SearchBar stateValue={useReducerState} searchDispatch={dispatch} />
        {records && records.length > 0 && (
          <div className="flex content-center gap-2">
            <button className="customButtonNoWdt" onClick={handleXLSXExport}>Экспорт в XLSX</button>
            <button className="customButtonTransparent" onClick={() => setShowTPTitles(true)}>Процессы</button>
          </div>

        )}
      </div>
      <table className="table-auto w-full mt-8">
        <thead className=" bg-color-primary text-color-white text-xl">
          <tr className="">
            <th className="py-2 rounded-l-lg border-r">Инв. номер</th>
            <th className="py-2 border-r">Пользователь</th>
            <th className="py-2 border-r">Тип</th>
            <th className="py-2 border-r">Категория</th>
            <th className="py-2 border-r">Тех. процессы</th>
            <th className="py-2 border-r">Название</th>
            <th className="py-2 border-r">IP-адрес</th>
            <th className="py-2 ">Отделение</th>
            <th className="py-2 "> </th>
            <th className="py-2 rounded-r-lg"> </th>
          </tr>
        </thead>
        <tbody className="pt-2">
          <tr className={` h-4`}>
            <td className=""> </td>
            <td className=""> </td>
            <td className=""></td>
            <td className=""> </td>
            <td className=""> </td>
            <td className=""> </td>
            <td className=" "> </td>
          </tr>
          {records &&
            records?.map((device, key) => (
              <tr
                key={uuid()}
                className={
                  key % 2
                    ? "group text-ll hover:bg-[#e9eaf5] text-lg text-color-dark-variant hover:text-color-dark hover:font-medium transition-all bg-[#f6f7fb]"
                    : "group text-ll hover:bg-[#e9eaf5] text-lg text-color-dark-variant hover:text-color-dark hover:font-medium transition-all bg-[#fbfbfd]"
                }
              >
                <td
                  key={uuid()}
                  className={
                    key == 0
                      ? "py-2 text-center rounded-tl-lg"
                      : key == records.length - 1
                      ? "py-2 text-center rounded-bl-lg"
                      : "py-2 text-center"
                  }
                >
                  {device.ASSET_NMB}
                </td>
                <td data-hover="hello" className="py-2 text-center">
                  {truncate(getTitle(device.USR, users))}
                </td>
                <td className="py-2 text-center">
                  {getTitle(device.TYPE_NMB, devicesTypes)}
                </td>
                <td className="py-2 text-center">{device.CATEGORY}</td>
                <td className="py-2 text-center">
                  {device.processNumber && device.processNumber.join(", ")}
                </td>
                <td className="py-2 text-center">{truncate(device.TITLE)}</td>
                <td className="py-2 text-center">{device.IP_ADDRESS}</td>
                <td className="py-2 text-center">{device.BRANCH}</td>
                <td
                  className="group-hover:opacity-100 opacity-0 w-7 cursor-pointer py-2 text-center text-color-primary"
                  onClick={() => handleEditMode(device)}
                >
                  <PencilIcon />
                </td>
                <td
                  className={
                    key == 0
                      ? "group-hover:opacity-100 opacity-0 w-7 cursor-pointer py-2 rounded-tr-lg text-center text-color-warning"
                      : key == records.length - 1
                      ? "group-hover:opacity-100 opacity-0 w-7 cursor-pointer py-2 rounded-br-lg text-center text-color-warning"
                      : "group-hover:opacity-100 opacity-0 w-7 cursor-pointer py-2 text-center text-color-warning"
                  }
                  onClick={() => handleDeleteMode(device.id)}
                >
                  <TrashIcon />
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <nav className="w-full mt-5 ">
        <ul className="flex justify-center gap-2">
          <li className="customButtonTransparentNoWdt" onClick={prevPage}>
            Назад
          </li>
          {numbers.map((number) => (
            <li
              key={uuid()}
              className={
                currentPage == number
                  ? "customButtonNoWdt"
                  : "customButtonTransparentNoWdt"
              }
              onClick={() => changeCurPage(number)}
            >
              {number}
            </li>
          ))}
          <li className="customButtonTransparentNoWdt" onClick={nextPage}>
            Вперед
          </li>
        </ul>
      </nav>

      {moduleAreYouSure && (
        <DeleteDevice
          setModules={setModuleAreYouSure}
          deviceId={deleteId}
          deletedHandler={itemDeleted}
        />
      )}

      {showTPTitles && tpTitle && <TechProcesses setModules={setShowTPTitles} processes={tpTitle}/>}

      {modules && (
        <DeviceWindows
          device={editDevice}
          setDevice={setEditDevice}
          setModules={setModules}
          branchesToShow={branchesToShow}
          devicesToShow={devicesToShow}
          techProcToShow={techProcToShow}
          usersABStoShow={usersABStoShow}
          dptsToShow={dptsToShow}
          osToShow={osToShow}
          APILink="device_update"
          devicesModifier={devicesModifier}
        />
      )}
    </div>
  );
};

export default AllDevices;
