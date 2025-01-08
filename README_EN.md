# 🖼️ Image Compression Tool

An elegant and easy-to-use image compression tool that supports batch processing, custom settings, and folder categorization.

English | [繁體中文](./README.md)

## ✨ Features

- 🎯 Simple drag-and-drop interface
- 📊 Real-time compression preview
- 📁 Folder drag-and-drop with auto-categorization
- 🎨 Individual compression settings per image
- 🌓 Dark/Light theme switch
- 🌏 English/Chinese interface
- 💾 Batch download compressed images
- 📱 Responsive design for all devices

## 🛠️ Functions

### Image Processing
- Supports JPG, PNG, GIF formats
- Adjustable compression quality (10% - 100%)
- Adjustable image size (25% - 100%)
- Real-time size preview

### Category Management
- Automatic folder structure recognition
- Expandable/Collapsible categories
- Deletable categories
- Auto-categorization for uncategorized images

### Custom Settings
- Global compression parameters
- Individual image settings
- Real-time setting preview

### Additional Features
- Batch compression progress display
- One-click download all
- Dark mode support
- Language switching

## 🚀 Quick Start

### Online Usage
Visit: [Image Compression Tool](https://pinstudios.rr.nu/image-compression-tool/)

### Local Setup
1. Clone the repository
```
git clone https://github.com/yeongpin/image-compression-tool.git
```

2. Enter project directory
```
cd image-compression-tool
```

3. Choose one of the following methods to run a local server:

#### Using VS Code Live Server
1. Install VS Code extension "Live Server"
2. Right-click index.html, select "Open with Live Server"
3. Browser will automatically open `http://localhost:5500`

#### Using Node.js
1. Install Node.js and npm
2. Install http-server
```
npm install -g http-server
```
3. Run server
```
http-server -p 8080
```
4. Visit `http://localhost:8080`

#### Using Python
```
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
Visit `http://localhost:8000`

## 📂 Project Structure
```
image-compression-tool/
├── index.html           # Main page
├── script/             # Script directory
│   └── script.js       # Main script
├── locale/             # Language directory
│   ├── en.json        # English translations
│   └── tw.json        # Traditional Chinese translations
├── style/              # Style directory
│   └── style.css      # Main stylesheet
├── README.md           # Chinese documentation
├── README_EN.md        # English documentation
└── LICENSE             # License file
```

## 📊 Browser Support

| Browser | Supported Version |
|---------|------------------|
| Chrome  | >= 60            |
| Firefox | >= 60            |
| Safari  | >= 11            |
| Edge    | >= 79            |

## 🙏 Acknowledgments

- [JSZip](https://stuk.github.io/jszip/) - File compression
- [Font Awesome](https://fontawesome.com/) - Icon support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details. 