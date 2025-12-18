import { useEffect, useRef } from "react";

const HeroProductRotate = ({ image }) => {
  const imgRef = useRef(null);
  let lastScroll = 0;
  let rotateY = 0;

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      const diff = current - lastScroll;

      rotateY += diff * 0.35; // rotation speed
      lastScroll = current;

      if (imgRef.current) {
        imgRef.current.style.transform = `
          rotateY(${rotateY}deg)
          rotateX(6deg)
        `;
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={scene}>
      <img
        ref={imgRef}
        src={image}
        alt="Rotating Product"
        style={product}
      />
    </div>
  );
};

export default HeroProductRotate;

/* ===== styles ===== */

const scene = {
  perspective: "1200px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const product = {
  width: "420px",
  maxWidth: "100%",
  transformStyle: "preserve-3d",
  transition: "transform 0.05s linear",
  filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.25))",
};


