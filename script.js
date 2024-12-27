document.getElementById("playerForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Ngăn hành động mặc định của form (load lại trang)
  savePlayer();
});

const players = [];




// Hàm lưu cầu thủ hoặc cập nhật thông tin cầu thủ
function saveOrUpdatePlayer() {
  const idInput = document.getElementById("player-id").value.trim();
  const nameInput = document.getElementById("player-name").value.trim();
  const positions = Array.from(document.querySelectorAll('input[name="position"]:checked')).map(input => input.value);

  if (!nameInput) {
    alert("Vui lòng nhập tên cầu thủ!");
    return;
  }

  if (positions.length === 0) {
    alert("Vui lòng chọn ít nhất một vị trí cầu thủ!");
    return;
  }

  const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];

  if (idInput) {
    // Cập nhật thông tin cầu thủ
    const playerIndex = storedPlayers.findIndex(player => player.id == idInput);
    if (playerIndex === -1) {
      alert("Không tìm thấy cầu thủ để cập nhật!");
      return;
    }

    storedPlayers[playerIndex].name = nameInput;
    storedPlayers[playerIndex].positions = positions;
    alert("Cập nhật thông tin cầu thủ thành công!");
  } else {
    // Thêm cầu thủ mới
    const newId = Math.floor(Math.random() * 99) + 1;
    const isDuplicate = storedPlayers.some(player => player.name.toLowerCase() === nameInput.toLowerCase());

    if (isDuplicate) {
      alert("Tên cầu thủ đã tồn tại. Vui lòng nhập tên khác!");
      return;
    }

    const newPlayer = { id: newId, name: nameInput, positions };
    storedPlayers.push(newPlayer);
    alert("Thêm cầu thủ mới thành công!");
  }

  localStorage.setItem("players", JSON.stringify(storedPlayers));
  renderPlayerList();
  resetForm();
}

// Hàm hiển thị thông tin cầu thủ lên form
function editPlayer(id) {
  const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];
  const playerToEdit = storedPlayers.find(player => player.id == id);

  if (playerToEdit) {
    document.getElementById("player-id").value = playerToEdit.id;
    document.getElementById("player-name").value = playerToEdit.name;
    document.querySelectorAll('input[name="position"]').forEach(input => {
      input.checked = playerToEdit.positions.includes(input.value);
    });
  } else {
    alert("Không tìm thấy cầu thủ để sửa!");
  }
}

// Hàm reset form
function resetForm() {
  document.getElementById("player-id").value = "";
  document.getElementById("player-name").value = "";
  document.querySelectorAll('input[name="position"]').forEach(input => (input.checked = false));
}

// Sửa nút submit trong form
const playerForm = document.getElementById("playerForm");
playerForm.addEventListener("submit", function (event) {
  event.preventDefault();
  saveOrUpdatePlayer();
});

// Cập nhật danh sách cầu thủ
function renderPlayerList() {
  const playerTableBody = document.getElementById("playerTableBody");
  const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];

  playerTableBody.innerHTML = "";

  storedPlayers.forEach((player, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${player.name}</td>
      <td>${player.positions.join(", ")}</td>
      <td>${player.id}</td>
      <td>
        <button onclick="editPlayer('${player.id}')">Sửa</button>
        <button onclick="deletePlayer('${player.id}')">Xóa</button>
      </td>
    `;
    playerTableBody.appendChild(row);
  });
}

// Hàm xóa cầu thủ
function deletePlayer(id) {
  const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];
  const updatedPlayers = storedPlayers.filter(player => player.id != id);

  localStorage.setItem("players", JSON.stringify(updatedPlayers));
  renderPlayerList();
}










// Hàm thêm dữ liệu thống kê cho cầu thủ
function updatePlayerStats(id, goals = 0, assists = 0) {
  const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];
  const player = storedPlayers.find(player => player.id === id);

  if (player) {
      player.stats = player.stats || { appearances: 0, goals: 0, assists: 0 };
      player.stats.appearances += 1; // Tăng số lần ra sân
      player.stats.goals += goals;  // Cập nhật số bàn thắng
      player.stats.assists += assists; // Cập nhật số kiến tạo
      localStorage.setItem("players", JSON.stringify(storedPlayers));
  }
}

// Hàm hiển thị thống kê chi tiết
function showPlayerStats() {
  const statsDiv = document.querySelector(".stats");
  const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];

  statsDiv.innerHTML = storedPlayers.map(player => `
      <p>
          ${player.name} - Số lần ra sân: ${player.stats?.appearances || 0}, 
          Bàn thắng: ${player.stats?.goals || 0}, 
          Kiến tạo: ${player.stats?.assists || 0}
      </p>
  `).join("");
}

function validatePlayer() {
  const nameInput = document.getElementById("player-name").value.trim(); // Loại bỏ khoảng trắng thừa
  const positionChecked = document.querySelectorAll('input[name="position"]:checked');

  
}

function searchPlayers() {
  const searchInput = document.getElementById("searchInput").value.trim().toLowerCase();
  const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];
  const filteredPlayers = storedPlayers.filter(player =>
      player.name.toLowerCase().includes(searchInput)
  );

  console.log("Từ khóa tìm kiếm:", searchInput);
  console.log("Kết quả tìm kiếm:", filteredPlayers); // Ghi log kết quả tìm kiếm
  renderFilteredPlayers(filteredPlayers);
}


function filterPlayersByPosition() {
  const selectedPosition = document.getElementById("positionFilter").value;
  const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];
  const filteredPlayers = selectedPosition === "All"
      ? storedPlayers
      : storedPlayers.filter(player => player.positions.includes(selectedPosition));

  console.log("Vị trí được chọn:", selectedPosition);
  console.log("Kết quả lọc:", filteredPlayers); // Ghi log kết quả lọc
  renderFilteredPlayers(filteredPlayers);
}


function renderFilteredPlayers(players) {
  console.log("Danh sách cầu thủ cần hiển thị:", players); // Ghi log kiểm tra
  const playerTableBody = document.getElementById("playerTableBody");
  playerTableBody.innerHTML = ""; // Xóa danh sách cũ

  if (players.length === 0) {
      playerTableBody.innerHTML = "<tr><td colspan='5'>Không tìm thấy cầu thủ</td></tr>";
      return;
  }

  players.forEach((player, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${index + 1}</td>
          <td>${player.name}</td>
          <td>${player.positions.join(", ")}</td>
          <td>${player.id}</td>
          <td>
              <button onclick="editPlayer('${player.id}')">Sửa</button>
              <button onclick="deletePlayer('${player.id}')">Xóa</button>
          </td>
      `;
      playerTableBody.appendChild(row);
  });
}


console.log("Dữ liệu cầu thủ trong Local Storage:", JSON.parse(localStorage.getItem("players")));


// Hàm sắp xếp đội hình
function generateTeams() {
  const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];

  if (storedPlayers.length < 14) {
    alert("Cần ít nhất 14 cầu thủ để chia đội!");
    return;
  }

  const goalkeepers = storedPlayers.filter(player => player.positions.includes("Thủ môn"));
  const forwards = storedPlayers.filter(player => player.positions.includes("Tiền đạo"));
  const others = storedPlayers.filter(player => !player.positions.includes("Thủ môn") && !player.positions.includes("Tiền đạo"));

  if (goalkeepers.length < 2 || forwards.length < 2) {
    alert("Cần ít nhất 2 thủ môn và 2 tiền đạo để chia đội!");
    return;
  }

  // Chọn ngẫu nhiên thủ môn và tiền đạo cho mỗi đội
  const teamA = [];
  const teamB = [];

  teamA.push(goalkeepers.pop());
  teamB.push(goalkeepers.pop());

  teamA.push(forwards.pop());
  teamB.push(forwards.pop());

  // Phân phối ngẫu nhiên các cầu thủ còn lại
  others.sort(() => Math.random() - 0.5);

  while (others.length) {
    if (teamA.length < 7) {
      teamA.push(others.pop());
    } else if (teamB.length < 7) {
      teamB.push(others.pop());
    }
  }

  // Hiển thị danh sách đội hình
  renderTeam("teamA", teamA);
  renderTeam("teamB", teamB);
}

function renderTeam(teamId, team) {
  const teamContainer = document.getElementById(teamId);
  teamContainer.innerHTML = team
    .map(player => `<li>${player.name} (${player.positions.join(", ")})</li>`)
    .join("");
}

document.getElementById("generateTeams").addEventListener("click", generateTeams);