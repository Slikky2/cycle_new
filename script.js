function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}

function isFertileDay(startDate, cycleLength) {
  const today = new Date();
  const start = new Date(startDate);
  const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24)) % cycleLength;
  return diffDays >= 10 && diffDays <= 17;
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

  messageBox.textContent = "Thinking...";
  document.body.classList.remove("bg-green-200", "bg-red-200");
  messageBox.innerHTML = "";

  try {
    const funnyMessage = await getFunnyMessage(status);
    let emoji = "";
    if (status === "SAFE") {
      document.body.classList.add("bg-green-200");
      emoji = "😄👍";
    } else {
      document.body.classList.add("bg-red-200");
      emoji = "☠️⚠️";
    }

    messageBox.innerHTML = `
      <div class="text-4xl mb-2">${emoji}</div>
      <div>${funnyMessage}</div>
    `;

    speakText(funnyMessage);
  } catch (err) {
    messageBox.textContent = "Something went wrong.";
  }
});
