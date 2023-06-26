import React from "react";
import DataTable from "react-data-table-component";
import { CardHeader, Typography, Button } from "@material-tailwind/react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import * as XLSX from "xlsx/xlsx.mjs";
import api from "../../../api/axios";
import numeral from "numeral";

const MonitoringVA = () => {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const getTransaction = async () => {
      try {
        const response = await api.get("/admin/transactions");
        setData(response.data.data);
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

  const generateRowNumber = (_, index) => {
    return index + 1;
  };

  const formatCurrency = (value, currency) => {
    let formattedValue = numeral(Math.abs(value)).format("0,0");
    let sign = value < 0 ? "- " : "";

    switch (currency) {
      case "JPY":
        sign += "¥";
        break;
      case "EUR":
        sign += "€";
        break;
      case "IDR":
        sign += "Rp";
        break;
      case "USD":
        sign += "$";
        break;
      default:
        break;
    }

    return `${sign} ${formattedValue}`;
  };

  const formatCurrencyCell = (row, selector) => {
    const currency = row.currency;
    const value = selector(row);

    return formatCurrency(value, currency);
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
              selector: generateRowNumber,
              sortable: true,
              width: "50px",
              style: {
                borderRight: "1px solid #dee2e6",
              },
            },
            {
              name: <b>Account Number</b>,
              selector: (row) => row.no_rekening_giro,
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
              selector: (row) => row.tanggal,
              sortable: true,
              center: true,
              width: "150px",
              style: {
                borderRight: "1px solid #dee2e6",
              },
            },
            {
              name: <b>Giro Balance</b>,
              selector: (row) =>
                formatCurrencyCell(row, (row) => row.posisi_saldo_giro),
              sortable: true,
              center: true,
              style: {
                borderRight: "1px solid #dee2e6",
              },
            },
            {
              name: <b>Total VA Number</b>,
              selector: (row) => row.jumlah_no_va,
              sortable: true,
              center: true,
              width: "100px",
              style: {
                borderRight: "1px solid #dee2e6",
              },
            },
            {
              name: <b>VA Balance</b>,
              selector: (row) =>
                formatCurrencyCell(row, (row) => row.posisi_saldo_va),
              sortable: true,
              center: true,
              style: {
                borderRight: "1px solid #dee2e6",
              },
            },
            {
              name: <b>Difference</b>,
              selector: (row) => formatCurrencyCell(row, (row) => row.selisih),
              sortable: true,
              center: true,

              cell: (row) => {
                let backgroundColor;
                if (row.posisi_saldo_giro > row.posisi_saldo_va) {
                  backgroundColor = "green";
                } else if (row.posisi_saldo_giro < row.posisi_saldo_va) {
                  backgroundColor = "red";
                } else if (row.posisi_saldo_giro === row.posisi_saldo_va) {
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
                    {formatCurrency(row.selisih, row.currency)}
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
