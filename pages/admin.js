import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import styles from "../styles/Admin.module.css"; // CSSモジュールのインポート

export default function Admin() {
  const [data, setData] = useState([]);
  const [inProgressData, setInProgressData] = useState([]);
  const [completedData, setCompletedData] = useState([]);
  const [currentNickname, setCurrentNickname] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedNickname = localStorage.getItem("adminNickname");
    if (!storedNickname) {
      router.push("/admin-auth"); // ニックネームが保存されていない場合、リダイレクト
    } else {
      setCurrentNickname(storedNickname);
      const fetchData = async () => {
        const result = await axios.get("/api/save");
        setData(result.data.data);
        setInProgressData(result.data.inProgressData);
        setCompletedData(result.data.completedData);
      };

      fetchData(); // 初期データの取得

      // データを定期的に取得する
      const intervalId = setInterval(fetchData, 5000); // 5秒ごとにデータを取得

      // クリーンアップ関数
      return () => clearInterval(intervalId);
    }
  }, [router]);

  const handleInProgressClick = async (entry) => {
    await axios.post("/api/save", {
      ...entry,
      status: "inProgress",
      handler: currentNickname,
    });

    const result = await axios.get("/api/save");
    setData(result.data.data);
    setInProgressData(result.data.inProgressData);
    setCompletedData(result.data.completedData);
  };

  const handleCompleteClick = async (entry) => {
    await axios.post("/api/save", {
      ...entry,
      status: "completed",
    });

    const result = await axios.get("/api/save");
    setData(result.data.data);
    setInProgressData(result.data.inProgressData);
    setCompletedData(result.data.completedData);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>管理者画面</h1>

      <div className={styles.nicknameForm}>
        <p>対応者ニックネーム: {currentNickname}</p>
      </div>

      <h2 className={styles.subtitle}>未完了のタスク</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>班番号</th>
            <th>ニックネーム</th>
            <th>カテゴリ</th>
            <th>時間</th>
            <th>対応中にする</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td>{entry.teamNumber}</td>
              <td>{entry.nickname}</td>
              <td>{entry.category}</td>
              <td>{entry.timestamp}</td>
              <td>
                <button onClick={() => handleInProgressClick(entry)}>
                  対応中にする
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className={styles.subtitle}>対応中のタスク</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>班番号</th>
            <th>ニックネーム</th>
            <th>カテゴリ</th>
            <th>時間</th>
            <th>対応者</th>
            <th>完了する</th>
          </tr>
        </thead>
        <tbody>
          {inProgressData.map((entry, index) => (
            <tr key={index}>
              <td>{entry.teamNumber}</td>
              <td>{entry.nickname}</td>
              <td>{entry.category}</td>
              <td>{entry.timestamp}</td>
              <td>{entry.handler}</td> {/* 対応者の表示 */}
              <td>
                <button onClick={() => handleCompleteClick(entry)}>
                  完了する
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className={styles.subtitle}>完了済みのタスク</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>班番号</th>
            <th>ニックネーム</th>
            <th>カテゴリ</th>
            <th>時間</th>
          </tr>
        </thead>
        <tbody>
          {completedData.map((entry, index) => (
            <tr key={index}>
              <td>{entry.teamNumber}</td>
              <td>{entry.nickname}</td>
              <td>{entry.category}</td>
              <td>{entry.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
