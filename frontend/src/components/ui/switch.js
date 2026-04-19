const Switch = ({ checked, onCheckedChange }) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onCheckedChange}
      style={{ width: "20px", height: "20px" }}
    />
  );
};

export { Switch };