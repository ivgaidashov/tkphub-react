import React from 'react'
import { idTitleList } from "../Interfaces";
import {useReducerSearchAction, useReducerSearchState} from "../components/AllDevices"

type SearchProps = {
    stateValue: useReducerSearchState;
    searchDispatch: React.Dispatch<useReducerSearchAction>;
  };

const SearchBar = ({stateValue,
    searchDispatch}:SearchProps) => {
  return (
    <div className='flex-1 h-12 border rounded-lg border-color-primary '>
        <input 
        onChange={(e) => searchDispatch({type: "IpOrAssetOrUser", payload: e.target.value})}
        className='w-full h-full customInputField bg-[#f6f7fb] text-xl' placeholder='Поиск по имени пользователю, IP-адресу или инвентарному номеру'>
        
        </input>
    </div>
  )
}

export default SearchBar