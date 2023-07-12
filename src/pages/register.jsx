import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import Swal from "sweetalert2";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const url = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  // Yup validation
  const validationSchema = Yup.object().shape({
    fullname: Yup.string()
      .min(4, "Full Name must be at least 4 characters")
      .required("Full Name is required"),
    username: Yup.string()
      .min(4, "Username must be at least 4 characters")
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+_!@#$%^&*.,?]).{8,}$/,
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one symbol"
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      fullname: "",
      password: "",
      confirmPassword: "",
      is_active: false,
      role: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(`${url}/register`, values, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Show success popup sweetalert2
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Registration Successful",
          text: "Please wait for admin to verify your Account",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          // Redirect to login page
          navigate("/login");
        });

        console.log(response);
        console.log(response.data);
      } catch (error) {
        console.log(error);

        // Check if email already registered
        if (error.response?.data?.message === "Email already registered") {
          formik.setFieldError(
            "email",
            "Email already taken. Choose another one"
          );
        }
        // Check if username already registered
        else if (
          error.response?.data?.message === "Username already registered"
        ) {
          formik.setFieldError(
            "username",
            "Username already taken. Choose another one"
          );
        }
      }
    },
  });

  // Function to show password
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Function to show confirm password
  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <img
        src="https://images.unsplash.com/photo-1682685797208-c741d58c2eff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        className="absolute inset-0 z-0 h-full w-full object-cover"
        alt="background"
      />
      <div className="absolute inset-0 z-0 h-full w-full bg-black/50" />
      <div className="container mx-auto p-4">
        <Card className="absolute top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-1 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              Create Account
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <div className="mb-1">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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

            <div className="mb-1">
              <label
                htmlFor="username"
                className="block text-gray-700 text-sm font-bold mb-1"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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

            <div className="mb-1">
              <label
                htmlFor="fullname"
                className="block text-gray-700 text-sm font-bold mb-1"
              >
                Full Name
              </label>
              <input
                id="fullname"
                type="text"
                className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="fullname"
                value={formik.values.fullname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.fullname && formik.errors.fullname && (
                <Typography variant="small" color="red">
                  {formik.errors.fullname}
                </Typography>
              )}
            </div>
            <div className="mb-1">
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-bold mb-1"
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  data-testid="password-input"
                />
                <button
                  type="button"
                  className="absolute right-4 top-8 focus:outline-none"
                  aria-label="Toggle Password Visibility"
                  onClick={handleTogglePassword}
                >
                  {showPassword ? (
                    <RiEyeLine className="h-6 w-6" />
                  ) : (
                    <RiEyeOffLine className="h-6 w-6" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <Typography variant="small" color="red">
                  {formik.errors.password}
                </Typography>
              )}
            </div>
            <div className="mb-1">
              <div className="relative">
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-700 text-sm font-bold mb-1"
                >
                  Confirm Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  data-testid="confirmPassword-input"
                />
                <button
                  type="button"
                  className="absolute right-4 top-8 focus:outline-none"
                  aria-label="Toggle Confirm Password Visibility"
                  onClick={handleToggleConfirmPassword}
                >
                  {showConfirmPassword ? (
                    <RiEyeLine className="h-6 w-6" />
                  ) : (
                    <RiEyeOffLine className="h-6 w-6" />
                  )}
                </button>
              </div>
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <Typography variant="small" color="red">
                    {formik.errors.confirmPassword}
                  </Typography>
                )}
            </div>
          </CardBody>
          <CardFooter className="mb-1 pt-0">
            <Button
              variant="gradient"
              fullWidth
              type="submit"
              onClick={formik.handleSubmit}
            >
              Register
            </Button>
            <Typography variant="small" className="mt-2 flex justify-center">
              Already have an account?
              <Link to="/login">
                <Typography
                  as="span"
                  variant="small"
                  color="blue"
                  className="ml-1 font-bold"
                >
                  Sign in
                </Typography>
              </Link>
            </Typography>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Register;
