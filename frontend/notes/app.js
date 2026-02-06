const API = "https://api.megadev.se/api";

const notesEl = document.getElementById("notes");
const statusEl = document.getElementById("status");
const form = document.getElementById("noteForm");
const input = document.getElementById("noteText");

function setStatus(msg){ statusEl.textContent = msg || ""; }

async function loadNotes(){
  setStatus("Hämtar notes...");
  const res = await fetch(`${API}/notes`);
  if(!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const data = await res.json();

  notesEl.innerHTML = "";
  for(const n of data){
    const li = document.createElement("li");
    li.className = "item";
    li.innerHTML = `
      <div>
        <div>${escapeHtml(n.text)}</div>
        <div class="meta">${new Date(n.createdUtc).toLocaleString()}</div>
      </div>
      <button class="danger" data-id="${n.id}">Delete</button>
    `;
    notesEl.appendChild(li);
  }
  setStatus(`Klart (${data.length} st).`);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if(!text) return;

  setStatus("Sparar...");
  const res = await fetch(`${API}/notes`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ text })
  });
  if(!res.ok) throw new Error(`POST failed: ${res.status}`);
  input.value = "";
  await loadNotes();
});

notesEl.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-id]");
  if(!btn) return;
  const id = btn.getAttribute("data-id");

  setStatus("Tar bort...");
  const res = await fetch(`${API}/notes/${id}`, { method: "DELETE" });
  if(!res.ok) throw new Error(`DELETE failed: ${res.status}`);
  await loadNotes();
});

function escapeHtml(s){
  return s.replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

loadNotes().catch(err => setStatus(err.message));
