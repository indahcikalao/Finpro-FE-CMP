import { render, screen, cleanup, waitFor } from "@testing-library/react";
import { MonitoringVA } from "../../../pages/admin/MonitoringVA";
import api from "../../../api/axios";
import { act } from "react-dom/test-utils";
import { usePermission } from "../../../hooks";
import { PERMISSIONS_CONFIG } from "../../../config";

jest.mock("../../../hooks/use-permission");
jest.mock("../../../hooks/use-auth");
