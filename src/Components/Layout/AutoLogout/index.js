import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
const events = [
  "load",
  "mousemove",
  "mousedown",
  "click",
  "scroll",
  "keypress",
];

const AutoLogout = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const timerRef = useRef();

  const logoutAction = useCallback(() => {
    localStorage.clear();
    navigate("/login");
  }, [navigate]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleLogoutTimer = useCallback(() => {
    timerRef.current = setTimeout(() => {
      resetTimer();
      Object.values(events).forEach((item) => {
        window.removeEventListener(item, resetTimer);
      });

      logoutAction();
    }, 1800000);
  }, [resetTimer, logoutAction]);

  useEffect(() => {
    if (token) {
      Object.values(events).forEach((item) => {
        window.addEventListener(item, () => {
          resetTimer();
          handleLogoutTimer();
        });
      });
    } else navigate("/login");
  }, [token, navigate, resetTimer, handleLogoutTimer]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        await api
          .get("/user/who-iam")
          .then((response) =>
            localStorage.setItem("userData", JSON.stringify(response.data.data))
          );
      } catch (error) {
        console.log("error", error);
      }
    };

    getUserData();
  }, []);
  return children;
};

export default AutoLogout;
