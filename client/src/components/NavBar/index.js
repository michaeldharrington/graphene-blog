import React from "react";
import styles from "./styles.module.css";

const NavBar = ({ children }) => {
  return <nav className={styles.container}>{children}</nav>;
};

export default NavBar;
