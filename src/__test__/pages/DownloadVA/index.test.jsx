import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DownloadVA from "../../../pages/Protected/DownloadVA";

jest.mock("../../../hooks", () => ({
    usePermission: jest.fn(() => ({
      config: {},
      hasWritePermission: jest.fn(),
    })),
  }));

describe("DownloadVA", () => {
  test("renders component correctly", () => {
    render(<DownloadVA />);

    expect(screen.getByText("Download VA Satker")).toBeInTheDocument();
    expect(screen.getByLabelText("Giro Account Number")).toBeInTheDocument();
    expect(screen.getByText("Date Range")).toBeInTheDocument();
    expect(screen.getByText("Type of Account")).toBeInTheDocument();
    expect(screen.getByText("Preview")).toBeInTheDocument();
    expect(screen.getByText("Download")).toBeInTheDocument();
  });

  test("displays error message when Giro Account Number is not provided", async () => {
    render(<DownloadVA />);

    userEvent.click(screen.getByText("Preview"));

    expect(
      await screen.findByText("Giro Number is required")
    ).toBeInTheDocument();
  });

  test("displays error message when Giro Account Number is not valid", async () => {
    render(<DownloadVA />);

    fireEvent.change(screen.getByLabelText("Giro Account Number"), {
      target: { value: "123" },
    });

    userEvent.click(screen.getByText("Preview"));

    expect(
      await screen.findByText(
        "Giro account number must be exactly 15 digits"
      )
    ).toBeInTheDocument();
  });

  test("displays error message when Date Range is not provided", async () => {
    render(<DownloadVA />);

    userEvent.click(screen.getByText("Preview"));

    expect(await screen.findByText("Date is Required")).toBeInTheDocument();
  });

  test("calls handleGetData function when Preview button is clicked", async () => {
    render(<DownloadVA />);

    fireEvent.change(screen.getByLabelText("Giro Account Number"), {
      target: { value: "123456789012345" },
    });

    fireEvent.click(screen.getByPlaceholderText("Pick Date Range"));
    fireEvent.click(screen.getByText("1"));

    userEvent.click(screen.getByText("Preview"));

  });

  test("calls handleDownload function when Download button is clicked", async () => {
    render(<DownloadVA />);

    fireEvent.change(screen.getByLabelText("Giro Account Number"), {
      target: { value: "123456789012345" },
    });

    fireEvent.click(screen.getByPlaceholderText("Pick Date Range"));
    fireEvent.click(screen.getByText("1"));

    userEvent.click(screen.getByText("Download"));

  });
});
