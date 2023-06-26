import { Input, Typography, Radio, Button } from "@material-tailwind/react";
import React, { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import * as Yup from "yup";
import { useFormik } from "formik";
import dayjs from "dayjs";

export default function DownloadVA() {
  const [date, setDate] = useState({
    startDate: dayjs().format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  });

  const initialValues = {
    giroNumber: "",
    date: { startDate: date.startDate, endDate: date.endDate },
    accountType: "Giro Account",
  };

  const validationSchema = Yup.object().shape({
    giroNumber: Yup.string()
      .matches(/^[0-9]+$/, "Giro account only consist of a serial of numbers")
      .test(
        "len",
        "Giro account number must be exactly 11 digits",
        (val) => val.length === 11
      )
      .required("Giro Number is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
  });

  const handleDateInput = (newDate) => {
    formik.values.date.startDate = newDate.startDate;
    formik.values.date.endDate = newDate.endDate;
    setDate(newDate);
  };
  const handleRadioButtonValue = (e) =>
    (formik.values.accountType = e.target.value);

  const handleSearch = () => {
    console.log(formik.values);
  };
  const handleDownload = () => {
    console.log(formik.values);
  };

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
          <div className="col-span-3">
            <div className="border border-gray-500 focus:!border-black rounded-md shadow-blue-gray-900/5  ">
              <Datepicker
                useRange={false}
                popoverDirection="down"
                placeholder="Pick Date Range"
                separator="to"
                value={date}
                onChange={handleDateInput}
                showShortcuts={true}
                maxDate={new Date()}
              />
            </div>
            {!date.startDate && !date.endDate && (
              <Typography variant="small" color="red">
                Date is Required
              </Typography>
            )}
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
              onClick={(e) => handleRadioButtonValue(e)}
            />
            <Radio
              id="free"
              name="type"
              value="Virtual Account"
              ripple={true}
              icon={<CheckCircleIcon className="w-full h-full scale-105" />}
              className="hover:before:opacity-0 bg-blue-500/25 border-blue-500/50 transition-all p-0"
              label={
                <Typography color="blue-gray" className="font-normal">
                  Virtual Account
                </Typography>
              }
              onClick={(e) => handleRadioButtonValue(e)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button
            onClick={handleSearch}
            disabled={
              (!date.startDate && !date.endDate) ||
              !formik.touched.giroNumber ||
              formik.errors.giroNumber
            }
          >
            Search
          </Button>
          <Button
            onClick={handleDownload}
            disabled={
              (!date.startDate && !date.endDate) ||
              !formik.touched.giroNumber ||
              formik.errors.giroNumber
            }
          >
            Download
          </Button>
        </div>
      </div>
      <div></div>
    </div>
  );
}
