import React, { useState } from "react";
import httpClient from "../utils/ApiRequests";
import uuid from "react-uuid";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";
import { idTitleList } from "../Interfaces";

interface iProps {
  setModule: (value: boolean) => void;
  loadingAddresses: boolean;
  addressTypes: idTitleList | undefined;
  addressPayload: idTitleList | undefined;
  clientCorrectAddress: string | undefined;
  icusnum: number | null;
}



const EgrulAddress = ({
  setModule,
  loadingAddresses,
  addressTypes,
  addressPayload,
  clientCorrectAddress,
  icusnum,
}: iProps) => {

    const [updatedAddresses, setUpdatedAddresses] = useState<number[]>([]);
    const [waiting, setWaiting] = useState<number[]>([]);
    const [error, setError] = useState<number[]>([]);
    const [errorText, setErrorText] = useState<string | null>(null);  
  
    const sendToDB = async (
      id: number | null,
      type: number
      ) => {
      if (id) {
        try {
          const resp = await httpClient.post(
            `//${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKENDPORT}/update_address`,
            { icusnum: id, type }
          );
  
          let result;
          if (resp.data.response) {
            result = 1;
          }
          if (resp.data.error) {
            setErrorText(resp.data.error);
  
            const index = waiting.indexOf(id);
            let newWaitingList = [...waiting];
            if (index && index > -1) {
              // only splice array when item is found
              newWaitingList.splice(index, 1); // 2nd parameter means remove one item only
            }
            setWaiting(newWaitingList);
            
            let newErrors = [...error]
            if (newErrors.includes(id) === false)
            newErrors.push(id);
            setError(newErrors)
          }
  
          return result;
        } catch (error) {
          console.log(error);
          console.log("Не удалось обновить клиента :с");
        }
      }
    };

    const getAddressForType = (idType: number) => {
      let matchAddress = addressPayload && addressPayload.find(addr => addr.id === idType);
      return matchAddress ? matchAddress.title : 'Не задан'
    }

    const startUpdating = async (
      icusnum: number | null,
      id: number,
      title: string,
       
      ) => {

          if (updatedAddresses.includes(id)) {
            setErrorText(`${title} уже обновлён`)
          }
          else {
          let newvalue;
          let newWaitingColumns = [...waiting];
          if (newWaitingColumns.includes(id) === false)
            {newWaitingColumns.push(id);
            setWaiting(newWaitingColumns);
            console.log(waiting);}

          const result = await sendToDB(icusnum, id);
  
          if (result == 1) {
            let newUpdatedAddresses = [...updatedAddresses];
            newUpdatedAddresses.push(id);
            setUpdatedAddresses(newUpdatedAddresses);
  
            const index = waiting.indexOf(id);
            let newWaitingList = [...waiting];
            if (index && index > -1) {
              // only splice array when item is found
              newWaitingList.splice(index, 1); // 2nd parameter means remove one item only
            }
            setWaiting(newWaitingList);
          }
        }

      }
  
    const refreshMV = async () => {
    if (updatedAddresses.length >= 1) {
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
  };
  return (
    <div className="h-full">
      <Modal
        setModules={setModule}
        width="w-fit"
        height="h-fit"
        paddingy="py-8"
      >
        <>
          {loadingAddresses && (
            <div className="w-full flex justify-center">
              <Spinner />
            </div>
          )}
        </>

        <>
          {!loadingAddresses && (
            <>
              {addressPayload && addressPayload.length > 0 && (
                <>
                  <div>
                    <div className=" w-full h-12 text-2xl text-color-primary font-bold ">
                      Клиент № {icusnum}:{" "}
                      <div className="text-base font-light text-color-dark">
                       Жёлтый - данные из ЕГРЮЛ, фиолетовый - текущий адрес в АБС, <button className="customButtonTransparent text-sm w-fit py-0 px-2 shadow-md cursor-default">+</button> - обновить информацию.
                       </div>
                    </div>

                    <div className=" w-fit mt-5 text-lg font-semibold py-2 border-b-2 border-color-warning">
                      Адрес из ЕГРЮЛ
                    </div>

                    <div className=" font-light text-xl mt-2">
                      {clientCorrectAddress}
                    </div>
                  </div>
                  <div className="mt-8">
                    {addressTypes &&
                      addressTypes.map((element) => {
                        return (
                          <>
                            <div>
                              <div className="w-fit text-lg font-semibold   py-2">
                                <span className="border-b-2 border-color-primary mr-3">{element.title }</span>
                                <button
                          className={`customButtonTransparent text-sm w-fit py-0 px-2 shadow-md ${
                            updatedAddresses.includes(element.id)
                              ? "text-color-success"
                              : ""
                          } ${
                            error.includes(element.id)
                              ? "text-color-danger"
                              : ""
                          }`}
                          key={uuid()}
                          onClick={() =>
                            startUpdating(
                              icusnum,
                              element.id,
                              element.title
                            )
                          }
                        >
                          {waiting.includes(element.id) ? (
                            <Spinner />
                          ) : updatedAddresses.includes(element.id) ? (
                            "Сохранено"
                          ) : error.includes(element.id) ? "Ошибка" :
                            "+"
                          }
                        </button>
                              </div>
                            
                            </div>
                            <div className="font-light text-xl">
                              {
                                  updatedAddresses.includes(element.id) ? clientCorrectAddress : getAddressForType(element.id)
                              }
                              
                                
                            </div>
                          </>
                        );
                      })}
                  </div>
                </>
              )}

              {addressPayload?.length == 0 && (
                <div className="flex justify-center text-2xl text-color-dark">
                  Различия отсутствуют
                </div>
              )}
              {addressPayload?.length == 0 && <div className="flex justify-center text-2xl text-color-dark">Различия в адресах отсутствуют</div>}
                {errorText && <div className="text-color-danger font-bold mt-2 pl-2">{errorText}</div>}
                <div className="flex justify-center pt-5"><button className="customButtonNoWdt text-sm w-fit py-1 px-2" key={uuid()} onClick={async () => {setModule(false); await refreshMV(); }}>Закрыть</button></div>
            </>
          )}
        </>
      </Modal>
    </div>
  );
};

export default EgrulAddress;
