import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "../../../pages/register";
import axios from "axios";

jest.mock("axios");

describe("Register Page", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("submits the form with valid data", async () => {
    axios.post.mockResolvedValueOnce({
      data: { message: "Registration successful" },
    });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "Password123!" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "Password123!" },
    });

    fireEvent.click(screen.getByText("Register"));

    await waitFor(() => {
      expect(screen.getByText("Registration Successful")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByText("Please wait for admin to verify your Account")
      ).toBeInTheDocument();
    });
  });

  it("displays an error message for existing email", async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        data: { message: "Email already registered" },
      },
    });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "existing@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "Password123!" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "Password123!" },
    });

    fireEvent.click(screen.getByText("Register"));

    await waitFor(() => {
      expect(
        screen.getByText("Email already taken. Choose another one")
      ).toBeInTheDocument();
    });
  });

  it("displays an error message for existing username", async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        data: { message: "Username already registered" },
      },
    });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "existinguser" },
    });
    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "Password123!" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "Password123!" },
    });

    fireEvent.click(screen.getByText("Register"));

    await waitFor(() => {
      expect(
        screen.getByText("Username already taken. Choose another one")
      ).toBeInTheDocument();
    });
  });

  it("redirects to the login page when clicking on the 'Sign in' link", () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Sign in"));

    expect(window.location.pathname).toBe("/login");
  });
});
