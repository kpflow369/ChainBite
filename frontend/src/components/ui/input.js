const Input = ({ value, onChange, placeholder }) => {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #333",
        background: "#111",
        color: "white"
      }}
    />
  );
};

export { Input };