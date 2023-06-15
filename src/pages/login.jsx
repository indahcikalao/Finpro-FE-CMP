import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TogglePassword } from "../Components/Atoms";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import Swal from "sweetalert2";

export default function Login() {
  const [passwordShown, setPasswordShown] = useState(false);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
  });

  const navigate = useNavigate();

  const urlMock = "https://88857839-8bc7-4b7e-ae66-3aac4cfcacf1.mock.pstmn.io";

  const handleLogin = async (value) => {
    console.log("==>value sent (later)", value);
    try {
      const res = await axios.post(`${urlMock}/login`, value, {
        headers: {
          "x-mock-response-code": 200,
        },
      });
      console.log("==>response", res);

      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Welcome Back!",
          text: "You are logged in.",
        }).then(() => {
          navigate("/");
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const bg =
    "https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80";

  const formik = useFormik({
    initialValues,
    validationSchema,
  });

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
          <CardBody className="flex flex-col gap-2">
            <div className="mb-2">
              <Input
                type="email"
                label="Email"
                size="lg"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <Typography variant="small" color="red">
                  {formik.errors.email}
                </Typography>
              )}
            </div>
            <div className="mb-2">
              <div className="relative">
                <Input
                  type={passwordShown ? "text" : "password"}
                  label="Password"
                  size="lg"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <TogglePassword
                  type="button"
                  onClick={() => setPasswordShown(!passwordShown)}
                  children={
                    passwordShown ? (
                      <RiEyeOffLine className="w-5 h-5" />
                    ) : (
                      <RiEyeLine className="w-5 h-5" />
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
            <Link className="text-sm text-right">
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
                (!formik.touched.email && !formik.touched.password) ||
                formik.errors.password ||
                formik.errors.email
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
