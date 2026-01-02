const API_URL = "PASTE_URL_APPS_SCRIPT_DI_SINI";

// ===============================
// LOAD SISWA SESUAI KELAS
// ===============================
function loadSiswa() {
  const kelas = document.getElementById("kelas").value;
  const siswa = document.getElementById("siswa");

  siswa.innerHTML = `<option value="">-- Pilih Nama --</option>`;

  if (!kelas) return;

  fetch(`${API_URL}?kelas=${kelas}`)
    .then(res => res.json())
    .then(data => {
      data.forEach(n => {
        let opt = document.createElement("option");
        opt.value = n;
        opt.text = n;
        siswa.appendChild(opt);
      });
    });
}

// ===============================
// TAMPILKAN SOAL SETELAH PILIH NAMA
// ===============================
function tampilkanSoal() {
  const nama = document.getElementById("siswa").value;
  if (!nama) return;

  let html = "";
  soal.forEach((s, i) => {
    html += `<p><b>${i + 1}. ${s.tanya}</b></p>`;
    s.opsi.forEach((o, j) => {
      html += `
        <label>
          <input type="radio" name="q${i}" value="${j}">
          ${o}
        </label><br>`;
    });
    html += "<br>";
  });

  document.getElementById("soal").innerHTML = html;
  document.getElementById("btnKirim").style.display = "block";
}

// ===============================
// KIRIM JAWABAN
// ===============================
function kirimJawaban() {
  const kelas = document.getElementById("kelas").value;
  const nama = document.getElementById("siswa").value;

  let skor = 0;
  soal.forEach((s, i) => {
    const jawab = document.querySelector(`input[name='q${i}']:checked`);
    if (jawab && parseInt(jawab.value) === s.benar) skor++;
  });

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ kelas, nama, skor })
  })
  .then(() => alert("✅ Jawaban berhasil dikirim"));
}
