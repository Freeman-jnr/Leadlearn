import bcrypt from "bcryptjs";

export const hashPassword = (plain: string) => bcrypt.hash(plain, 12);
export const comparePassword = (plain: string, hash: string) =>
  bcrypt.compare(plain, hash);

export const generateOtp = (len = 6) =>
  Array.from({ length: len }, () => Math.floor(Math.random() * 10)).join("");
