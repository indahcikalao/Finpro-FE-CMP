import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { useFormik } from "formik";
import { TogglePassword } from "../../../Components/Atoms";
import { useAuth, useLocalStorage } from "../../../hooks";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";

export default function Login() {
  const [passwordShown, setPasswordShown] = useState(false);
  const { getUserData } = useAuth();

  const navigate = useNavigate();
  const url = process.env.REACT_APP_BASE_URL;
  const bg =
    "https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80";

  const initialValues = {
    username: "",
    password: "",
  };

  const tokenStorage = useLocalStorage("token");
  const token = tokenStorage.get();

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
  });

  if (token) {
    return <Navigate to="/" />;
  }

  const handleLogin = async (value) => {
    try {
      const res = await axios.post(`${url}/login`, value);
      console.log(res);

      if (res.status === 200) {
        tokenStorage.set(res.data.data.token);

        await getUserData();

        await Swal.fire({
          icon: "success",
          title: "Welcome Back!",
          text: "You are logged in.",
        }).then(() => {
          navigate("/");
        });
      }
    } catch ({ response: error }) {
      Swal.fire({
        icon: "error",
        title: error.data.message,
        text:
          error.data.message === "The account is not yet activated"
            ? "Please contact Admin to activate your account!"
            : error.data.input_false === 1
            ? `You have 2 more attempts. Please try again!`
            : error.data.input_false === 2
            ? `You have 1 more attempt. Please try again!`
            : error.data.input_false === 3
            ? `Your Account is unactivated. Please contact Admin to reactivate your account!`
            : "please try again!",
      });
    }
  };

  return (
    <>
      <img
        src={bg}
        className="absolute inset-0 z-0 h-full w-full object-cover"
        alt="background"
      />
      <div className="absolute inset-0 z-0 h-full w-full bg-black/50" />
      <div className="container mx-auto p-4">
        <Card className="absolute top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 h-28 flex flex-col justify-center items-center"
          >
            <Typography variant="h3" color="white">
              Welcome Back
            </Typography>
            <p>It's nice to see you again.</p>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <div className="mb-2">
              <label
                htmlFor="username"
                className="block text-gray-700 text-sm font-bold mb-1"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                className="shadow appearance-none border border-gray-400 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.username && formik.errors.username && (
                <Typography variant="small" color="red">
                  {formik.errors.username}
                </Typography>
              )}
            </div>
            <div className="mb-2">
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-bold mb-1"
                >
                  Password
                </label>
                <input
                  type={passwordShown ? "text" : "password"}
                  id="password"
                  className="shadow appearance-none border border-gray-400 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  data-testid="password-input"
                />
                <TogglePassword
                  type="button"
                  ariaLabel="Toggle Password Visibility"
                  onClick={() => setPasswordShown(!passwordShown)}
                  children={
                    passwordShown ? (
                      <RiEyeOffLine className="w-6 h-6" />
                    ) : (
                      <RiEyeLine className="w-6 h-6" />
                    )
                  }
                />
              </div>
              {formik.touched.password && formik.errors.password && (
                <Typography variant="small" color="red">
                  {formik.errors.password}
                </Typography>
              )}
            </div>
            <Link className="text-sm text-right" to="/reset-password">
              <Typography variant="small" color="blue" className="ml-1">
                Forgot Password?
              </Typography>
            </Link>
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              variant="gradient"
              fullWidth
              onClick={() => handleLogin(formik.values)}
              disabled={
                (!formik.touched.username && !formik.touched.password) ||
                formik.errors.password ||
                formik.errors.username
              }
            >
              Login
            </Button>

            <Typography variant="small" className="mt-6 flex justify-center">
              Don't have an account?
              <Link to="/register">
                <Typography
                  as="span"
                  variant="small"
                  color="blue"
                  className="ml-1 font-bold"
                >
                  Register
                </Typography>
              </Link>
            </Typography>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
