import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import React, { useState, useEffect } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

export default function Url({ checkedUrls, cookies, server_port, server_host }) {
  const [url, setUrl] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const itemsPerPage = 6;

  const [data, setData] = useState({
    checkedUrls: checkedUrls,
    totalPages: Math.ceil(checkedUrls.length / itemsPerPage),
  });

  useEffect(() => {
    fetchCheckedUrls();
  }, [cookies]);

  const fetchCheckedUrls = async () => {
    try {
      const response = await fetch(
        `http://${server_host}:${server_port}/connection/exuberance/url/checked`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch checked URLs");
      }

      const result = await response.json();
      setData({
        checkedUrls: result.data || [],
        totalPages: Math.ceil(result.data.length / itemsPerPage),
      });
    } catch (error) {
      console.error("Error fetching checked URLs:", error.message);
    }
  };

  const getStatusTextColor = (status) => {
    if (status === "Phishing") {
      return "text-red-500";
    } else if (status === "Safe") {
      return "text-lime-500";
    }
  };

  const totalPages = data.totalPages;

  const displayedUrls = data.checkedUrls.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleCheckUrl = async () => {
    try {
      setIsChecking(true);
      setLoading(true);

      const response = await fetch(
        `http://${server_host}:${server_port}/connection/exuberance/url/checker`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.token}`,
          },
          body: JSON.stringify({
            urlInfo: {
              url: url,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check URL");
      }

      const result = await response.json();
      await fetchCheckedUrls();
      setUrl("");

      alert(`URL Status: ${result.status} for ${result.url}`);
    } catch (error) {
      console.error("Error checking URL:", error.message);

      alert("Failed to check URL. Please try again later.");
    } finally {
      setLoading(false);
      setIsChecking(false);
    }
  };

  return (
    <>
      <SEO title="Exuberance" />
      <Layout cookies={cookies}>
        <div className="container mx-auto mt-8 p-4 bg-white rounded shadow-lg">
          <div className="text-4xl font-popin font-semibold mb-8">
            Pendeteksi URL Phising
          </div>
          <div className="flex items-center justify-between">
            <input
              className="px-5 w-full py-3 border-slate-950 border bg-gray-200 transition duration-300 hover:bg-white hover:border-slate-950 shadow-md"
              type="text"
              placeholder="Masukan URL Kamu Disini"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              className={`ml-4 px-6 py-3 ${
                isChecking ? 'bg-black text-white' : 'bg-gradient-to-t from-[#172882] to-sky-400 text-white hover:bg-[#172882]'
              } transition duration-300 whitespace-nowrap`}
              onClick={handleCheckUrl}
              disabled={loading}
            >
              {isChecking ? "Mengecek URL..." : "Cek URL"}
            </button>
          </div>
          <div className="flex justify-end items-center mt-5">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="mr-2"
            >
              <AiOutlineLeft />
            </button>
            <div>
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="ml-2"
            >
              <AiOutlineRight />
            </button>
          </div>
          <div className="flex justify-center items-center mt-5">
            <table className="w-full overflow-scroll bg-white shadow-md">
              <thead>
                <tr className="text-left text-md text-slate-700">
                  <th className="py-2 px-4 border-b">URL</th>
                  <th className="py-2 px-4 border-b w-1/6">Status</th>
                </tr>
              </thead>
              <tbody>
                {displayedUrls.map((app) => (
                  <tr key={app.id} className="text-sm">
                    <td className="py-3 px-4 border-b">{app.url}</td>
                    <td className={`py-3 px-4 border-b ${getStatusTextColor(app.status)}`}>
                      {app.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

  try {
    const response = await fetch(`http://${process.env.SERVER_WEB}:${process.env.SERVER_PORT}/connection/exuberance/url/checked`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${cookies.token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch checked URLs");
    }

    const result = await response.json();
    const checkedUrls = result.data || [];

    return {
      props: {
        cookies,
        checkedUrls,
        server_port: process.env.SERVER_PORT,
        server_host: process.env.SERVER_HOST,
      },
    };
  } catch (error) {
    console.error("Error fetching checked URLs:", error.message);
    return {
      props: {
        cookies,
        checkedUrls: [],
        server_port: process.env.SERVER_PORT,
        server_host: process.env.SERVER_HOST,
      },
    };
  }
};