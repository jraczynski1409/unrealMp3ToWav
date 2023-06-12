const bar = document.querySelector("#progressBarFill");
let width = 0;

function convertMP3toWAV() {
        
        const mp3FileInput = document.getElementById('mp3FileInput');
        const file = mp3FileInput.files[0];
        
            width=0;
            bar.style.width=width+"%";

        if (file) {
          const reader = new FileReader();

          reader.onload = function(e) {
            const mp3Data = e.target.result;
            const audioContext = new AudioContext();
            audioContext.decodeAudioData(mp3Data, function(decodedData) {
              const wavData = convertToWav(decodedData);

              const blob = new Blob([wavData], { type: 'audio/wav' });
              const url = URL.createObjectURL(blob);

              const downloadLink = document.createElement('a');
              downloadLink.href = url;
              downloadLink.download = file.name.replace('.mp3', '.wav');
              downloadLink.click();
            });
          };

          reader.readAsArrayBuffer(file);
            width+=25;
            bar.style.width=width+"%";
        }
      }

      function convertToWav(buffer) {
        const wavData = new ArrayBuffer(44 + buffer.length * 2);
        const view = new DataView(wavData);

        // Nagłówek WAV
        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + buffer.length * 2, true);
        writeString(view, 8, 'WAVE');
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, 44100, true);
        view.setUint32(28, 44100 * 2 * 2, true);
        view.setUint16(32, 2 * 2, true);
        view.setUint16(34, 16, true);
        writeString(view, 36, 'data');
        view.setUint32(40, buffer.length * 2, true);

        // Konwersja próbek
        const offset = 44;
        for (let i = 0; i < buffer.length; i++) {
          view.setInt16(offset + i * 2, buffer[i] * 32767, true);
        }
        width+=25;
        bar.style.width=width+"%";

        return wavData;
      }

      function writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
        width+=12.5;
        bar.style.width=width+"%";
      }