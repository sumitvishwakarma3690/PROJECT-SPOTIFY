console.log("Let's write some javascript");

// This function return all the songs from songs directory
let currentSong = new Audio();

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
const playMusic = (track)=>{
  currentSong.src = "/songs/" + track
  currentSong.play();
  play.src = "img/pause.svg"
  

}

async function main() {

  // Get the list of all the songs
  let songs = await getSongs();
  console.log(songs);

  // Show all the songs in the playlist 
  let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
  for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `<li>
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
  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click", element=>{
      console.log(e.querySelector(".info").firstElementChild.innerHTML)
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
  })

  // Attack an event listener to play, next and previous 
  play.addEventListener("click", ()=>{
    if(currentSong.paused) {
      currentSong.play()
      play.src = "img/pause.svg"
    }
    else{
      currentSong.pause()
      play.src = "img/play.svg"
    }
  })
}
main();
