// Core Classes and Utilities
class AudioPlayer {
    constructor() {
        this.audio = new Audio();
        this.isPlaying = false;
        this.currentTrack = null;
        this.volume = 1;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Time update event
        this.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
        });

        // Track end event
        this.audio.addEventListener('ended', () => {
            PlayerUI.resetPlayButton();
            QueueManager.playNext();
        });

        // Error handling
        this.audio.addEventListener('error', (e) => {
            NotificationManager.show('Error playing track', 'error');
            console.error('Audio error:', e);
        });
    }

    play(track = null) {
        if (track) {
            this.currentTrack = track;
            this.audio.src = track.url;
        }
        
        this.audio.play();
        this.isPlaying = true;
        PlayerUI.updatePlayButton(true);
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        PlayerUI.updatePlayButton(false);
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    seek(time) {
        this.audio.currentTime = time;
    }

    setVolume(level) {
        this.volume = Math.max(0, Math.min(1, level));
        this.audio.volume = this.volume;
        PlayerUI.updateVolumeUI(this.volume);
    }

    updateProgress() {
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        PlayerUI.updateProgressBar(progress);
        PlayerUI.updateTimeDisplay(this.audio.currentTime, this.audio.duration);
    }
}

class QueueManager {
    constructor() {
        this.queue = [];
        this.currentIndex = -1;
        this.shuffle = false;
        this.repeat = 'none'; // none, one, all
    }

    addToQueue(track) {
        this.queue.push(track);
        PlayerUI.updateQueueDisplay(this.queue);
        NotificationManager.show('Added to queue');
    }

    removeFromQueue(index) {
        this.queue.splice(index, 1);
        PlayerUI.updateQueueDisplay(this.queue);
    }

    playNext() {
        if (this.repeat === 'one') {
            audioPlayer.play(this.getCurrentTrack());
            return;
        }

        if (this.shuffle) {
            this.currentIndex = Math.floor(Math.random() * this.queue.length);
        } else {
            this.currentIndex++;
        }

        if (this.currentIndex >= this.queue.length) {
            if (this.repeat === 'all') {
                this.currentIndex = 0;
            } else {
                this.currentIndex = this.queue.length - 1;
                audioPlayer.pause();
                return;
            }
        }

        audioPlayer.play(this.getCurrentTrack());
    }

    playPrevious() {
        this.currentIndex = Math.max(0, this.currentIndex - 1);
        audioPlayer.play(this.getCurrentTrack());
    }

    getCurrentTrack() {
        return this.queue[this.currentIndex];
    }

    toggleShuffle() {
        this.shuffle = !this.shuffle;
        PlayerUI.updateShuffleButton(this.shuffle);
    }

    setRepeatMode() {
        switch(this.repeat) {
            case 'none':
                this.repeat = 'all';
                break;
            case 'all':
                this.repeat = 'one';
                break;
            case 'one':
                this.repeat = 'none';
                break;
        }
        PlayerUI.updateRepeatButton(this.repeat);
    }
}

class SearchManager {
    constructor() {
        this.searchTimeout = null;
        this.initializeSearchListener();
    }

    initializeSearchListener() {
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', (e) => {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 500);
        });
    }

    async performSearch(query) {
        if (!query.trim()) {
            PlayerUI.clearSearchResults();
            return;
        }

        try {
            PlayerUI.showSearchLoading();
            const results = await this.fetchSearchResults(query);
            PlayerUI.displaySearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
            NotificationManager.show('Search failed', 'error');
        } finally {
            PlayerUI.hideSearchLoading();
        }
    }

    async fetchSearchResults(query) {
        // Implement your API call here
        // This is a placeholder
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    songs: [],
                    artists: [],
                    albums: []
                });
            }, 1000);
        });
    }
}

// Import songs data
import { songsList } from './data/songs.js';

// Import additional data
import { artistsList } from './data/artists.js';
import { albumsList } from './data/albums.js';

class SongManager {
    constructor() {
        this.songs = songsList;
        // Load recently played from localStorage or start with empty array
        this.recentlyPlayed = JSON.parse(localStorage.getItem('recentlyPlayed')) || [];
        this.recommended = this.getRecommendedSongs();
        this.initializeDefaultRecent();
        this.initializeProgressBar();
        this.initializePlayerControls();
    }

    initializeAudioEvents() {
        // Time update event for progress bar
        this.audioPlayer.addEventListener('timeupdate', () => {
            this.updateProgress();
        });

        // Track end event
        this.audioPlayer.addEventListener('ended', () => {
            this.updatePlayButton(false);
        });

        // Add click handler for progress bar
        const progressContainer = document.querySelector('.progress-bar');
        if (progressContainer) {
            progressContainer.addEventListener('click', (e) => {
                this.seekTo(e);
            });
        }
    }

    updateProgress() {
        if (!this.audioPlayer.duration) return;

        // Update progress bar
        const progressBar = document.querySelector('.progress');
        const currentTime = document.querySelector('.current-time');
        const totalTime = document.querySelector('.total-time');

        if (progressBar) {
            const percentage = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
            progressBar.style.width = `${percentage}%`;
        }

        if (currentTime) {
            currentTime.textContent = this.formatTime(this.audioPlayer.currentTime);
        }

        if (totalTime) {
            totalTime.textContent = this.formatTime(this.audioPlayer.duration);
        }
    }

    

    // Initialize some default recent songs if none exist
    initializeDefaultRecent() {
        if (this.recentlyPlayed.length === 0) {
            this.recentlyPlayed = this.getRandomSongs(5);
            this.saveRecentlyPlayed();
        }
    }

    // Get recommended songs (excluding recently played ones)
    getRecommendedSongs() {
        return this.getRandomSongs(10, this.recentlyPlayed);
    }

    // Get random songs excluding specified ones
    getRandomSongs(count, excludeSongs = []) {
        let availableSongs = this.songs.filter(song => 
            !excludeSongs.some(excludeSong => excludeSong.id === song.id)
        );
        
        if (availableSongs.length === 0) return [];

        let randomSongs = [];
        while (randomSongs.length < count && availableSongs.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableSongs.length);
            randomSongs.push(availableSongs[randomIndex]);
            availableSongs.splice(randomIndex, 1);
        }
        return randomSongs;
    }

    saveRecentlyPlayed() {
        localStorage.setItem('recentlyPlayed', JSON.stringify(this.recentlyPlayed));
    }

    displaySongs() {
        this.displayRecentlyPlayed();
        this.displayRecommended();
    }

    displayRecentlyPlayed() {
        const recentlyPlayedSection = document.querySelector('.recently-played');
        if (!recentlyPlayedSection) return;

        const heading = document.createElement('h3');
        heading.textContent = 'Recently Played';
        recentlyPlayedSection.appendChild(heading);

        const songGrid = document.createElement('div');
        songGrid.className = 'song-grid';
        
        this.recentlyPlayed.forEach(song => {
            const songCard = this.createSongCard(song);
            songGrid.appendChild(songCard);
        });

        recentlyPlayedSection.appendChild(songGrid);
    }

    displayRecommended() {
        const recommendedSection = document.querySelector('.recommended');
        if (!recommendedSection) return;

        const heading = document.createElement('h3');
        heading.textContent = 'Recommended for You';
        recommendedSection.appendChild(heading);

        const songGrid = document.createElement('div');
        songGrid.className = 'song-grid';
        
        this.recommended.forEach(song => {
            const songCard = this.createSongCard(song);
            songGrid.appendChild(songCard);
        });

        recommendedSection.appendChild(songGrid);
    }

    createSongCard(song) {
        const card = document.createElement('div');
        card.className = 'song-card';
        card.innerHTML = `
            <img src="${song.coverArt}" alt="${song.title}">
            <div class="song-info">
                <h4 class="song-title">${song.title}</h4>
                <p class="song-artist">${song.artist}</p>
            </div>
        `;

        // Add click handler for playback
        card.addEventListener('click', () => {
            this.playSong(song);
        });

        return card;
    }

    playSong(song) {
        if (!song?.url) return;
        
        // Update current song and play
        this.currentSong = song;
        this.audioPlayer = this.audioPlayer || new Audio();
        this.audioPlayer.src = song.url;
        
        // Add timeupdate listener for progress
        this.audioPlayer.addEventListener('timeupdate', () => {
            this.updateProgress();
        });
        
        this.audioPlayer.play()
            .catch(err => console.error('Playback failed:', err));
        
        // Update UI
        this.updateNowPlaying(song);
        this.updatePlayButton(true);
        this.addToRecentlyPlayed(song);
    }

    updateNowPlaying(song) {
        // Update bottom player bar
        const elements = {
            cover: document.querySelector('.current-album-art'),
            title: document.querySelector('.track-name'),
            artist: document.querySelector('.artist-name')
        };

        if (elements.cover) elements.cover.src = song.coverArt;
        if (elements.title) elements.title.textContent = song.title;
        if (elements.artist) elements.artist.textContent = song.artist;
    }

    updatePlayButton(isPlaying) {
        const playBtn = document.querySelector('.play-btn');
        if (playBtn) {
            playBtn.classList.toggle('fa-play', !isPlaying);
            playBtn.classList.toggle('fa-pause', isPlaying);
        }
    }

    addToRecentlyPlayed(song) {
        // Remove the song if it already exists
        this.recentlyPlayed = this.recentlyPlayed.filter(s => s.id !== song.id);
        
        // Add the song to the beginning
        this.recentlyPlayed.unshift(song);
        
        // Keep only the last 5 songs
        if (this.recentlyPlayed.length > 5) {
            this.recentlyPlayed.pop();
        }

        // Update only the recently played section
        const recentlyPlayedGrid = document.querySelector('.recently-played .song-grid');
        if (recentlyPlayedGrid) {
            recentlyPlayedGrid.innerHTML = '';
            this.recentlyPlayed.forEach(song => {
                recentlyPlayedGrid.appendChild(this.createSongCard(song));
            });
        }
    }

    initializeCarousel() {
        const track = document.querySelector('.carousel-track');
        const prevButton = document.querySelector('.carousel-button.prev');
        const nextButton = document.querySelector('.carousel-button.next');
        
        // Create carousel items
        this.songs.forEach(song => {
            const card = document.createElement('div');
            card.className = 'carousel-card';
            card.innerHTML = `
                <div class="song-card-inner">
                    <div class="song-image-container">
                        <img src="${song.coverArt}" alt="${song.title}" class="song-image">
                        <div class="play-overlay">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                    <div class="song-info">
                        <h4 class="song-title">${song.title}</h4>
                        <p class="song-artist">${song.artist}</p>
                    </div>
                </div>
            `;
            
            card.addEventListener('click', () => this.playSong(song));
            track.appendChild(card);
        });

        let currentIndex = 0;
        const cardWidth = 220; // card width + gap
        const visibleCards = 5;
        const maxIndex = this.songs.length - visibleCards;

        // Update carousel position
        const updateCarousel = () => {
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        };

        // Event listeners for buttons
        prevButton.addEventListener('click', () => {
            currentIndex = Math.max(currentIndex - 1, 0);
            updateCarousel();
        });

        nextButton.addEventListener('click', () => {
            currentIndex = Math.min(currentIndex + 1, maxIndex);
            updateCarousel();
        });
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Add click handler for progress bar
    initializeProgressBar() {
        const progressContainer = document.querySelector('.progress-bar');
        if (progressContainer) {
            progressContainer.addEventListener('click', (e) => {
                if (this.audioPlayer && this.audioPlayer.duration) {
                    const clickPosition = (e.pageX - progressContainer.offsetLeft) / progressContainer.offsetWidth;
                    this.audioPlayer.currentTime = clickPosition * this.audioPlayer.duration;
                }
            });
        }
    }

    initializePlayerControls() {
        // Play/Pause button
        const playBtn = document.querySelector('.play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', () => this.togglePlay());
        }

        // Next button
        const nextBtn = document.querySelector('.next-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.playNext());
        }

        // Previous button
        const prevBtn = document.querySelector('.prev-btn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.playPrevious());
        }
    }

    togglePlay() {
        if (!this.currentSong) return;
        
        if (this.audioPlayer.paused) {
            this.audioPlayer.play()
                .catch(err => console.error('Playback failed:', err));
            this.updatePlayButton(true);
        } else {
            this.audioPlayer.pause();
            this.updatePlayButton(false);
        }
    }

    playNext() {
        if (!this.currentSong || !this.songs.length) return;
        
        const currentIndex = this.songs.findIndex(song => song.id === this.currentSong.id);
        const nextIndex = (currentIndex + 1) % this.songs.length;
        this.playSong(this.songs[nextIndex]);
    }

    playPrevious() {
        if (!this.currentSong || !this.songs.length) return;
        
        const currentIndex = this.songs.findIndex(song => song.id === this.currentSong.id);
        const prevIndex = currentIndex <= 0 ? this.songs.length - 1 : currentIndex - 1;
        this.playSong(this.songs[prevIndex]);
    }
}

class ContentManager {
    constructor() {
        this.artists = artistsList;
        this.albums = albumsList;
    }

    displayArtists() {
        const artistGrid = document.querySelector('.artist-grid');
        artistGrid.innerHTML = '';

        this.artists.forEach(artist => {
            const artistCard = this.createArtistCard(artist);
            artistGrid.appendChild(artistCard);
        });
    }

    createArtistCard(artist) {
        const card = document.createElement('div');
        card.className = 'artist-card';
        card.innerHTML = `
            <img src="${artist.image}" alt="${artist.name}" class="artist-image">
            <h4 class="artist-name">${artist.name}</h4>
            <p class="artist-genre">${artist.genre}</p>
            <p class="monthly-listeners">${artist.monthlyListeners} monthly listeners</p>
        `;

        // Add click handler for redirection
        card.addEventListener('click', () => {
            window.location.href = `pages/artist.html?id=${artist.id}`;
        });

        return card;
    }

    displayAlbums() {
        const albumGrid = document.querySelector('.album-grid');
        albumGrid.innerHTML = '';

        this.albums.forEach(album => {
            const albumCard = this.createAlbumCard(album);
            albumGrid.appendChild(albumCard);
        });
    }

    createAlbumCard(album) {
        const card = document.createElement('div');
        card.className = 'album-card';
        card.innerHTML = `
            <img src="${album.coverArt}" alt="${album.title}" class="album-image">
            <div class="album-info">
                <h4 class="album-title">${album.title}</h4>
                <p class="album-artist">${album.artist}</p>
                <p class="album-year">${album.year}</p>
            </div>
        `;

        // Add click handler for redirection
        card.addEventListener('click', () => {
            window.location.href = `pages/album.html?id=${album.id}`;
        });

        return card;
    }

    openArtistPage(artist) {
        // Implement artist page navigation
        console.log('Opening artist page:', artist.name);
    }

    openAlbumPage(album) {
        // Implement album page navigation
        console.log('Opening album page:', album.title);
    }

    createFeaturedCard(album) {
        const card = document.createElement('div');
        card.className = 'carousel-card';
        card.innerHTML = `
            <img src="${album.coverArt}" alt="${album.title}">
            <div class="carousel-info">
                <h4 class="carousel-title">${album.title}</h4>
                <p class="carousel-artist">${album.artist}</p>
                <p class="carousel-year">${album.year}</p>
            </div>
        `;

        card.addEventListener('click', () => {
            window.location.href = `pages/album.html?id=${album.id}`;
        });

        return card;
    }
}

// Add this new class - don't modify any existing code
class ProfileControls {
    constructor() {
        this.profileButton = document.getElementById('profileButton');
        this.profileDropdown = document.getElementById('profileDropdown');
        this.initializeProfileControls();
    }

    initializeProfileControls() {
        // Toggle dropdown
        this.profileButton?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.profileDropdown?.classList.toggle('active');
        });

        // Close on outside click
        document.addEventListener('click', () => {
            this.profileDropdown?.classList.remove('active');
        });

        // Handle menu items
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = e.currentTarget.querySelector('span').textContent.toLowerCase();
                
                switch(action) {
                    case 'profile':
                        console.log('Opening profile...');
                        // Add your profile page navigation
                        break;
                    case 'settings':
                        console.log('Opening settings...');
                        // Add your settings page navigation
                        break;
                    case 'logout':
                        console.log('Logging out...');
                        // Add your logout logic
                        break;
                }
                
                this.profileDropdown?.classList.remove('active');
            });
        });
    }
}

// Initialize managers
const audioPlayer = new AudioPlayer();
const queueManager = new QueueManager();
const songManager = new SongManager();
const contentManager = new ContentManager();
const profileControls = new ProfileControls();

// Display songs when page loads
document.addEventListener('DOMContentLoaded', () => {
    songManager.displaySongs();
    songManager.initializeCarousel();
    contentManager.displayArtists();
    contentManager.displayAlbums();
});

// Add necessary styles
const style = document.createElement('style');
style.textContent = `
    .song-card {
        background: var(--background-light);
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.2s ease;
        cursor: pointer;
    }

    .song-card:hover {
        transform: scale(1.05);
    }

    .song-image-container {
        position: relative;
        padding-top: 100%;
    }

    .song-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .play-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.2s ease;
    }

    .song-card:hover .play-overlay {
        opacity: 1;
    }

    .play-overlay i {
        color: white;
        font-size: 2em;
    }

    .song-info {
        padding: 12px;
    }

    .song-title {
        margin: 0;
        font-size: 1em;
        color: var(--text-primary);
    }

    .song-artist {
        margin: 4px 0 0;
        font-size: 0.9em;
        color: var(--text-secondary);
    }

    .recently-played, .recommended {
        margin-bottom: 32px;
    }

    .recently-played h3, .recommended h3 {
        margin-bottom: 16px;
        color: var(--text-primary);
    }
`;
document.head.appendChild(style);

async function searchSongs(query) {
    try {
        const urlForAPI = `https://www.jiosaavn.com/api.php?__call=search.getResults&p=0&n=6&q=${query}&_format=json&_marker=00&ctx=wap6dot0`;
        const response = await fetch(urlForAPI, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Add CORS headers if needed
                'Access-Control-Allow-Origin': '*'
            }
        });
        
        const data = await response.json();
        
        if (data.total === 0) {
            console.log("No results found");
            return [];
        }

        // Process and return the songs data
        return data.results.map(song => ({
            id: song.id,
            title: song.song,
            artist: song.primary_artists,
            coverArt: song.image.replace('150x150', '500x500'),
            audioUrl: song.media_preview_url.replace('preview.saavncdn.com', 'aac.saavncdn.com')
                                         .replace('_96_p', '_320'),
            duration: song.duration,
            album: song.album,
            year: song.year
        }));

    } catch (error) {
        console.error("Error fetching songs:", error);
        return [];
    }
}

// Usage example:
// searchSongs("your query").then(songs => {
//     console.log(songs);
// });

document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    const footerSection = document.querySelector('.footer-section');
    if (footerSection) {
        observer.observe(footerSection);
    }
});

