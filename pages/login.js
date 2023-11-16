import Image from "next/image";
import React, { useState } from "react";
import SEO from "@/components/SEO";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";
import axios from "axios";

export default function Login({ server_port, server_host, web_port, web_host }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      const response = await axios.get("/api/google-login");
      if (response.data && response.data.url) {
        window.location = response.data.url;
      }
    } catch (error) {
      console.error("Error initiating Google login:", error);
      setError("An error occurred during Google login.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (isLoading) {
      return;
    }
  
    setIsLoading(true);
  
    const data = {
      email: email,
      password: password,
    };
  
    try {
      const response = await axios.post(
        `http://${server_host}:${server_port}/connection/exuberance/login`,
        data
      );

      if (
        response.data &&
        response.data.response &&
        response.data.response.token &&
        response.data.response.image_profile
      ) {
        const token = response.data.response.token;
        const id = response.data.response.data.Id;
        const profile = response.data.response.image_profile;
  
        document.cookie = `token=${token}; path=/`;
        document.cookie = `id=${id}; path=/`;
        document.cookie = `profile=${profile}; path=/`
        
  
        window.location.href = `http://${web_host}:${web_port}`;
      }
  
      console.log("Login successful!", response.data);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.response &&
        error.response.data.response.message
      ) {
        setError(error.response.data.response.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO title="Exuberance" />
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
              <h2 className="text-2xl font-bold mb-1">Exuberance</h2>
            </div>
            <p className="text-sm mb-8 text-center font-5 font-popin">
              Silakan Masuk ke Akun Anda
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="font-popin font-thin text-black-600 text-sm mb-2 ml-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full border-transparent mt-1 mb-1 text-sm opacity-70 font-thin font-popin bg-[#F3F3F3] p-2 rounded-2xl focus:outline outline-2 focus:shadow-md"
                  placeholder="Masukan Email Kamu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="font-popin font-thin text-black-600 text-sm mb-2 ml-2"
                >
                  Kata Sandi
                </label>
                <input
                  autoComplete="off"
                  type="password"
                  id="password"
                  className="w-full border-transparent mt-1 text-sm opacity-70 font-thin font-popin bg-[#F3F3F3] p-2 rounded-2xl focus:outline outline-2 focus:shadow-md"
                  placeholder="Masukan Kata Sandi Kamu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className={`w-full p-2 rounded-full mt-5 font-popin ${
                  isLoading
                    ? "bg-black text-white cursor-not-allowed"
                    : "bg-white border border-black text-black hover:text-white hover:bg-black hover:border-transparent"
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Proses Masuk..." : "Masuk"}
              </button>
              {error && (
                <div className="text-center text-red-500 font-bold mt-4">
                  {error}
                </div>
              )}
            </form>
            <div className="flex flex-col">
            <button
              onClick={handleGoogleLogin}
              className="flex flex-row items-center justify-center rounded-full px-12 py-2 mb-5 bg-gradient-to-t from-[#172882] to-sky-400 text-white mt-2"
            >
              <FaGoogle className="mr-2" />
              Masuk dengan Google
            </button>
              <div className="text-sm text-center font-5 font-popin">
                Belum Punya Akun?{" "}
                <Link
                  className="font-bold underline decoration-solid"
                  href="/register"
                >
                  Daftar
                </Link>
              </div>
            </div>
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