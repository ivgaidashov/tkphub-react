import React, { useState } from "react";
import {idTitleList} from "../Interfaces"

interface myProps {
  title: string;
  labels: idTitleList | null;
  handleInputDevice: (inputEv:any) => void;
  attributeName: string | null;
  initialValues: string | null;
}

const RadioButtons = ({ title, labels, handleInputDevice, attributeName, initialValues }: myProps) => {
  const [clicked, setClicked] = useState<string|number|null>(initialValues);

  if ((initialValues == null || initialValues =="")  && clicked !=null) { /*нужно, иначе после успешного добавления устройства item почему-то не обнуляется */
  setClicked(null)
}

  const changeSelection = (e: any) => {
    setClicked(e.target.value);
    handleInputDevice(e)
  };

  const clickedButton = "w-fit py-1 px-2 border border-color-primary rounded-full shadow-md font-semibold text-lg";
  const notClicked = "w-fit py-1 px-2 text-lg";

  return (
    <div className="flex w-full justify-between h-fit mt-2 pb-2">
      <p className="w-32 text-lg">{title}</p>
      <div className="flex-1 justify-between ml-2">
        {labels?.map((label)=>(
           <button
           key={label.id}
           className={clicked == label.id ? clickedButton : notClicked}
           value={Number(label.id)}
           // @ts-ignore
           name={attributeName}
           onClick={changeSelection}
         >
           {label.title}
         </button>
        )

        )}
        
      </div>
    </div>
  );
};

export default RadioButtons;
