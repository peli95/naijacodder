# 🎨 Meme Coloring Gallery

A beautiful web application where users can select black-and-white meme sketches and color them with an interactive canvas drawing tool. Features payment integration through Paystack to remove watermarks.

## ✨ Features

- **Gallery of Meme Sketches**: Choose from popular memes like Drake, Woman Yelling at Cat, Distracted Boyfriend, and This is Fine Dog
- **Interactive Canvas Drawing**: 
  - Brush tool with adjustable size (2-20px)
  - Color palette with 10 preset colors plus custom color picker
  - Undo functionality (up to 20 steps)
  - Clear canvas option
- **Download & Share**:
  - Download artwork with watermark (free)
  - Share modal with preview
  - Pay ₦500 via Paystack to remove watermark
- **Mobile Responsive**: Touch-friendly interface that works on all devices
- **Modern UI**: Beautiful gradient background, smooth animations, and intuitive design

## 🚀 Quick Start

1. **Clone or download** this repository
2. **Install dependencies** (optional, for development server):
   ```bash
   npm install
   ```
3. **Run the application**:
   ```bash
   # Option 1: Using npm script
   npm start
   
   # Option 2: Using any web server
   npx http-server . -p 3000 -o
   
   # Option 3: Open index.html directly in browser
   ```

## 🎮 How to Use

1. **Select a Meme**: Click on any meme sketch from the gallery
2. **Start Coloring**:
   - Choose a color from the palette or use the custom color picker
   - Adjust brush size with the slider
   - Draw on the canvas to color the meme
3. **Use Tools**:
   - **Undo**: Remove the last drawing action
   - **Clear**: Reset the entire canvas
   - **Download**: Save your artwork
   - **Share**: Preview with watermark
4. **Remove Watermark**: Pay ₦500 via Paystack to download clean artwork

## 💳 Payment Integration

The app integrates with **Paystack** for processing payments:

- **Test Mode**: Currently configured with test keys
- **Production Setup**: Replace the test key in `script.js`:
  ```javascript
  key: 'pk_live_your_paystack_public_key_here'
  ```
- **Backend Verification**: Add server-side payment verification for production

## 🛠️ Technical Details

### Technologies Used
- **HTML5 Canvas** for drawing functionality
- **Vanilla JavaScript** for interactivity
- **CSS3** with modern features (Grid, Flexbox, Animations)
- **Paystack Inline** for payment processing
- **SVG** for scalable meme sketches

### File Structure
```
📁 meme-coloring-gallery/
├── 📄 index.html          # Main HTML structure
├── 📄 styles.css          # Modern CSS styling
├── 📄 script.js           # JavaScript functionality
├── 📄 package.json        # Project configuration
└── 📄 README.md           # Documentation
```

### Key Features Implementation
- **Canvas Layering**: Two-layer system (coloring + sketch)
- **Touch Support**: Mobile-friendly touch events
- **Responsive Design**: Adapts to all screen sizes
- **State Management**: Undo stack with 20-step history
- **Image Generation**: Dynamic canvas-to-image conversion

## 🎨 Customization

### Adding New Memes
1. Create SVG sketch (600x450px recommended)
2. Convert to base64 data URL
3. Add to `memeImages` object in `script.js`
4. Add gallery item in `index.html`

### Styling
- Modify colors in `styles.css`
- Gradient background can be changed in the `body` selector
- Button styles in `.btn` classes

### Payment Configuration
- Update Paystack public key in `processPayment()` function
- Modify amount (currently 50000 kobo = ₦500)
- Add backend verification endpoint

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment

### Static Hosting (Recommended)
- **Netlify**: Drag and drop the folder
- **Vercel**: `vercel --prod`
- **GitHub Pages**: Push to repository and enable Pages

### Server Setup
For production with payment processing:
1. Set up backend server for payment verification
2. Configure Paystack webhook endpoints
3. Add user authentication (optional)
4. Implement artwork storage (optional)

## 📄 License

MIT License - feel free to use, modify, and distribute!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 💡 Future Enhancements

- User accounts and artwork gallery
- More meme templates
- Social sharing features
- Advanced drawing tools (shapes, text)
- Print functionality
- Collaborative coloring sessions

---

**Enjoy coloring your favorite memes!** 🎨✨
