import React, { useState, Dispatch } from "react";
import { idTitleList } from "../Interfaces";
import {useReducerSearchAction, useReducerSearchState} from "../components/AllDevices"

type MultiSelectProps = {
  techProcToShow: idTitleList | null;
  stateValue: useReducerSearchState;
  searchDispatch: React.Dispatch<useReducerSearchAction>;
};

const MultipleSelect = ({
  techProcToShow,
  stateValue,
  searchDispatch
}: MultiSelectProps) => {
  function selectOption(option: number) {
    if (stateValue.techProcesses && stateValue.techProcesses.includes(option)) {
      searchDispatch({ type: 'techProc', payload: stateValue.techProcesses.filter((o) => o !== option) });
      
    } else {
      
        stateValue.techProcesses ? searchDispatch({ type: 'techProc', payload: [option, ...stateValue.techProcesses]}) : searchDispatch({ type: 'techProc', payload: [option]});

    }
  }

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative w-60 h-12 flex align-middle border bg-[#e9eaf5] border-color-primary rounded-lg py-2 px-1"
      onClick={() => setIsOpen((prev) => !prev)}
      onBlur={() => setIsOpen(false)}
      tabIndex={0}
    >
      <span className="flex grow gap-1 overflow-x-hidden ">
        {stateValue.techProcesses ?
          stateValue.techProcesses.length > 0 ? stateValue.techProcesses.map((v) => (
            <button
              key={v}
              onClick={(e) => {
                e.stopPropagation();
                selectOption(v);
              }}
              className="flex items-center border outline-none bg-[#e9eaf5]  rounded-lg py-[2px] px-2 border-color-primary font-bold text-color-primary"
            >
              {v}
            </button>
          )) : <p className="self-center font-thin">Фильтр по тех. процессам</p> : <p className="self-center font-thin">Фильтр по тех. процессам</p>}
      </span>
      <div className="flex absolute top-[5%] right-0 bg-[#e9eaf5] h-[90%] rounded-lg text-color-primary font-bold">
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="text-color-primary pr-2"
          onClickCapture={() => {searchDispatch({ type: 'techProc', payload: []})}}
        >
          &times;
        </button>
        <div className=" bg-color-primary self-stretch w-[1px]"></div>
        <div className="translate-y-[30%] text-sm px-2 cursor-pointer text-color-primary">
          ▼
        </div>
      </div>
      <ul
        className={`absolute w-full max-h-60 top-[110%] left-0  list-none m-0 p-0  overflow-y-auto no-scrollbar z-50 bg-color-white rounded-lg ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {techProcToShow &&
          techProcToShow.map((option, index) => (
            <li
              onClick={(e) => {
                e.stopPropagation();
                selectOption(option.id);
                setIsOpen(false);
              }}
              key={option.title}
              className={` text-color-dark text-lg pl-3`}
            >
              {option.id}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default MultipleSelect;

/*  display: flex;
  align-items: center;
  border: .05em solid #777;
  border-radius: .25em;
  padding: .15em .25em;
  gap: .25em;
  cursor: pointer;
  background: none;
  outline: none; */
