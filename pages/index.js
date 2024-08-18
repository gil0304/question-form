import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment-timezone";
import styles from "../styles/Home.module.css"; // CSSモジュールのインポート

export default function Home() {
  const [nickname, setNickname] = useState("");
  const [teamNumber, setTeamNumber] = useState("");
  const [category, setCategory] = useState("開発");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    const storedTeamNumber = localStorage.getItem("teamNumber");
    if (storedNickname && storedTeamNumber) {
      setNickname(storedNickname);
      setTeamNumber(storedTeamNumber);
      setIsSubmitted(true);
    }
  }, []);

  const handleInitialSubmit = () => {
    localStorage.setItem("nickname", nickname);
    localStorage.setItem("teamNumber", teamNumber);
    setIsSubmitted(true);
  };

  const handleClick = async () => {
    const timestamp = moment().tz("Asia/Tokyo").format("YYYY-MM-DD HH:mm:ss");
    await axios.post("/api/save", {
      nickname,
      teamNumber,
      category,
      timestamp,
    });
    alert("データが送信されました。");
  };

  if (isSubmitted) {
    return (
      <div className={styles.container}>
        <div className={styles.sendForm}>
          <p>班番号: {teamNumber}</p>
          <p>ニックネーム: {nickname}</p>
          <select
            className={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="開発">開発</option>
            <option value="運営">運営</option>
            <option value="その他">その他</option>
          </select>
          <button className={styles.button} onClick={handleClick}>
            送信
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.submitForm}>
        <input
          className={styles.input}
          type="text"
          placeholder="班番号"
          value={teamNumber}
          onChange={(e) => setTeamNumber(e.target.value)}
        />
        <input
          className={styles.input}
          type="text"
          placeholder="ニックネーム"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <button className={styles.button} onClick={handleInitialSubmit}>
          登録
        </button>
      </div>
    </div>
  );
}
