import { render, screen } from "@testing-library/react";
import Login from "../../../pages/login";
import { BrowserRouter } from "react-router-dom";

describe("Login Page", () => {
  const view = () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

	
  it("header to be in the document", () => {
		view();
		
    const title = screen.getByText(/welcome back/i);
    const subTitle = screen.getByText(/It's nice to see you again/i);
		
    expect(title).toBeInTheDocument();
    expect(subTitle).toBeInTheDocument();
  });

});
