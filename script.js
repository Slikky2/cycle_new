// script.js

function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}

function getCycleDay(startDate, cycleLength) {
  const today = new Date();
  const start = new Date(startDate);
  return Math.floor((today - start) / (1000 * 60 * 60 * 24)) % cycleLength;
}

function isFertileDay(cycleDay, cycleLength) {
  const ovulationDay = cycleLength - 14;
  return cycleDay >= (ovulationDay - 5) && cycleDay <= ovulationDay;
}

function isMenstruationDay(cycleDay) {
  return cycleDay >= 0 && cycleDay <= 4; // First 5 days
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

  const cycleDay = getCycleDay(startDate, cycleLength);
  const fertile = isFertileDay(cycleDay, cycleLength);
  const menstruating = isMenstruationDay(cycleDay);

  let status = "SAFE";
  let emoji = "😄👍";

  if (menstruating) {
    status = "MENSTRUATING";
    emoji = "🩸🚨";
    document.body.style.backgroundColor = "#fef2f2"; // light red
    const msg = "Code Red - Voda!";
    const aiMsg = await getFunnyMessage(status);
    messageBox.innerHTML = `
      <div class="text-4xl mb-2">${emoji}</div>
      <div class="text-xl font-bold mb-1">${msg}</div>
      <div>${aiMsg}</div>
    `;
    speakText(`${msg}. ${aiMsg}`);
    return;
  }

  if (fertile) {
    status = "NOT SAFE";
    emoji = "☠️⚠️";
    document.body.style.backgroundColor = "#fecaca"; // red
  } else {
    status = "SAFE";
    emoji = "😄👍";
    document.body.style.backgroundColor = "#d1fae5"; // green
  }

  messageBox.textContent = "Thinking...";

  try {
    const funnyMessage = await getFunnyMessage(status);
    messageBox.innerHTML = `
      <div class="text-4xl mb-2">${emoji}</div>
      <div>${funnyMessage}</div>
    `;
    speakText(funnyMessage);
  } catch (err) {
    messageBox.textContent = "Something went wrong.";
  }
});
