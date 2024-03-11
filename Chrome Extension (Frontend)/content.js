function getEmailContent() {
    const emailBody = document.querySelector('.email-content').innerText;
    return emailBody;
}

function analyzeEmail(emailContent) {
    chrome.runtime.sendMessage({
        action: "analyzeEmail",
        content: emailContent
    }, function(response) {
        if (response.success) {
            highlightSuspiciousPhrases(response.data);
        } else {
            console.error('Failed to analyze email:', response.error);
        }
    });
}

function highlightSuspiciousPhrases(analysisResults) {
    const suspiciousPhrases = analysisResults.suspiciousPhrases; // assuming analysisResults contains a list of suspicious phrases
    const emailBody = document.querySelector('.email-content');
    if (!emailBody) return;

    suspiciousPhrases.forEach(phrase => {
        emailBody.innerHTML = emailBody.innerHTML.replace(new RegExp(phrase, 'gi'), match => `<span class="highlight">${match}</span>`);
    });

    if (suspiciousPhrases.length > 0) {
        showEducationalAlert();
    }
}

function showEducationalAlert() {
    const alertBox = document.createElement('div');
    alertBox.style.backgroundColor = '#ffcc00';
    alertBox.style.color = 'black';
    alertBox.style.padding = '10px';
    alertBox.style.marginTop = '10px';
    alertBox.textContent = 'Warning: This email may contain phishing attempts. Be cautious with suspicious links and requests for personal information.';
    document.body.insertBefore(alertBox, document.body.firstChild);
}

function onEmailLoad() {
    const emailContent = getEmailContent();
    if (emailContent) {
        analyzeEmail(emailContent);
    }
}

setInterval(() => {
    if (document.querySelector('.email-content')) { // Check if an email is opened
        onEmailLoad();
    }
}, 1000);
