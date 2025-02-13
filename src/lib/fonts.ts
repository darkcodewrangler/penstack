import { Rubik, Gabarito, Plus_Jakarta_Sans } from "next/font/google";

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});
const heading = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
});
export const fonts = {
  body,
  heading,
};
