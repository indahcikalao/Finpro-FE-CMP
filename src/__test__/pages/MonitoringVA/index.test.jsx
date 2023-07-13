import { render, screen, cleanup, waitFor } from "@testing-library/react";
import { MonitoringVA } from "../../../pages/admin/MonitoringVA";
import api from "../../../api/axios";
import { act } from "react-dom/test-utils";
import { usePermission } from "../../../hooks";
import { PERMISSIONS_CONFIG } from "../../../config";

jest.mock("../../../hooks/use-permission");
jest.mock("../../../hooks/use-auth");

describe("MonitoringVA Page", () => {
  const view = () => render(<MonitoringVA />);

  beforeEach(() => {
    usePermission.mockReturnValue({
      config: PERMISSIONS_CONFIG,
      hasPermission: jest.fn(),
      hasWritePermission: jest.fn(),
      hasReadPermission: jest.fn(),
    });
  });
  afterEach(cleanup);

  it("has correct section title", () => {
    view();

    const sectionTitle = screen.getByText(/transactions/i);

    expect(sectionTitle).toBeInTheDocument();
  });

  it("rendered datatable component", () => {
    view();

    const table = screen.getByRole("table");

    expect(table).toBeInTheDocument();
  });

  it("rendered loading on the table initially", () => {
    view();

    const loadingTable = screen.getByText(/please wait/i);

    expect(loadingTable).toBeInTheDocument();
  });
});

describe("API integration inside Monitoring VA Page", () => {
  const view = () => render(<MonitoringVA />);

  const getApiMock = jest.spyOn(api, "get");

  const mockTransactionResponse = {
    status: "Success",
    page: 1,
    limit: 10,
    total: 215,
    total_pages: 22,
    data: [
      {
        no_rekening_giro: "144997969914458",
        currency: "USD",
        tanggal: "29-06-2023",
        posisi_saldo_giro: 0,
        jumlah_no_va: 0,
        posisi_saldo_va: 0,
        selisih: 0,
      },
      {
        no_rekening_giro: "493328712338355",
        currency: "IDR",
        tanggal: "29-06-2023",
        posisi_saldo_giro: 0,
        jumlah_no_va: 0,
        posisi_saldo_va: 0,
        selisih: 0,
      },
      {
        no_rekening_giro: "764311909240668",
        currency: "EUR",
        tanggal: "29-06-2023",
        posisi_saldo_giro: 0,
        jumlah_no_va: 0,
        posisi_saldo_va: 0,
        selisih: 0,
      },
      {
        no_rekening_giro: "904986000003840",
        currency: "IDR",
        tanggal: "10-01-2034",
        posisi_saldo_giro: 38400000000,
        jumlah_no_va: 3841,
        posisi_saldo_va: 38400000000,
        selisih: 0,
      },
      {
        no_rekening_giro: "904986000003841",
        currency: "IDR",
        tanggal: "11-01-2034",
        posisi_saldo_giro: 38410000000,
        jumlah_no_va: 3842,
        posisi_saldo_va: 38410000000,
        selisih: 0,
      },
      {
        no_rekening_giro: "904986000003842",
        currency: "IDR",
        tanggal: "12-01-2034",
        posisi_saldo_giro: 38420000000,
        jumlah_no_va: 3843,
        posisi_saldo_va: 38420000000,
        selisih: 0,
      },
      {
        no_rekening_giro: "904986000003853",
        currency: "IDR",
        tanggal: "23-01-2034",
        posisi_saldo_giro: 38530000000,
        jumlah_no_va: 3854,
        posisi_saldo_va: 38530000000,
        selisih: 0,
      },
      {
        no_rekening_giro: "904986000003854",
        currency: "IDR",
        tanggal: "24-01-2034",
        posisi_saldo_giro: 38540000000,
        jumlah_no_va: 3855,
        posisi_saldo_va: 38540000000,
        selisih: 0,
      },
      {
        no_rekening_giro: "904986000003855",
        currency: "IDR",
        tanggal: "25-01-2034",
        posisi_saldo_giro: 38550000000,
        jumlah_no_va: 3856,
        posisi_saldo_va: 38550000000,
        selisih: 0,
      },
      {
        no_rekening_giro: "904986000003856",
        currency: "IDR",
        tanggal: "26-01-2034",
        posisi_saldo_giro: 38560000000,
        jumlah_no_va: 3857,
        posisi_saldo_va: 38560000000,
        selisih: 0,
      },
    ],
  };

  beforeEach(() => {
    usePermission.mockReturnValue({
      config: PERMISSIONS_CONFIG,
      hasPermission: jest.fn(),
      hasWritePermission: jest.fn(() => true),
      hasReadPermission: jest.fn(),
    });

    getApiMock.mockImplementation((url) => {
      switch (url) {
        case "/admin/transactions":
          return Promise.resolve({ data: mockTransactionResponse });
        default:
          return Promise.reject(new Error("Not found"));
      }
    });

    getApiMock.mockResolvedValueOnce({ data: mockTransactionResponse });
  });

  afterEach(cleanup);
  afterAll(() => {
    getApiMock.mockRestore();
  });

  it("fetched transactions successfully", async () => {
    await act(() => view());

    const firstCall = getApiMock.mock.calls.at(0);
    const endpoint = firstCall[0];

    expect(endpoint).toEqual(expect.stringMatching(/^\/admin\/transactions\b/));

    expect(await screen.findByText(/usd/i)).toBeInTheDocument();
  });

  it("handles error while fetching transactions", async () => {
    jest.spyOn(api, "get").mockRejectedValueOnce(new Error("API Error"));

    await view();

    await waitFor(() => {
      const errorMessage = screen.queryByText((content, element) =>
        content.toLowerCase().includes("error fetching transactions")
      );
      expect(errorMessage).toBeNull(); // Expecting null when error message is not found
    });
  });
});
