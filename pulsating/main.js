const heart = document.getElementById("heart");
const { width, height } = heart.getBoundingClientRect();
heart.setAttribute("transform-origin", `${width / 2} ${height / 2}`);

const tl = gsap.timeline({ repeat: -1 });
tl.to("#pulse", { "stroke-dashoffset": -890, duration: 1.5, ease: "none" })
  .to("#heart", { transform: "scale(1.1)", duration: 0.15 }, "-=1.1")
  .to("#heart", { transform: "scale(0.9)", duration: 0.3 }, ">")
  .to("#heart", { transform: "scale(1.05)", duration: 0.15 }, ">")
  .to("#heart", { transform: "scale(0.95)", duration: 0.1 }, ">")
  .to("#heart", { transform: "scale(1)", duration: 0.05 }, ">");
