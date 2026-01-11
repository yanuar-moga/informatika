const API = "https://script.google.com/macros/s/AKfycbz_yK-5jwgT-GNMQ3HAB0XDWRW4Dj_Lj5ohq4MiQIFXBlapHSQB1yRRa8VLCp9CQlowVA/exec";

const kelasSelect   = document.getElementById("kelas");
const namaSelect    = document.getElementById("nama");
const jkInput       = document.getElementById("jk");
const tanggalInput  = document.getElementById("tanggal");
const statusSelect  = document.getElementById("status");
const msg           = document.getElementById("msg");
const btnSubmit     = document.querySelector("button");

// =========================
// TANGGAL (DISPLAY SAJA)
// =========================
tanggalInput.value = new Date().toLocaleString("id-ID");

// =========================
// LOAD DATA SISWA
// =========================
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

// =========================
// PILIH KELAS
// =========================
kelasSelect.addEventListener("change", () => {
  namaSelect.innerHTML = `<option value="">-- Pilih Nama --</option>`;
  namaSelect.disabled = false;
  jkInput.value = "";
  msg.innerHTML = "";

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

// =========================
// PILIH NAMA
// =========================
namaSelect.addEventListener("change", () => {
  const selected = namaSelect.options[namaSelect.selectedIndex];
  jkInput.value = selected ? selected.dataset.jk : "";
});

// =========================
// KIRIM ABSENSI
// =========================
function kirimAbsensi() {
  const kelas  = kelasSelect.value;
  const nama   = namaSelect.value;
  const jk     = jkInput.value;
  const status = statusSelect.value;

  if (!kelas || !nama || !jk) {
    msg.innerHTML = "⚠️ Lengkapi data terlebih dahulu";
    return;
  }

  btnSubmit.disabled = true;
  msg.innerHTML = "⏳ Menyimpan presensi...";

  const params = new URLSearchParams({
    action: "submit",
    kelas,
    nama,
    jk,
    status
  });

  fetch(`${API}?${params.toString()}`)
    .then(res => res.json())
    .then(res => {
      if (res.status === "success") {
        msg.innerHTML = "✅ Presensi berhasil disimpan";
      } else if (res.status === "duplicate") {
        msg.innerHTML = "⚠️ Siswa sudah presensi hari ini";
      } else {
        msg.innerHTML = "❌ Gagal menyimpan presensi";
      }
    })
    .catch(() => {
      msg.innerHTML = "❌ Koneksi bermasalah";
    })
    .finally(() => {
      btnSubmit.disabled = false;
    });
}
