import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function ResetPassword() {
  const [passwordShown, setPasswordShown] = useState(false);

  const initialValues = {
    email: "",
    password: "",
    confirm_password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .required("Required")
      .matches(
        /^(?=.*\d)(?=.*[a-zA-Z]).{8,}.*$/,
        "Password must contain at least 8 characters and combination of letters and numbers"
      ),
    confirm_password: Yup.string()
      .required("Required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const navigate = useNavigate();

  const urlMock = process.env.REACT_APP_BASE_URL;

  const handleResetPassword = async (value) => {
    const data = {
      email: value.email,
      password: value.password,
    };

    console.log("==>value sent (later)", data);
    try {
      const res = await axios.patch(`${urlMock}/user/forgot-password`, data);
      console.log("==>response", res);

      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Password Updated!",
          text: "Your password has been successfully updated.",
        }).then(() => {
          navigate("/login");
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
        alt="background"
        className="absolute inset-0 z-0 h-full w-full object-cover"
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
              Forgot Password?
            </Typography>
            <p>No worries, we got you!</p>
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
            <div className="mb-2">
              <div className="relative">
                <Input
                  type={passwordShown ? "text" : "password"}
                  label="Confrim Password"
                  size="lg"
                  name="confirm_password"
                  value={formik.values.confirm_password}
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
              {formik.touched.confirm_password &&
                formik.errors.confirm_password && (
                  <Typography variant="small" color="red">
                    {formik.errors.confirm_password}
                  </Typography>
                )}
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              variant="gradient"
              fullWidth
              onClick={() => handleResetPassword(formik.values)}
              disabled={
                (!formik.touched.email &&
                  !formik.touched.password &&
                  !formik.touched.confirm_password) ||
                formik.errors.password ||
                formik.errors.email ||
                formik.errors.confirm_password
              }
            >
              Reset Password
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
