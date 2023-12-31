import React, { useState } from "react";
import { Input, Typography, Radio, Button } from "@material-tailwind/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useFormik } from "formik";
import { giroHistoryColumn } from "../../../utils/giroHistoryColumn";
import { vaHistoryColumn } from "../../../utils/vaHistoryColumn";
import { withReadPermission } from "../../../utils/hoc";
import { PERMISSIONS_CONFIG } from "../../../config";
import { usePermission } from "../../../hooks";
import { Spinner } from "../../../Components/Atoms";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { LuFileSearch } from "react-icons/lu";
import Datepicker from "react-tailwindcss-datepicker";
import dayjs from "dayjs";
import DataTable from "react-data-table-component";
import api from "../../../api/axios";
import * as Yup from "yup";

function DownloadVA() {
  const { config, hasWritePermission } = usePermission();

  const [date, setDate] = useState({
    startDate: dayjs().format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  });

  const [data, setData] = useState([]);

  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

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
        "Giro account number must be exactly 15 digits",
        (val) => val.length === 15
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

  const handleGetData = async (page, limit) => {
    const sendData = formik.values;
    if (sendData.giroNumber) {
      setLoading(true);
      try {
        const { data: response } = await api.get(
          `/admin/transactions-filter-by-date`,
          {
            params: {
              type_account: sendData.accountType,
              giro_number: sendData.giroNumber,
              start_date: sendData.startDate,
              end_date: sendData.endDate,
              page,
              limit,
            },
          }
        );

        setData(response.data);
        setTotalRows(response.total);
        setPerPage(limit);
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    await handleGetData(page, newPerPage);
  };

  const handlePageChange = async (page) => {
    await handleGetData(page);
  };

  const handleDownload = async () => {
    try {
      const sendData = formik.values;
      const { data: response } = await api.get(
        `/admin/transactions-filter-by-date/download`,
        {
          params: {
            type_account: sendData.accountType,
            giro_number: sendData.giroNumber,
            start_date: sendData.startDate,
            end_date: sendData.endDate,
          },
          responseType: "arraybuffer",
        }
      );

      const accountType = formik.values.accountType;
      const arr = accountType.split("_");

      for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
      }

      const fileName = `Transaction History - ${arr.join(" ")}.xlsx`;

      const url = URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log("error", error);
    }
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

      <div className="w-100 sm:w-11/12 md:w-10/12 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 mb-6 md:mb-4 flex items-center">
          <h6 className="font-bold">Giro Account Number</h6>
          <div className="col-span-3">
            <Input
              type="text"
              size="lg"
              name="giroNumber"
              placeholder="15 Digits Giro Number"
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
            className="flex items-center gap-3"
            onClick={() => handleGetData(1, perPage)}
            disabled={
              (!date.startDate && !date.endDate) ||
              !formik.touched.giroNumber ||
              formik.errors.giroNumber
            }
          >
            <LuFileSearch className="h-4 w-4" />
            Preview
          </Button>
          {hasWritePermission(config.resources.download) && (
            <Button
              className="flex items-center gap-3"
              onClick={handleDownload}
              disabled={
                (!date.startDate && !date.endDate) ||
                !formik.touched.giroNumber ||
                formik.errors.giroNumber
              }
            >
              <ArrowDownTrayIcon strokeWidth={2} className="h-4 w-4" />
              Download
            </Button>
          )}
        </div>
      </div>
      <div
        className={`my-4 space-y-4 rounded-lg ${
          data && data.length !== 0 && !loading && "border-2"
        }`}
      >
        {data ? (
          <DataTable
            columns={
              formik.values.accountType === "giro"
                ? giroHistoryColumn
                : vaHistoryColumn
            }
            data={data}
            noDataComponent={null}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerRowsChange}
            progressPending={loading}
            progressComponent={
              <Spinner message="Please wait for a moment..." size="lg" />
            }
            fixedHeader
            fixedHeaderScrollHeight="600px"
          />
        ) : (
          <h4 className="p-5 text-center">No data available.</h4>
        )}
      </div>
    </div>
  );
}

export default withReadPermission(
  DownloadVA,
  PERMISSIONS_CONFIG.resources.download
);
