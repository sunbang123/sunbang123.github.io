const body = document.body;
const backgroundRefreshButton = document.getElementById("background-refresh");
const fallbackImages = ["0.jpg", "1.jpg", "2.jpg"];
const PICSUM_LIST_URL = "https://picsum.photos/v2/list";
const BACKGROUND_ID_KEY = "todo-background-id";
const FALLBACK_INDEX_KEY = "todo-background-index";

function setBackgroundImage(url) {
    body.style.backgroundImage = `url(${url})`;
}

function setFallbackBackground() {
    let backgroundImageIndex = -1;
    const prevIndex = localStorage.getItem(FALLBACK_INDEX_KEY);

    do {
        backgroundImageIndex = Math.floor(Math.random() * fallbackImages.length);
    } while (prevIndex && +prevIndex === backgroundImageIndex && fallbackImages.length > 1);

    localStorage.setItem(FALLBACK_INDEX_KEY, backgroundImageIndex);
    setBackgroundImage(`img/${fallbackImages[backgroundImageIndex]}`);
}

function pickRandomPhoto(photos) {
    const prevId = localStorage.getItem(BACKGROUND_ID_KEY);
    let selectedPhoto = photos[Math.floor(Math.random() * photos.length)];

    if (photos.length > 1) {
        while (selectedPhoto.id === prevId) {
            selectedPhoto = photos[Math.floor(Math.random() * photos.length)];
        }
    }

    localStorage.setItem(BACKGROUND_ID_KEY, selectedPhoto.id);
    return selectedPhoto;
}

function setRandomPicsumBackground() {
    const randomPage = Math.floor(Math.random() * 10) + 1;
    const url = `${PICSUM_LIST_URL}?page=${randomPage}&limit=100`;

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Background request failed");
            }
            return response.json();
        })
        .then((photos) => {
            const selectedPhoto = pickRandomPhoto(photos);
            setBackgroundImage(`https://picsum.photos/id/${selectedPhoto.id}/1920/1080`);
        })
        .catch(setFallbackBackground);
}

backgroundRefreshButton.addEventListener("click", setRandomPicsumBackground);
setRandomPicsumBackground();
