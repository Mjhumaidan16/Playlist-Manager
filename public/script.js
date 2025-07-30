let playlistContent = []; // Stores loaded playlist lines
let draggedIndex = null;

   // Handle file upload
document.getElementById("fileInput").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    playlistContent = e.target.result.split("\n"); // Split lines
    displayPlaylist();
    document.getElementById("saveBtn").style.display = "inline-block";
    document.getElementById("toggleAddBtn").style.display = "inline-block";
  };
  reader.readAsText(file);
});

  // Handle dropdown limit change
document.getElementById("limitSelect").addEventListener("change", () => {
  displayPlaylist(document.getElementById("searchInput").value, document.getElementById("limitSelect").value);
});

  // Handle search input
document.getElementById("searchInput").addEventListener("input", (e) => {
  displayPlaylist(e.target.value);
});

  // Toggle Add Video form visibility
document.getElementById("toggleAddBtn").addEventListener("click", () => {
  const box = document.getElementById("addVideoBox");
  box.classList.toggle("hidden");
});

 // Normalize text for comparison (search case-insensitive)
function normalize(text) {
  return text.normalize('NFKC').toLowerCase();
}

  // Display playlist with filter and limit
function displayPlaylist(filter = "", limit = "all") {
  const container = document.getElementById("playlistContainer");
  container.innerHTML = "";

  let count = 0;

  for (let i = 0; i < playlistContent.length; i++) {
    const video = playlistContent[i];
    if (!normalize(video).includes(normalize(filter))) continue;

    if (limit !== "all" && count >= parseInt(limit)) break;
    count++;

    const item = document.createElement("div");
    item.className = "flex justify-between items-center bg-gray-100 rounded p-2";

    const textSpan = document.createElement("span");
    textSpan.textContent = video;

    const buttons = document.createElement("div");
    buttons.className = "flex gap-1";
    item.setAttribute("draggable", "true"); // ✅ This is required!


      // Track index for drag logic
item.dataset.index = i;

// 🎯 Drag and Drop Events
item.ondragstart = (e) => {
draggedIndex = parseInt(item.dataset.index);
item.classList.add("opacity-50"); // Optional visual feedback
};

item.ondragend = () => {
draggedIndex = null;
item.classList.remove("opacity-50");
};

item.ondragover = (e) => {
e.preventDefault(); // Required to allow dropping
item.classList.add("ring", "ring-blue-300"); // Optional highlight
};

item.ondragleave = () => {
item.classList.remove("ring", "ring-blue-300");
};

item.ondrop = () => {
const targetIndex = parseInt(item.dataset.index);
if (draggedIndex !== null && draggedIndex !== targetIndex) {
swapVideos(draggedIndex, targetIndex);
}
item.classList.remove("ring", "ring-blue-300");
};

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.title = "Edit";
    editBtn.textContent = "✏️";
    editBtn.className = "hover:text-blue-600";
    editBtn.onclick = () => {
      const newVal = prompt("Edit video path:", playlistContent[i]);
      if (newVal) {
        playlistContent[i] = newVal.trim();
        displayPlaylist(filter, limit);
      }
    };


  // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.title = "Delete";
    deleteBtn.textContent = "🗑️";
    deleteBtn.className = "hover:text-red-600";
    deleteBtn.onclick = () => {
      if (confirm("Are you sure you want to delete this item?")) {
        playlistContent.splice(i, 1);
        displayPlaylist(filter, limit);
      }
    };

       // Move Up/Down buttons
    const moveUpBtn = document.createElement("button");
    moveUpBtn.title = "Move Up";
    moveUpBtn.textContent = "↑";
    moveUpBtn.className = "hover:text-green-600";
    moveUpBtn.onclick = () => moveVideo(i, "up");

    const moveDownBtn = document.createElement("button");
    moveDownBtn.title = "Move Down";
    moveDownBtn.textContent = "↓";
    moveDownBtn.className = "hover:text-green-600";
    moveDownBtn.onclick = () => moveVideo(i, "down");

    [editBtn, deleteBtn, moveUpBtn, moveDownBtn].forEach(btn => {
      btn.classList.add("text-sm", "px-1");
      buttons.appendChild(btn);
    });

    item.appendChild(textSpan);
    item.appendChild(buttons);
    container.appendChild(item);
  }
}

 // Swap two playlist items
function swapVideos(index1, index2) {
  [playlistContent[index1], playlistContent[index2]] = [playlistContent[index2], playlistContent[index1]];
  displayPlaylist(document.getElementById("searchInput").value, document.getElementById("limitSelect").value);
}

 // Move video up or down
function moveVideo(index, direction) {
  if (direction === "up" && index > 0) {
    swapVideos(index, index - 1);
  } else if (direction === "down" && index < playlistContent.length - 1) {
    swapVideos(index, index + 1);
  }
}


// Add new video to playlist with validation
function addVideoToPlaylist() {
const input = document.getElementById("newVideoInput");
const videoName = input.value.trim();

// Check: not empty, ends with .mp4, and not just .mp4
// Check: not empty, ends with .mp4 or .jpg, and not just '.mp4' or '.jpg'
if (!videoName) {
  alert("Please enter a video name.");
} else if (
  !videoName.toLowerCase().endsWith(".mp4") &&
  !videoName.toLowerCase().endsWith(".jpg")
) {
  alert("The video name must end with '.mp4' or '.jpg'.");
} else if (
  videoName.trim().toLowerCase() === ".mp4" ||
  videoName.trim().toLowerCase() === ".jpg"
) {
  alert("Video name cannot be just '.mp4' or '.jpg'.");
} else {
  playlistContent.push(videoName);
  input.value = "";
  displayPlaylist(
    document.getElementById("searchInput").value,
    document.getElementById("limitSelect").value
  );
}

}


// Save playlist to server via POST
document.getElementById("saveBtn").addEventListener("click", () => {
  const modifiedContent = playlistContent.join("\n");
  fetch('/overwrite-playlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: document.getElementById("fileInput").files[0]?.name || 'playlist.m3u8',
      content: modifiedContent
    })
  })
  .then(res => res.text())
  .then(msg => alert('Playlist saved on server: ' + msg))
  .catch(err => alert('Error saving playlist: ' + err.message));
});

async function submitPassword (){

    const password = document.getElementById('obsPassword').value;
    if (!password) return alert('Password is required.');
    // Save temporarily in sessionStorage
    sessionStorage.setItem('obsPassword', password);
    console.log(password);

     // Send to backend
     const res = await fetch('/api/obs-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        alert('Password sent successfully.');
      } else {
        alert('Failed to send password.');
      }
    }


 document.getElementById("checkDuration").addEventListener("click", async () => {
  try {
    const res = await fetch('/api/playlist/duration');
    const data = await res.json();
    document.getElementById("resultBox").innerHTML =
      `🎬 Total Duration: <b>${data.totalDurationFormatted}</b> 
      (${data.totalDurationSeconds} seconds)<br>
       🖼️ Images: ${data.imageCount} | 📹 Videos: ${data.videoCount}`;
  } catch (err) {
    document.getElementById("resultBox").innerText = "Error calculating duration.";
  }
});

document.getElementById("checkMismatch").addEventListener("click", async () => {
  try {
    const res = await fetch('/api/playlist/check');
    const data = await res.json();
    document.getElementById("resultBox").innerHTML =
      `🧩 Files in folder but not in playlist: <b>${data.missingInM3u8.join(', ') || 'None'}</b><br>
       ❌ Files in playlist but missing on disk: <b>${data.missingOnDisk.join(', ') || 'None'}</b><br>
       📂 Total Files in folder: ${data.totalFolderFiles} | 🎞 Playlist Entries: ${data.totalM3u8Entries}`;
  } catch (err) {
    document.getElementById("resultDisplay").innerText = "Error checking playlist.";
  }
});





// Send scene switch request to server
function switchScene(scene) {
  fetch('/switch-scene', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scene })
  })
  .then(res => res.text())
  .then(alert)
  .catch(err => alert("Error: " + err.message));
}