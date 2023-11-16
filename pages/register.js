import { useState } from "react";
import SEO from "@/components/SEO";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";

export default function Register({ server_port, server_host }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

    const data = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        `http://${server_host}:${server_port}/connection/exuberance/register`,
        data
      );

      console.log("Registration response:", response.data);

      if (response.data.response.status_code === 200) {
        const { id, token } = response.data.response.data;
        localStorage.setItem("id", id);
        localStorage.setItem("token", token);
        router.push(`/verification?id=${id}`);
      } else {
        console.error("Registration failed:", response.data.response.message);
      }
    } catch (error) {
      console.error("Registration failed", error);
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
            <img src="/image/OIG1.png" alt="Sanur" width={150} height={100} />
          </div>
          <div className="mb-5">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-1">Exuberance</h2>
            </div>
            <p className="text-sm mb-8 text-center font-5 font-popin">
            Buat Akun Anda
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="email"
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
                className="w-full bg-white border border-black text-black p-2 rounded-full mt-5 font-popin hover:bg-gray-100 hover:border-transparent transition duration-300"
              >
                Daftarkan
              </button>
            </form>
            <div className="flex flex-col">
            <button
              onClick={handleGoogleLogin}
              className="flex flex-row items-center justify-center rounded-full px-12 py-2 mb-5 bg-gradient-to-t from-[#172882] to-sky-400 text-white mt-2"
            >
              <FaGoogle className="mr-2" />
              Daftar dengan Google
            </button>
              <div className="text-sm text-center font-5 font-popin">
                Sudah Punya Akun?{" "}
                <Link
                  className="font-bold underline decoration-solid"
                  href="/login"
                >
                  Masuk
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
    },
  };
};