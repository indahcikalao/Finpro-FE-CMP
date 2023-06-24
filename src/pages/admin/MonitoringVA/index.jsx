import React from "react";
import DataTable from "react-data-table-component";
import { CardHeader, Typography, Button } from "@material-tailwind/react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import * as XLSX from "xlsx/xlsx.mjs";
// import api from "../../../api/axios";

const MonitoringVA = () => {
  const [data, setData] = React.useState([]);

  // React.useEffect(() => {
  //   const getTransaction = async () => {
  //     try {
  //       const { data: response } = await api.get("/admin/users");

  //       setData(response.data);
  //     } catch (error) {
  //       console.log("error", error);
  //     }
  //   };

  //   getTransaction();
  // }, []);

  React.useEffect(() => {
    const generateDummyData = (count) => {
      const dummyData = [];

      for (let i = 1; i <= count; i++) {
        const dummyAccountNumber = generateRandomAccountNumber(10);
        const dummyDate = generateRandomDate();
        const dummyGiroBalance = generateRandomBalance();
        const dummyTotalVANumber = generateRandomNumber(1, 10);
        const dummyVABalance = generateRandomBalance();
        const dummyDifference = dummyGiroBalance - dummyVABalance;

        const dummyRow = {
          no: i,
          account_number: dummyAccountNumber,
          currency: "IDR",
          date: dummyDate,
          giro_balance: formatCurrency(dummyGiroBalance),
          total_va_number: dummyTotalVANumber,
          va_balance: formatCurrency(dummyVABalance),
          difference: formatCurrency(dummyDifference),
        };

        dummyData.push(dummyRow);
      }

      return dummyData;
    };

    const generateRandomAccountNumber = (length) => {
      let result = "";
      const characters = "0123456789";
      const charactersLength = characters.length;

      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }

      return result;
    };

    const generateRandomDate = () => {
      const startDate = new Date(2023, 0, 1).getTime();
      const endDate = new Date().getTime();
      const randomDate = new Date(
        startDate + Math.random() * (endDate - startDate)
      );
      return randomDate.toISOString().split("T")[0];
    };

    const generateRandomBalance = () => {
      return Math.floor(Math.random() * 10000000 + 1000000);
    };

    const generateRandomNumber = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1) + min);
    };

    const formatCurrency = (value) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    };

    const getTransaction = async () => {
      try {
        const dummyData = generateDummyData(150);
        setData(dummyData);
      } catch (error) {
        console.log("error", error);
      }
    };

    getTransaction();
  }, []);

  const handleDownload = () => {
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
    link.setAttribute("download", "transactionVA.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <React.Fragment>
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-1 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Transactions
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Displays a list of real account data and virtual accounts
            </Typography>
          </div>
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <Button
              className="flex items-center gap-3"
              color="blue"
              size="sm"
              onClick={handleDownload}
            >
              <ArrowDownTrayIcon strokeWidth={2} className="h-4 w-4" /> Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <div className="my-4 space-y-4 border-2">
        <DataTable
          columns={[
            {
              name: <b>No</b>,
              selector: (row) => row.no,
              sortable: true,
              width: "50px",
              style: {
                borderRight: "1px solid #dee2e6",
              },
            },
            {
              name: <b>Account Number</b>,
              selector: (row) => row.account_number,
              sortable: true,
              center: true,
              style: {
                borderRight: "1px solid #dee2e6",
              },
            },
            {
              name: <b>Currency</b>,
              selector: (row) => row.currency,
              sortable: true,
              center: true,
              width: "100px",
              style: {
                borderRight: "1px solid #dee2e6",
              },
            },
            {
              name: <b>Date</b>,
              selector: (row) => row.date,
              sortable: true,
              center: true,
              style: {
                borderRight: "1px solid #dee2e6",
              },
            },
            {
              name: <b>Giro Balance</b>,
              selector: (row) => row.giro_balance,
              sortable: true,
              center: true,
              style: {
                borderRight: "1px solid #dee2e6",
              },
            },
            {
              name: <b>Total VA Number</b>,
              selector: (row) => row.total_va_number,
              sortable: true,
              center: true,
              width: "100px",
              style: {
                borderRight: "1px solid #dee2e6",
              },
            },
            {
              name: <b>VA Balance</b>,
              selector: (row) => row.va_balance,
              sortable: true,
              center: true,
              style: {
                borderRight: "1px solid #dee2e6",
              },
            },
            {
              name: <b>Difference</b>,
              selector: (row) => row.difference,
              sortable: true,
              center: true,
              width: "150px",
              cell: (row) => {
                let backgroundColor;
                if (row.giro_balance > row.va_balance) {
                  backgroundColor = "green";
                } else if (row.giro_balance < row.va_balance) {
                  backgroundColor = "red";
                } else if ((row.giro_balance = row.va_balance)) {
                  backgroundColor = "blue";
                }

                return (
                  <div
                    style={{
                      backgroundColor: backgroundColor,
                      color: "white",
                      padding: "8px",
                      borderRadius: "4px",
                      width: "150px",
                      textAlign: "center",
                    }}
                  >
                    {row.difference}
                  </div>
                );
              },
            },
          ]}
          data={data}
          pagination
        />
      </div>
    </React.Fragment>
  );
};

export default MonitoringVA;
