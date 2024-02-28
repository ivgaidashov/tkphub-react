import React from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import {ToolCardTypes} from "../Interfaces";
import ConvertIcons from "../utils/ConvertIcons";
import { Outlet, Link } from "react-router-dom";



const ToolCard = (props: {info: ToolCardTypes}) => {

    const dummy = {icon: props.info.icon, availability: props.info.available}

  return (
    <Link className="cursor-default" to={`/${props.info.available ===1 ? props.info.link : ''}`}>
    <div 
      className={`w-full h-80 ${props.info.available ===1 ? 'bg-color-background hover:scale-102 cursor-pointer' : 'bg-transparent'} rounded-lg shadow-xl 
    text-white transition-transform ease-out `}
    >
      <div className="flex h-full flex-col justify-center items-center w-full ">
        <div className="flex justify-center text-color-white">
            <ConvertIcons info={dummy}/>
        </div>
        <p className={`text-center text-xl font-bold mt-4 ${props.info.available === 1 ? 'text-color-dark' : 'text-color-info-dark' }`}>
            {props.info.title}
        </p>

        <p className="text-center font-light mt-4 px-6 text-color-dark-variant ">
             {props.info.description}
        </p>
      </div>
    </div></Link>
  );
};

export default ToolCard;
