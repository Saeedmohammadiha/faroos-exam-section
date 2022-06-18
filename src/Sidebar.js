import React from "react";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import avatar from './login-avatar.png'

import {
  ProSidebar,
  SidebarHeader,
  SidebarContent,
  Menu,
  MenuItem,
} from "react-pro-sidebar";

const Sidebar = ({ collapse, toggled, handleToggleSidebar }) => {
  const name = localStorage.getItem("name")

  return (
    <div className=" sticky-right">
      <ProSidebar
        onToggle={handleToggleSidebar}
        toggled={toggled}
        collapsed={collapse}
        rtl={true}
        breakPoint="sm"
      >
        <SidebarHeader>
          <div className="text-right">
            <h5 className={`p-3 ${collapse ? "d-none" : ""}`}>
              پنل مدیران مدارس
            </h5>
            <div
              className={`dropdown-divider ${collapse ? "d-none" : ""}`}
            ></div>
            <div className="w-50 mr-2">
              <div className="">
                <img
                  src={avatar}
                  className="rounded-circle w-100 mt-4"
                  alt="User Image"
                />
              </div>
              <div
                className={`p-3 info mt-2 text-white ${collapse ? "d-none" : ""
                  }`}
              >
                <p href="#" className="d-block name">
                  {name}
                </p>
                خوش آمدید
              </div>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <Menu>
            <MenuItem icon={<i className="fas fa-home"></i>}>
              دانش پذیران
              <Link to="/manager" />
            </MenuItem>
            <MenuItem></MenuItem>
            <MenuItem></MenuItem>
            <MenuItem></MenuItem>
            <MenuItem></MenuItem>
            <MenuItem></MenuItem>
            <MenuItem></MenuItem>
            <MenuItem></MenuItem>
            <MenuItem></MenuItem>
            <MenuItem></MenuItem>
            <MenuItem></MenuItem>
            <MenuItem></MenuItem>
            <MenuItem></MenuItem>
            <MenuItem></MenuItem>
            <MenuItem></MenuItem>
            <MenuItem></MenuItem>
            <MenuItem></MenuItem>
            <MenuItem></MenuItem>
            <MenuItem></MenuItem>
            <MenuItem></MenuItem>
            <MenuItem></MenuItem>
            <MenuItem></MenuItem>
            <MenuItem></MenuItem>
            <MenuItem></MenuItem>
            <MenuItem></MenuItem>
          </Menu>
        </SidebarContent>

      </ProSidebar>
    </div>
  );
};

export default Sidebar;
