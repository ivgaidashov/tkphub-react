import React from 'react'
import Modal from "../components/Modal";
import httpClient from "../utils/ApiRequests";

type DeleteDeviceProps = {
    deviceId: string | null,
    setModules: React.Dispatch<React.SetStateAction<boolean>>,
    deletedHandler: (id: string, status?: boolean) => void;
}


const DeleteDevice = ({deviceId, setModules, deletedHandler} : DeleteDeviceProps) => {

const DeleteDeviceHandler = async () => {
    const URL = `//${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKENDPORT}/delete_device`;
    console.log(URL)
    try {
        console.log(URL)

        const resp = await httpClient.post(
            URL,
            {data: deviceId,}
          );
          if (resp.data.response === 'Successfully deleted '+deviceId)
          {
            console.log('Successfully deleted ' + deviceId);
            deviceId && deletedHandler(deviceId)
            
            setModules(false)
          }
          else {
            console.log(resp.data.response);
            deviceId && deletedHandler(deviceId, false)
          }

    }
    catch (e: any) {
        console.log(e)
    }
}

  return (
    <div className="h-full ">
          <Modal setModules={setModules} height="h-[150px]" width="w-[600px]" paddingy="py-8">
          <div className='h-full w-5/6 flex flex-col justify-center items-center mx-auto'>
            
            <p className='font-semibold text-color-primary text-xl '>Вы уверены, что хотите удалить данное устройство?</p>
          

          <div className='flex justify-center items-center gap-4 mt-7'><button className='customButtonNoWdt' onClick={() => DeleteDeviceHandler()} >
              Да
            </button>
            <button className='customButtonYellow hover:no-border' onClick={() => setModules(false)} >
              Нет
            </button>
            </div>
          </div>
          <div></div>

          
          </Modal>
    </div>
  )
}

export default DeleteDevice