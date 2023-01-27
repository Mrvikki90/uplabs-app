import React from "react";
import { Layout, Menu } from "antd";

const NavBar = () => {
  const { Header } = Layout;
  return (
    <>
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" />
        </Header>
      </Layout>
    </>
  );
};

export default NavBar;
