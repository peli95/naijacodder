# 🎨 Meme Coloring Gallery

A beautiful web application where users can select black-and-white meme sketches and color them with an interactive canvas drawing tool. Features payment integration through Paystack to remove watermarks.

**📦 Ready for Vercel deployment as a static site!**

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

## 🚀 Deploy to Vercel

### Option 1: Deploy from GitHub (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add meme coloring gallery"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure deployment settings:
     - **Framework Preset**: Other
     - **Build Command**: (leave empty)
     - **Output Directory**: `public`
     - **Install Command**: (leave empty)

3. **Deploy**: Click "Deploy" and your app will be live!

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Follow prompts:
# - Framework: Other
# - Build Command: (leave empty)
# - Output Directory: public
```

## 🛠️ Local Development

```bash
# Clone repository
git clone <your-repo-url>
cd meme-coloring-gallery

# Install dev dependencies (optional)
npm install

# Start local server
npm run dev

# Or manually serve public folder
cd public && npx http-server . -p 3000 -o
```

## 📁 Project Structure

```
📁 meme-coloring-gallery/
├── 📁 public/                 # Static files for deployment
│   ├── 📄 index.html          # Main HTML structure
│   ├── 📄 styles.css          # Modern CSS styling
│   └── 📄 script.js           # JavaScript functionality
├── 📄 package.json            # Project configuration
├── 📄 vercel.json             # Vercel deployment config
└── 📄 README.md               # Documentation
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

## 💳 Payment Integration Setup

The app integrates with **Paystack** for processing payments:

### For Production:
1. **Get Paystack API Keys**:
   - Sign up at [paystack.com](https://paystack.com)
   - Get your public key from the dashboard

2. **Update Payment Configuration**:
   - Edit `public/script.js`
   - Replace the test key:
   ```javascript
   // In processPayment() function
   key: 'pk_live_your_paystack_public_key_here'
   ```

3. **Set up Webhook Verification** (Optional):
   - Add backend server for payment verification
   - Configure webhook endpoints in Paystack dashboard

## 🛠️ Technical Details

### Technologies Used
- **HTML5 Canvas** for drawing functionality
- **Vanilla JavaScript** for interactivity
- **CSS3** with modern features (Grid, Flexbox, Animations)
- **Paystack Inline** for payment processing
- **SVG** for scalable meme sketches

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
3. Add to `memeImages` object in `public/script.js`
4. Add gallery item in `public/index.html`

### Styling
- Modify colors in `public/styles.css`
- Gradient background can be changed in the `body` selector
- Button styles in `.btn` classes

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Other Deployment Options

### Netlify
1. Drag and drop the `public/` folder to [netlify.com](https://netlify.com)
2. Or connect GitHub repository with build settings:
   - Build command: (leave empty)
   - Publish directory: `public`

### GitHub Pages
1. Push `public/` folder contents to `gh-pages` branch
2. Enable GitHub Pages in repository settings

### Cloudflare Pages
1. Connect GitHub repository
2. Set build output directory to `public`

## 🔧 Environment Variables (Optional)

For production deployments with backend integration:

```env
PAYSTACK_PUBLIC_KEY=pk_live_your_key_here
PAYSTACK_SECRET_KEY=sk_live_your_secret_here
```

## 📄 License

MIT License - feel free to use, modify, and distribute!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test in `public/` folder
5. Submit a pull request

## 💡 Future Enhancements

- User accounts and artwork gallery
- More meme templates
- Social sharing features
- Advanced drawing tools (shapes, text)
- Print functionality
- Backend for payment verification
- Collaborative coloring sessions

---

**Ready to deploy! 🚀 Your meme coloring gallery is optimized for Vercel static hosting.**

## 🆘 Troubleshooting

**Deployment Issues:**
- Ensure `public/` folder contains all files
- Verify Vercel output directory is set to `public`
- Check browser console for any errors

**Payment Issues:**
- Verify Paystack public key is correct
- Test with Paystack test keys first
- Check network connectivity for payment modal

**Canvas Issues:**
- Ensure browser supports HTML5 Canvas
- Check if JavaScript is enabled
- Test on different devices/browsers

---

**Enjoy coloring your favorite memes!** 🎨✨
