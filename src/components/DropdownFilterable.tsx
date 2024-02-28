import React, { useState, useEffect } from "react";
import {
  ArrowDownCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { idTitleList, devicePassport } from "../Interfaces";

interface dropDownProps {
  title: string;
  clicked: string | null;
  setClicked: (clicked: string | null) => void;
  data: idTitleList | null;
  handleInputDevice: (inputEv:any) => void;
  attributeName: any;
  initialValues: string | number | null;
  device: devicePassport;
}

const DropdownFilterable = ({
  title,
  clicked,
  setClicked,
  data,
  handleInputDevice,
  attributeName,
  initialValues,
  device
}: dropDownProps) => {
  const [filteredItem, setFilteredItem] = useState<string>("");

  let modifiedInitialValues = initialValues;

  if (initialValues !== "" && initialValues !== null) {
    const foundObject = data!.filter(name => name["id"] == initialValues)
    modifiedInitialValues= foundObject[0].title
  }

  const [item, setItem] = useState(modifiedInitialValues);

  if ((modifiedInitialValues == null || modifiedInitialValues == "") && item !=null) { /*нужно, иначе после успешного добавления устройства item почему-то не обнуляется */
    setItem(null)
  }

  const handleDropShow = (e: any) => {
    e.preventDefault();
    setClicked(title);
  };

  const handleListItem = (e: any, title: string) => {
    e.preventDefault();
    handleInputDevice(e);
    setItem(title);
  };

  
  return (
    <div className="flex justify-between py-2 gap-2">
      <div className="text-lg w-32 ">{title}</div>
      <div
        className="flex-1   customInputField items-center justify-between  mr-3 relative"
        onClick={handleDropShow}
      >
        {data!.length > 0 && <div className="flex justify-between" id="no">
          <p>{item}</p>
          <ArrowDownCircleIcon className="w-6 text-color-primary" />
        </div>}
        {data!.length <1  && <div className="flex justify-between" id="no">
          <p className="font-extralight">Получение данных...</p>
          {data!.length > 0 &&<ArrowDownCircleIcon className="w-6 text-color-primary" />}
        </div>}
        {clicked === title && data!.length >0 && (
          <div className="h-fit max-h-60 mt-4 overflow-y-auto absolute z-20 bg-color-white shadow-xl">
            <div className="flex ring-1 ring-color-primary  rounded-md m-2 px-1">
              <MagnifyingGlassIcon className="w-6 text-color-primary" />
              <input
                type="text"
                value={filteredItem}
                onChange={(e) => setFilteredItem(e.target.value)}
                className="w-fit text-gray-700 outline-none"
                id="no"
              />
            </div>
            <ul className="mt-2  bg-color-white w-full rounded-lg">
              {data!.map((dpt) => (
                <li
                  className={`py-2 pl-2 text-md hover:bg-color-light hover:text-white 

            
            ${
              dpt?.title?.toLowerCase() === filteredItem?.toLowerCase() &&
              "bg-sky-600 text-white"
            }
            ${
              dpt?.title?.toLowerCase().includes(filteredItem.toLowerCase())
                ? " "
                : "hidden "
            } `}
                  key={dpt.id}
                  // @ts-ignore
                  name={attributeName}
                  value={dpt.id}
                  onClick={(e) => handleListItem(e, dpt.title)}
                >
                  {dpt.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DropdownFilterable;
