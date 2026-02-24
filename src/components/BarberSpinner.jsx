import styles from "./BarberSpinner.module.css";

export default function BarberSpinner({ text="Setting up your style..." }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner}></div>
      <div className={styles.text}>{text}</div>
    </div>
  );
}
