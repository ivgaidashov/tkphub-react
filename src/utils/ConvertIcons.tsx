import React from "react";
import { ReactPropTypes } from "react";
import { BellIcon, UserIcon, BanknotesIcon, PencilSquareIcon, NewspaperIcon,  ComputerDesktopIcon, BuildingLibraryIcon} from "@heroicons/react/24/outline";
import {IconProps} from "../Interfaces"


const ConvertIcons = (props: {info: IconProps}) => {

  const dynamicClass = props.info.availability === 1 ? 'customIcon' : 'customIconNotAv';
  let renderedIcon;

  switch (props.info.icon) {
    case "BellIcon":
      renderedIcon = <BellIcon className={dynamicClass}/>;
      break;
    case "UserIcon":
      renderedIcon = <UserIcon className={dynamicClass}/>;
      break;
    case "BanknotesIcon":
      renderedIcon = <BanknotesIcon className={dynamicClass}/>;
      break;
    case "PencilSquareIcon":
      renderedIcon = <PencilSquareIcon className={dynamicClass}/>;
      break;
    case "NewspaperIcon":
      renderedIcon = <NewspaperIcon className={dynamicClass}/>;
      break;
    case "ComputerDesktopIcon":
        renderedIcon = <ComputerDesktopIcon className={dynamicClass}/>;
        break;
    case "BuildingLibraryIcon":
      renderedIcon = <BuildingLibraryIcon className={dynamicClass}/>;
      break;
    default:
      renderedIcon = <BellIcon className={dynamicClass}/>;

  }

  return (
    renderedIcon
  );
};

export default ConvertIcons;
