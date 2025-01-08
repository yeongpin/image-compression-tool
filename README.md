# 🖼️ Image Compression Tool

一個優雅且易用的圖片壓縮工具，支持批量處理、自定義設置和文件夾分類。

[English](./README_EN.md) | 繁體中文

## ✨ 特點

- 🎯 簡單直觀的拖放界面
- 📊 實時預覽壓縮效果
- 📁 支持文件夾拖放和自動分類
- 🎨 每張圖片可獨立設置壓縮參數
- 🌓 深色/淺色主題切換
- 🌏 支持中文/英文界面
- 💾 批量下載壓縮後的圖片
- 📱 響應式設計，支持各種設備

## 🛠️ 功能

### 圖片處理
- 支持 JPG、PNG、GIF 格式
- 可調整壓縮質量（10% - 100%）
- 可調整圖片尺寸（25% - 100%）
- 實時預覽壓縮後的大小

### 分類管理
- 自動識別文件夾結構
- 支持分類展開/收起
- 可刪除整個分類
- 未分類圖片自動歸類

### 自定義設置
- 全局壓縮參數設置
- 單張圖片獨立設置
- 設置實時預覽效果

### 其他功能
- 批量壓縮進度顯示
- 一鍵下載所有圖片
- 支持深色模式
- 中英文界面切換

## 🚀 快速開始

### 在線使用
訪問：[Image Compression Tool](https://pinstudios.rr.nu/image-compression-tool/)

### 本地運行
1. 克隆項目
```
git clone https://github.com/yeongpin/image-compression-tool.git
```

2. 進入項目目錄
```
cd image-compression-tool
```

3. 選擇以下任一方式運行本地服務器：

#### 使用 VS Code Live Server
1. 安裝 VS Code 擴展 "Live Server"
2. 右鍵 index.html，選擇 "Open with Live Server"
3. 自動打開瀏覽器訪問 `http://localhost:5500`

#### 使用 Node.js
1. 安裝 Node.js 和 npm
2. 安裝 http-server
```
npm install -g http-server
```
3. 運行服務器
```
http-server -p 8080
```
4. 訪問 `http://localhost:8080`

#### 使用 Python
```
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
訪問 `http://localhost:8000`

## 📂 項目結構
```
image-compression-tool/
├── index.html           # 主頁面
├── script/             # 腳本文件夾
│   └── script.js       # 主腳本
├── locale/             # 語言文件夾
│   ├── en.json        # 英文翻譯
│   └── tw.json        # 繁體中文翻譯
├── style/              # 樣式文件夾
│   └── style.css      # 主樣式表
├── README.md           # 中文說明文件
├── README_EN.md        # 英文說明文件
└── LICENSE             # 開源協議
```

## 📊 瀏覽器支持

| 瀏覽器 | 支持版本 |
|-------|---------|
| Chrome | >= 60   |
| Firefox| >= 60   |
| Safari | >= 11   |
| Edge   | >= 79   |

## 🙏 鳴謝

- [JSZip](https://stuk.github.io/jszip/) - 文件壓縮
- [Font Awesome](https://fontawesome.com/) - 圖標支持

## 📄 開源協議

本項目基於 MIT 協議開源，詳見 [LICENSE](./LICENSE) 文件。 