function getApiKey(callback) {
  chrome.storage.sync.get('youtubeApiKey', function (data) {
    if (data.youtubeApiKey) {
      callback(data.youtubeApiKey);
    } else {
      console.log('No API Key found');
      callback(null);
    }
  });
}

async function isMusicVideo(videoId, apiKey) {
  const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`);
  const data = await response.json();

  if (data.items && data.items.length > 0) {
    const snippet = data.items[0].snippet;
    console.log(`category id ${snippet.categoryId}`)
    return snippet.categoryId === '10'
  }
  return false;
}

function getYouTubeVideoId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('v');
}

// 主函式
async function checkIfMusicVideo(apiKey) {
  const videoId = getYouTubeVideoId();
  if (videoId) {
    const result = await isMusicVideo(videoId, apiKey);
    console.log(`Is this a music video? ${result}`);
    var video = document.querySelector('video');
    const originalSpeed = video.playbackRate
    video.playbackRate = result ? 1 : originalSpeed;
    console.log(`play rate has been adjusted to ${video.playbackRate}`)
  }
}

// 當頁面加載完成時執行主函式
window.addEventListener('load', getApiKey(checkIfMusicVideo));

// 監聽 URL 變化（為了處理在 YouTube 內部導航的情況）
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    getApiKey(checkIfMusicVideo);
  }
}).observe(document, { subtree: true, childList: true });