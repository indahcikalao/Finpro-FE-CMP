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
});
