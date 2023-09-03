const ssId = "paste the reference worksheet id here";
const favicon = "img/favicon.ico";
const ss = SpreadsheetApp.openById(ssId);

const doGet = (e) => {
  return html("index", "Checklist de Visitas", "Magê");
};
