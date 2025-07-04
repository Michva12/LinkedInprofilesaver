chrome.runtime.onInstalled.addListener(() => {
  chrome.identity.getAuthToken({ interactive: true }, function(token) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return;
    }
    chrome.storage.local.set({ authToken: token });
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "saveToSheet") {
    chrome.storage.local.get(['authToken', 'spreadsheetId'], function(data) {
      if (!data.spreadsheetId) {
        sendResponse({ error: "Spreadsheet ID not set. Please configure in options." });
        return;
      }

      const profileData = request.data;
      const values = [
        [
          new Date().toISOString(),
          profileData.name || '',
          profileData.headline || '',
          profileData.location || '',
          profileData.profileUrl || ''
        ]
      ];

      fetch(`https://sheets.googleapis.com/v4/spreadsheets/${data.spreadsheetId}/values/Sheet1!A:E:append?valueInputOption=RAW`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${data.authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: values
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          sendResponse({ error: data.error.message });
        } else {
          sendResponse({ success: true });
        }
      })
      .catch(error => {
        sendResponse({ error: error.message });
      });
    });
    return true; // Keep the message channel open for async response
  }
});