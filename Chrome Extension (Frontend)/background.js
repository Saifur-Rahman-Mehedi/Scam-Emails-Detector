// This script runs in the background and listens for messages from the content script
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // Check if the message is from our content script, asking for email analysis
    if (request.content && request.action === "analyzeEmail") {
      analyzeEmail(request.content).then(response => {
        // Once the analysis is complete, send the response back to the content script
        sendResponse({success: true, data: response});
      }).catch(error => {
        console.error("Error analyzing email:", error);
        sendResponse({success: false, error: error.toString()});
      });
      return true;
    }
});

// Function to send the email content to the Flask backend for analysis
async function analyzeEmail(emailContent) {
  try {
    const response = await fetch('https://flaskbackend.com/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({emailContent: emailContent}),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
}
