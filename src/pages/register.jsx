import { useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import Swal from "sweetalert2";

export function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  //Yup validation
  const validationSchema = Yup.object().shape({
    fullname: Yup.string().required("Full Name is required"),
    username: Yup.string().required("Username is required"),
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
    agreeTerms: Yup.bool().oneOf(
      [true],
      "You must accept the Terms and Conditions"
    ),
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
      agreeTerms: false,
    },
    validationSchema,

    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "https://cmp-project.up.railway.app/register",
          values,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Show success popup sweetalert2
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "Please wait admin to verify your Account",
        }).then(() => {
          // Redirect to login page
          window.location.href = "/login";
        });

        console.log(response);
        console.log(response.data);
      } catch (error) {
        console.error(error);

        //check if email already registered
        if (error.response.data.message === "Email already registered") {
          formik.setFieldError(
            "email",
            "Email already taken. Choose another one"
          );
        }
        //check if username already registered
        else if (
          error.response.data.message === "Username already registered"
        ) {
          formik.setFieldError(
            "username",
            "Username already taken. Choose another one"
          );
        } else {
          formik.setFieldError("email", "Error happend. Please try again.");
        }
      }
    },
  });

  //function to show password
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  //function to show confirm password
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

      <div className="container mx-auto">
        <div className="flex items-center justify-center h-screen scale-75">
          <Card className="w-full max-w-[24rem]">
            <CardHeader
              variant="gradient"
              color="blue"
              className="mb-2 grid h-28 place-items-center"
            >
              <Typography variant="h3" color="white">
                Create Account
              </Typography>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
              <div className="mb-2">
                <Input
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
                <Input
                  label="Full Name"
                  size="lg"
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
              <div className="mb-2">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    size="lg"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-3 focus:outline-none"
                    onClick={handleTogglePassword}
                  >
                    {showPassword ? (
                      <RiEyeOffLine className="h-6 w-6" />
                    ) : (
                      <RiEyeLine className="h-6 w-6" />
                    )}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <Typography variant="small" color="red">
                    {formik.errors.password}
                  </Typography>
                )}
              </div>
              <div className="mb-0">
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    label="Confirm Password"
                    size="lg"
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-3 focus:outline-none"
                    onClick={handleToggleConfirmPassword}
                  >
                    {showConfirmPassword ? (
                      <RiEyeOffLine className="h-6 w-6" />
                    ) : (
                      <RiEyeLine className="h-6 w-6" />
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
              <div className="-ml-2.5">
                <Checkbox
                  label="I agree to the Terms and Conditions"
                  name="agreeTerms"
                  checked={formik.values.agreeTerms}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.agreeTerms && formik.errors.agreeTerms && (
                  <Typography variant="small" color="red">
                    {formik.errors.agreeTerms}
                  </Typography>
                )}
              </div>
            </CardBody>
            <CardFooter className="mb-2 pt-0">
              <Button
                variant="gradient"
                fullWidth
                type="submit"
                onClick={formik.handleSubmit}
              >
                Register
              </Button>
              <Typography variant="small" className="mt-3 flex justify-center">
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
      </div>
    </>
  );
}

export default Register;
