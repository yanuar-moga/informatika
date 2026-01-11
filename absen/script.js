// =========================
// KONFIGURASI API
// =========================
const API = "https://script.google.com/macros/s/AKfycbz_yK-5jwgT-GNMQ3HAB0XDWRW4Dj_Lj5ohq4MiQIFXBlapHSQB1yRRa8VLCp9CQlowVA/exec";

// =========================
// AMBIL ELEMEN (PASTI ADA)
// =========================
const kelasSelect   = document.getElementById("kelas");
const namaSelect    = document.getElementById("nama");
const jkInput       = document.getElementById("jk");
const tanggalInput  = document.getElementById("tanggal");
const statusSelect  = document.getElementById("status");
const msg           = document.getElementById("msg");
const form          = document.getElementById("formAbsensi");
const btnSubmit     = form.querySelector("button");

// =========================
// TANGGAL (DISPLAY SAJA)
// =========================
tanggalInput.value = new Date().toLocaleString("id-ID");

// =========================
// LOAD DATA SISWA (GET)
// =========================
fetch(API + "?action=getData")
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
  })
  .catch(() => {
    msg.innerHTML = "❌ Gagal memuat data siswa";
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
// SUBMIT FORM (ANTI RELOAD)
// =========================
form.addEventListener("submit", function (e) {
  e.preventDefault();
  kirimAbsensi();
});

// =========================
// KIRIM ABSENSI (POST JSON)
// =========================
function kirimAbsensi() {
  const kelas  = kelasSelect.value.trim();
  const nama   = namaSelect.value.trim();
  const jk     = jkInput.value.trim();
  const status = statusSelect.value.trim();

  // VALIDASI
  if (!kelas || !nama || !jk || !status) {
    msg.innerHTML = "⚠️ Kelas, Nama, JK, dan Status WAJIB diisi";
    return;
  }

  btnSubmit.disabled = true;
  msg.innerHTML = "⏳ Menyimpan presensi...";

  const payload = {
    action: "submit",
    kelas: kelas,
    nama: nama,
    jk: jk,
    status: status
  };

  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(res => {
      if (res.status === "success") {
        msg.innerHTML = "✅ Presensi berhasil disimpan";

        form.reset();
        namaSelect.disabled = true;
        jkInput.value = "";
        tanggalInput.value = new Date().toLocaleString("id-ID");
      } 
      else if (res.status === "duplicate") {
        msg.innerHTML = "⚠️ Siswa sudah presensi hari ini";
      } 
      else {
        msg.innerHTML = "❌ " + (res.message || "Gagal menyimpan presensi");
      }
    })
    .catch(err => {
      console.error(err);
      msg.innerHTML = "❌ Koneksi bermasalah";
    })
    .finally(() => {
      btnSubmit.disabled = false;
    });
}
