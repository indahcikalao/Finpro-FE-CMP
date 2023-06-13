import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
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

  const handleRegister = (values, { setSubmitting }) => {
    // Simulate API request
    axios
      .post("http://localhost:3005/register", values)
      .then((res) => {
        console.log(res);

        if (res.status === 200) {
          const data = res.data;
          if (data.error) {
            // Handle username or email already exists error
            alert(data.error);
          } else {
            if (data.status === "active") {
              navigate("/login");
            } else {
              alert(
                "User registration is not yet active, please wait for admin verification"
              );
              navigate("/login");
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setSubmitting(false);
      });
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
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    children={
                      isSubmitting ? "Creating account..." : "Create an account"
                    }
                  />
                  <p className="text-sm font-light text-gray-500">
                    Already have an account?{" "}
                    <Link
                      to={"/login"}
                      className="font-medium text-primary-600 hover:underline"
                    >
                      Login here
                    </Link>
                  </p>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
