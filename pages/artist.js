import { songsList } from '../data/songs.js';

class ArtistPage {
    constructor() {
        console.log("ArtistPage initializing...");
        this.songs = songsList;
        this.audioPlayer = new Audio();
        this.currentSong = null;
        this.loadArtistDetails();
        this.displaySongs();
        this.initializePlayer();
    }

    loadArtistDetails() {
        // Get artist details from the first song
        const artistData = {
            name: this.songs[0]?.artist || 'Unknown Artist',
            image: '../assets/images/artist-cover.jpg',
            monthlyListeners: '1.5M'
        };

        this.updateArtistUI(artistData);
    }

    updateArtistUI(artistData) {
        const artistName = document.querySelector('.artist-name');
        const artistCover = document.querySelector('.artist-cover');
        const monthlyListeners = document.querySelector('.monthly-listeners');

        if (artistName) artistName.textContent = artistData.name;
        if (artistCover) artistCover.src = artistData.image;
        if (monthlyListeners) monthlyListeners.textContent = `Monthly Listeners: ${artistData.monthlyListeners}`;
    }

    displaySongs() {
        console.log("Displaying songs...");
        const songsList = document.querySelector('.songs-list');
        if (!songsList) {
            console.error("Songs list container not found!");
            return;
        }

        songsList.innerHTML = '';
        this.songs.forEach((song, index) => {
            const row = this.createSongRow(song, index + 1);
            songsList.appendChild(row);
        });
    }

    createSongRow(song, index) {
        const row = document.createElement('div');
        row.className = 'song-row';
        
        const duration = this.formatTime(song.duration || 180);
        const isPlaying = this.currentSong?.id === song.id;
        
        row.innerHTML = `
            <div class="song-index">
                ${isPlaying ? '<i class="fas fa-volume-up"></i>' : index}
            </div>
            <div class="song-info">
                <div class="song-details">
                    <span class="song-title ${isPlaying ? 'playing' : ''}">${song.title}</span>
                    <span class="song-artist">${song.artist}</span>
                </div>
            </div>
            <div class="song-album">${song.album || 'Unknown Album'}</div>
            <div class="song-duration">${duration}</div>
        `;

        row.addEventListener('click', () => {
            console.log("Song clicked:", song);
            this.playSong(song);
        });
        
        if (isPlaying) {
            row.classList.add('active');
        }

        return row;
    }

    playSong(song) {
        if (!song?.url) {
            console.error("No song URL provided");
            return;
        }

        this.currentSong = song;
        
        // Update audio source and play
        this.audioPlayer.src = song.url;
        this.audioPlayer.play()
            .catch(err => console.error('Playback failed:', err));
        
        // Update UI
        this.updateNowPlaying(song);
        this.displaySongs(); // Refresh list to show playing state
        
        // Update main player if it exists
        if (window.songManager) {
            window.songManager.playSong(song);
        }
    }

    updateNowPlaying(song) {
        const elements = {
            cover: document.querySelector('.current-album-art'),
            title: document.querySelector('.track-name'),
            artist: document.querySelector('.artist-name')
        };

        if (elements.cover) elements.cover.src = song.coverArt;
        if (elements.title) elements.title.textContent = song.title;
        if (elements.artist) elements.artist.textContent = song.artist;
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    initializePlayer() {
        this.audioPlayer.addEventListener('ended', () => {
            this.playNextSong();
        });

        // Initialize player controls
        const playPauseBtn = document.querySelector('.play-pause');
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                if (this.audioPlayer.paused) {
                    this.audioPlayer.play();
                    playPauseBtn.querySelector('i').className = 'fa-solid fa-pause';
                } else {
                    this.audioPlayer.pause();
                    playPauseBtn.querySelector('i').className = 'fa-solid fa-play';
                }
            });
        }
    }

    playNextSong() {
        if (!this.currentSong) return;
        
        const currentIndex = this.songs.findIndex(song => song.id === this.currentSong.id);
        const nextIndex = (currentIndex + 1) % this.songs.length;
        this.playSong(this.songs[nextIndex]);
    }
}

// Initialize the artist page
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, creating ArtistPage...");
    const artistPage = new ArtistPage();
}); 