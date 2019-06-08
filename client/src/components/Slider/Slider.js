import React from "react";

const Slider = ({ title, value, min = 0, max = 10, step = 1, onChange }) => {
  return (
    <>
      <label htmlFor="customRange1">{title}</label>
      <input
        className="custom-range"
        value={value}
        min={min}
        max={max}
        step={step}
        aria-labelledby="Zoom"
        onChange={onChange}
        type="range"
      />
    </>
  );
};

export default Slider;
