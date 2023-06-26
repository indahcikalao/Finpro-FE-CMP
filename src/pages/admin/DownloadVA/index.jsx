import { Input, Typography, Radio, Button } from "@material-tailwind/react";
import React, { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import * as Yup from "yup";
import { useFormik } from "formik";

export default function DownloadVA() {
  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });

  const handleValueChange = (newValue) => {
    formik.values.date.startDate = newValue.startDate;
    formik.values.date.endDate = newValue.endDate;
    setValue(newValue);
  };
  const initialValues = {
    giroNumber: "",
    date: { startDate: "", endDate: "" },
    accountType: "Giro Account",
  };

  const validationSchema = Yup.object().shape({
    giroNumber: Yup.string()
      .matches(/^[0-9]+$/, "Giro Account only consist of a serial of numbers")
      .test("len", "Must be exactly 11 digits", (val) => val.length === 11)
      .required("Giro Number is required"),
    date: Yup.object().required("ok"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
  });
  return (
    <div className="p-5">
      <div className="mb-10">
        <Typography variant="h5" color="blue-gray">
          Download VA Satker
        </Typography>
        <Typography color="gray">
          Download Giro or Virtual Account transaction History
        </Typography>
      </div>

      <div className="w-10/12 mx-auto">
        <div className="grid grid-cols-4 gap-2 mb-4 flex items-center">
          <Typography>Giro Account Number</Typography>
          <div className="col-span-3">
            <Input
              type="text"
              size="lg"
              name="giroNumber"
              placeholder="11 Digits Giro Number"
              className=" focus:!border-black border bg-white shadow-md !border-gray-500 shadow-blue-gray-900/5 text-blue-gray-500"
              labelProps={{
                className: "hidden",
              }}
              value={formik.values.giroNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.giroNumber && formik.errors.giroNumber && (
              <Typography variant="small" color="red">
                {formik.errors.giroNumber}
              </Typography>
            )}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-4 flex items-center">
          <div>Date Range</div>
          <div className="border border-gray-500 focus:!border-black rounded-md shadow-blue-gray-900/5  col-span-3">
            <Datepicker
              useRange={false}
              popoverDirection="down"
              placeholder="Pick Date Range"
              separator="to"
              value={value}
              onChange={handleValueChange}
              onBlur={formik.handleBlur}
              showShortcuts={true}
              maxDate={new Date()}
            />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-4 flex items-center">
          <div>Type of Account</div>
          <div className="flex gap-10 col-span-3">
            <Radio
              id="premium"
              name="type"
              value="Giro Account"
              ripple={true}
              defaultChecked
              icon={<CheckCircleIcon className="w-full h-full scale-105" />}
              className="hover:before:opacity-0 bg-blue-500/25 border-blue-500/50 transition-all p-0"
              label={
                <Typography color="blue-gray" className="font-normal">
                  Giro Account
                </Typography>
              }
              onClick={(e) =>
                console.log((formik.values.accountType = e.target.value))
              }
            />
            <Radio
              id="free"
              name="type"
              value="virtual Account"
              ripple={true}
              icon={<CheckCircleIcon className="w-full h-full scale-105" />}
              className="hover:before:opacity-0 bg-blue-500/25 border-blue-500/50 transition-all p-0"
              label={
                <Typography color="blue-gray" className="font-normal">
                  Virtual Account
                </Typography>
              }
              onClick={(e) =>
                console.log((formik.values.accountType = e.target.value))
              }
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button onClick={() => console.log(formik.values)}>Search</Button>
          <Button>Download</Button>
        </div>
      </div>
      <div></div>
    </div>
  );
}
