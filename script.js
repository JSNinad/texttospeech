document.addEventListener('DOMContentLoaded', () => {
  const landingPage = document.getElementById('landing-page');
  const textToSpeechSection = document.getElementById('text-to-speech-section');
  const speechToTextSection = document.getElementById('speech-to-text-section');
  const textToSpeechBtn = document.getElementById('text-to-speech-btn');
  const speechToTextBtn = document.getElementById('speech-to-text-btn');
  const backBtnTTS = document.getElementById('back-btn-tts');
  const backBtnSTT = document.getElementById('back-btn-stt');
  const copyBtn = document.getElementById('copy-btn');

  textToSpeechBtn.addEventListener('click', () => {
      landingPage.style.display = 'none';
      textToSpeechSection.style.display = 'block';
  });

  speechToTextBtn.addEventListener('click', () => {
      landingPage.style.display = 'none';
      speechToTextSection.style.display = 'block';
  });

  backBtnTTS.addEventListener('click', () => {
      textToSpeechSection.style.display = 'none';
      landingPage.style.display = 'block';
  });

  backBtnSTT.addEventListener('click', () => {
      speechToTextSection.style.display = 'none';
      landingPage.style.display = 'block';
  });

  copyBtn.addEventListener('click', () => {
      const recognizedText = document.getElementById('recognized-text').textContent;
      navigator.clipboard.writeText(recognizedText).then(() => {
          alert('Text copied to clipboard!');
      }).catch(err => {
          console.error('Failed to copy text: ', err);
      });
  });

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
});
