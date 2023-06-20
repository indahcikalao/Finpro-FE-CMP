import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  let timer;

  const logoutAction = () => {
    localStorage.clear();
    navigate("/login");
  };

  const resetTimer = () => {
    if (timer) clearTimeout(timer);
  };

  const handleLogoutTimer = () => {
    timer = setTimeout(() => {
      resetTimer();
      Object.values(events).forEach((item) => {
        window.removeEventListener(item, resetTimer);
      });

      logoutAction();
    }, 1800000);
  };

  useEffect(() => {
    if (token) {
      Object.values(events).forEach((item) => {
        window.addEventListener(item, () => {
          resetTimer();
          handleLogoutTimer();
        });
      });
    } else navigate("/login");
  }, [token, navigate]);

  return children;
};

export default AutoLogout;
