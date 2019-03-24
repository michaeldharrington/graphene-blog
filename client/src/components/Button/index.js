import React from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.css";

const Button = props => {
  const { color, click, text, icon, type, children } = props;

  return (
    <button
      className={styles.button}
      style={{ background: color }}
      onClick={click}
      type={type}
    >
      {icon}
      <div className={styles.text}>
        {text}
        {children}
      </div>
    </button>
  );
};

Button.defaultProps = {};

Button.propTypes = {
  color: PropTypes.string
};

export default Button;
