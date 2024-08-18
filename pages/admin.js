import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Admin.module.css"; // CSSモジュールのインポート

export default function Admin() {
  const [data, setData] = useState([]);
  const [completedData, setCompletedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("/api/save");
      setData(result.data.data);
      setCompletedData(result.data.completedData);
    };

    fetchData(); // 初期データの取得

    // データを定期的に取得する
    const intervalId = setInterval(fetchData, 5000); // 5秒ごとにデータを取得

    // クリーンアップ関数
    return () => clearInterval(intervalId);
  }, []);

  const handleCheckboxChange = async (entry) => {
    await axios.post("/api/save", {
      ...entry,
      isCompleted: true,
    });

    // 状態を手動で更新
    const result = await axios.get("/api/save");
    setData(result.data.data);
    setCompletedData(result.data.completedData);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>管理者画面</h1>
      <h2 className={styles.subtitle}>未完了のタスク</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>班番号</th>
            <th>ニックネーム</th>
            <th>カテゴリ</th>
            <th>時間</th>
            <th>Done</th>
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
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(entry)}
                />
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
