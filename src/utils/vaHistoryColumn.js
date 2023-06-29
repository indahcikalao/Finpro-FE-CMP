import { FormatCurrency } from "../Components/Atoms";

export const vaHistoryColumn = [
  {
    name: <b>No</b>,
    selector: (row, i) => i + 1,
    sortable: true,
    width: "50px",
    style: {
      borderRight: "1px solid #dee2e6",
    },
  },
  {
    name: <b>Account Number</b>,
    selector: (row) => row.nomor_rekening_giro,
    sortable: true,
    center: true,
    width: "150px",
    style: {
      borderRight: "1px solid #dee2e6",
    },
  },
  {
    name: <b>Virtual Account Number</b>,
    selector: (row) => row.nomor_virtual_account,
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
    selector: (row) => row.tanggal_transaksi,
    sortable: true,
    center: true,
    style: {
      borderRight: "1px solid #dee2e6",
    },
  },
  {
    name: <b>Time</b>,
    selector: (row) => row.jam,
    sortable: true,
    center: true,
    style: {
      borderRight: "1px solid #dee2e6",
    },
  },
  {
    name: <b>Remark</b>,
    selector: (row) => row.remark,
    sortable: true,
    center: true,
    width: "100px",
    style: {
      borderRight: "1px solid #dee2e6",
    },
  },
  {
    name: <b>Teller</b>,
    selector: (row) => row.teller,
    sortable: true,
    center: true,
    style: {
      borderRight: "1px solid #dee2e6",
    },
  },
  {
    name: <b>Category</b>,
    selector: (row) => row.category,
    sortable: true,
    center: true,

    style: {
      borderRight: "1px solid #dee2e6",
    },
  },
  {
    name: <b>Credit</b>,
    selector: (row) => (
      <FormatCurrency currency={row.currency} value={row.credit} />
    ),
    sortable: true,
    center: true,
    width: "100px",
  },
];
