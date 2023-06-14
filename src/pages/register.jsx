import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Button,
  Input,
  TogglePassword,
  ErrorMessageInput,
} from "../Components/Atoms";

const Register = () => {
  const [passwordShown, setPasswordShown] = React.useState(false);
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const navigate = useNavigate();

  const initialValues = {
    email: "",
    username: "",
    full_name: "",
    password: "",
    confirm_password: "",
    role: "user",
    isActive: false,
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    username: Yup.string().required("Required"),
    full_name: Yup.string().required("Required"),
    password: Yup.string()
      .required("Required")
      .matches(
        /^(?=.*\d)(?=.*[a-zA-Z]).*$/,
        "Password must contain a combination of letters and numbers"
      ),
    confirm_password: Yup.string()
      .required("Required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const handleRegister = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/register",
        values
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Registration Success",
          text: "Please wait for admin verification.",
        }).then(() => {
          navigate("/login");
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.error;

        if (errorMessage === "Password and Confirm Password must match") {
          setFieldError("confirm_password", "Passwords must match");
        } else if (
          errorMessage ===
          "Password must contain a combination of letters and numbers"
        ) {
          setFieldError(
            "password",
            "Password must contain a combination of letters and numbers"
          );
        } else {
          // Check if email or username already registered
          if (
            errorMessage.includes("Email is already registered") ||
            errorMessage.includes("Username is already registered")
          ) {
            if (errorMessage.includes("Email is already registered")) {
              setFieldError("email", "Email is already taken");
            }
            if (errorMessage.includes("Username is already registered")) {
              setFieldError("username", "Username is already taken");
            }
          }
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg border-2 border-black shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Create Account
            </h1>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleRegister}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4 md:space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Email
                    </label>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Insert your Email"
                    />
                    <ErrorMessageInput name="email" />
                  </div>
                  <div>
                    <label
                      htmlFor="username"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Username
                    </label>
                    <Input
                      type="text"
                      name="username"
                      id="username"
                      placeholder="Insert your Username"
                    />
                    <ErrorMessageInput name="username" />
                  </div>
                  <div>
                    <label
                      htmlFor="full_name"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Full Name
                    </label>
                    <Input
                      type="text"
                      name="full_name"
                      id="full_name"
                      placeholder="Insert your Full Name"
                    />
                    <ErrorMessageInput name="full_name" />
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        type={passwordShown ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={togglePassword}
                        className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500"
                      >
                        {passwordShown ? (
                          <RiEyeOffLine className="w-5 h-5" />
                        ) : (
                          <RiEyeLine className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <ErrorMessageInput name="password" />
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="confirm_password"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Input
                        type={passwordShown ? "text" : "password"}
                        name="confirm_password"
                        id="confirm_password"
                        placeholder="••••••••"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10"
                      />
                      <TogglePassword
                        type="button"
                        onClick={togglePassword}
                        children={
                          passwordShown ? (
                            <RiEyeOffLine className="w-5 h-5" />
                          ) : (
                            <RiEyeLine className="w-5 h-5" />
                          )
                        }
                      />
                    </div>
                    <ErrorMessageInput name="confirm_password" />
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <Input type="checkbox" name="terms" id="terms" />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="terms"
                        className="font-light text-gray-500"
                      >
                        I accept the{" "}
                        <Link
                          className="font-medium text-primary-600 hover:underline"
                          to="#"
                        >
                          Terms and Conditions
                        </Link>
                      </label>
                    </div>

                    <ErrorMessageInput name="terms" />
                  </div>
                  <div className="text-center mt-6">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      children={
                        isSubmitting
                          ? "Creating account..."
                          : "Create an account"
                      }
                    />
                  </div>
                </Form>
              )}
            </Formik>
            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-500"
              >
                Log in
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
