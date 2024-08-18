let data = []; // 未完了のタスク
let inProgressData = []; // 対応中のタスク
let completedData = []; // 完了済みのタスク

export default function handler(req, res) {
  if (req.method === "POST") {
    const { nickname, teamNumber, category, timestamp, status, handler } =
      req.body;

    if (status === "completed") {
      // 完了済みのタスクとして追加
      const existingIndex = inProgressData.findIndex(
        (item) =>
          item.nickname === nickname &&
          item.teamNumber === teamNumber &&
          item.category === category &&
          item.timestamp === timestamp
      );

      if (existingIndex > -1) {
        // 対応中のリストから削除
        inProgressData.splice(existingIndex, 1);
      }

      completedData.push({ nickname, teamNumber, category, timestamp });
    } else if (status === "inProgress") {
      // 対応中のタスクとして追加
      const existingIndex = data.findIndex(
        (item) =>
          item.nickname === nickname &&
          item.teamNumber === teamNumber &&
          item.category === category &&
          item.timestamp === timestamp
      );

      if (existingIndex > -1) {
        // 未完了のリストから削除
        data.splice(existingIndex, 1);
      }

      inProgressData.push({
        nickname,
        teamNumber,
        category,
        timestamp,
        handler,
      });
    } else {
      // 新しいタスクを追加
      data.push({ nickname, teamNumber, category, timestamp });
    }

    res.status(200).json({ message: "データが保存されました。" });
  } else if (req.method === "GET") {
    res.status(200).json({
      data,
      inProgressData,
      completedData,
    });
  }
}
