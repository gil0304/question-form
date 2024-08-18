let data = []; // 未完了のタスク
let completedData = []; // 完了済みのタスク

export default function handler(req, res) {
  if (req.method === "POST") {
    const { nickname, teamNumber, category, timestamp, isCompleted } = req.body;

    if (isCompleted) {
      // 完了済みのタスクとして追加
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

      completedData.push({ nickname, teamNumber, category, timestamp });
    } else {
      // 新しいタスクを追加
      data.push({ nickname, teamNumber, category, timestamp });
    }

    res.status(200).json({ message: "データが保存されました。" });
  } else if (req.method === "GET") {
    res.status(200).json({
      data,
      completedData,
    });
  }
}
