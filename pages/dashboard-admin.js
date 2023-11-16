import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import React, { useState, useEffect } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

export default function Email({ cookies, auditLogs }) {
  const [searchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [displayedChars, setDisplayedChars] = useState(40);
  const [selectedLog, setSelectedLog] = useState(null);

  const handleRowClick = (log) => {
    setSelectedLog(log);
  };

  const filteredLogs = (auditLogs || []).filter((log) =>
  log.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const displayedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setItemsPerPage(8);
        setDisplayedChars(15);
      } else {
        setItemsPerPage(8);
        setDisplayedChars(40);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <SEO title="Exuberance" />
      <Layout cookies={cookies}>
        <div className="container mx-auto mt-8 p-4 bg-white rounded shadow-lg">
          <div className="text-4xl font-popin font-semibold mb-8">
            Dashboard Admin
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
                  <th className="py-2 px-4 border-b w-[5%] md:w-[20%] hidden md:table-cell">
                    Date Login
                  </th>
                  <th className="py-2 px-4 border-b w-[12%]">User Id</th>
                  <th className="py-2 px-4 border-b w-[45%]">Email</th>
                  <th className="py-2 px-4 border-b text-center hidden md:table-cell">
                    Remote Address
                  </th>
                  <th className="py-2 px-4 border-b w-1/6 text-center table-cell md:hidden"></th>
                </tr>
              </thead>
              <tbody>
                {displayedLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="text-sm md:text-sm cursor-pointer"
                    onClick={() => handleRowClick(log)}
                  >
                    <td className="py-2 px-4 border-b hidden md:table-cell">
                      {log.created}
                    </td>
                    <td className="py-2 px-4 border-b">{log.userId}</td>
                    <td className="py-2 px-4 border-b line-clamp">
                      {log.name}
                    </td>
                    <td className="py-2 px-4 border-b text-center hidden md:table-cell">
                      {log.remoteAddress}
                    </td>
                    <td className={`py-2 px-4 border-b hidden md:table-cell`}></td>
                    <td className="py-2 px-4 border-b w-1/6 text-center table-cell md:hidden">
                      View Detail
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
      {selectedLog && (
  <div className="fixed inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white w-full max-w-md p-4 overflow-x-auto rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Audit Log Details</h2>
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-600">
          Date: {selectedLog.created}
        </p>
      </div>
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-600">
          User Id: {selectedLog.userId}
        </p>
      </div>
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-600">
          Email: {selectedLog.name}
        </p>
      </div>
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-600">
          Remote Address: {selectedLog.remoteAddress}
        </p>
      </div>
      <button onClick={() => setSelectedLog(null)}>Close</button>
    </div>
  </div>
)}
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

  if (cookies.oauth !== "108729504825733303534") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  try {
    const response = await fetch(`http://${process.env.SERVER_WEB}:${process.env.SERVER_PORT}/connection/exuberance/auditlog`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch audit logs");
    }

    const result = await response.json();
    const auditLogs = result.data || [];


    const formattedLogs = auditLogs.map((log) => ({
      id: log.id,
      created: log.created,
      userId: log.user_id || 'Not available',
      name: log.name,
      remoteAddress: log.remote_address || 'Not available',
    }));

    return {
      props: {
        cookies,
        auditLogs: formattedLogs,
      },
    };
  } catch (error) {
    console.error("Error fetching audit logs:", error.message);
    return {
      props: {
        cookies,
        auditLogs: [],
      },
    };
  }
};
