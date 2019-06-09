import React, { useRef } from "react";
import styled from "styled-components";
import lockScroll from "../../customHooks/lockScroll";

const Slider = ({ title, value, min = 0, max = 10, step = 1, onChange, style }) => {
  const sliderRef = useRef(null);
  const lockScrollEvents = lockScroll();

  const scrollHandler = async e => {
    if (value - (e.deltaY / 100) * step > 0.9) e.target.value = value - (e.deltaY / 100) * step;
    await onChange(e);
  };
  const SliderContainer = styled.div(style);
  return (
    <SliderContainer onWheelCapture={scrollHandler} {...lockScrollEvents}>
      <label htmlFor="customRange">{title}</label>
      <input
        className="custom-range"
        id="customRange"
        title={title}
        value={value}
        min={min}
        max={max}
        ref={sliderRef}
        step={step}
        aria-labelledby={title}
        onChange={onChange}
        type="range"
      />
    </SliderContainer>
  );
};
export default Slider;
