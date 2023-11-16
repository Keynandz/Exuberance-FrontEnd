import { useState, useEffect } from "react";
import SEO from "@/components/SEO";
import Image from "next/image";
import AuthCode from "react-auth-code-input";
import axios from "axios";
import { useRouter } from "next/router";

export default function Verification({ server_port, server_host, web_port, web_host }) {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [createdBy, setCreatedBy] = useState("");

  useEffect(() => {
    const storedId = localStorage.getItem("id");
    if (storedId) {
      setCreatedBy(storedId);
    } else {
      const { id } = router.query;
      if (id) {
        setCreatedBy(id);
      }
    }
  }, [router.query]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      createdby: parseInt(createdBy),
      otp_code: parseInt(otp),
    };

    try {
      const response = await axios.post(
        `http://${server_host}:${server_port}/connection/exuberance/register/verifotp`,
        data
      );

      if (response.data.status_code === 200) {
        console.log("OTP verification successful");
        window.location.href = `http://${web_host}:${web_port}`;
      } else {
        console.error("OTP verification failed:", response.data.message);
      }
    } catch (error) {
      console.error("OTP verification failed", error);
    }
  };

  return (
    <>
      <SEO title="Exubarence" />
      <div
        className="flex justify-center items-center h-screen bg-cover bg-center"
        style={{ backgroundImage: `url("/image/background.jpeg")` }}
      >
        <div className="w-96 container py-5 px-10 bg-white rounded-[25px] shadow-md relative">
          <div className="flex items-center justify-center">
            <Image src="/image/OIG1.png" alt="Sanur" width={150} height={100} />
          </div>
          <div className="mb-5">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-1">OTP Verification</h2>
            </div>
            <p className="text-sm mb-8 text-center font-5 font-popin">
              Check Your Gmail
            </p>
            <form
                onSubmit={handleSubmit}
                action={`http://${process.env.server_host}:${process.env.server_port}/connection/exuberance/register/verifotp`}
                method="POST"
              >
              <div className="justify-center items-center flex flex-row mb-10">
                <AuthCode
                  inputClassName="border-b-2 border-black focus:outline-0 text-center w-10"
                  containerClassName="flex space-x-2"
                  onChange={(code) => setOtp(code)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-white border border-black text-black p-2 rounded-full mt-5 font-popin hover:bg-gray-100 hover:border-transparent transition duration-300"
              >
                Verify
              </button>
            </form>
            <p className="text-center font-popin text-sm mt-20">
              Didn’t get any code? <a className="font-bold">Send Again</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (context) => {
  return {
    props: {
      server_port: process.env.SERVER_PORT,
      server_host: process.env.SERVER_HOST,
      web_port: process.env.WEB_PORT,
      web_host: process.env.WEB_HOST,
    },
  };
};