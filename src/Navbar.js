import React from "react";

const Navbar = ({ setCollapse, collapse, setToggled }) => {
  const windowHeight = window.screen.availWidth
  return (
    <nav   className="navbar bg-dark rounded shadow">
      <div className="container-fluid  ">
        <button onClick={()=>{setCollapse(!collapse)}} type="button" id="sidebarCollapse"  className={`btn btn-info ${windowHeight<577?'d-none':''}`}>
          <i className="fas fa-align-left"></i>
        </button>
        <button onClick={()=>{setToggled(true)}} type="button"   className={`btn btn-info ${windowHeight<577?'':'d-none'}`}>
          <i className="fas fa-align-left"></i>
        </button>
        <a href="/" className="btn btn-info">
          صفحه اصلی پنل
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
