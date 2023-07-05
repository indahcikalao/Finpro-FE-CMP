import React, { useState } from "react";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { useFormik } from "formik";
import { TogglePassword } from "../Components/Atoms";
import { Link } from "react-router-dom";
import * as Yup from "yup";
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
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);

  const navigate = useNavigate();
  const url = process.env.REACT_APP_BASE_URL;
  const bg =
    "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80";

  const initialValues = {
    email: "",
    username: "",
    password: "",
    confirm_password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is equired"),
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+_!@#$%^&*.,?]).{8,}$/,
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one symbol"
      ),
    confirm_password: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
  });

  const handleResetPassword = async (value) => {
    const data = {
      email: value.email,
      username: value.username,
      password: value.password,
    };

    try {
      const res = await axios.patch(`${url}/user/forgot-password`, data);

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
      Swal.fire({
        icon: "error",
        title: error.response.data.message,
        text: "Please try again!",
      });
    }
  };

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
          <CardBody className="flex flex-col gap-4">
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
              <Input
                type="text"
                label="Username"
                size="lg"
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
                  type={confirmPasswordShown ? "text" : "password"}
                  label="Confrim Password"
                  size="lg"
                  name="confirm_password"
                  value={formik.values.confirm_password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <TogglePassword
                  type="button"
                  onClick={() => setConfirmPasswordShown(!confirmPasswordShown)}
                  children={
                    confirmPasswordShown ? (
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
          <CardFooter className="pt-0 pb-8">
            <Button
              variant="gradient"
              fullWidth
              onClick={() => handleResetPassword(formik.values)}
              disabled={
                (!formik.touched.email &&
                  !formik.touched.password &&
                  !formik.touched.confirm_password &&
                  formik.touched.username) ||
                formik.errors.password ||
                formik.errors.email ||
                formik.errors.confirm_password ||
                formik.errors.username
              }
            >
              Reset Password
            </Button>
            <Typography variant="small" className="mt-3 flex justify-center">
              Remember your password?
              <Link to="/login">
                <Typography
                  as="span"
                  variant="small"
                  color="blue"
                  className="ml-1 font-bold"
                >
                  Log In
                </Typography>
              </Link>
            </Typography>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
