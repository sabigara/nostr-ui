import RelayPanelDialog from "@/app/RelayPanelDialog";
import styles from "./Header.module.scss";

export default function Header() {
  return (
    <header className={styles.container}>
      <span className={styles.logo}>Nostr</span>
      <RelayPanelDialog />
    </header>
  );
}
