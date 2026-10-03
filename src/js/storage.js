const STORAGE_KEY = "talestris_memory_game_leaders";

export function getLeaders() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveResult(movesCount) {
  const leaders = getLeaders();

  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const dateStr = `${day}.${month}.${year}`;

  const newResult = {
    moves: movesCount,
    date: dateStr,
    timestamp: Date.now(),
  };

  leaders.push(newResult);

  leaders.sort((a, b) => {
    if (a.moves !== b.moves) {
      return a.moves - b.moves;
    }
    return a.timestamp - b.timestamp;
  });

  const topTen = leaders.slice(0, 10);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(topTen));
}
