const terminal = document.getElementById('terminal');
const prompt = 'user@arch -> ';
const startbtn = document.querySelector('.start');
const icon = document.getElementById('icon');
const music = document.getElementById('music');
const visualizer = document.getElementById('visualizer');

async function loadMusic() {
  const res = await fetch('./assets/script/data/data.json');
  const data = await res.json();
  let indexNumber = 0;

  const information = document.querySelector('.information');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  const musicName = document.querySelector('.music-name');
  let userPressStart = false;

  function updateMusicInfo() {
    const currentMusic = data[indexNumber];

    information.innerHTML = `
      <div><dt>user@ArcavaOS</dt></div>
      <div><dt>OS</dt><dd>: ArcavaOS</dd></div>
      <div><dt>Website</dt><dd>: ArcavaOS</dd></div>
      <div><dt>Package</dt><dd>: 140 (pacman)</dd></div>
      <div><dt>DE</dt><dd>: i3-WindowManager</dd></div>
      <div><dt>Shell</dt><dd>: zsh</dd></div>
      <div><dt>WM Theme</dt><dd>: revananda</dd></div>
      <div><dt>Theme</dt><dd>: Dark</dd></div>
      <div><dt>Font</dt><dd>: Fira Code</dd></div>
      <div><dt>Mood</dt><dd>: ${currentMusic.mood}</dd></div>
    `;

    musicName.textContent = currentMusic.title;
    music.src = currentMusic.source;
  }
  try {
  updateMusicInfo();

  prevBtn.addEventListener('click', () => {
    indexNumber = (indexNumber - 1 + data.length) % data.length;
    icon.classList.add('fa-play');
    updateMusicInfo();
  });

  nextBtn.addEventListener('click', () => {
    indexNumber = (indexNumber + 1) % data.length;
    icon.classList.add('fa-play');
    updateMusicInfo();
  });

  startbtn.addEventListener('click', () => {
    userPressStart = true;

    if (music.paused) {
      audioCtx.resume().then(() => {
        music.play();
        draw();
        icon.classList.remove("fa-play");
        icon.classList.add("fa-pause");
      });
    } else {
      music.pause();
      icon.classList.remove("fa-pause");
      icon.classList.add("fa-play");
    }
  });

  music.addEventListener('ended', () => {
    indexNumber = (indexNumber + 1) % data.length;
    icon.classList.remove("fa-play");
    icon.classList.add("fa-pause");
    updateMusicInfo();

    if (userPressStart) {
      music.play();
    }
  });
  } catch (err) {
    console.log(err);
  }
}

window.addEventListener('DOMContentLoaded', loadMusic);

// Terminal handling
terminal.textContent = prompt;
terminal.addEventListener('keydown', (e) => {
  const line = terminal.innerText.split('\n');
  const lastline = line[line.length - 1];
  
  if (e.key === 'Backspace' && lastline.length <= prompt.length) {
    e.preventDefault();
  }
  if (e.key === 'Enter') {
    e.preventDefault();
    const command = lastline.slice(prompt.length).trim();
    handleCommand(command);
  }
});

function handleCommand(cmd) {
  let output = '';
  const args = cmd.split(' ');
  const base = args[0];

  switch (base) {
    case 'hello':
      output = `hi`;
      break;
    case 'hi':
      output = `hello`;
      break;
    case 'echo':
      output = args.slice(1).join(' ').trim().replace(/^"|"$/g, '');
      break;
    case 'neofetch':
      output = `You're Already Doing It`;
      break;
    case 'ls':
      output = `index.html assets`;
      break;
    case 'ls assets':
      output = `font images music script style`;
      break;
    case 'pwd':
      output = `/home/user`;
      break;
    case 'whoami':
      output = `user`;
      break;
    case 'date':
      output = new Date().toString();
      break;
    case 'clear':
      terminal.textContent = prompt;
      return;
    case 'help':
      output = `Available commands:
echo - display a message
neofetch - system information
ls - list directory contents
pwd - print working directory
whoami - print current user
date - show current date/time
clear - clear terminal
help - show this help message`;
      break;
    case 'kill.revan':
      output = `you have done it`;
      break;
    case 'delete.revan':
      output = `You already doing it`;
      break;
    case 'revan':
      output = `No idea`;
      break;
    case 'ig':
      output = `@revananda2006`;
      break;
    default:
      output = `command not found: ${cmd}`;
      break;
  }
  terminal.textContent += '\n' + output + '\n' + prompt;
  terminal.scrollTop = terminal.scrollHeight;
  cursorEnd(terminal);
}

function cursorEnd(e) {
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(e);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
  e.focus();
}

// Clock
function clockRealTime() {
  const time = new Date();
  document.querySelector('.clock').textContent = time.toLocaleTimeString();
  document.querySelector('.date').textContent = `${time.getDay()}-${time.getMonth()}-${time.getFullYear()}`;
}

clockRealTime();
setInterval(clockRealTime, 1000);

// Music visualizer
const ctx = visualizer.getContext('2d');
const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 64;

const source = audioCtx.createMediaElementSource(music);
source.connect(analyser);
analyser.connect(audioCtx.destination);

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
const barWidth = (visualizer.width / bufferLength) * 1.5;

function draw() {
  requestAnimationFrame(draw);
  analyser.getByteFrequencyData(dataArray);
  ctx.fillStyle = 'rgb(36, 40, 59)';
  ctx.fillRect(0, 0, visualizer.width, visualizer.height);
  
  let x = 0;
  for (let i = 0; i < bufferLength; i++) {
    let value = dataArray[i];
    if (i < 10 || i > bufferLength - 10) {
      value *= 0.6;
    }
    const barHeight = (value / 255) * visualizer.height;
    ctx.fillStyle = 'rgb(205, 211, 245)';
    ctx.fillRect(x, visualizer.height - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }
}






