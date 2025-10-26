import { init } from "@paralleldrive/cuid2";

export const createId = () =>
  init({
    random: Math.random,
    length: 10,
    fingerprint: "a-fingerprint-for-hostel-web-app",
  });

export const createPassword = () =>
  init({
    random: Math.random,
    length: 10,
    fingerprint: "a-fingerprint-for-hostel-web-app-password",
  });
