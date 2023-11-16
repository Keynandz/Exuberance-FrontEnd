import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, cookies }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar cookies={cookies} />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
