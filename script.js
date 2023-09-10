const timeMachine = {
  id: 1,
  songName: "Time Machine",
  bandName: "The Winery Dogs",
  image: "001-twd-the-winery-dogs.jpg",
  file: "twd-timemachine.mp3",
  liked: false,
};
const witchesDance = {
  id: 2,
  songName: "The Witches' Dance",
  bandName: "At Vance",
  image: "002-at-vance-only-human.jpg",
  file: "at-vance-witchers-dance.mp3",
  liked: true,
};
const heroes = {
  id: 3,
  songName: "Heroes",
  bandName: "Masterplan",
  image: "003-masterplan-heroes.jpg",
  file: "masterplan-heroes.mp3",
  liked: false,
};

const originalPlaylist = JSON.parse(localStorage.getItem("playlist")) ?? [
  timeMachine,
  witchesDance,
  heroes,
];
let sortedPlaylist = [...originalPlaylist];
let index = 0;
const songName = document.getElementById("song-name");
const bandName = document.getElementById("band-name");
const song = document.getElementById("audio");
const cover = document.getElementById("cover");
const play = document.getElementById("play");
const previous = document.getElementById("previous");
const next = document.getElementById("next");
const currentProgress = document.getElementById("current-progress");
const progressContainer = document.getElementById("progress-container");
const shuffleButton = document.getElementById("shuffle");
const repeatButton = document.getElementById("repeat");
const songTime = document.getElementById("song-time");
const totalTime = document.getElementById("total-time");
const likeButton = document.getElementById("like");

let isPlaying = false;
let isShuffled = false;
let repeatOn = false;

function playSong() {
  play.querySelector(".bi").classList.remove("bi-play-circle-fill");
  play.querySelector(".bi").classList.add("bi-pause-circle-fill");
  song.play();
  isPlaying = true;
}

function pauseSong() {
  play.querySelector(".bi").classList.add("bi-play-circle-fill");
  play.querySelector(".bi").classList.remove("bi-pause-circle-fill");
  song.pause();
  isPlaying = false;
}

function playPauseDecider() {
  if (isPlaying === true) {
    pauseSong();
  } else {
    playSong();
  }
}

function initializeSong() {
  cover.src = `album_covers/${sortedPlaylist[index].image}`;
  song.src = `music/${sortedPlaylist[index].file}`;
  songName.innerText = sortedPlaylist[index].songName;
  bandName.innerText = sortedPlaylist[index].bandName;
  likeButtonRender();
}

function previousSong() {
  if (index === 0) {
    index = sortedPlaylist.length - 1;
  } else {
    index = index - 1;
  }
  initializeSong();
  playSong();
}

function nextSong() {
  if (index == sortedPlaylist.length - 1) {
    index = 0;
  } else {
    index = index + 1;
  }
  initializeSong();
  playSong();
}

function updateProgress() {
  const barWitdh = (song.currentTime / song.duration) * 100;
  currentProgress.style.setProperty("--progress", `${barWitdh}%`);
  songTime.innerText = toHHMMSS(song.currentTime);
}
function jumpTo(event) {
  const width = progressContainer.clientWidth;
  const clickPosition = event.offsetX;
  const jumpToTime = (clickPosition / width) * song.duration;
  song.currentTime = jumpToTime;
}

function shuffleButtonClicked() {
  if (isShuffled === false) {
    isShuffled = true;
    shuffleArray(sortedPlaylist);
    shuffleButton.classList.add("button-active");
  } else {
    isShuffled = false;
    sortedPlaylist = [...originalPlaylist];
    shuffleButton.classList.remove("button-active");
  }
}

function shuffleArray(preShuffleArray) {
  const size = preShuffleArray.length;
  let currentIndex = size - 1;

  while (currentIndex > 0) {
    let randomIndex = Math.floor(Math.random() * size);
    let aux = preShuffleArray[currentIndex];
    preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
    preShuffleArray[randomIndex] = aux;
    currentIndex--;
  }
}

function repeatButtonClicked() {
  if (repeatOn === false) {
    repeatOn = true;

    repeatButton.classList.add("button-active");
  } else {
    repeatOn = false;

    repeatButton.classList.remove("button-active");
  }
}

function nextOrRepeat() {
  if (repeatOn === false) {
    nextSong();
  } else {
    playSong();
  }
}

function toHHMMSS(originalNumber) {
  let hours = Math.floor(originalNumber / 3600);
  let min = Math.floor((originalNumber - hours * 3600) / 60);
  let sec = Math.floor(originalNumber - hours * 3600 - min * 60);

  let output = "";
  if (hours > 0) {
    output += `${hours.toString().padStart(2, "0")}:`;
  }

  output += `${min.toString().padStart(2, "0")}:${sec
    .toString()
    .padStart(2, "0")}`;

  return output;
}

function updateTotalTime() {
  totalTime.innerText = toHHMMSS(song.duration);
}

function likeButtonRender() {
  if (sortedPlaylist[index].liked === true) {
    likeButton.querySelector(".bi").classList.remove("bi-heart");
    likeButton.querySelector(".bi").classList.add("bi-heart-fill");
    likeButton.classList.add("button-active");
  } else {
    likeButton.querySelector(".bi").classList.add("bi-heart");
    likeButton.querySelector(".bi").classList.remove("bi-heart-fill");
    likeButton.classList.remove("button-active");
  }
}

function likeButtonClicked() {
  if (sortedPlaylist[index].liked === false) {
    sortedPlaylist[index].liked = true;
  } else {
    sortedPlaylist[index].liked = false;
  }
  likeButtonRender();
  localStorage.setItem("playlist", JSON.stringify(originalPlaylist));
}

document.addEventListener("keydown", function (event) {
  if (event.key === " ") {
    playPauseDecider();
  } else if (event.key === "ArrowRight") {
    nextSong();
  } else if (event.key === "ArrowLeft") {
    previousSong();
  }
});

play.addEventListener("click", playPauseDecider);
previous.addEventListener("click", previousSong);
next.addEventListener("click", nextSong);
song.addEventListener("timeupdate", updateProgress);
song.addEventListener("ended", nextOrRepeat);
song.addEventListener("loadedmetadata", updateTotalTime);
progressContainer.addEventListener("click", jumpTo);
shuffleButton.addEventListener("click", shuffleButtonClicked);
repeatButton.addEventListener("click", repeatButtonClicked);
likeButton.addEventListener("click", likeButtonClicked);

initializeSong();
