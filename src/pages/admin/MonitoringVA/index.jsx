import React from "react";
import DataTable from "react-data-table-component";
import { CardHeader, Typography, Button } from "@material-tailwind/react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import * as XLSX from "xlsx/xlsx.mjs";
import api from "../../../api/axios";
import numeral from "numeral";
import { Spinner } from "../../../Components/Atoms";
import { withReadPermission } from "../../../utils/hoc/with-read-permission";
import { PERMISSIONS_CONFIG } from "../../../config";
import { usePermission } from "../../../hooks";

const MonitoringVA = () => {
  const { config, hasWritePermission } = usePermission();

  const [data, setData] = React.useState([]);
  const [totalRows, setTotalRows] = React.useState(0);
  const [perPage, setPerPage] = React.useState(10);
  const [loading, setLoading] = React.useState(false);

  const fetchTransaction = async (page = 1, limit = perPage) => {
    setLoading(true);

    try {
      const { data: response } = await api.get("/admin/transactions", {
        params: {
          Page: page,
          Limit: limit,
        },
      });

      setData(response.data);
      setTotalRows(response.total);
      setPerPage(limit);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePerRowsChange = async (newPerPage, page) =>
    await fetchTransaction(page, newPerPage);

  const handlePageChange = async (page) => await fetchTransaction(page);

  React.useEffect(() => {
    const getTransaction = async () => {
      try {
        await fetchTransaction();
      } catch (error) {
        console.log("Error fetching transactions:", error);
      }
    };

    getTransaction();
  }, []);

  const handleDownload = async () => {
    try {
      await api.get("/admin/transactions/download", {
        responseType: "blob",
      });

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

      const excelBuffer = await XLSX.write(workbook, {
        type: "array",
        bookType: "xlsx",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", "monitoringVA.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log("Error downloading file:", error);
    }
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
          {hasWritePermission(config.resources.monitoring) && (
            <div className="flex w-full shrink-0 gap-2 md:w-max">
              <Button
                className="flex items-center gap-3"
                color="blue"
                size="sm"
                onClick={handleDownload}
              >
                <ArrowDownTrayIcon strokeWidth={2} className="h-4 w-4" />{" "}
                Download
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <div className="my-4 space-y-4 border-2">
        <DataTable
          columns={[
            {
              name: <b>No</b>,
              selector: generateRowNumber,
              sortable: true,
              width: "65px",
              style: {
                borderRight: "1px solid #dee2e6",
                textAlign: "center",
              },
            },
            {
              name: <b>Account Number</b>,
              selector: (row) => row.no_rekening_giro,
              sortable: true,
              center: true,
              width: "150px",
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
              width: "100px",
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
          progressPending={loading}
          progressComponent={
            <Spinner message="Please wait for a moment..." size="lg" />
          }
          pagination
          paginationRowsPerPageOptions={[10, 50, 100, 200]}
          paginationServer
          paginationTotalRows={totalRows}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handlePerRowsChange}
          defaultSortAsc={true}
          defaultSortFieldId="status"
        />
      </div>
    </React.Fragment>
  );
};

export default withReadPermission(
  MonitoringVA,
  PERMISSIONS_CONFIG.resources.monitoring
);
