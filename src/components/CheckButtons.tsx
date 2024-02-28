import React, { useState } from "react";
import { idTitleList } from "../Interfaces";

interface myProps {
  title: string;
  labels: idTitleList | null;
  handleMultipleInputDevice: (inputEv: any, fieldname: any) => void;
  attributeName: string | null;
  initialValues: number[] | null;
}

const TwoRadioButtons = ({
  title,
  labels,
  handleMultipleInputDevice,
  attributeName,
  initialValues,
}: myProps) => {
  const [clicked, setClicked] = useState<number[] | null>(initialValues);

  if (initialValues && initialValues.length === 0 && clicked != null) {
    /*нужно, иначе после успешного добавления устройства item почему-то не обнуляется */
    setClicked(null);
  }

  const changeSelection = (e: any, id: any) => {
    let fieldvalue = [];
    console.log();
    if (clicked) {
      if (!clicked.includes(id)) {
        fieldvalue = [...clicked, id];
      } else {
        fieldvalue = [...clicked.filter((val: number) => val !== id)];
      }
    } else {
      fieldvalue = [id];
    }
    setClicked(fieldvalue);
    handleMultipleInputDevice(fieldvalue, e.target.getAttribute("name"));
    console.log(clicked);
  };

  const clickedButton =
    "w-fit ml-1 py-1 px-2 border border-color-primary rounded-full shadow-md font-semibold text-lg";
  const notClicked = "w-fit ml-1 py-1 px-2 text-lg";

  return (
    <div className="flex w-full justify-between h-fit my-2">
      <p className="w-32 text-lg">{title}</p>

      <div className="flex-1 justify-between ml-2">
        {labels?.map((label) => (
          <button
            key={label.id}
            className={clicked?.includes(label.id) ? clickedButton : notClicked}
            onClick={(e) => changeSelection(e, label.id)}
            // @ts-ignore
            name={attributeName}
            // @ts-ignore
            value={clicked}
          >
            {label.id}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TwoRadioButtons;
