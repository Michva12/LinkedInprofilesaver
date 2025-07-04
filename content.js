function extractProfileData() {
  const name = document.querySelector('.pv-top-card--list li:first-child')?.textContent.trim();
  const headline = document.querySelector('.pv-top-card--list li:nth-child(2)')?.textContent.trim();
  const location = document.querySelector('.pv-top-card--list li:nth-child(3)')?.textContent.trim();
  const profileUrl = window.location.href;

  return {
    name: name || 'N/A',
    headline: headline || 'N/A',
    location: location || 'N/A',
    profileUrl: profileUrl
  };
}

function saveToSheet() {
  const profileData = extractProfileData();
  
  chrome.runtime.sendMessage({
    action: 'saveToSheet',
    data: profileData
  }, response => {
    if (response.error) {
      console.error('Error saving to sheet:', response.error);
      alert('Error saving to sheet: ' + response.error);
    } else {
      console.log('Profile saved to Google Sheet');
      alert('Profile saved successfully!');
    }
  });
}

// Run when page is fully loaded
window.addEventListener('load', () => {
  // Wait a bit for dynamic content to load
  setTimeout(saveToSheet, 2000);
});