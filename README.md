# Playlist-Manager

A Node.js-based web application to manage playlists and control OBS Studio remotely using WebSockets.
Features include starting/stopping streams, switching scenes, monitoring stream duration, and checking playlist integrity.

Table of Contents

Features
Requirements
Usage
Project Structure


#Features

✅ Start and stop OBS streams remotely

✅ Switch OBS scenes

✅ Check playlist duration and mismatched files

✅ Monitor streaming uptime, bitrate, and FPS

✅ Securely store stream keys and OBS passwords using .env

#Requirements

Node.js >= 18
npm
OBS Studio with WebSocket Plugin (v5+)
YouTube/RTMP streaming account (for live streams)


#Usage

Start OBS with WebSocket enabled.

Configure playlist in the playlists/ directory.

Open the web app in a browser.

Playlist Tools:

manage the playlist file .m3u8

Check total playlist duration

Check for missing files between folder and playlist

Streaming Controls:

Start / Stop stream

Switch scenes


#Project Structure

src/
├─ controllers/        # Request handlers for OBS and playlist actions
├─ routes/             # Routing logic
├─ services/           # OBS and playlist service functions
├─ public/             # Frontend HTML, JS, and CSS
playlists/             # Folder containing playlist files
.env                   # Environment variables (secure)
server1.js              # Entry point for Node.js server1



