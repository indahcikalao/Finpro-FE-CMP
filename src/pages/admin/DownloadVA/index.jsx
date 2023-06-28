import React, { useState, useEffect } from "react";
import { Input, Typography, Radio, Button } from "@material-tailwind/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useFormik } from "formik";
import { giroHistoryColumn } from "../../../utils/giroHistoryColumn";
import { vaHistoryColumn } from "../../../utils/vaHistoryColumn";
import Datepicker from "react-tailwindcss-datepicker";
import dayjs from "dayjs";
import DataTable from "react-data-table-component";
import axios from "axios";
import * as XLSX from "xlsx/xlsx.mjs";
import * as Yup from "yup";

export default function DownloadVA() {
  const [date, setDate] = useState({
    startDate: dayjs().format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  });
  const [data, setData] = useState(null);
  const [downloadState, setDownloadState] = useState(false);

  const initialValues = {
    giroNumber: "",
    startDate: date.startDate,
    endDate: date.endDate,
    accountType: "giro",
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
    formik.values.startDate = newDate.startDate;
    formik.values.endDate = newDate.endDate;
    setDate(newDate);
  };

  const handleRadioButtonValue = (e) => {
    formik.values.accountType = e.target.value;
  };

  const handleGetData = async () => {
    const url = "https://b1c00f56-0319-4468-94c9-0326c3a6d50a.mock.pstmn.io";
    const sendData = formik.values;
    try {
      const { data: response } = await axios.get(
        `${url}/admin/transaction-fillter-by-date?type_account=${sendData.accountType}&giro_number=${sendData.giroNumber}&start_date=${sendData.startDate}&end_date=${sendData.endDate}`
      );
      setData(response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (data && downloadState) {
      const handleDownload = (data) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
        const excelBuffer = XLSX.write(workbook, {
          type: "buffer",
          bookType: "xlsx",
        });
        const blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `${formik.values.accountType}-TransactionHistory.xlsx`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      handleDownload(data);
      setDownloadState(false);
    }
  }, [data, downloadState, formik.values]);

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

      <div className="w-100 sm:w-11/12 md:w-10/12 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 mb-6 md:mb-4 flex items-center">
          <h6 className="font-bold">Giro Account Number</h6>
          <div className="col-span-3">
            <Input
              type="text"
              size="lg"
              name="giroNumber"
              placeholder="11 Digits Giro Number"
              className="focus:!border-black border shadow-sm !border-gray-500 shadow-blue-gray-900/5 "
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 mb-4 flex items-center">
          <h6 className="font-bold">Date Range</h6>
          <div className="md:col-span-3">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 mb-6 flex items-center">
          <h6 className="font-bold">Type of Account</h6>
          <div className="flex gap-10 col-span-3">
            <Radio
              id="premium"
              name="type"
              value="giro"
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
              value="virtual_account"
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
        <div className="flex justify-end gap-4 mb-6">
          <Button
            onClick={handleGetData}
            disabled={
              (!date.startDate && !date.endDate) ||
              !formik.touched.giroNumber ||
              formik.errors.giroNumber
            }
          >
            Preview
          </Button>
          <Button
            onClick={() => {
              handleGetData();
              setDownloadState(true);
            }}
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
      {data && (
        <div className="my-4 space-y-4 border-2 rounded-lg">
          <DataTable
            columns={
              formik.values.accountType === "giro"
                ? giroHistoryColumn
                : vaHistoryColumn
            }
            data={data}
            pagination
          />
        </div>
      )}
    </div>
  );
}
