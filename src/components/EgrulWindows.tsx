import React, { useState } from "react";
import uuid from "react-uuid";
import httpClient from "../utils/ApiRequests";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";
import { ClientDifferenceEgrulList } from "../Interfaces";

interface iProps {
  setModule: (value: boolean) => void;
  loadingDifference: boolean;
  clientDifferences: ClientDifferenceEgrulList;
  icusnum: number | null;
}

const EgrulWindows = ({
  setModule,
  loadingDifference,
  clientDifferences,
  icusnum,
}: iProps) => {
  const [updatedColumns, setUpdatedColumns] = useState<string[]>([]);
  const [waiting, setWaiting] = useState<string[]>([]);
  const [error, setError] = useState<string []>([]);
  const [errorText, setErrorText] = useState<string | null>(null);

  const sendToDB = async (
    id: number | null,
    column: string | null,
    value: string
  ) => {
    if (id) {
      try {
        const resp = await httpClient.post(
          `//${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKENDPORT}/update_column`,
          { icusnum: id, column, value }
        );

        let result;
        if (resp.data.response) {
          result = 1;
        }
        if (resp.data.error) {
          setErrorText(resp.data.error);

          const index = column && waiting.indexOf(column);
          let newWaitingList = [...waiting];
          if (index && index > -1) {
            // only splice array when item is found
            newWaitingList.splice(index, 1); // 2nd parameter means removing one item only
          }
          setWaiting(newWaitingList);
          
          let newErrors = [...error]
          if (column && newErrors.includes(column) === false)
          newErrors.push(column);
          setError(newErrors)
        }

        return result;
      } catch (error) {
        console.log(error);
        console.log("Не удалось обновить клиента :с");
      }
    }
  };

  const startUpdating = async (
    id: number | null,
    column: string | null,
    value: string,
    title: string,
    abs: string
  ) => {
    if (id) {
      setErrorText(null)
      if (column) {
        if (updatedColumns.includes(column)) {
          setErrorText(`${title} уже обновлён`)
        }
        else {
        let newvalue;
        let newWaitingColumns = [...waiting];
        if (newWaitingColumns.includes(column) === false)
          {newWaitingColumns.push(column);
          setWaiting(newWaitingColumns);
          console.log(waiting);}
        console.log(abs)
        
        if (column == 'CCUSOKVED2') {
          const simecolon_count = abs.split(";").length - 1;
          simecolon_count <= 1 ? newvalue = value+';' : newvalue = abs+value+';';
        }
        else {
          newvalue = value;
        }
        const result = await sendToDB(id, column, newvalue);

        if (column && result == 1) {
          let newUpdatedColumns = [...updatedColumns];
          newUpdatedColumns.push(column);
          setUpdatedColumns(newUpdatedColumns);

          const index = column && waiting.indexOf(column);
          let newWaitingList = [...waiting];
          if (index && index > -1) {
            // only splice array when item is found
            newWaitingList.splice(index, 1); // 2nd parameter means remove one item only
          }
          setWaiting(newWaitingList);
        }
      }
      }
    }
  };
  console.log('waiting')
  console.log(waiting)
  console.log('updatedColumns')
  console.log(updatedColumns)
  console.log('error')
  console.log(error)

  const refreshMV = async () => {
        if (updatedColumns.length >= 1) {
          console.log('Refreshing the materialized view')
          try {
            const resp = await httpClient.post(
              `//${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKENDPORT}/refresh_egrul_mv`,
            );
              console.log(resp.data)
            } catch (error) {
                console.log("Error occured while refreshing the materialized view");
              }
            }
    }

  return (
    <div className="h-full">
      <Modal
        setModules={setModule}
        width="w-[1000px]"
        height="h-fit"
        paddingy="py-8"
      >
        <>
          {loadingDifference && (
            <div className="w-full flex justify-center">
              <Spinner />
            </div>
          )}
        </>

        <>
          {!loadingDifference && (
            <>
              <div className="text-xl text-color-primary font-bold pl-2 pb-4">Клиент № {icusnum}</div>
              { clientDifferences && clientDifferences.length > 0 && <div className="grid grid-cols-[20%_35%_35%_10%] font-semibold text-lg bg-[#e7ecff] p-2 rounded-tl-xl rounded-tr-xl ">
                <div className="flex justify-center drop-shadow-md	">
                  Название
                </div>
                <div className="flex justify-center drop-shadow-md	">ЕГРЮЛ</div>
                <div className="flex justify-center drop-shadow-md	">АБС</div>
                <div></div>
              </div> }
              {clientDifferences &&
                clientDifferences.map((element, key) => (
                  <div
                    className={`grid grid-cols-[20%_35%_35%_10%] p-2 ${
                      key % 2 ? "bg-[#f5f7ff]" : "bg-[#fffafa] "
                    } ${
                      key + 1 == clientDifferences.length
                        ? "rounded-bl-xl rounded-br-xl"
                        : " "
                    }`}
                  >
                    <div className="flex items-center font-semibold text-color-dark drop-shadow-md	 ">
                      {element.title}
                    </div>
                    <div
                      className={`flex items-center font-thin ${
                        element.egrul?.length > 50 ? " text-md " : " text-lg "
                      }`}
                    >
                      {element?.egrul ? element.egrul : "Не заполнено"}
                    </div>
                    <div
                      className={`flex items-center font-thin ${
                        element.abs?.length > 50 ? " text-md " : " text-lg "
                      }`}
                    >
                      {element?.abs ? element.abs : "Не заполнено"}
                    </div>
                    <div className="flex items-center">
                      {element.column ? (
                        <button
                          className={`customButtonTransparent text-sm w-fit py-1 px-2 shadow-md ${
                            updatedColumns.includes(element.column)
                              ? "text-color-success"
                              : ""
                          } ${
                            error.includes(element.column)
                              ? "text-color-danger"
                              : ""
                          }`}
                          key={uuid()}
                          onClick={() =>
                            startUpdating(
                              icusnum,
                              element.column,
                              element.egrul,
                              element.title,
                              element.abs
                            )
                          }
                        >
                          {waiting.includes(element.column) ? (
                            <Spinner />
                          ) : updatedColumns.includes(element.column) ? (
                            "Сохранено"
                          ) : error.includes(element.column) ? "Ошибка" :
                            "Обновить"
                          }
                        </button>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                ))}
                {clientDifferences?.length == 0 && <div className="flex justify-center text-2xl text-color-dark">Различия отсутствуют</div>}
                {errorText && <div className="text-color-danger font-bold mt-2 pl-2">{errorText}</div>}
                <div className="flex justify-center pt-5"><button className="customButtonNoWdt text-sm w-fit py-1 px-2" key={uuid()} onClick={async () => {setModule(false); await refreshMV(); }}>Закрыть</button></div>
            </>
          )}
        </>
      </Modal>
    </div>
  );
};

export default EgrulWindows;
