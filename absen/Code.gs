const SPREADSHEET_ID = "1rQcTtSG2Q_PX_CEx_NC2Cs5eb8CXxXBEsxqiVSNze2Q";

/* =========================
   LOAD WEB APP
========================= */
function doGet() {
  return HtmlService
    .createTemplateFromFile("index")
    .evaluate()
    .setTitle("Absensi Siswa")
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
}

/* =========================
   INCLUDE FILE HTML
========================= */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/* =========================
   AMBIL DATA SISWA
   Sheet: DATA SISWA INFORMATIKA KELAS 7
   B = Nama
   C = Jenis Kelamin
   D = Rombel
========================= */
function getDataSiswa() {
  const sheet = SpreadsheetApp
    .openById(SPREADSHEET_ID)
    .getSheetByName("DATA SISWA INFORMATIKA KELAS 7");

  if (!sheet) {
    throw new Error("Sheet DATA SISWA INFORMATIKA KELAS 7 tidak ditemukan");
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const values = sheet.getRange(2, 2, lastRow - 1, 3).getValues();

  return values
    .filter(r => r[0] && r[2]) // pastikan Nama & Rombel ada
    .map(r => ({
      nama: r[0],
      jk: r[1],
      rombel: r[2]
    }));
}

/* =========================
   SIMPAN ABSENSI
========================= */
function submitAbsensi(data) {
  const nama   = (data.nama   || "").toString().trim();
  const jk     = (data.jk     || "").toString().trim();
  const rombel = (data.rombel || "").toString().trim();
  const status = (data.status || "").toString().trim();

  if (!nama || !jk || !rombel || !status) {
    return {
      status: "error",
      message: "Data tidak lengkap"
    };
  }

  const sheet = SpreadsheetApp
    .openById(SPREADSHEET_ID)
    .getSheetByName("ABSENSI");

  if (!sheet) {
    throw new Error("Sheet ABSENSI tidak ditemukan");
  }

  const now = new Date();
  const todayKey = Utilities.formatDate(
    now,
    "Asia/Jakarta",
    "yyyyMMdd"
  );

  const dataAbsensi = sheet.getDataRange().getValues();

  // 🔒 CEK DUPLIKAT (Nama + Tanggal)
  for (let i = 1; i < dataAbsensi.length; i++) {
    const tglSheet  = dataAbsensi[i][0];
    const namaSheet = dataAbsensi[i][1];

    if (!(tglSheet instanceof Date)) continue;

    const tglKey = Utilities.formatDate(
      tglSheet,
      "Asia/Jakarta",
      "yyyyMMdd"
    );

    if (namaSheet === nama && tglKey === todayKey) {
      return { status: "duplicate" };
    }
  }

  // ✅ SIMPAN
  sheet.appendRow([
    now,     // A Tanggal
    nama,    // B Nama
    jk,      // C Jenis Kelamin
    rombel,  // D Rombel
    status   // E Status
  ]);

  return { status: "success" };
}
