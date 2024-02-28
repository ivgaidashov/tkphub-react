import React from "react";


interface myProps {
    labels: {label : string | null, title: string | null, attributeName: string, placeholder: string };
    handleInputDevice: (inputEv:any) => void;
  }

const LabelInput = ({labels, handleInputDevice}: myProps) => {
  return (
    <div className="flex justify-between py-2 gap-2">
      <label className="text-lg w-32">{labels.title}</label>
      <input
                value={labels.label === null ? '' : labels.label}
                name={labels.attributeName}
                onChange={(e) => handleInputDevice(e)}
                className="flex-1 customInputField mr-3"
                placeholder={labels.placeholder}
                type="text"
              />
    </div>
  );
};

export default LabelInput;
