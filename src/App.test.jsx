import "./setupTests";
import { describe, test, expect } from "bun:test";
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { App } from "./App";

describe("App komponens", () => {
  test("render: megjelenik a felhasználónév és jelszó mező + bejelentkezés gomb", () => {
    const { getByPlaceholderText, getByRole } = render(<App />);

    expect(getByPlaceholderText("felhasználónév")).toBeInTheDocument();
    expect(getByPlaceholderText("jelszó")).toBeInTheDocument();

    // ez már nem akad ki attól, hogy a cím is "Bejelentkezés"
    expect(getByRole("button", { name: /Bejelentkezés/i })).toBeInTheDocument();
  });

  test("űrlap: lehet írni a mezőkbe és az érték frissül", () => {
    const { getByPlaceholderText } = render(<App />);

    const usernameInput = getByPlaceholderText("felhasználónév");
    const passwordInput = getByPlaceholderText("jelszó");

    fireEvent.change(usernameInput, { target: { value: "user" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });

    expect(usernameInput.value).toBe("user");
    expect(passwordInput.value).toBe("password");
  });
});