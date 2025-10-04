# StreamLink - P2P Screen Sharing

![StreamLink Banner](https://img.shields.io/badge/WebRTC-Powered-blue?style=for-the-badge&logo=webrtc)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

A professional, fully static web application for peer-to-peer screen sharing with audio over WebRTC. No backend required, no dependencies, just pure HTML, CSS, and JavaScript.

## ✨ Features

- 🖥️ **Screen + Audio Sharing** - Share your entire screen with system audio and microphone
- 🔐 **P2P Connection** - Direct peer-to-peer streaming via WebRTC (no server in the middle)
- 🗜️ **Compressed Signaling** - Short connection codes instead of long JSON blobs
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ⛶ **Fullscreen Mode** - Immersive viewing experience for remote streams
- 🎨 **Professional UI** - Clean, modern interface with smooth animations
- 🚀 **Zero Dependencies** - No frameworks, no build tools, no npm packages
- 🔒 **Privacy First** - All data stays between peers, nothing stored on servers

## 🚀 Quick Start

### Option 1: Direct Usage
1. Demo: [StreamLink]([https://webrtc.org](https://sachinsonii.github.io/Sream-Link/))
2. Open it in any modern browser (Chrome, Edge, Firefox, Safari)
3. Done! No installation or setup required

### Option 2: Host It Yourself
```bash
# Clone the repository
git clone https://github.com/yourusername/streamlink.git

# Navigate to the directory
cd streamlink

# Open with any static server (or just double-click the HTML file)
python -m http.server 8000
# or
npx serve
```

Then visit `http://localhost:8000/streamlink.html`

## 📖 How to Use

### For the Sender (Screen Sharer):

1. Click **"Start Sharing"** button
2. Select which screen/window to share
3. ✅ Make sure to check **"Share audio"** in the dialog
4. Click **"Create Offer"** button
5. Copy the generated code and send it to the receiver via any messaging app

### For the Receiver:

1. Paste the offer code in the textarea
2. Click **"Set Remote"** button
3. Click **"Create Answer"** button
4. Copy the answer code and send it back to the sender

### Final Step (Sender):

1. Paste the answer code
2. Click **"Set Remote"** button
3. Connection establishes automatically! 🎉

## 🛠️ Technical Details

### Technology Stack
- **WebRTC** - RTCPeerConnection API for P2P streaming
- **getDisplayMedia** - Screen capture with audio support
- **Base64 Encoding** - Compressed signaling for easy code sharing
- **STUN Servers** - Google's public STUN for NAT traversal

### Browser Support
| Browser | Minimum Version | Screen Audio |
|---------|----------------|--------------|
| Chrome  | 72+            | ✅ Full      |
| Edge    | 79+            | ✅ Full      |
| Firefox | 66+            | ⚠️ Limited   |
| Safari  | 13+            | ❌ No        |

*Note: System audio sharing is best supported in Chromium-based browsers*

### Architecture
```
┌─────────────┐                    ┌─────────────┐
│   Sender    │                    │  Receiver   │
│             │                    │             │
│  ┌───────┐  │   Offer (Code)     │  ┌───────┐  │
│  │Screen │  │ ─────────────────> │  │       │  │
│  │Capture│  │                    │  │       │  │
│  └───────┘  │   Answer (Code)    │  └───────┘  │
│             │ <───────────────── │             │
│  WebRTC     │                    │  WebRTC     │
│  Peer       │ ══════════════════ │  Peer       │
│             │   P2P Video/Audio  │             │
└─────────────┘                    └─────────────┘
```

## 🔧 Configuration

### Custom STUN/TURN Servers
Edit the `config` object in the JavaScript section:

```javascript
const config = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { 
            urls: 'turn:your-turn-server.com',
            username: 'user',
            credential: 'pass'
        }
    ]
};
```

### Video Quality Settings
Modify the `getDisplayMedia` constraints:

```javascript
video: {
    cursor: 'always',
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    frameRate: { ideal: 30 }
}
```

## 🎨 Customization

### Change Theme Colors
Edit CSS variables in the `:root` section:

```css
:root {
    --primary: #2563eb;        /* Main brand color */
    --success: #10b981;        /* Success/connected state */
    --danger: #ef4444;         /* Error/stop state */
}
```

### Modify Logo
Replace the logo text in the HTML:

```html
<div class="logo">SL</div>  <!-- Change to your initials -->
<h1>StreamLink</h1>         <!-- Change to your app name -->
```

## 🐛 Troubleshooting

### Connection Not Establishing?
- Ensure both users are on networks that allow WebRTC (some corporate firewalls block it)
- Try using a TURN server for networks behind strict NAT
- Check browser console for detailed error messages

### No Audio in Stream?
- Make sure to check "Share audio" when selecting screen
- System audio works best on Chrome/Edge
- Some browsers don't support system audio capture

### Screen Share Permission Denied?
- Grant screen sharing permission in browser settings
- On macOS, enable Screen Recording in System Preferences → Privacy

## 📋 Roadmap

- [ ] QR code generation for connection codes
- [ ] Chat functionality during screen share
- [ ] Recording capability
- [ ] Multiple peer support (broadcast to multiple viewers)
- [ ] Connection statistics display
- [ ] Dark mode toggle
- [ ] Mobile app version

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- WebRTC API documentation from MDN
- STUN servers provided by Google
- Inspiration from various open-source WebRTC projects

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check existing issues for solutions
- Read the WebRTC documentation at [webrtc.org](https://webrtc.org)

## ⭐ Star History

If you find this project useful, please consider giving it a star!

---
**Built with ❤️ using pure Web Technologies**

*No frameworks were harmed in the making of this application*
