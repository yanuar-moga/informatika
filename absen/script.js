const API = "https://script.google.com/macros/s/AKfycbz_yK-5jwgT-GNMQ3HAB0XDWRW4Dj_Lj5ohq4MiQIFXBlapHSQB1yRRa8VLCp9CQlowVA/exec";

const kelasSelect = document.getElementById("kelas");
const namaSelect = document.getElementById("nama");
const jkInput = document.getElementById("jk");
const tanggalInput = document.getElementById("tanggal");
const msg = document.getElementById("msg");

tanggalInput.value = new Date().toLocaleString("id-ID");

fetch(`${API}?action=getData`)
  .then(res => res.json())
  .then(data => {
    window.dataSiswa = data;

    const kelasUnik = [...new Set(data.map(s => s.kelas))];
    kelasUnik.forEach(k => {
      const opt = document.createElement("option");
      opt.value = k;
      opt.textContent = k;
      kelasSelect.appendChild(opt);
    });
  });

kelasSelect.addEventListener("change", () => {
  namaSelect.innerHTML = `<option value="">-- Pilih Nama --</option>`;
  namaSelect.disabled = false;
  jkInput.value = "";

  window.dataSiswa
    .filter(s => s.kelas === kelasSelect.value)
    .forEach(s => {
      const opt = document.createElement("option");
      opt.value = s.nama;
      opt.textContent = s.nama;
      opt.dataset.jk = s.jk;
      namaSelect.appendChild(opt);
    });
});

namaSelect.addEventListener("change", () => {
  jkInput.value =
    namaSelect.options[namaSelect.selectedIndex].dataset.jk || "";
});

function kirimAbsensi() {
  const data = {
    nama: namaSelect.value,
    jk: jkInput.value,
    kelas: kelasSelect.value,
    status: document.getElementById("status").value
  };

  if (!data.nama || !data.kelas) {
    msg.innerHTML = "⚠️ Lengkapi data!";
    return;
  }

  const params = new URLSearchParams(data).toString();
  fetch(`${API}?action=submit&${params}`)
    .then(res => res.json())
    .then(res => {
      msg.innerHTML = res.message || "✅ Presensi tersimpan";
    });
}
