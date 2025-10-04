const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const localPlaceholder = document.getElementById('localPlaceholder');
const remotePlaceholder = document.getElementById('remotePlaceholder');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const createOfferBtn = document.getElementById('createOfferBtn');
const createAnswerBtn = document.getElementById('createAnswerBtn');
const setRemoteBtn = document.getElementById('setRemoteBtn');
const signalingData = document.getElementById('signalingData');
const statusText = document.getElementById('statusText');
const statusDot = document.getElementById('statusDot');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const remoteCard = document.getElementById('remoteCard');
const charCount = document.getElementById('charCount');

let pc = null;
let localStream = null;
const config = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

// Update character count
signalingData.addEventListener('input', () => {
    charCount.textContent = `${signalingData.value.length} chars`;
});

// Compression utilities
function compressData(data) {
    const json = JSON.stringify(data);
    const compressed = btoa(unescape(encodeURIComponent(json)));
    return (data.type === 'offer' ? 'O:' : 'A:') + compressed;
}

function decompressData(compressed) {
    try {
        const prefix = compressed.substring(0, 2);
        const data = compressed.substring(2);
        const json = decodeURIComponent(escape(atob(data)));
        return JSON.parse(json);
    } catch (e) {
        return JSON.parse(compressed);
    }
}

function updateStatus(text, connected = false) {
    statusText.textContent = text;
    if (connected) {
        statusDot.classList.add('connected');
    } else {
        statusDot.classList.remove('connected');
    }
}

function initPeerConnection() {
    pc = new RTCPeerConnection(config);

    pc.oniceconnectionstatechange = () => {
        const state = pc.iceConnectionState;
        if (state === 'connected') {
            updateStatus('Connected', true);
        } else if (state === 'disconnected') {
            updateStatus('Disconnected', false);
        } else if (state === 'failed') {
            updateStatus('Connection failed', false);
        } else if (state === 'checking') {
            updateStatus('Connecting...', false);
        }
    };

    pc.ontrack = (e) => {
        if (remoteVideo.srcObject !== e.streams[0]) {
            remoteVideo.srcObject = e.streams[0];
            remotePlaceholder.style.display = 'none';
            updateStatus('Receiving stream', true);
        }
    };

    if (localStream) {
        localStream.getTracks().forEach(track => {
            pc.addTrack(track, localStream);
        });
    }

    createOfferBtn.disabled = false;
    createAnswerBtn.disabled = false;
}

startBtn.addEventListener('click', async () => {
    try {
        localStream = await navigator.mediaDevices.getDisplayMedia({
            video: { cursor: 'always' },
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 44100
            }
        });

        localVideo.srcObject = localStream;
        localPlaceholder.style.display = 'none';
        startBtn.disabled = true;
        stopBtn.disabled = false;
        updateStatus('Screen sharing active');

        initPeerConnection();

        localStream.getVideoTracks()[0].onended = () => {
            stopSharing();
        };

    } catch (err) {
        console.error('Error:', err);
        updateStatus('Failed to start');
        alert('Failed to capture screen. Please grant permission and select "Share audio" if available.');
    }
});

stopBtn.addEventListener('click', () => {
    stopSharing();
});

function stopSharing() {
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }
    localVideo.srcObject = null;
    localPlaceholder.style.display = 'flex';
    startBtn.disabled = false;
    stopBtn.disabled = true;
    updateStatus('Sharing stopped');
}

createOfferBtn.addEventListener('click', async () => {
    if (!pc) {
        alert('Please start screen sharing first!');
        return;
    }

    try {
        updateStatus('Creating offer...');
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        await new Promise((resolve) => {
            if (pc.iceGatheringState === 'complete') {
                resolve();
            } else {
                const checkState = () => {
                    if (pc.iceGatheringState === 'complete') {
                        pc.removeEventListener('icegatheringstatechange', checkState);
                        resolve();
                    }
                };
                pc.addEventListener('icegatheringstatechange', checkState);
            }
        });

        const offerData = {
            type: 'offer',
            sdp: pc.localDescription.sdp
        };

        const compressed = compressData(offerData);
        signalingData.value = compressed;
        signalingData.select();
        document.execCommand('copy');
        updateStatus(`Offer created (${compressed.length} chars)`);
    } catch (err) {
        console.error('Error:', err);
        updateStatus('Failed to create offer');
    }
});

createAnswerBtn.addEventListener('click', async () => {
    if (!pc) {
        alert('Please set the remote offer first!');
        return;
    }

    try {
        updateStatus('Creating answer...');
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        await new Promise((resolve) => {
            if (pc.iceGatheringState === 'complete') {
                resolve();
            } else {
                const checkState = () => {
                    if (pc.iceGatheringState === 'complete') {
                        pc.removeEventListener('icegatheringstatechange', checkState);
                        resolve();
                    }
                };
                pc.addEventListener('icegatheringstatechange', checkState);
            }
        });

        const answerData = {
            type: 'answer',
            sdp: pc.localDescription.sdp
        };

        const compressed = compressData(answerData);
        signalingData.value = compressed;
        signalingData.select();
        document.execCommand('copy');
        updateStatus(`Answer created (${compressed.length} chars)`);
    } catch (err) {
        console.error('Error:', err);
        updateStatus('Failed to create answer');
    }
});

setRemoteBtn.addEventListener('click', async () => {
    try {
        updateStatus('Setting remote description...');
        const data = decompressData(signalingData.value.trim());
        
        if (!pc) {
            initPeerConnection();
        }
        
        await pc.setRemoteDescription(new RTCSessionDescription(data));
        updateStatus(`Remote ${data.type} set successfully`);
        
        if (data.type === 'offer') {
            createAnswerBtn.disabled = false;
        }
        
        signalingData.value = '';
        charCount.textContent = '0 chars';
    } catch (err) {
        console.error('Error:', err);
        updateStatus('Invalid connection code');
        alert('Invalid connection code. Please check and try again.');
    }
});

// Fullscreen functionality
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        remoteCard.requestFullscreen().catch(err => {
            console.error('Fullscreen error:', err);
        });
    } else {
        document.exitFullscreen();
    }
});

document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        remoteCard.classList.add('fullscreen');
    } else {
        remoteCard.classList.remove('fullscreen');
    }
});

// Initialize
updateStatus('Ready to connect');
