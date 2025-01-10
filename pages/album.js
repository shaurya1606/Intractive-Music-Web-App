import { songsList } from '../data/songs.js';

class AlbumPage {
    constructor() {
        this.songs = songsList;
        this.audioPlayer = new Audio();
        this.currentSong = null;
        this.loadAlbumDetails();
        this.displaySongs();
        this.initializePlayer();
    }

    loadAlbumDetails() {
        // Get album details from the first song
        const albumData = {
            name: this.songs[0]?.album || 'Unknown Album',
            artist: this.songs[0]?.artist || 'Unknown Artist',
            coverArt: this.songs[0]?.coverArt || '../assets/images/default-cover.jpg',
            year: '2024',
            songsCount: this.songs.length
        };

        this.updateAlbumUI(albumData);
    }

    updateAlbumUI(albumData) {
        const elements = {
            name: document.querySelector('.album-name'),
            artist: document.querySelector('.album-artist'),
            cover: document.querySelector('.album-cover'),
            year: document.querySelector('.album-year'),
            count: document.querySelector('.album-songs-count')
        };

        if (elements.name) elements.name.textContent = albumData.name;
        if (elements.artist) elements.artist.textContent = albumData.artist;
        if (elements.cover) elements.cover.src = albumData.coverArt;
        if (elements.year) elements.year.textContent = albumData.year;
        if (elements.count) elements.count.textContent = `${albumData.songsCount} songs`;
    }

    displaySongs() {
        const songsList = document.querySelector('.songs-list');
        if (!songsList) return;

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
            <div class="song-artist">${song.artist}</div>
            <div class="song-duration">${duration}</div>
        `;

        row.addEventListener('click', () => this.playSong(song));
        
        if (isPlaying) {
            row.classList.add('active');
        }

        return row;
    }

    playSong(song) {
        this.currentSong = song;
        
        // Update audio source and play
        this.audioPlayer.src = song.url;
        this.audioPlayer.play()
            .catch(err => console.error('Playback failed:', err));
        
        // Update UI
        this.updateNowPlaying(song);
        this.displaySongs(); // Refresh the list to show playing state
        
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
    }

    playNextSong() {
        if (!this.currentSong) return;
        
        const currentIndex = this.songs.findIndex(song => song.id === this.currentSong.id);
        const nextIndex = (currentIndex + 1) % this.songs.length;
        this.playSong(this.songs[nextIndex]);
    }
}

// Initialize the album page
document.addEventListener('DOMContentLoaded', () => {
    const albumPage = new AlbumPage();
}); 