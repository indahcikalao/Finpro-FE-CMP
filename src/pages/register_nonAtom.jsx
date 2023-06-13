import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";

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
    status: "inactive",
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
          text: "Registration successful. Please wait for admin verification.",
        }).then(() => {
          navigate("/login");
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        if (
          error.response.data.error ===
          "Password and Confirm Password must match"
        ) {
          setFieldError("confirm_password", "Passwords must match");
        } else if (
          error.response.data.error ===
          "Password must contain a combination of letters and numbers"
        ) {
          setFieldError(
            "password",
            "Password must contain a combination of letters and numbers"
          );
        } else if (
          error.response.data.error === "Email is already registered"
        ) {
          setFieldError("email", "Email is already taken");
        } else if (
          error.response.data.error === "Username is already registered"
        ) {
          setFieldError("username", "Username is already taken");
        } else {
          Swal.fire({
            icon: "error",
            title: "Registration Failed",
            text: "An error occurred. Please try again later.",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: "An error occurred. Please try again later.",
        });
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
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Insert your Email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="username"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Username
                    </label>
                    <Field
                      type="text"
                      name="username"
                      id="username"
                      placeholder="Insert your Username"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="full_name"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Full Name
                    </label>
                    <Field
                      type="text"
                      name="full_name"
                      id="full_name"
                      placeholder="Insert your Full Name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    />
                    <ErrorMessage
                      name="full_name"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Field
                        type={passwordShown ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder="••••••••"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10"
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
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="confirm_password"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Field
                        type={passwordShown ? "text" : "password"}
                        name="confirm_password"
                        id="confirm_password"
                        placeholder="••••••••"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10"
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
                    <ErrorMessage
                      name="confirm_password"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="text-center mt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-500 px-4 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:bg-primary-700"
                    >
                      {isSubmitting ? "Creating..." : "Create Account"}
                    </button>
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
