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

// Speech-to-Text
const recordBtn = document.getElementById('record-btn');
const recognizedTextDiv = document.getElementById('recognized-text');

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  let isRecording = false;

  recordBtn.addEventListener('click', () => {
      if (isRecording) {
          recognition.stop();
      } else {
          recognizedTextDiv.textContent = '';
          recognition.start();
          recordBtn.textContent = 'Stop Recording';
      }
      isRecording = !isRecording;
  });

  recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      recognizedTextDiv.textContent = transcript;
  };

  recognition.onerror = (event) => {
      console.error('Speech recognition error detected: ' + event.error);
      recordBtn.textContent = 'Start Recording';
      isRecording = false;

      let errorMessage = 'An error occurred: ' + event.error;

      switch(event.error) {
          case 'network':
              errorMessage = 'Network error occurred. Please check your internet connection.';
              break;
          case 'not-allowed':
              errorMessage = 'Microphone access is denied. Please allow microphone access in your browser settings.';
              break;
          case 'service-not-allowed':
              errorMessage = 'Speech recognition service is not allowed. Please check your browser settings.';
              break;
          case 'no-speech':
              errorMessage = 'No speech detected. Please try again.';
              break;
          case 'audio-capture':
              errorMessage = 'Microphone not available. Please check your microphone settings.';
              break;
          default:
              errorMessage = 'An error occurred: ' + event.error;
      }

      alert(errorMessage);

      // Additional diagnostic information for development
      console.log('Error details:', event);
      if (navigator.onLine) {
          console.log('The browser is online.');
      } else {
          console.log('The browser is offline.');
      }
  };

  recognition.onend = () => {
      recordBtn.textContent = 'Start Recording';
      isRecording = false;
  };
} else {
  recordBtn.disabled = true;
  alert('Speech recognition is not supported in this browser.');
}
