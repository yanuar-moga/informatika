const API_URL = "PASTE_URL_APPS_SCRIPT_DI_SINI";


function loadSiswa() {
const kelas = document.getElementById("kelas").value;


fetch(`${API_URL}?kelas=${kelas}`)
.then(res => res.json())
.then(data => {
const siswa = document.getElementById("siswa");
siswa.innerHTML = "";
data.forEach(n => {
let opt = document.createElement("option");
opt.text = n;
siswa.add(opt);
});
tampilkanSoal();
});
}


function tampilkanSoal() {
let html = "";
soal.forEach((s, i) => {
html += `<p>${i+1}. ${s.tanya}</p>`;
s.opsi.forEach((o, j) => {
html += `<label><input type='radio' name='q${i}' value='${j}'> ${o}</label><br>`;
});
});
document.getElementById("soal").innerHTML = html;
}


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
.then(() => alert("Jawaban berhasil dikirim"));
}
