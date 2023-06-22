import { useCallback, useEffect, useRef } from "react";
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

	return children;
};

export default AutoLogout;
