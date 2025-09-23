import { LoginErrorMessageResponse } from "@/types/errors";

export const getLoginErrorMessage = (error: string): LoginErrorMessageResponse | undefined => {
  const errorMessage = error.toLowerCase();
  if (errorMessage.includes("password is incorrect")) {
    return {
      key: "password",
      message: "Incorrect password",
    };
  } else if (errorMessage.includes("couldn't find your account")) {
    return {
      key: "email",
      message: "Account not found",
    };
  }
};
