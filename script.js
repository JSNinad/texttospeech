document.getElementById('speak-btn').addEventListener('click', () => {
    const text = document.getElementById('text-to-read').value.trim();
    if (text !== '') {
      speak(text);
    } else {
      alert('Please enter some text to speak.');
    }
  });
  
  function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  }
  