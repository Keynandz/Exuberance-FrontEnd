import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import React, { useState } from "react";
import { BsArrowLeftShort } from "react-icons/bs";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ChangePassword({ cookies, server_port, server_host }) {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      alert("New password and confirmation do not match.");
      return;
    }

    setIsChangingPassword(true);

    const requestData = {
      old_password: oldPassword,
      new_password: newPassword,
    };

    try {
      const response = await fetch(`http://${server_host}:${server_port}/connection/exuberance/user/changepass/${cookies.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();

      if (response.ok) {
        alert(responseData.message);
        router.push("/");
      } else {
        alert(`Failed to change password. Error: ${responseData.message}`);
      }
    } catch (error) {
      console.error("Error during password change:", error);
      alert("Failed to change password. Please try again later.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <>
      <SEO title="Exuberance" />
      <Layout cookies={cookies}>
        <Link href="/" className="font-popin text-sm flex items-center">
          <BsArrowLeftShort size={20} />
          <span>Balik</span>
        </Link>
        <div className="text-2xl md:text-4xl font-popin font-semibold mt-5 md:mt-10">
          Ubah Kata Sandi
        </div>
        <form className="mt-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password Lama:
              <input
                type="password"
                className="mt-1 p-2 w-full border rounded-md"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password Baru:
              <input
                type="password"
                className="mt-1 p-2 w-full border rounded-md"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Memastikan Password Baru:
              <input
                type="password"
                className="mt-1 p-2 w-full border rounded-md"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </label>
          </div>
          <div className="flex justify-end">
          <button
            type="button"
            className={`bg-${isChangingPassword ? 'black' : 'blue-500'} text-white px-4 py-2 rounded-md hover:bg-${isChangingPassword ? 'black' : 'blue-600'} font-popin`}
            onClick={handleChangePassword}
            disabled={isChangingPassword}
          >
            {isChangingPassword ? "Kata Sandi Diubah..." : "Ubah Kata Sandi"}
          </button>
          </div>
        </form>
      </Layout>
    </>
  );
}

export const getServerSideProps = async (context) => {
  const { req } = context;
  const { cookies } = req;

  if (!cookies.token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { cookies,
    server_port: process.env.SERVER_PORT,
    server_host: process.env.SERVER_HOST,
  },
  };
};
