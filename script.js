document.getElementById("playerForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Ngăn hành động mặc định của form (load lại trang)
  savePlayer();
});

const players = [];

// Hàm lưu cầu thủ vào Local Storage
function savePlayer() {
  console.log("Đang lưu cầu thủ..."); // Kiểm tra hàm được gọi

  const idInput = document.getElementById("player-id")?.value.trim() || ""; // Lấy ID nhập vào (nếu có)
  const nameInput = document.getElementById("player-name").value.trim(); // Lấy tên nhập vào
  const positions = Array.from(document.querySelectorAll('input[name="position"]:checked')).map(input => input.value);

  console.log("Tên:", nameInput, "Vị trí:", positions);

  // Kiểm tra thông tin nhập vào
  if (nameInput === "") {
    alert("Vui lòng nhập tên cầu thủ!");
    return;
  }

  if (positions.length === 0) {
    alert("Vui lòng chọn ít nhất một vị trí cầu thủ!");
    return;
  }

  // Lấy danh sách cầu thủ từ Local Storage
  const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];
  console.log("Danh sách trước khi thêm:", storedPlayers);

  // Tạo ID nếu không nhập
  const playerId = idInput || Math.floor(Math.random() * 99) + 1;

  // Kiểm tra trùng lặp ID hoặc tên
  const isDuplicate = storedPlayers.some(player => player.id === playerId || player.name.toLowerCase() === nameInput.toLowerCase());
  if (isDuplicate) {
    alert("ID hoặc tên cầu thủ đã tồn tại. Vui lòng nhập thông tin khác!");
    return;
  }

  // Thêm cầu thủ vào danh sách
  const player = { id: playerId, name: nameInput, positions };
  storedPlayers.push(player); // Thêm vào danh sách
  localStorage.setItem("players", JSON.stringify(storedPlayers)); // Lưu vào Local Storage

  console.log("Danh sách sau khi thêm:", storedPlayers);

  // Cập nhật danh sách hiển thị
  renderPlayerList();

  // Reset form
  document.getElementById("player-id").value = "";
  document.getElementById("player-name").value = "";
  document.querySelectorAll('input[name="position"]:checked').forEach(input => input.checked = false);


  console.log("Cầu thủ đã được lưu:", storedPlayers);
  console.log("Danh sách cầu thủ trong Local Storage:", JSON.parse(localStorage.getItem("players")));

}






// Hàm hiển thị danh sách cầu thủ 
function renderPlayerList() {
  console.log("Danh sách cầu thủ được lọc:", players); // Kiểm tra dữ liệu lọc
  const playerTableBody = document.getElementById("playerTableBody");
  playerTableBody.innerHTML = ""; // Xóa danh sách cũ

  // Lấy danh sách cầu thủ từ Local Storage
  const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];

  // Kiểm tra nếu danh sách trống
  if (storedPlayers.length === 0) {
    console.log("Không có cầu thủ nào được lưu.");
    return;
  }

  // Hiển thị danh sách cầu thủ vào bảng    
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

  console.log("Danh sách cầu thủ được hiển thị:", storedPlayers);
}





// Hàm xóa cầu thủ
function deletePlayer(id) {
  const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];
  const updatedPlayers = storedPlayers.filter(player => player.id != id);

  localStorage.setItem("players", JSON.stringify(updatedPlayers));
  renderPlayerList();

  console.log("Danh sách cầu thủ hiện tại:", JSON.parse(localStorage.getItem("players")));
}

// Hàm hiển thị thông tin cầu thủ vào form để chỉnh sửa
function startEditPlayer(id) {
  const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];
  const playerToEdit = storedPlayers.find(player => player.id == id);

  if (playerToEdit) {
    // Điền thông tin cầu thủ vào form
    document.getElementById("player-id").value = playerToEdit.id;
    document.getElementById("player-name").value = playerToEdit.name;
    document.querySelectorAll('input[name="position"]').forEach(input => {
      input.checked = playerToEdit.positions.includes(input.value);
    });

    // Lưu ID của cầu thủ đang chỉnh sửa để cập nhật sau
    document.getElementById("playerForm").setAttribute("data-edit-id", id);
  } else {
    alert("Không tìm thấy cầu thủ để sửa!");
  }
}

// Hàm lưu thông tin cầu thủ sau khi chỉnh sửa
function saveEditedPlayer() {
  const editId = document.getElementById("playerForm").getAttribute("data-edit-id");
  if (!editId) {
    savePlayer(); // Nếu không phải đang chỉnh sửa, gọi hàm thêm mới
    return;
  }

  const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];
  const playerIndex = storedPlayers.findIndex(player => player.id == editId);

  if (playerIndex === -1) {
    alert("Không tìm thấy cầu thủ để cập nhật!");
    return;
  }

  // Lấy dữ liệu từ form
  const nameInput = document.getElementById("player-name").value.trim();
  const positions = Array.from(document.querySelectorAll('input[name="position"]:checked')).map(input => input.value);

  if (nameInput === "") {
    alert("Vui lòng nhập tên cầu thủ!");
    return;
  }

  if (positions.length === 0) {
    alert("Vui lòng chọn ít nhất một vị trí cầu thủ!");
    return;
  }

  // Kiểm tra trùng lặp tên và ID khi chỉnh sửa
  const isDuplicateName = storedPlayers.some((player, index) => index !== playerIndex && player.name.toLowerCase() === nameInput.toLowerCase());
  if (isDuplicateName) {
    alert("Tên cầu thủ đã tồn tại. Vui lòng nhập tên khác!");
    return;
  }


  
  // Cập nhật thông tin cầu thủ
  storedPlayers[playerIndex].name = nameInput;
  storedPlayers[playerIndex].positions = positions;

  localStorage.setItem("players", JSON.stringify(storedPlayers));

  // Reset form
  document.getElementById("playerForm").removeAttribute("data-edit-id");
  document.getElementById("player-id").value = "";
  document.getElementById("player-name").value = "";
  document.querySelectorAll('input[name="position"]').forEach(input => input.checked = false);

  renderPlayerList();
  alert("Cập nhật thông tin cầu thủ thành công!");
}



// Hàm sửa để sử dụng chức năng startEditPlayer
function editPlayer(id) {
  startEditPlayer(id);
}

// Hàm sửa thông tin cầu thủ
function editPlayer(id) {
  const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];
  const playerToEdit = storedPlayers.find(player => player.id === id);


  // Xóa cầu thủ cũ tạm thời nhưng lưu danh sách lại
  const updatedPlayers = storedPlayers.filter(player => player.id !== id);
  localStorage.setItem("players", JSON.stringify(updatedPlayers));

  // Render lại danh sách để cập nhật
  renderPlayerList();

  console.log("Danh sách cầu thủ hiện tại:", JSON.parse(localStorage.getItem("players")));

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
