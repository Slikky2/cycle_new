// script.js

function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}

function isFertileDay(startDate, cycleLength) {
  const today = new Date();
  const start = new Date(startDate);
  const cycleDay = Math.floor((today - start) / (1000 * 60 * 60 * 24)) % cycleLength;

  const ovulationDay = cycleLength - 14; // typical ovulation timing
  return cycleDay >= (ovulationDay - 5) && cycleDay <= ovulationDay;
}

async function getFunnyMessage(status) {
  const response = await fetch('/.netlify/functions/get-funny-message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status })
  });

  const data = await response.json();
  return data.message || "Couldn't get a funny message.";
}

document.getElementById("checkButton").addEventListener("click", async () => {
  const startDate = document.getElementById("periodStart").value;
  const cycleLength = parseInt(document.getElementById("cycleLength").value);
  const messageBox = document.getElementById("messageBox");

  if (!startDate || isNaN(cycleLength)) {
    messageBox.textContent = "Please enter valid inputs.";
    return;
  }

  speakText("Checking...");

  const fertile = isFertileDay(startDate, cycleLength);
  const status = fertile ? "NOT SAFE" : "SAFE";

  // Change background color using inline style
  document.body.style.backgroundColor = status === "SAFE" ? "#d1fae5" : "#fecaca"; // green or red

  messageBox.textContent = "Thinking...";

  try {
    const funnyMessage = await getFunnyMessage(status);
    const emoji = status === "SAFE" ? "😄👍" : "☠️⚠️";

    messageBox.innerHTML = `
      <div class="text-4xl mb-2">${emoji}</div>
      <div>${funnyMessage}</div>
    `;

    speakText(funnyMessage);
  } catch (err) {
    messageBox.textContent = "Something went wrong.";
  }
});
