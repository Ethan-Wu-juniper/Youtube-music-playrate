document.addEventListener('DOMContentLoaded', function() {
    var saveButton = document.getElementById('saveButton');
    var apiKeyInput = document.getElementById('apiKey');

    // 載入已保存的 API Key（如果有）
    chrome.storage.sync.get('youtubeApiKey', function(data) {
        if (data.youtubeApiKey) {
            apiKeyInput.value = data.youtubeApiKey;
        }
    });

    saveButton.addEventListener('click', function() {
        var apiKey = apiKeyInput.value;
        chrome.storage.sync.set({youtubeApiKey: apiKey}, function() {
            console.log('API Key saved');
            alert('API Key 已保存！');
        });
    });
});