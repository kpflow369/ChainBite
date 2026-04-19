const Button = ({ children, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={className}
      style={{
        background: "#E63946",
        color: "white",
        padding: "10px 16px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        width: "100%"
      }}
    >
      {children}
    </button>
  );
};

export { Button };