const $ = id => document.getElementById(id);
const screens = document.querySelectorAll('.screen');
const dots = document.querySelectorAll('#dots i');
const wrap = $('wrap');
const audio = $('music');
const player = $('player');
let isPlaying = false;

function go(n) {
  screens.forEach(s => s.classList.remove('active'));
  $('s' + n).classList.add('active');
  dots.forEach((d, i) => d.classList.toggle('on', i === n - 1));
  hearts(n === 5 ? 35 : 10);
  if (n === 5) confetti(60);
}

function blow() {
  const candle = $('candle');
  if (candle.classList.contains('off')) return;
  candle.classList.add('off');
  $('cake').classList.add('off');
  hearts(22);
  confetti(40);
  setTimeout(() => go(4), 1000);
}

function openGift() {
  $('gift').classList.add('open');
  hearts(30);
  setTimeout(() => go(5), 600);
}

function hearts(num) {
  const icons = ['💗', '💕', '💖', '✨', '🌸'];
  for (let i = 0; i < num; i++) {
    const x = document.createElement('div');
    x.className = 'float';
    x.textContent = icons[Math.floor(Math.random() * icons.length)];
    x.style.left = Math.random() * 95 + '%';
    x.style.bottom = '-20px';
    x.style.fontSize = 14 + Math.random() * 16 + 'px';
    x.style.animationDelay = Math.random() * 1.8 + 's';
    wrap.appendChild(x);
    setTimeout(() => x.remove(), 7000);
  }
}

function confetti(num) {
  const colors = ['#f0629a', '#a57cf0', '#8fd0f5', '#ffd76b', '#ff9fc4'];
  for (let i = 0; i < num; i++) {
    const c = document.createElement('i');
    c.className = 'confetti';
    c.style.left = Math.random() * 100 + '%';
    c.style.background = colors[i % colors.length];
    c.style.animationDuration = 2 + Math.random() * 2 + 's';
    c.style.animationDelay = Math.random() * 0.6 + 's';
    wrap.appendChild(c);
    setTimeout(() => c.remove(), 5000);
  }
}

/* ---------- musik ---------- */
const fmt = t => isFinite(t) ? Math.floor(t / 60) + ':' + String(Math.floor(t % 60)).padStart(2, '0') : '0:00';

function setPlaying(state) {
  isPlaying = state;
  player.classList.toggle('playing', state);
  $('play').textContent = state ? '❚❚ Pause' : '▶ Play';
}

function musicToggle() {
  if (isPlaying) { audio.pause(); setPlaying(false); return; }
  audio.play()
    .then(() => { setPlaying(true); $('status').textContent = '💕'; })
    .catch(() => { $('status').textContent = '⚠️ File lagu.mp3 tidak ditemukan'; });
}

audio.addEventListener('loadedmetadata', () => $('dur').textContent = fmt(audio.duration));
audio.addEventListener('timeupdate', () => {
  if (audio.duration) $('bar').style.width = audio.currentTime / audio.duration * 100 + '%';
  $('cur').textContent = fmt(audio.currentTime);
});
audio.addEventListener('error', () => { $('status').textContent = '⚠️ File lagu.mp3 tidak ditemukan'; });
$('seek').addEventListener('click', e => {
  if (!audio.duration) return;
  const r = e.currentTarget.getBoundingClientRect();
  audio.currentTime = (e.clientX - r.left) / r.width * audio.duration;
});

/* ---------- event ---------- */
document.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => go(+b.dataset.go)));
$('candle').addEventListener('click', blow);
$('blowBtn').addEventListener('click', blow);
$('gift').addEventListener('click', openGift);
$('giftBtn').addEventListener('click', openGift);
$('play').addEventListener('click', musicToggle);
