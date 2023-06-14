import React from "react";
import { Link } from "react-router-dom";

export default function login() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div>
        <div className="font-bold text-2xl"> INI PAGE LOGIN</div>
        <Link to="/register">
          <button class="bg-blue-500 mt-5 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
            Kembali ke Register
          </button>
        </Link>
      </div>
    </div>
  );
}
