import SEO from "@/components/SEO";
import Layout from "@/components/Layout";
import { useState } from "react";
import { useRouter } from "next/router";

import 'tailwindcss/tailwind.css';

export default function Home({ cookies, adminOAuthUid }) {
  const router = useRouter();
  const isAuthorized = cookies.oauth === adminOAuthUid;
  const [isAdminButtonClicked, setAdminButtonClicked] = useState(false);

  const handleAdminButtonClick = () => {
    setAdminButtonClicked(!isAdminButtonClicked);
    router.push('/dashboard-admin');
  };

  return (
    <>
      <SEO title="Exuberance" />

      <Layout cookies={cookies}>
        <div className="container mx-auto mt-8 p-4 bg-white rounded shadow-lg">
            <div className="text-4xl font-popin font-semibold mb-8">
              Dashboard
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="col-span-2 lg:col-span-3 bg-blue-100 p-4 rounded-md">
              <h2 className="text-lg font-semibold mb-4">Phishing URL Checker</h2>
              <p className="text-sm mb-4">
              Phishing URL Checker Exuberance memberdayakan Anda untuk menemukan tautan berpotensi berbahaya dalam email, pesan teks, dan berbagai konten online. Dengan menggunakan algoritma kecerdasan buatan canggih, alat kami memeriksa tautan untuk pola yang mencurigakan, membedakan antara penipuan phishing dan sumber yang sah.
              </p>
              <p className="text-sm mb-4">
                Dengan Pengecek Tautan Phishing Exuberance, Anda dapat menjelajahi lanskap online dengan percaya diri, menjauhi klik tidak sengaja pada tautan berbahaya yang dapat mengakibatkan pencurian identitas atau kerugian keuangan.
              </p>
              <p className="text-sm mb-4">
                Pengecek situs phishing kami memeriksa setiap tautan secara cermat, membandingkannya dengan database yang luas dari situs web phishing yang diakui. Begitu mendeteksi tautan yang mencurigakan, alat ini segera memberi tahu Anda, memberikan informasi rinci tentang URL asli, URL yang diarahkan, dan status URL saat ini.
              </p>
              <p className="text-sm">
                Percayakan Pengecek Tautan Phishing Exuberance untuk memperkuat pertahanan Anda terhadap penipuan phishing, memastikan keamanan informasi pribadi Anda, dan melindungi Anda dari ancaman potensial.
              </p>
              </div>
              </div>
              <div className="container mx-auto mt-5 p-2 bg-white">
              <div className="col-span-1 lg:col-span-1 flex flex-col items-center justify-center">
              {isAuthorized && (
                <div className="relative">
                  <button
                    onClick={handleAdminButtonClick}
                    className={`${
                      isAdminButtonClicked
                        ? 'bg-black text-white'
                        : 'bg-gradient-to-t from-[#172882] to-sky-400 text-white'
                    } py-3 px-6 rounded-md shadow-md transition-all duration-300`}
                  >
                    {isAdminButtonClicked
                      ? 'Menuju Admin...'
                      : 'Pergi Ke Dashboard Admin'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
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
    props: {
      cookies,
      adminOAuthUid: process.env.ADMIN_OAUTHUID,
    },
  };
};