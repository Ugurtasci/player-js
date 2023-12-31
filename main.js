const prevButton = document.getElementById("prev")
//prevButton.style.backgroundColor = "red"

const nextButton = document.getElementById("next")
const repeatButton = document.getElementById("repeat")
const shuffleButton = document.getElementById("shuffle")
const audio = document.getElementById("audio")
const songImage = document.getElementById("song-image")
const songName = document.getElementById("song-name")
const songArtist = document.getElementById("song-artist")
const pauseButton = document.getElementById("pause")
const playButton = document.getElementById("play")
const playListButton = document.getElementById("playlist")

const maxDuration = document.getElementById("max-duration")
const currentTimeRef = document.getElementById("current-time")

const progressBar = document.getElementById("progress-bar")
const playListContainer = document.getElementById("playlist-container")
const closeButton = document.getElementById("close-button")
const playListSongs = document.getElementById("playlist-songs")

const currentProgress = document.getElementById("current-progress")

// index şarkı için
let index

//döngü
let loop = true

//karıştırıcı açık mı?
let isShuffleActive = false

//şarkı listesi
const songsList = [
  {
    name: "Kafama Sıkar Giderim",
    link: "assets/giderim.mp3",
    artist: "Ahmet Kaya",
    image: "assets/ahmetkaya.jpg",
  },
  {
    name: "Gibi Gibi",
    link: "assets/gibigibi.mp3",
    artist: "Barış Manço",
    image: "assets/barismanco.jpg"
  },
  {
    name: "Fesubhanallah",
    link: "assets/fesubhanallah.mp3",
    artist: "Erkin Koray",
    image: "assets/erkinkoray.jpeg"
  },
  {
    name: "Benden Selam Olsun Bolu Beyine",
    link: "assets/bolubeyi.mp3",
    artist: "Hüseyin Ay",
    image: "assets/huseyinay.jpg"
  },
  {
    name: "Keçe Cane",
    link: "assets/kececane.mp3",
    artist: "Rewşan",
    image: "assets/rewsan.jpg"
  },
  {
    name: "Drama Köprüsü",
    link: "assets/drama-koprusu.mp3",
    artist: "Suavi",
    image: "assets/suavi.jpeg"
  }
]

//zaman formatı ayarlama
const timeFormatter = (timeInput) => {
  let minute = Math.floor(timeInput / 60)
  minute = minute < 10 ? "0" + minute : minute
  let second = Math.floor(timeInput % 60)
  second = second < 10 ? "0" + second : second
  return `${minute}:${second}`
}

//şarkıyı çalma
const playAudio = () => {
  console.log("playAudio")
  audio.play()
  pauseButton.classList.remove("hide")
  playButton.classList.add("hide")
}

// şarkı atama
const setSong = (arrayIndex) => {
  if (loop == true && isShuffleActive == true) {
    arrayIndex = Math.floor(Math.random() * 100) % 5
  }

  let { name, link, artist, image } = songsList[arrayIndex]

  audio.src = link
  songName.innerHTML = name
  songArtist.innerHTML = artist
  songImage.src = image

  audio.onloadedmetadata = () => {
    maxDuration.innerText = timeFormatter(audio.duration)
  }
  playListContainer.classList.add("hide")
  playAudio()
}

//! sıradakini çal

//next Buttonu
const nextSong = () => {
  if (loop) {
    if (index == (songsList.length - 1)) {
      index = 0;
    } else {
      index += 1
    }
    setSong(index)
  } else {
    let randIndex = Math.floor(Math.random() * songsList.length)
    setSong(randIndex)
  }
}

playListButton.addEventListener("click", () => {
  playListContainer.classList.remove("hide")
})

closeButton.addEventListener("click", () => {
  playListContainer.classList.add("hide")
})

//pause Buttonu
const pauseAudio = () => {
  audio.pause()
  pauseButton.classList.add("hide")
  playButton.classList.remove("hide")
};

setInterval(() => {
  currentTimeRef.innerHTML = timeFormatter(audio.currentTime)
  currentProgress.style.width = (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%"
  //
}, 1000);

progressBar.addEventListener("click", (event) => {
  let coordStart = progressBar.getBoundingClientRect().left

  let coordEnd = event.clientX
  let progress = (coordEnd - coordStart) / progressBar.offsetWidth

  currentProgress.style.width = progressBar * 100 + "%"

  audio.currentTime = progress * audio.duration
  audio.play()
  pauseButton.classList.remove("hide")
  playButton.classList.add("hide")
})


//prev butonu
const previousSong = () => {
  console.log(index)
  if (index > 0) {
    index -= 1
  } else {
    index = songsList.length - 1
  }
  setSong(index)
}
//repeat butonu
repeatButton.addEventListener("click", () => {
  if (repeatButton.classList.contains("active")) {
    repeatButton.classList.remove("active")
    audio.loop = false;
    console.log("tekrar kapatildi")
  } else {
    repeatButton.classList.add("active")
    audio.loop = true;
    console.log("tekrar acildi")
  }
})

//shuffle butonu
shuffleButton.addEventListener("click", () => {
  if (shuffleButton.classList.contains("active")) {
    isShuffleActive = false;
    shuffleButton.classList.remove("active")
    audio.loop = true;
    //index = Math.floor(Math.random() * 100) % 5
    console.log("karistirici kapatildi")
  } else {
    isShuffleActive = true
    shuffleButton.classList.add("active")
    audio.loop = false
    console.log("karistirici acildi")
  }
})

const initializePlaylist = () => {
  for (let i in songsList) {
    playListSongs.innerHTML += `<li class="playlistSong"
        onclick="setSong(${i})">
        <div class="playlist-image-container">
           <img src="${songsList[i].image}"/>
        </div>
        <div class="playlist-song-details">
        <span id="playlist-song-name">
        ${songsList[i].name}
        </span>
        <span id="playlist-song-artist-album">
           ${songsList[i].artist}
        </span>
        </div>
        </li>`
  }
}

//tıklama yakalama/yapma
nextButton.addEventListener("click", nextSong)
pauseButton.addEventListener("click", pauseAudio)
playButton.addEventListener("click", playAudio)
prevButton.addEventListener("click", previousSong)

// şarkı bittişini yakala
audio.onended = () => {
  nextSong()
}

audio.addEventListener('timeupdate', () => {
    currentTimeRef.innerText = timeFormatter(audio.currentTime)
})

//ekran ilk yüklenildiğinde
window.onload = () => {
  index = 0
  setSong(index)
  // durdur ve şark listei oluştur
  pauseAudio()
  initializePlaylist()
}
