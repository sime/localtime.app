const DEFAULT_TIMEZONES = ['Europe/Berlin', 'Australia/Sydney', 'America/Vancouver'];
const TZ_MODEL = 'timeZones';

const times     = document.getElementById("times");
const template  = document.getElementById("city");
const tzAdder   = document.getElementById("tz-adder");

class View {

  constructor(options) {
    this.options = { ...options };
  }

  render() {
    const date = new Date();

    const options = {
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hourCycle: 'h23',
    };

    const timeZones = initTimezones();

    timeZones.forEach(timezone => {
      const clone = this.options.template.content.cloneNode(true);
      options.timeZone = timezone;
      const currentTime = new Intl.DateTimeFormat('en', options).format(date);

      const timeElement = clone.querySelector('time');
      timeElement.textContent = currentTime;
      const paragraph = clone.querySelector('p');
      paragraph.textContent = timezone;

      const input = clone.querySelector('input');
      input.value = timezone;

      const form = clone.querySelector('form');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const FD = new FormData(e.target);
        deleteTimezone(FD.get('tz'));
        this.restart();
      });

      this.options.times.appendChild(clone);
    });
  }

  restart() {
    while (this.options.times.firstChild) {
      this.options.times.removeChild(this.options.times.firstChild);
    }
    this.render();
  }
}

const UI = new View({times, template});
UI.render();

function initTimezones() {
  const store = getAllTimezones();
  if (store.length > 0) {
    return store;
  }

  writeTimezones(DEFAULT_TIMEZONES);
  return DEFAULT_TIMEZONES;
}

function getAllTimezones() {
  const result = localStorage.getItem(TZ_MODEL);
  if (result === null) {
    return [];
  }
  return JSON.parse(result);
}

function saveTimezone(tz) { // String
  const allTimezones = getAllTimezones();
  allTimezones.push(tz);
  const newTimezones = new Set(allTimezones);
  const timezoneStorage = [];
  newTimezones.forEach(newTimezone => timezoneStorage.push(newTimezone));
  writeTimezones(timezoneStorage);
}

function deleteTimezone(tz) {
  const allTimezones = getAllTimezones();
  const newTimezones = new Set(allTimezones);
  newTimezones.delete(tz);
  const timezoneStorage = [];
  newTimezones.forEach(newTimezone => timezoneStorage.push(newTimezone));
  writeTimezones(timezoneStorage);
}

function writeTimezones(tzs) { // Array. I think two lines from delete and save Timezone methods can be put here.
  localStorage.setItem(TZ_MODEL, JSON.stringify(tzs));
}

tzAdder.addEventListener("submit", (e) => {
  e.preventDefault();
  const FD = new FormData(e.target);
  saveTimezone(FD.get('tzdb'));
  UI.restart();
});


