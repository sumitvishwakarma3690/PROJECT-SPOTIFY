console.log("Let's write some javascript");

// This function return all the songs from songs directory
let currentSong = new Audio();
let songUL;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
  let a = await fetch("http://127.0.0.1:3000/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith("mp3")) {
      songs.push(element.href.split("/songs/")[1]); // ye jo hai /songs ke baad ka jo bhi hai wo lega
    }
  }
  return songs;
}

// stops and play the music
const playMusic = (track, pause = false) => {
  currentSong.src = "/songs/" + track;
  if (!pause) {
    currentSong.play();
    play.src = "img/pause.svg";
  }

  document.querySelector(".songInfo").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
};

async function main() {
  // Get the list of all the songs
  let songs = await getSongs();
  playMusic(songs[0], true);
  console.log(songs);

  // Show all the songs in the playlist
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
                            <img class="invert" src="/img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div> 
                                <div>Sumit</div>
                            </div>
                            <div class="playnow">
                               <span>Play Now</span> 
                                <img class="invert" src="img/play-circle.svg" alt="">
                            </div></li>`;
    // ye line jo hai songs ko inner HTML me dalega aur usko sahi format me dikhane ke liye list aur replaceAll the use hua hai
  }

  // Attach an event listener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  // Attack an event listener to play, next and previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/play.svg";
    }
  });

  // Listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )}/${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration) * 100 + "%";
  });

  // add an event listener to seekbar 
  document.querySelector(".seekbar").addEventListener("click", e=>{
    let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100 ;
    document.querySelector(".circle").style.left = percent + "%"
    currentSong.currentTime = (currentSong.duration * percent)/100
  })

  // Add event listener for hamburger 
  document.querySelector(".hamburger").addEventListener("click", ()=> {
    document.querySelector(".left").style.left = 0
  })

  // Add event listener for close button 
  document.querySelector(".close").addEventListener("click", ()=>{
    document.querySelector(".left").style.left = "-120%"
  })

  // add event listeners to previous  
  previous.addEventListener("click", ()=>{
    console.log("Previous clikced")
    console.log(currentSong)
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index-1) >= 0) {
      playMusic(songs[index-1])
    }
  })

  // add event listeners to next
  next.addEventListener("click", ()=>{
    currentSong.pause()
    console.log("Next clikced")
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index+1) < songs.length) {
      playMusic(songs[index+1])
    }

  })

  // add an event to volume
  document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
    console.log("Setting volume to", e.target.value, "/ 100")
    currentSong.volume = parseInt(e.target.value)/100
  })
}
main();
