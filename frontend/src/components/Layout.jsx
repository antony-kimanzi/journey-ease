import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import '../index.css';

export default function Layout() {
  return (
    <div className="montserrat-font d-flex flex-column min-vh-100" style={{ backgroundColor: "#f7f7f7" }}>
      {/* Content Wrapper */}
      <div className="container mx-auto p-8 flex-grow-1" style={{ paddingTop: "80px" }}>
        <Outlet />
        <ToastContainer />
      </div>

      {/* Footer Always at Bottom */}
      <Footer />
    </div>
  );
}
