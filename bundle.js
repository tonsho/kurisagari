const state = {
  num: null,
  startTime: null,
  progress: 0,
  statements: null,
  endTime: null,
};

const STATEMENTS_1 = [
  "10 - 8",
  "10 - 5",
  "10 - 7",
  "10 - 2",
  "10 - 4",
  "10 - 1",
  "10 - 3",
  "10 - 9",
  "10 - 0",
  "10 - 6",
  "10 - 3",
  "10 - 2",
  "10 - 6",
  "10 - 1",
  "10 - 9",
  "10 - 5",
  "10 - 8",
  "10 - 10",
  "10 - 7",
  "10 - 4",
];


const STATEMENTS_2 = [
  "13 - 8",
  "12 - 5",
  "15 - 7",
  "11 - 2",
  "12 - 4",
  "16 - 9",
  "18 - 9",
  "17 - 5",
  "11 - 5",
  "13 - 6",
  "11 - 3",
  "16 - 7",
  "14 - 6",
  "11 - 7",
  "15 - 9",
  "12 - 6",
  "15 - 8",
  "17 - 9",
  "16 - 8",
  "11 - 9",
  "13 - 4",
  "12 - 7",
  "14 - 8",
  "13 - 5",
  "12 - 9",
  "13 - 7",
  "14 - 9",
  "11 - 4",
  "15 - 6",
  "11 - 8",
];

window.onload = function () {
  initialize();
  $("#btn-start1").on('click', start1);
  $("#btn-start2").on('click', start2);
  $("#btn-next").on('click', nextStatement);
  $("#btn-history").on('click', showHistory);
  $("#btn-init").on('click', initialize);
  $("#btn-save").on('click', saveResult);
  $("#btn-delete-all").on('click', deleteAll);
}

function initialize() {
  display("start");
}

function start1() {
  startCommon("No. 1", STATEMENTS_1);
}

function start2() {
  startCommon("No. 2", STATEMENTS_2);
}


function startCommon(num, statements) {
  state.num = num;
  state.startTime = new Date();
  state.statements = shuffle(statements);
  state.progress = 0;
  showCountdown();
}

function showCountdown() {
  display("countdown");
  $("#countdown-sec").text("3");
  setTimeout(() => {
    $("#countdown-sec").text("2");
    setTimeout(() => {
      $("#countdown-sec").text("1");
      setTimeout(() => {
        display("progress", 100);
        nextStatement();
      }, 1000);
    }, 1000);
  }, 1000);
  nextStatement();
}

function display(block, speed) {
  if (speed === undefined) {
    speed = 300;
  }
  const contents = [
    "start",
    "countdown",
    "progress",
    "result",
    "history",
  ];
  contents.forEach(c => {
    $(`#${c}`).hide();
  });
  $(`#${block}`).show(speed);
  document.getElementById("goto-init").style.display = "start" == block ? "none" : "block";
  document.getElementById("goto-history").style.display = "history" == block ? "none" : "block";
}

function nextStatement() {
  if (state.progress == state.statements.length) {
    showResult();
    return;
  }

  $("#statement").text(state.statements[state.progress]);

  state.progress += 1;
  const percentage = Math.floor(100.0 * state.progress / state.statements.length);
  $("#progress-bar").width(`${percentage}%`);
}

function showResult() {
  state.endTime = new Date();
  display("result");
  $("#card-title").text(state.num);
  $("#elapsed").text(formatElapsedTime(state.endTime - state.startTime));
}

function showHistory(speed) {
  display("history", speed);
  const history1Tag = $("#history1");
  history1Tag.empty();
  const history2Tag = $("#history2");
  history2Tag.empty();

  const history1 = JSON.parse(localStorage.getItem("No. 1") || "[]");
  showHistoryItems(history1Tag, history1);
  const history2 = JSON.parse(localStorage.getItem("No. 2") || "[]");
  showHistoryItems(history2Tag, history2);
}

function formatElapsedTime(elapsedMs) {
  const elapsedSec = Math.floor(elapsedMs / 1000);
  const min = Math.floor(elapsedSec / 60);
  const sec = (elapsedMs - min * 60 * 1000) / 1000;
  return `${min}:${zeroPadding(sec.toFixed(3), 6)}`;
}

function zeroPadding(num, length) {
  return ('0000000000' + num).slice(-length);
}

function shuffle(arrayOrg) {
  const array = arrayOrg.slice();
  let n = array.length,
    t, i;

  while (n) {
    i = Math.floor(Math.random() * n--);
    t = array[n];
    array[n] = array[i];
    array[i] = t;
  }

  return array;
}

function showHistoryItems(tag, historyItems) {
  let minElapsedMs = 0;
  if (historyItems.length >= 2) {
    minElapsedMs = historyItems.reduce((accumulator, currentValue) => {
      return Math.min(accumulator, currentValue.elapsedMs)
    }, Number.MAX_VALUE);
  }

  historyItems.forEach(h => {
    tag.append(
      `<div class="col s7 ${h.elapsedMs == minElapsedMs ? "green lighten-3" : ""}" style="margin-left: 10pt; white-space: nowrap">${h.date}</div>
      <div class="col s3 ${h.elapsedMs == minElapsedMs ? "green lighten-3 left" : ""}" style="white-space: nowrap">${formatElapsedTime(h.elapsedMs)}</div>
      <div class="col s1 delete-this" data-date="${h.date}"><i class="material-icons">clear</i></div>`
    );
  });
  $(".delete-this", tag).on("click", function () {
    deleteHistoryItem($(this).data("date"));
    showHistory(0);
  });
}

function saveResult() {
  const result = JSON.parse(localStorage.getItem(state.num) || "[]");
  result.unshift({
    date: state.startTime.toLocaleString(),
    elapsedMs: state.endTime - state.startTime
  });
  localStorage.setItem(state.num, JSON.stringify(result));
  showHistory();
}

function deleteHistoryItem(date) {
  const keys = ["No. 1", "No. 2"];
  keys.forEach(k => {
    const historyItems = JSON.parse(localStorage.getItem(k) || "[]");
    for (let i = 0; i < historyItems.length; i++) {
      if (historyItems[i].date == date) {
        console.log(`Found ${date} in ${k} at ${i}.`);
        historyItems.splice(i, 1);
        localStorage.setItem(k, JSON.stringify(historyItems));
        return;
      }
    }
  });
}

function deleteAll() {
  localStorage.removeItem("No. 1");
  localStorage.removeItem("No. 2");
  showHistory(0);
}