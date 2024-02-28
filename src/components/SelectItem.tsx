import React from 'react'

interface list {
    items: [];
    handleInput: (event:any) => void;
  }

const SelectItem = ({items, handleInput}: list) => {
  return (
    <select
            className="p-2.5 border border-color-warning bg-transparent rounded-md shadow-sm outline-none text-center text-xl"
            onChange={event => handleInput}
          >
            {items?.map((item, i) => (
              <option key={i}>{item}</option>
            ))}
          </select>
  )
}

export default SelectItem