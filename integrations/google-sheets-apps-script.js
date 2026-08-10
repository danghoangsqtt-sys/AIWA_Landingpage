/* eslint-disable @typescript-eslint/no-unused-vars */

const SHEET_NAME = "Khách hàng AIWA";
const HEADERS = [
  "STT",
  "Họ và tên",
  "Số điện thoại",
  "Email",
  "Key free đang được sử dụng",
  "Thời gian bắt đầu sử dụng",
  "Đã mua gói hay chưa?",
  "Có tương tác thường xuyên không?",
  "Có vào nhóm hỗ trợ khách hàng chưa?",
];

function doGet() {
  return jsonResponse({ ok: true, service: "AIWA Google Sheets webhook" });
}

function doPost(event) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const payload = JSON.parse(event.postData.contents || "{}");
    const properties = PropertiesService.getScriptProperties();
    const expectedSecret = properties.getProperty("AIWA_WEBHOOK_SECRET");
    const sheetId = properties.getProperty("AIWA_SHEET_ID");

    if (!expectedSecret || payload.secret !== expectedSecret) {
      return jsonResponse({ ok: false, error: "Unauthorized" });
    }
    if (!sheetId) {
      return jsonResponse({ ok: false, error: "Missing AIWA_SHEET_ID" });
    }

    const spreadsheet = SpreadsheetApp.openById(sheetId);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, HEADERS.length)
        .setBackground("#092e6d")
        .setFontColor("#ffffff")
        .setFontWeight("bold")
        .setWrap(true)
        .setVerticalAlignment("middle");
      sheet.setRowHeight(1, 48);
      [60, 190, 135, 220, 180, 180, 160, 210, 230].forEach(function (width, index) {
        sheet.setColumnWidth(index + 1, width);
      });
      sheet.getRange("G2:G2000").setDataValidation(
        SpreadsheetApp.newDataValidation().requireValueInList(["Chưa mua", "Đã mua"], true).setAllowInvalid(false).build()
      );
      sheet.getRange("H2:H2000").setDataValidation(
        SpreadsheetApp.newDataValidation().requireValueInList(["Chưa xác định", "Không", "Ít", "Thường xuyên"], true).setAllowInvalid(false).build()
      );
      sheet.getRange("I2:I2000").setDataValidation(
        SpreadsheetApp.newDataValidation().requireValueInList(["Chưa tham gia", "Đã tham gia"], true).setAllowInvalid(false).build()
      );
    }

    sheet.appendRow([
      payload.stt || sheet.getLastRow(),
      safeSheetText(payload.fullName || ""),
      safeSheetText(payload.phone || ""),
      safeSheetText(payload.email || ""),
      safeSheetText(payload.freeKey || "Chờ cấp"),
      payload.trialStartedAt ? parseTimestamp(payload.trialStartedAt) : new Date(),
      safeSheetText(payload.purchaseStatus || "Chưa mua"),
      safeSheetText(payload.engagementStatus || "Chưa xác định"),
      safeSheetText(payload.supportGroupStatus || "Chưa tham gia"),
    ]);

    const row = sheet.getLastRow();
    sheet.getRange(row, 6).setNumberFormat("dd/MM/yyyy HH:mm");
    sheet.getRange(row, 1, 1, HEADERS.length).setVerticalAlignment("middle").setWrap(true);
    sheet.getRange(row, 7, 1, 3).setBackground("#fff4e8");
    SpreadsheetApp.flush();

    return jsonResponse({ ok: true, row: row });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

function safeSheetText(value) {
  const text = String(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function parseTimestamp(value) {
  const text = String(value).replace(" ", "T");
  return new Date(/[zZ]$|[+-]\d\d:\d\d$/.test(text) ? text : text + "Z");
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
