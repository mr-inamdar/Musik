import { renderPlaylist } from "./index.js";

const media_query_for_mobile = window.matchMedia("(max-width: 499px)");

display_nav_bar = ()=>{
    if (media_query_for_mobile.matches){
        options = document.getElementById("options");
        // options.style.right = "0px";
        options.style.display = "flex";
    }
}
close_nav_bar = ()=>{
    if (media_query_for_mobile.matches){
        options = document.getElementById("options");
        // options.style.right = "-200px";
        options.style.display = "none";
    }
}
// Handle hash change and screen size
function handleHashChange() {
  const isMobile = media_query_for_mobile.matches;
  const hash = location.hash;

  if (isMobile) {
    switch (hash) {
      case "#playlist":
        showSection({ playList: true });
        break;
      case "#search":
        showSection({ search: true });
        break;
      default:
        showSection({ home: true });
        break;
    }
  } else {
    // Desktop view: show all except search
    showSection({ desktop: true });
  }
}
const playlist = document.getElementById("playlist");
const songs = document.getElementById("songs");

// Handle hash change and screen size
function handleHashChange() {
  const isMobile = media_query_for_mobile.matches;
  const hash = location.hash;

  if (isMobile) {
    switch (hash) {
      case "#playlist":
        showSection({ playList: true });
        break;
      default:
        showSection({ home: true });
        break;
    }
  } else {
    // Desktop view: show all except search
    showSection({ desktop: true });
  }
}

// Show/hide sections based on flags
function showSection({ playList = false, search = false, home = false, desktop = false }) {
  songs.style.width = (home || desktop) ? "100%" : "0%";
  songs.style.opacity = (home || desktop) ? "1" : "0";
  playlist.style.width = (playList || desktop) ? "100%" : "0%";
  playlist.style.opacity = (playList || desktop) ? "1" : "0";

  if (playList) {
    renderPlaylist();
  }
}
// Navigation functions
function display_playlist_page() {
  if (media_query_for_mobile.matches) location.hash = "#playlist";
}
function display_home_page() {
  if (media_query_for_mobile.matches) location.hash = "";
}
// Event listeners
window.addEventListener("load", handleHashChange);
window.addEventListener("hashchange", handleHashChange);
media_query_for_mobile.addEventListener("change", handleHashChange)
