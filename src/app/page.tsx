import Feed from "@/app/feed/Feed";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <Feed />
    </main>
  );
}
