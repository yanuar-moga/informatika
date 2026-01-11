const SPREADSHEET_ID = "1rQcTtSG2Q_PX_CEx_NC2Cs5eb8CXxXBEsxqiVSNze2Q";

function doGet() {
  return HtmlService
    .createTemplateFromFile("index")
    .evaluate()
    .setTitle("Absensi Siswa")
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
}

/* =========================
   DATA SISWA
========================= */
function getDataSiswa() {
  const sheet = SpreadsheetApp
    .openById(SPREADSHEET_ID)
    .getSheetByName("DATA");

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const values = sheet.getRange(2, 2, lastRow - 1, 3).getValues();

  return values.map(r => ({
    nama: r[0],
    jk: r[1],
    kelas: r[2]
  }));
}

/* =========================
   SIMPAN ABSENSI
========================= */
function submitAbsensi(data) {
  const { nama, jk, kelas, status } = data;

  if (!nama || !jk || !kelas || !status) {
    return { status: "error", message: "Data tidak lengkap" };
  }

  const sheet = SpreadsheetApp
    .openById(SPREADSHEET_ID)
    .getSheetByName("ABSENSI");

  const now = new Date();
  const todayKey = Utilities.formatDate(now, "Asia/Jakarta", "yyyyMMdd");

  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    const tgl = rows[i][0];
    const nm  = rows[i][1];

    if (!(tgl instanceof Date)) continue;

    const key = Utilities.formatDate(tgl, "Asia/Jakarta", "yyyyMMdd");
    if (nm === nama && key === todayKey) {
      return { status: "duplicate" };
    }
  }

  sheet.appendRow([now, nama, jk, kelas, status]);

  return { status: "success" };
}
