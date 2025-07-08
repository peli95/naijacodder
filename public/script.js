// Global variables
let currentMeme = null;
let isDrawing = false;
let currentColor = '#FF0000';
let brushSize = 10;
let undoStack = [];
let hasWatermarkRemoved = false;

// DOM elements
const gallery = document.getElementById('gallery');
const canvasSection = document.getElementById('canvas-section');
const coloringCanvas = document.getElementById('coloring-canvas');
const sketchCanvas = document.getElementById('sketch-canvas');
const ctx = coloringCanvas.getContext('2d');
const sketchCtx = sketchCanvas.getContext('2d');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    setupCanvas();
    updateBrushSizeDisplay();
    selectDefaultColor();
}

function setupEventListeners() {
    // Gallery items
    document.querySelectorAll('.meme-item').forEach(item => {
        item.addEventListener('click', () => selectMeme(item.dataset.meme));
    });

    // Navigation
    document.getElementById('back-btn').addEventListener('click', backToGallery);

    // Color selection
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', () => selectColor(option.dataset.color));
    });

    document.getElementById('custom-color').addEventListener('change', (e) => {
        selectColor(e.target.value);
    });

    // Brush size
    const brushSlider = document.getElementById('brush-size');
    brushSlider.addEventListener('input', (e) => {
        brushSize = parseInt(e.target.value);
        updateBrushSizeDisplay();
    });

    // Tool buttons
    document.getElementById('undo-btn').addEventListener('click', undo);
    document.getElementById('clear-btn').addEventListener('click', clearCanvas);
    document.getElementById('download-btn').addEventListener('click', downloadArtwork);
    document.getElementById('share-btn').addEventListener('click', showShareModal);

    // Modal events
    setupModalEvents();

    // Canvas drawing events
    setupCanvasEvents();
}

function setupCanvas() {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = 'multiply';
    
    // Clear the canvas with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, coloringCanvas.width, coloringCanvas.height);
    
    saveState();
}

function setupCanvasEvents() {
    // Mouse events
    coloringCanvas.addEventListener('mousedown', startDrawing);
    coloringCanvas.addEventListener('mousemove', draw);
    coloringCanvas.addEventListener('mouseup', stopDrawing);
    coloringCanvas.addEventListener('mouseout', stopDrawing);

    // Touch events for mobile
    coloringCanvas.addEventListener('touchstart', handleTouch);
    coloringCanvas.addEventListener('touchmove', handleTouch);
    coloringCanvas.addEventListener('touchend', stopDrawing);
}

function selectMeme(memeType) {
    currentMeme = memeType;
    loadMemeSketch(memeType);
    showCanvasSection();
}

function loadMemeSketch(memeType) {
    const memeImages = {
        drake: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8IS0tIERyYWtlIG1lbWUgc2tldGNoIC0tPgogIDxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDUwIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSI0Ii8+CiAgPCEtLSBUb3AgcGFuZWwgLS0+CiAgPGxpbmUgeDE9IjAiIHkxPSIyMjUiIHgyPSI2MDAiIHkyPSIyMjUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iNCIvPgogIDwhLS0gRHJha2UgZmFjZSAodG9wKSAtLT4KICA8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMTIiIHI9IjQ1IiBmaWxsPSJub25lIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiLz4KICA8Y2lyY2xlIGN4PSIxMzUiIGN5PSIxMDAiIHI9IjciIGZpbGw9ImJsYWNrIi8+CiAgPGNpcmNsZSBjeD0iMTY1IiBjeT0iMTAwIiByPSI3IiBmaWxsPSJibGFjayIvPgogIDxwYXRoIGQ9Ik0xMzUgMTI1IFEgMTUwIDEzNSAxNjUgMTI1IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz4KICA8IS0tIEhhbmQgKHRvcCkgLS0+CiAgPHBhdGggZD0iTTMwMCA2OCBMIDM2MCA0NSBMIDM5MCA2OCBMIDM2MCA5MCBAIC0tPgogIDxwYXRoIGQ9Ik0zMDAgNjggUSAzMzAgNTggMzYwIDQ1IFEgMzc1IDUwIDM5MCA2OCBRIDM3NSA4MCAzNjAgOTAgUSAzMzAgODAgMzAwIDY4IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz4KICA8IS0tIERyYWtlIGZhY2UgKGJvdHRvbSkgLS0+CiAgPGNpcmNsZSBjeD0iMTUwIiBjeT0iMzM3IiByPSI0NSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSI0Ii8+CiAgPGNpcmNsZSBjeD0iMTM1IiBjeT0iMzI1IiByPSI3IiBmaWxsPSJibGFjayIvPgogIDxjaXJjbGUgY3g9IjE2NSIgY3k9IjMyNSIgcj0iNyIgZmlsbD0iYmxhY2siLz4KICA8cGF0aCBkPSJNMTM1IDM1MCBRIDE1MCAzNjAgMTY1IDM1MCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIi8+CiAgPCEtLSBQb2ludGluZyBoYW5kIChib3R0b20pIC0tPgogIDxwYXRoIGQ9Ik0zMDAgMjkzIEwgNDIwIDI5MyBMIDQzNSAzMDggTCA0MjAgMzIzIEwgMzAwIDMyMyBaIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz4KICA8dGV4dCB4PSIzNjAiIHk9IjE1OCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI3IiBmaWxsPSJibGFjayI+Tk88L3RleHQ+CiAgPHRleHQgeD0iMzYwIiB5PSIzODMiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNyIgZmlsbD0iYmxhY2siPllFUzwvdGV4dD4KPC9zdmc+',
        
        woman_cat: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8IS0tIFdvbWFuIHllbGxpbmcgYXQgY2F0IG1lbWUgc2tldGNoIC0tPgogIDxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDUwIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSI0Ii8+CiAgPCEtLSBEaXZpZGVyIC0tPgogIDxsaW5lIHgxPSIzMDAiIHkxPSIwIiB4Mj0iMzAwIiB5Mj0iNDUwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiLz4KICA8IS0tIFdvbWFuIGZhY2UgKGxlZnQpIC0tPgogIDxjaXJjbGUgY3g9IjE1MCIgY3k9IjE4MCIgcj0iNzUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iNCIvPgogIDwhLS0gQW5ncnkgZXllcyAtLT4KICA8bGluZSB4MT0iMTIwIiB5MT0iMTUwIiB4Mj0iMTM1IiB5Mj0iMTY1IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiLz4KICA8bGluZSB4MT0iMTM1IiB5MT0iMTUwIiB4Mj0iMTIwIiB5Mj0iMTY1IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiLz4KICA8bGluZSB4MT0iMTY1IiB5MT0iMTUwIiB4Mj0iMTgwIiB5Mj0iMTY1IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiLz4KICA8bGluZSB4MT0iMTgwIiB5MT0iMTUwIiB4Mj0iMTY1IiB5Mj0iMTY1IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiLz4KICA8IS0tIE1vdXRoIC0tPgogIDxlbGxpcHNlIGN4PSIxNTAiIGN5PSIyMTAiIHJ4PSIyNCIgcnk9IjE1IiBmaWxsPSJub25lIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiLz4KICA8IS0tIFBvaW50aW5nIGFybSAtLT4KICA8bGluZSB4MT0iMjI1IiB5MT0iMjEwIiB4Mj0iMjg1IiB5Mj0iMjEwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjYiLz4KICA8IS0tIENhdCAocmlnaHQpIC0tPgogIDwhLS0gQ2F0IGJvZHkgLS0+CiAgPGVsbGlwc2UgY3g9IjQ1MCIgY3k9IjI0MCIgcng9IjkwIiByeT0iNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iNCIvPgogIDwhLS0gQ2F0IGhlYWQgLS0+CiAgPGNpcmNsZSBjeD0iNDUwIiBjeT0iMTUwIiByPSI0NSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSI0Ii8+CiAgPCEtLSBDYXQgZWFycyAtLT4KICA8cG9seWdvbiBwb2ludHM9IjQwNSwxMjAgNDIwLDkwIDQzNSwxMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iNCIvPgogIDxwb2x5Z29uIHBvaW50cz0iNDY1LDEyMCA0ODAsOTAgNDk1LDEyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSI0Ii8+CiAgPCEtLSBDYXQgZXllcyAtLT4KICA8Y2lyY2xlIGN4PSI0MzUiIGN5PSIxNDEiIHI9IjYiIGZpbGw9ImJsYWNrIi8+CiAgPGNpcmNsZSBjeD0iNDY1IiBjeT0iMTQxIiByPSI2IiBmaWxsPSJibGFjayIvPgogIDwhLS0gQ2F0IG5vc2UgLS0+CiAgPHBvbHlnb24gcG9pbnRzPSI0NDQsMTU2IDQ1NiwxNTYgNDUwLDE2MiIgZmlsbD0iYmxhY2siLz4KICA8IS0tIENhdCBtb3V0aCAtLT4KICA8cGF0aCBkPSJNNDM1IDE2OCBRIDQ1MCAyNzQgNDY1IDE2OCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJub25lIi8+CiAgPCEtLSBUYWJsZSAtLT4KICA8bGluZSB4MT0iMzYwIiB5MT0iMzAwIiB4Mj0iNTQwIiB5Mj0iMzAwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiLz4KPC9zdmc+',
        
        distracted_boyfriend: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8IS0tIERpc3RyYWN0ZWQgYm95ZnJpZW5kIG1lbWUgc2tldGNoIC0tPgogIDxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDUwIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSI0Ii8+CiAgPCEtLSBCb3lmcmllbmQgKGNlbnRlcikgLS0+CiAgPGNpcmNsZSBjeD0iMzAwIiBjeT0iMTIwIiByPSI0NSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSI0Ii8+CiAgPGVsbGlwc2UgY3g9IjMwMCIgY3k9IjIxMCIgcng9IjM2IiByeT0iNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iNCIvPgogIDwhLS0gRXllcyBsb29raW5nIHJpZ2h0IC0tPgogIDxjaXJjbGUgY3g9IjMwNiIgY3k9IjExMSIgcj0iNiIgZmlsbD0iYmxhY2siLz4KICA8Y2lyY2xlIGN4PSIzMDYiIGN5PSIxMjkiIHI9IjYiIGZpbGw9ImJsYWNrIi8+CiAgPCEtLSBBcm0gcG9pbnRpbmcgLS0+CiAgPGxpbmUgeDE9IjMzNiIgeTE9IjE4MCIgeDI9IjQyMCIgeTI9IjE1MCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSI2Ii8+CiAgPCEtLSBHaXJsZnJpZW5kIChsZWZ0KSAtLT4KICA8Y2lyY2xlIGN4PSIxMjAiIGN5PSIxNTAiIHI9IjM2IiBmaWxsPSJub25lIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiLz4KICA8ZWxsaXBzZSBjeD0iMTIwIiBjeT0iMjI1IiByeD0iMzAiIHJ5PSI1NCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSI0Ii8+CiAgPCEtLSBBbmdyeSBleHByZXNzaW9uIC0tPgogIDxsaW5lIHgxPSIxMDUiIHkxPSIxMzUiIHgyPSIxMjAiIHkyPSIxNTAiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iNCIvPgogIDxsaW5lIHgxPSIxMjAiIHkxPSIxMzUiIHgyPSIxMzUiIHkyPSIxNTAiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iNCIvPgogIDwhLS0gT3RoZXIgd29tYW4gKHJpZ2h0KSAtLT4KICA8Y2lyY2xlIGN4PSI0ODAiIGN5PSIxODAiIHI9IjM2IiBmaWxsPSJub25lIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiLz4KICA8ZWxsaXBzZSBjeD0iNDgwIiBjeT0iMjU1IiByeD0iMzAiIHJ5PSI1NCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSI0Ii8+CiAgPCEtLSBTbWlsaW5nIC0tPgogIDxjaXJjbGUgY3g9IjQ3MSIgY3k9IjE3MSIgcj0iNiIgZmlsbD0iYmxhY2siLz4KICA8Y2lyY2xlIGN4PSI0ODkiIGN5PSIxNzEiIHI9IjYiIGZpbGw9ImJsYWNrIi8+CiAgPHBhdGggZD0iTTQ2NSAxOTUgUSA0ODAgMjA0IDQ5NSAxOTUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4=',
        
        this_is_fine: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8IS0tIFRoaXMgaXMgZmluZSBkb2cgbWVtZSBza2V0Y2ggLS0+CiAgPHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0NTAiIGZpbGw9IndoaXRlIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiLz4KICA8IS0tIERvZyBib2R5IC0tPgogIDxlbGxpcHNlIGN4PSIyNDAiIGN5PSIyNDAiIHJ4PSI3NSIgcnk9IjYwIiBmaWxsPSJub25lIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiLz4KICA8IS0tIERvZyBoZWFkIC0tPgogIDxjaXJjbGUgY3g9IjE4MCIgY3k9IjE4MCIgcj0iNTQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iNCIvPgogIDwhLS0gRG9nIGVhcnMgLS0+CiAgPGVsbGlwc2UgY3g9IjE0NCIgY3k9IjE1MCIgcng9IjI0IiByeT0iMzYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iNCIvPgogIDxlbGxpcHNlIGN4PSIyMTYiIGN5PSIxNTAiIHJ4PSIyNCIgcnk9IjM2IiBmaWxsPSJub25lIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiLz4KICA8IS0tIERvZyBleWVzIC0tPgogIDxjaXJjbGUgY3g9IjE2NSIgY3k9IjE3MSIgcj0iOSIgZmlsbD0iYmxhY2siLz4KICA8Y2lyY2xlIGN4PSIxOTUiIGN5PSIxNzEiIHI9IjkiIGZpbGw9ImJsYWNrIi8+CiAgPCEtLSBEb2cgbm9zZSAtLT4KICA8ZWxsaXBzZSBjeD0iMTgwIiBjeT0iMTk1IiByeD0iOSIgcnk9IjYiIGZpbGw9ImJsYWNrIi8+CiAgPCEtLSBEb2cgbW91dGggLS0+CiAgPHBhdGggZD0iTTE2NSAyMTAgUSAxODAgMjE5IDE5NSAyMTAiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIvPgogIDwhLS0gQ29mZmVlIGN1cCAtLT4KICA8cmVjdCB4PSIyNTUiIHk9IjIxMCIgd2lkdGg9IjQ1IiBoZWlnaHQ9IjYwIiBmaWxsPSJub25lIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiLz4KICA8cGF0aCBkPSJNMzAwIDIyNSBMIDMxNSAyMjUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIvPgogIDwhLS0gRmlyZSBmbGFtZXMgLS0+CiAgPHBhdGggZD0iTTM2MCAyMCBRIDM3NSA5MCAzOTAgMTIwIFEgNDA1IDkwIDQyMCAxMjAgUSA0MzUgMTA1IDQ1MCAyMCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIi8+CiAgPHBhdGggZD0iTTQyMCAxODAgUSA0MzUgMTUwIDQ1MCAzODAgUSA0NjUgMTUwIDQ4MCAyODAgUSA0OTUgMTY1IDUxMCAyOCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIi8+CiAgPHBhdGggZD0iTTMzMCAyNDAgUSAzNDUgMjEwIDM2MCAyNDAgUSAzNzUgMjEwIDM5MCAyNDAgUSA0MDUgMjI1IDQyMCAyNTUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIvPgogIDwhLS0gVGV4dCAtLT4KICA8dGV4dCB4PSI5MCIgeT0iMzkwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDIiIGZpbGw9ImJsYWNrIj5UaGlzIGlzIGZpbmUuPC90ZXh0Pgo8L3N2Zz4='
    };

    const img = new Image();
    img.onload = function() {
        sketchCtx.clearRect(0, 0, sketchCanvas.width, sketchCanvas.height);
        sketchCtx.drawImage(img, 0, 0, sketchCanvas.width, sketchCanvas.height);
    };
    img.src = memeImages[memeType];

    // Update canvas title
    document.getElementById('canvas-title').textContent = `Color Your ${memeType.replace('_', ' ')} Meme`;
}

function showCanvasSection() {
    gallery.classList.add('hidden');
    canvasSection.classList.remove('hidden');
    hasWatermarkRemoved = false;
}

function backToGallery() {
    canvasSection.classList.add('hidden');
    gallery.classList.remove('hidden');
    clearCanvas();
}

function selectColor(color) {
    currentColor = color;
    
    // Update visual selection
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    const selectedOption = document.querySelector(`[data-color="${color}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
    
    // Update custom color picker
    document.getElementById('custom-color').value = color;
}

function selectDefaultColor() {
    selectColor('#FF0000');
}

function updateBrushSizeDisplay() {
    document.getElementById('brush-size-display').textContent = `${brushSize}px`;
}

function startDrawing(e) {
    isDrawing = true;
    saveState();
    
    const rect = coloringCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function draw(e) {
    if (!isDrawing) return;
    
    const rect = coloringCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath();
}

function handleTouch(e) {
    e.preventDefault();
    const rect = coloringCanvas.getBoundingClientRect();
    const touch = e.touches[0];
    
    const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                     e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    
    coloringCanvas.dispatchEvent(mouseEvent);
}

function saveState() {
    undoStack.push(ctx.getImageData(0, 0, coloringCanvas.width, coloringCanvas.height));
    if (undoStack.length > 20) {
        undoStack.shift();
    }
}

function undo() {
    if (undoStack.length > 1) {
        undoStack.pop();
        const previousState = undoStack[undoStack.length - 1];
        ctx.putImageData(previousState, 0, 0);
    }
}

function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, coloringCanvas.width, coloringCanvas.height);
    saveState();
}

function downloadArtwork() {
    if (hasWatermarkRemoved) {
        downloadClean();
    } else {
        showShareModal();
    }
}

function downloadClean() {
    const finalCanvas = createFinalCanvas(false);
    const link = document.createElement('a');
    link.download = `${currentMeme}_colored.png`;
    link.href = finalCanvas.toDataURL();
    link.click();
}

function downloadWithWatermark() {
    const finalCanvas = createFinalCanvas(true);
    const link = document.createElement('a');
    link.download = `${currentMeme}_colored_watermarked.png`;
    link.href = finalCanvas.toDataURL();
    link.click();
}

function createFinalCanvas(withWatermark = false) {
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = coloringCanvas.width;
    finalCanvas.height = coloringCanvas.height;
    const finalCtx = finalCanvas.getContext('2d');
    
    // Draw coloring layer
    finalCtx.drawImage(coloringCanvas, 0, 0);
    
    // Draw sketch on top
    finalCtx.globalCompositeOperation = 'multiply';
    finalCtx.drawImage(sketchCanvas, 0, 0);
    
    // Add watermark if needed
    if (withWatermark) {
        finalCtx.globalCompositeOperation = 'source-over';
        finalCtx.font = '48px Arial';
        finalCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        finalCtx.textAlign = 'center';
        finalCtx.save();
        finalCtx.translate(finalCanvas.width / 2, finalCanvas.height / 2);
        finalCtx.rotate(-Math.PI / 4);
        finalCtx.fillText('MEME COLORING GALLERY', 0, 0);
        finalCtx.restore();
    }
    
    return finalCanvas;
}

function showShareModal() {
    const modal = document.getElementById('share-modal');
    const shareCanvas = document.getElementById('share-canvas');
    const shareCtx = shareCanvas.getContext('2d');
    
    // Create preview with watermark
    const previewCanvas = createFinalCanvas(true);
    shareCtx.drawImage(previewCanvas, 0, 0, shareCanvas.width, shareCanvas.height);
    
    modal.classList.add('show');
}

function setupModalEvents() {
    // Close modals
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModals);
    });
    
    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModals();
            }
        });
    });
    
    // Download with watermark
    document.getElementById('download-with-watermark').addEventListener('click', () => {
        downloadWithWatermark();
        closeModals();
    });
    
    // Remove watermark buttons
    document.getElementById('remove-watermark-btn').addEventListener('click', showPaymentModal);
    document.getElementById('pay-btn').addEventListener('click', processPayment);
}

function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('show');
    });
}

function showPaymentModal() {
    closeModals();
    document.getElementById('payment-modal').classList.add('show');
}

function processPayment() {
    // Initialize Paystack payment
    PaystackPop.setup({
        key: 'pk_test_your_paystack_public_key_here', // Replace with your actual Paystack public key
        email: 'user@example.com', // You might want to collect this from user
        amount: 50000, // Amount in kobo (₦500)
        currency: 'NGN',
        ref: generateReference(),
        onClose: function() {
            alert('Payment window closed');
        },
        callback: function(response) {
            // Payment successful
            hasWatermarkRemoved = true;
            closeModals();
            alert('Payment successful! You can now download without watermark.');
            downloadClean();
            
            // Here you would typically verify the payment on your backend
            console.log('Payment reference:', response.reference);
        }
    });
}

function generateReference() {
    const date = new Date();
    return `meme_${date.getTime()}`;
}

// Utility functions
function resizeCanvasForMobile() {
    if (window.innerWidth <= 768) {
        const container = document.querySelector('.canvas-wrapper');
        const containerWidth = container.clientWidth - 6; // Account for border
        const aspectRatio = 450 / 600;
        const newHeight = containerWidth * aspectRatio;
        
        coloringCanvas.style.width = containerWidth + 'px';
        coloringCanvas.style.height = newHeight + 'px';
        sketchCanvas.style.width = containerWidth + 'px';
        sketchCanvas.style.height = newHeight + 'px';
    }
}

// Handle window resize
window.addEventListener('resize', resizeCanvasForMobile);

// Initialize mobile responsive canvas
resizeCanvasForMobile();