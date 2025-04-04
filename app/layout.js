import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/Components/Navbar/navbar";
import { Provider } from "react-redux";
import store from "@/Redux/store";
import ReduxProvider from "@/Redux/reduxprovider";
import { GoogleOAuthProvider } from "@react-oauth/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
        <ReduxProvider>
        <Navbar/>
        {children}
        </ReduxProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
