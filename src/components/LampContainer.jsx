import { useState } from "react";
import styles from "./LampContainer.module.css";

export default function LampContainer({ children }) {
  const [isLightOn, setIsLightOn] = useState(false);
  const [isPulling, setIsPulling] = useState(false);

  // Play a synthetic mechanical click sound using Web Audio API
  const playClickSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      // Sharp metallic high-pitch click
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(900, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.06);
      gain1.gain.setValueAtTime(0.06, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc1.start();
      osc1.stop(ctx.currentTime + 0.06);

      // Low wooden case resonance/thud
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(140, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.12);
      gain2.gain.setValueAtTime(0.04, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc2.start();
      osc2.stop(ctx.currentTime + 0.12);
    } catch (e) {
      // Audio context might be blocked or unsupported
      console.warn("Audio feedback blocked:", e);
    }
  };

  const handlePull = () => {
    if (isPulling) return;
    setIsPulling(true);
    playClickSound();
    setIsLightOn((prev) => !prev);

    setTimeout(() => {
      setIsPulling(false);
    }, 300);
  };

  return (
    <div className={`${styles.wrapper} ${isLightOn ? styles.lightOn : styles.lightOff}`}>
      
      {/* Interactive Lamp Area */}
      <div className={styles.lampArea}>
        
        {/* Helper prompt */}
        <div className={styles.instruction}>
          {isLightOn ? "CLICK LAMP OR STRING TO TURN OFF" : "PULL THE STRING TO TOGGLE LIGHT"}
        </div>

        <div className={styles.lamp}>
          {/* Light Cone radiating from bottom of shade */}
          <div className={styles.lightCone}></div>

          {/* Lamp Shade & Bulb */}
          <div className={styles.shadeContainer} onClick={handlePull}>
            <svg className={styles.shadeSvg} viewBox="0 0 120 60">
              {/* Trapezoidal Shade Body */}
              <polygon
                points="30,10 90,10 110,50 10,50"
                className={styles.shadeBody}
              />
              {/* Top Cap */}
              <ellipse cx="60" cy="10" rx="30" ry="4" className={styles.shadeCap} />
              {/* Bottom Rim */}
              <ellipse cx="60" cy="50" rx="50" ry="6" className={styles.shadeRim} />
            </svg>
            <div className={styles.bulb}></div>
          </div>

          {/* Pull string hanging from the shade */}
          <div
            className={`${styles.pullString} ${isPulling ? styles.pulling : ""}`}
            onClick={handlePull}
          >
            <div className={styles.stringLine}></div>
            <div className={styles.stringHandle}></div>
          </div>

          {/* Lamp Pole */}
          <div className={styles.pole}></div>

          {/* Lamp Base */}
          <div className={styles.base}></div>
        </div>
      </div>

      {/* Form Card Content Area */}
      <div className={styles.contentArea}>
        <div className={styles.cardWrapper}>
          {children}
        </div>
      </div>

    </div>
  );
}
