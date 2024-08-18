import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Admin.module.css"; // CSSモジュールのインポート

export default function AdminAuth() {
  const [nickname, setNickname] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    if (nickname) {
      localStorage.setItem("adminNickname", nickname);
      router.push("/admin"); // 管理者画面にリダイレクト
    } else {
      alert("ニックネームを入力してください。");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>管理者画面へのアクセス</h1>
      <input
        type="text"
        placeholder="ニックネーム"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleSubmit} className={styles.button}>
        登録
      </button>
    </div>
  );
}
