import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "../atoms/ModalAtoms";
import httpClient from "../utils/ApiRequests";

const Header = () => {
  const [user, setUser] = useRecoilState(userState);
  document.title = "TKPHub";
  console.log("header");

  const navigate = useNavigate();

  const location = useLocation();

  const logOut = async () => {
    await httpClient.post(`//${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKENDPORT}/logout`);
    window.location.href = "/";
  };

  return (
    <div className="flex w-full h-16 justify-between items-center">
      {user && (
        <>
          <div className="flex w-80 justify-between items-center">
            {location.pathname === "/" && (
              <div className="flex pr-4 items-center">
                Добро пожаловать,{" "}
                <p className="ml-3 px-5 py-2 hover:px-6 hover:py-1 border border-color-primary rounded-3xl hover:bg-color-success transition-all ease-out hover:border-color-success text-color-primary hover:text-color-white font-bold">
                  {user}
                </p>
              </div>
            )}

            {location.pathname !== "/" && (
              <button
                className="customButtonYellow hover:no-border"
                onClick={() => {
                  navigate("/");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                  />
                </svg>
                <p className="pl-2">Назад</p>
              </button>
            )}
          </div>
          <div className="">
            <button className="customButton" onClick={logOut}>
              Выйти
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Header;
