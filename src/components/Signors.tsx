/*https://bobbyhadz.com/blog/react-typescript-pass-function-as-prop*/

import React from 'react'

interface iProps {
    i: number;
    id: string;
    name: string;
    position: string;
    handleInput: (inputEv:any, index:any, type:string) => void;

  }
  

const Signors = ({i, id, name, position, handleInput}: iProps)  => {
  return (
    <div className="border-2 border-my-slate rounded-md p-5 hover:border-off-white hover:shadow-lg hover:border-4 ease-in-out duration-200">
            <form className="flex items-center w-full mb-4 relative" >
              <p className="absolute -top-11 -left-2 bg-whitish p-2 italic">Позиция: {i+1}</p>
              <label className="text-xl w-32">Должность</label>
              <input
                value={position}
                onChange={(e) => handleInput(e, id, 'position')}
                className="flex-1 customInputField mr-3"
                type="text"
                placeholder="Загрузка..."
              />
            </form>
            <form className="flex items-center w-full" >
              <label className="text-xl w-32">ФИО</label>
              <input
                value={name}
                onChange={(e) => handleInput(e, id, 'name')}
                className="flex-1 customInputField mr-3"
                type="text"
                placeholder="Загрузка..."
              />
            </form>
          </div>
  )
}

export default Signors