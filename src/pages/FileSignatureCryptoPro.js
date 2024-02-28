import React, { useState, useEffect } from "react";
import FileSignature from "file-signature-in-react";
import httpClient from "../utils/ApiRequests";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "../atoms/ModalAtoms";

export const FileSignatureCryptoPro = () => {
  const [filesForSignature, setFilesForSignature] = useState(null);
  const [clear, setClear] = useState(false);

  const navigate = useNavigate();

  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.post("//192.168.20.175:5004/@me", {
          page: 2,
        });
        setUser(resp.data?.login_id);
      } catch (error) {
        console.log("Not authenticated");
        navigate("/");
      }
    })();
  }, []);

  const fileInputHandler = ({ target: { files = [] } }) => {
    setFilesForSignature(files);
  };

  const onChange = (e) => {
    console.log(e);
    console.log(e[0].sign);
    console.log(e[0].sign.type);

    const blob = new Blob([e[0].sign], { type: e[0].sign.type });
    // Create a link pointing to the ObjectURL containing the blob
    const blobURL = window.URL.createObjectURL(blob);
    const tempLink = document.createElement("a");
    tempLink.style.display = "none";
    tempLink.href = blobURL;
    tempLink.setAttribute("download", e[0].fileNameSign);
    // Safari thinks _blank anchor are pop ups. We only want to set _blank
    // target if the browser does not support the HTML5 download attribute.
    // This allows you to download files in desktop safari if pop up blocking
    // is enabled.
    if (typeof tempLink.download === "undefined") {
      tempLink.setAttribute("target", "_blank");
    }
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(blobURL);
    }, 100);
  };
  const callbackError = (e) => console.error(e);

  return (
    <div className="flex w-full h-screen flex-col justify-center items-center">
      <div className="flex justify-center w-1/2 items-center p-4 bg-color-primary  rounded-xl hover:rounded-2xl ease-in-out duration-200 shadow-lg">
        <p className="text-color-white text-3xl">Электронная подпись документов</p>
      </div>

      <div className="flex flex-col  w-1/2 mt-10 justify-center items-center">
        <div className="flex items-center w-full mb-3"> {/*строка*/}
          <div className = "flex justify-center items-center w-1/12 h-12 bg-color-success rounded-lg shadow-lg">
            <p className="font-bold">1</p>
          </div>
          <div className = "flex w-11/12 pl-6">
            <p className="text-justify">Убедитесь, что у вас установлены «КРИПТО-ПРО» и плагин для браузеров «КриптоПро ЭЦП Browser plug-in».</p>
          </div>
        </div>

        <div className="flex items-center w-full mb-3"> {/*строка*/}
          <div className = "flex justify-center items-center w-1/12 h-12 bg-color-primary rounded-lg shadow-lg">
            <p className="font-bold">2</p>
          </div>
          <div className = "flex w-11/12 pl-6">
            <p className="text-justify">При первом запуске разрешите доступ к Вашим сертификатам и ключам.</p>
          </div>
        </div>

        <div className="flex items-center w-full mb-3"> {/*строка*/}
          <div className = "flex justify-center items-center w-1/12 h-12 bg-color-warning rounded-lg shadow-lg">
            <p className="font-bold">3</p>
          </div>
          <div className = "flex w-11/12 pl-6">
            <p className="text-justify">На Вашем компьютере должны быть добавлены сертификаты ЭЦП.</p>
          </div>
        </div>

        <div className="flex items-center w-full"> {/*строка*/}
          <div className = "flex justify-center items-center w-1/12 h-12 bg-color-danger rounded-lg shadow-lg">
            <p className="font-bold">4</p>
          </div>
          <div className = "flex w-11/12 pl-6">
            <p className="text-justify">Выберите файл и подпись, затем укажите путь сохранения.</p>
          </div>
        </div>       
      </div>

      <input
        type="file"
        className="flex items-center mt-10 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-color-primary file:text-color-white file:cursor-pointer hover:file:bg-color-primary-variant"
        onChange={fileInputHandler}
        multiple // если хотим подписать много файлов скопом
      />

      {/*<button onClick={() => {setClear(true); console.log("pressed")}}> Удалить подпись</button>*/}

      <div className="flex mt-5 text-center"><FileSignature
        {...{
          onChange, // функция вызовится когда файл подпишится
          files: filesForSignature, // сам файлы для подписи
          clear, // флаг очищения подписи
          callbackError, // функция вызовится когда будет ошибка
          /*
          SelectComponent: MySelect,
          ButtonComponent: MyButton,
          
          */
        }}
      /></div>

      
    </div>
  );
};

export default FileSignatureCryptoPro;
