console.log("Let's write some javascript");

// This function return all the songs from songs directory
let currentSong = new Audio();
let songs;
let currFolder;

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

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith("mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]); // ye jo hai /songs ke baad ka jo bhi hai wo lega
    }
  }

   // Show all the songs in the playlist
  let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
  songUL.innerHTML = ""
  for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML +`<li><img class="invert" src="/img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div> 
                                <div>Sumit</div>
                            </div>
                            <div class="playnow">
                               <span>Play Now</span> 
                                <img class="invert" src="img/play.svg" alt="">
                            </div></li>`;
    // ye line jo hai songs ko inner HTML me dalega aur usko sahi format me dikhane ke liye list aur replaceAll the use hua hai
  }

  // Attach an event listener to each song
  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  return songs

}

// stops and play the music
const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "img/pause.svg";
  }

  document.querySelector(".songInfo").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML = "00:00 / 00:00";


};

async function displayAlbums() {
  let a = await fetch(`/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
 let anchers =  div.getElementsByTagName("a")
 let cardContainer = document.querySelector(".cardContainer")
 let array = Array.from(anchers)
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    
  if(e.href.includes("/songs") && !e.href.includes(".htaccess")) {
    let folder = e.href.split("/").slice(-2)[0]
    //Get the meta data of the folder
    let a = await fetch(`/songs/${folder}/info.json`);
    let response = await a.json();
    console.log(response)
    cardContainer.innerHTML = cardContainer.innerHTML + `
     <div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg class="play-icon" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="happyhits">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
  }
 }

// load the playlist whenever the card is clicked 
  Array.from(document.getElementsByClassName("card")).forEach(e=>{ 
    e.addEventListener("click", async item=>{
      console.log(item, item.currentTarget.dataset)
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder})`)
      playMusic(songs[0])
    })
  })
  
}

async function main() {
  // Get the list of all the songs
   await getSongs("songs/ncs");
  playMusic(songs[0], true);

 //Display all the albums on the page
 // writing a function to display albums
  displayAlbums() 


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
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
    currentSong.volume = parseInt(e.target.value)/100
    if( currentSong.volume > 0) {
      document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
    }
  })

  // add event listener to mute the track
  document.querySelector(".volume>img").addEventListener("click", (e)=>{
    console.log(e.target)
    if(e.target.src.includes("volume.svg")){
      e.target.src = e.target.src.replace("volume.svg", "mute.svg")
      currentSong.volume = 0;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
    else{
      e.target.src = e.target.src.replace("mute.svg", "volume.svg")
      currentSong.volume = .10;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 10;

    }
  })


}
main();
