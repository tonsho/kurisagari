const state = {
  num: null,
  startTime: null,
  progress: 0,
  statements: null,
  endTime: null,
};

const TITLES = ["１の段", "２の段", "３の段", "４の段", "５の段", "６の段", "７の段", "８の段", "９の段", "ランダム"];
const STATEMENTS = [];
for (let i = 1; i <= 9; i++) {
  const s = [];
  for (let j = 1; j <= 9; j++) {
    s.push(`${i} x ${j}`);
    s.push(`${i} x ${j}`);
  }
  STATEMENTS.push(s)
}

class Storage {
  constructor(name) {
      this.name = name;
  }

  get(title) {
      return JSON.parse(localStorage.getItem(this.key(title)) || "[]");
  }

  set(title, obj) {
    localStorage.setItem(this.key(title), JSON.stringify(obj));
  }

  remove(title) {
    localStorage.removeItem(this.key(title));
  }

  key(title) {
    return `${this.name}_${title}`;
  }
}

const storage = new Storage(location.pathname);

window.onload = function () {
  initialize();
  $("#btn-start1").on('click', start1);
  $("#btn-start2").on('click', start2);
  $("#btn-start3").on('click', start3);
  $("#btn-start4").on('click', start4);
  $("#btn-start5").on('click', start5);
  $("#btn-start6").on('click', start6);
  $("#btn-start7").on('click', start7);
  $("#btn-start8").on('click', start8);
  $("#btn-start9").on('click', start9);
  $("#btn-start-r").on('click', startR);
  $("#btn-next").on('click', nextStatement);
  $("#btn-back").on('click', backStatement);
  $("#btn-back-to-progress").on('click', backToProgress);
  $("#btn-history").on('click', showHistory);
  $("#btn-init").on('click', initialize);
  $("#btn-save").on('click', saveResult);
  $(".btn-delete-all").on('click', deleteAll);
}

function initialize() {
  display("start");
}

function start1() {
  startCommon(TITLES[0], STATEMENTS[0]);
}

function start2() {
  startCommon(TITLES[1], STATEMENTS[1]);
}

function start3() {
  startCommon(TITLES[2], STATEMENTS[2]);
}

function start4() {
  startCommon(TITLES[3], STATEMENTS[3]);
}

function start5() {
  startCommon(TITLES[4], STATEMENTS[4]);
}

function start6() {
  startCommon(TITLES[5], STATEMENTS[5]);
}

function start7() {
  startCommon(TITLES[6], STATEMENTS[6]);
}

function start8() {
  startCommon(TITLES[7], STATEMENTS[7]);
}

function start9() {
  startCommon(TITLES[8], STATEMENTS[8]);
}

function startR() {
  const s = [];
  for (let i = 0; i < 20; i++) {
    s.push(`${getRandomInt(9)} x ${getRandomInt(9)}`);
  }
  startCommon(TITLES[9], s);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * (max - 1)) + 1;
}

function startCommon(num, statements) {
  state.num = num;
  do {
    state.statements = shuffle(statements);
  } while (checkContinuity(state.statements))
  state.progress = 0;
  showCountdown();
}

function showCountdown() {
  $("#progress-bar").width("0%");
  display("countdown");
  $("#countdown-sec").text("3");
  setTimeout(() => {
    $("#countdown-sec").text("2");
    setTimeout(() => {
      $("#countdown-sec").text("1");
      setTimeout(() => {
        display("progress", 100);
        state.startTime = new Date();
        nextStatement();
      }, 1000);
    }, 1000);
  }, 1000 + 500);
}

function display(block, speed) {
  if (speed === undefined) {
    speed = 500;
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
  $(`#${block}`).show('fade', '', speed);
  document.getElementById("goto-init").style.display = "start" == block ? "none" : "block";
  document.getElementById("goto-history").style.display = "history" == block ? "none" : "block";
}

function nextStatement() {
  if (state.progress == state.statements.length) {
    showResult();
    return;
  }
  document.getElementById("btn-back").style.display = state.progress > 0 ? "block" : "none";

  $("#statement").text(state.statements[state.progress]);

  state.progress += 1;
  const percentage = Math.floor(100.0 * state.progress / state.statements.length);
  $("#progress-bar").width(`${percentage}%`);
}

function backStatement() {
  state.progress -= 2;
  nextStatement();
}

function showResult() {
  state.endTime = new Date();
  display("result");
  $("#card-title").text(state.num);
  $("#elapsed").text(formatElapsedTime(state.endTime - state.startTime));
}

function backToProgress() {
  display("progress", 0);
  state.progress = state.statements.length - 1;
  nextStatement();
}

function showHistory(speed) {
  display("history", speed);
  for (let i = 1; i <= 10; i++) {
    const historyTag = $(`#history${i}`);
    historyTag.empty();
    const history = storage.get(TITLES[i - 1]);
    showHistoryItems(historyTag, history);
  }
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

function formatDate (date, format) {
  format = format.replace(/yyyy/g, date.getFullYear());
  format = format.replace(/MM/g, (' ' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/dd/g, (' ' + date.getDate()).slice(-2));
  format = format.replace(/HH/g, (' ' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
  format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3));
  return format.replace(/\s/g, '&nbsp;');
};

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

function checkContinuity(array) {
  for (let i = 1; i < array.length; i++) {
    if (array[i] == array[i - 1]) {
      return true;
    }
  }
  return false;
}

function showHistoryItems(tag, historyItems) {
  let minElapsedMs = 0;
  if (historyItems.length >= 2) {
    minElapsedMs = historyItems.reduce((accumulator, currentValue) => {
      return Math.min(accumulator, currentValue.elapsedMs)
    }, Number.MAX_VALUE);
  }

  historyItems.forEach(h => {
    const date = new Date(Date.parse(h.date))
    tag.append(
      `<div class="col s5 offset-s1 ${h.elapsedMs == minElapsedMs ? "green lighten-3" : ""}" style="white-space: nowrap">${formatDate(date, 'MM/dd HH:mm')}</div>
      <div class="col s4 ${h.elapsedMs == minElapsedMs ? "green lighten-3 left" : ""}" style="white-space: nowrap">${formatElapsedTime(h.elapsedMs)}</div>
      <div class="col s2 delete-this" data-date="${h.date}"><i class="material-icons" style="color: grey; font-size: 1em">clear</i></div>`
    );
  });
  $(".delete-this", tag).on("click", function () {
    if (confirm(`${$(this).data("date")} の記録を削除しますか？`)) {
      deleteHistoryItem($(this).data("date"));
      showHistory(0);
    }
  });
}

function saveResult() {
  if (confirm(`${state.num} の記録 ${formatElapsedTime(state.endTime - state.startTime)} を保存しますか？`)) {
    const result = storage.get(state.num);
    result.unshift({
      date: state.startTime.toLocaleString(),
      elapsedMs: state.endTime - state.startTime
    });
    storage.set(state.num, result);
    showHistory();
  }
}

function deleteHistoryItem(date) {
  const keys = TITLES;
  keys.forEach(k => {
    const historyItems = storage.get(k);
    for (let i = 0; i < historyItems.length; i++) {
      if (historyItems[i].date == date) {
        console.log(`Found ${date} in ${k} at ${i}.`);
        historyItems.splice(i, 1);
        storage.set(k, historyItems);
        return;
      }
    }
  });
}

function deleteAll() {
  const num = $(this).data("num");
  if (confirm(`${num}の記録を全部消していいですか？`)) {
    storage.remove(num);
    showHistory(0);
  }
}
