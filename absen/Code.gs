function getDataSiswa() {
  const sheet = SpreadsheetApp
    .openById(SPREADSHEET_ID)
    .getSheetByName("DATA SISWA INFORMATIKA KELAS 7"); // ⬅️ SESUAIKAN NAMA SHEET

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  // Kolom:
  // B = Nama
  // C = Jenis Kelamin
  // D = Rombel
  const values = sheet.getRange(2, 2, lastRow - 1, 3).getValues();

  return values.map(r => ({
    nama: r[0],
    jk: r[1],
    rombel: r[2]
  }));
}
