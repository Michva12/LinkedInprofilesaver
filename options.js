document.getElementById('saveButton').addEventListener('click', () => {
       const clientId = document.getElementById('clientId').value;
       const spreadsheetId = document.getElementById('spreadsheetId').value;
       console.log('Saving:', { clientId, spreadsheetId }); // Added for debugging
       chrome.storage.local.set({ clientId: clientId, spreadsheetId: spreadsheetId }, () => {
         alert('Settings saved!');
       });
     });

     // Load saved settings
     chrome.storage.local.get(['clientId', 'spreadsheetId'], (data) => {
       if (data.clientId) {
         document.getElementById('clientId').value = data.clientId;
       }
       if (data.spreadsheetId) {
         document.getElementById('spreadsheetId').value = data.spreadsheetId;
       }
     });