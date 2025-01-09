let i18n = null; // 存儲當前語言的翻譯

// 加載語言文件
async function loadLanguage(lang) {
    try {
        const response = await fetch(`locale/${lang.toLowerCase()}.json`);
        i18n = await response.json();
        // 只有在 DOM 加載完成後才更新 UI
        if (document.readyState === 'complete') {
            updateUILanguage();
        }
    } catch (error) {

    }
}

// 獲取翻譯文本的輔助函數
function t(key, params = {}) {
    // 通過點號分割的路徑獲取嵌套的翻譯值
    const value = key.split('.').reduce((obj, k) => obj?.[k], i18n);
    if (value === undefined) return key;

    // 替換參數
    return value.replace(/\{(\w+)\}/g, (_, k) => params[k] || `{${k}}`);
}

// 更新界面語言
function updateUILanguage() {
    if (!i18n || !document.body) return;  // 確保 DOM 已加載

    try {
        // 更新拖拽區域文字
        const dropAreaText = document.querySelector('#dropArea p');
        if (dropAreaText) {
            dropAreaText.textContent = t('dropArea.text');
        }

        // 更新壓縮質量標題和按鈕
        const qualityTitle = document.querySelector('.compression-settings h3');
        if (qualityTitle) {
            qualityTitle.textContent = t('settings.quality.title');
        }

        document.querySelectorAll('[data-quality]').forEach(btn => {
            if (btn) {
                const quality = Math.round(parseFloat(btn.dataset.quality) * 100);
                btn.textContent = t(`settings.quality.options.${quality}`);
            }
        });

        // 更新縮放比例標題和按鈕
        const scaleTitle = document.querySelector('.scale-settings h3');
        if (scaleTitle) {
            scaleTitle.textContent = t('settings.scale.title');
        }

        document.querySelectorAll('[data-scale]').forEach(btn => {
            if (btn) {
                const scale = Math.round(parseFloat(btn.dataset.scale) * 100);
                btn.textContent = t(`settings.scale.options.${scale}`);
            }
        });

        // 更新未分類標題
        const uncategorizedTitle = document.querySelector('.category.uncategorized span:not(.image-count)');
        if (uncategorizedTitle) {
            uncategorizedTitle.textContent = t('categoryList.uncategorized');
        }

        // 更新主要按鈕文字
        const startCompressBtn = document.getElementById('startCompress');
        if (startCompressBtn) {
            startCompressBtn.textContent = t('buttons.startCompress');
        }

        const deleteAllBtn = document.getElementById('deleteAll');
        if (deleteAllBtn) {
            deleteAllBtn.innerHTML = `<i class="fas fa-trash-alt"></i> ${t('buttons.deleteAll')}`;
        }

        const downloadAllBtn = document.getElementById('downloadAll');
        if (downloadAllBtn) {
            downloadAllBtn.innerHTML = `<i class="fas fa-file-archive"></i> ${t('buttons.downloadAll')}`;
        }

        // 更新所有圖片卡片
        document.querySelectorAll('.image-card').forEach(updateImageCardLanguage);

        // 更新所有設置彈出框的語言
        document.querySelectorAll('.settings-popup').forEach(popup => {
            // 更新標題
            popup.querySelector('h4').textContent = t('imageCard.customSettings');
            
            // 更新 checkbox 標籤
            popup.querySelector('label').innerHTML = `
                <input type="checkbox" class="use-custom-settings">
                ${t('imageCard.useCustomSettings')}
            `;
            
            // 更新質量設置標題和按鈕
            popup.querySelector('.quality-settings h4').textContent = t('settings.quality.title');
            popup.querySelectorAll('.quality-settings button').forEach(btn => {
                const quality = Math.round(parseFloat(btn.dataset.quality) * 100);
                btn.textContent = t(`settings.quality.options.${quality}`);
            });
            
            // 更新縮放設置標題和按鈕
            popup.querySelector('.scale-settings h4').textContent = t('settings.scale.title');
            popup.querySelectorAll('.scale-settings button').forEach(btn => {
                const scale = Math.round(parseFloat(btn.dataset.scale) * 100);
                btn.textContent = t(`settings.scale.options.${scale}`);
            });
        });
    } catch (error) {

    }
}

// 更新單個圖片卡片的語言
function updateImageCardLanguage(card) {
    const info = card.querySelector('.image-info');
    const isCompressed = card.querySelector('.status-icon.completed') !== null;
    
    // 獲取原始數據
    const filename = info.querySelector('.filename').textContent.split(': ')[1];
    const size = info.querySelector('p:nth-child(2)').textContent.split(': ')[1];
    const originalSize = info.querySelector('p:nth-child(3)').textContent.split(': ')[1];
    const compressedSizeEl = info.querySelector('.compressed-size');
    const compressedSize = compressedSizeEl.textContent.split(': ')[1].split('\n')[0];
    const ratio = compressedSizeEl.querySelector('small').textContent.split(' ').pop();

    // 更新文字
    info.innerHTML = `
        <p class="filename">${t('imageCard.filename')}: ${filename}</p>
        <p>${t('imageCard.size')}: ${size}</p>
        <p>${t('imageCard.originalSize')}: ${originalSize}</p>
        <p class="compressed-size ${isCompressed ? 'actual' : ''}">
            ${isCompressed ? t('imageCard.compressedSize') : t('imageCard.estimatedSize')}: ${compressedSize}
            <small>${t('imageCard.compressionRatio')} ${ratio}</small>
        </p>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');
    const imageList = document.getElementById('imageList');
    let currentQuality = 1.0;
    let currentScale = 1.0;
    let originalImages = [];
    const downloadAllBtn = document.getElementById('downloadAll');
    let compressedImages = []; // 存儲壓縮後的圖片
    const deleteAllBtn = document.getElementById('deleteAll');
    const themeToggle = document.getElementById('themeToggle');
    const langToggle = document.getElementById('langToggle');
    let isDarkTheme = localStorage.getItem('darkTheme') === 'true' || true;
    let currentLang = localStorage.getItem('language') || 'EN';

    // 初始化主題
    updateTheme();

    // 確保語言文件加載完成後再進行其他操作
    async function initialize() {
        await loadLanguage(currentLang);
        langToggle.querySelector('span').textContent = currentLang;
        await loadImagesFromStorage();
        updateButtonsVisibility();
        initializeCategoryCollapse();
        
        // 初始隱藏未分類
        const uncategorized = document.querySelector('.category.uncategorized');
        if (uncategorized) {
            uncategorized.style.display = 'none';
        }
    }

    // 執行初始化
    initialize();

    async function loadImagesFromStorage() {
        // 確保語言已加載
        await ensureLanguageLoaded();
        
        const savedImages = localStorage.getItem('originalImages');
        if (savedImages) {
            try {
                const savedData = JSON.parse(savedImages);
                if (savedData.length > 0) {
                    alert(t('alerts.refreshWarning'));
                    localStorage.removeItem('originalImages');
                    originalImages = []; // 確保清空數組
                }
            } catch (e) {
                
                localStorage.removeItem('originalImages');
                originalImages = []; // 確保清空數組
            }
        }
    }

    function saveToLocalStorage() {
        try {
            // 只存儲必要的信息，不存儲 dataUrl
            const imagesForStorage = originalImages.map(img => ({
                fileName: img.fileName,
                width: img.width,
                height: img.height,
                size: img.size
            }));
            localStorage.setItem('originalImages', JSON.stringify(imagesForStorage));
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                alert(t('alerts.storageQuotaExceeded'));
                // 清除已有的存儲
                localStorage.removeItem('originalImages');
            }
            
        }
    }

    // 設置拖拽事件
    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('dragover');
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('dragover');
    });

    dropArea.addEventListener('drop', async (e) => {
        e.preventDefault();
        dropArea.classList.remove('dragover');
        
        // 使用 DataTransferItemList 接口處理文件和文件夾
        const items = e.dataTransfer.items;
        if (items) {
            for (const item of items) {
                if (item.kind === 'file') {
                    const entry = item.webkitGetAsEntry();
                    if (entry) {
                        if (entry.isDirectory) {
                            // 處理文件夾
                            await handleDirectory(entry);
                        } else if (entry.isFile && entry.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
                            // 處理單個圖片文件
                            const file = await getFileFromEntry(entry);
                            await processImage(file, 'uncategorized');
                        }
                    }
                }
            }
        } else {
            // 降級處理：直接處理文件
            handleFiles(e.dataTransfer.files);
        }
    });

    // 點擊上傳
    dropArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // 質量和縮放按鈕事件保持不變
    document.querySelectorAll('[data-quality]').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('[data-quality]').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            currentQuality = parseFloat(button.dataset.quality);
            updatePreviewSizes();
        });
    });

    document.querySelectorAll('[data-scale]').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('[data-scale]').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            currentScale = parseFloat(button.dataset.scale);
            updatePreviewSizes();
        });
    });

    // 修改壓縮按鈕事件
    document.getElementById('startCompress').addEventListener('click', async () => {
        const overlay = document.querySelector('.compression-overlay');
        const progressBar = overlay.querySelector('.progress-bar');
        const progressText = overlay.querySelector('.progress-text');
        const currentFile = overlay.querySelector('.current-file');
        const title = overlay.querySelector('h3');
        
        // 顯示 overlay
        overlay.style.display = 'flex';
        title.textContent = t('compression.title');
        
        // 清空之前的壓縮圖片數組
        compressedImages = [];
        
        // 清空所有分類中的圖片
        document.querySelectorAll('.category-content').forEach(content => {
            content.innerHTML = '';
        });

        // 計算總數和當前�度
        const total = originalImages.length;
        let completed = 0;

        // 創建壓縮任務
        const promises = originalImages.map(imgData => {
            return new Promise(resolve => {
                // 更新當前處理的文件名
                currentFile.textContent = t('compression.processing', { filename: imgData.fileName });
                
                compressImage(imgData, () => {
                    completed++;
                    // 更新進度條
                    const progress = (completed / total) * 100;
                    progressBar.style.width = `${progress}%`;
                    progressText.textContent = `${Math.round(progress)}%`;
                    resolve();
                });
            });
        });

        // 等待所有圖片壓縮完成
        await Promise.all(promises);

        // 顯示完成狀態
        title.textContent = t('compression.completed');
        title.style.color = '#28a745';
        currentFile.textContent = '';

        // 添加壓縮後的圖片到對應分類
        compressedImages.forEach(img => {
            const originalImg = originalImages.find(orig => orig.fileName === img.fileName);
            if (originalImg) {
                const card = createImageCard(
                    img.dataUrl,
                    img.fileName,
                    originalImg.width * currentScale,
                    originalImg.height * currentScale,
                    originalImg.size,
                    true
                );
                
                const categoryContent = document.querySelector(`.category[data-name="${originalImg.category}"] .category-content`);
                if (categoryContent) {
                    categoryContent.appendChild(card);
                    updateCategoryCount(originalImg.category);
                }
            }
        });

        // 延遲關閉 overlay
        setTimeout(() => {
            overlay.style.display = 'none';
            progressBar.style.width = '0';
            progressText.textContent = '0%';
            currentFile.textContent = '';
            title.textContent = t('compression.title');
            title.style.color = ''; // 重置顏色
        }, 1000);

        // 更新按鈕狀態
        updateButtonsVisibility();
    });

    function ensureLanguageLoaded() {
        if (!i18n) {
            return loadLanguage(currentLang);
        }
        return Promise.resolve();
    }

    // 修改 handleFiles 函數
    async function handleFiles(files) {
        await ensureLanguageLoaded();
        
        downloadAllBtn.style.display = 'none';
        compressedImages = [];
        
        const MAX_IMAGES = 20;
        if (originalImages.length + files.length > MAX_IMAGES) {
            alert(t('alerts.maxImages', { max: MAX_IMAGES, current: originalImages.length }));
            return;
        }

        Array.from(files).forEach(async file => {
            const MAX_FILE_SIZE = 20 * 1024 * 1024;
            if (file.size > MAX_FILE_SIZE) {
                alert(t('alerts.fileTooLarge', {
                    filename: file.name,
                    size: formatSize(file.size),
                    maxSize: formatSize(MAX_FILE_SIZE)
                }));
                return;
            }

            if (file.type.startsWith('image/')) {
                // 使用 processImage 函數處理圖片
                await processImage(file, 'uncategorized');
            }
        });
    }

    function compressImage(imgData, callback) {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // 使用存儲的設置
            let quality = currentQuality;
            let scale = currentScale;

            if (imgData.settings.useCustomSettings) {
                quality = imgData.settings.customSettings.quality;
                scale = imgData.settings.customSettings.scale;
            } else {
                
            }

            const newWidth = img.width * scale;
            const newHeight = img.height * scale;

            canvas.width = newWidth;
            canvas.height = newHeight;
            ctx.drawImage(img, 0, 0, newWidth, newHeight);

            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            
            compressedImages.push({
                dataUrl: compressedDataUrl,
                fileName: imgData.fileName
            });

            if (callback) callback();
        };
        img.src = imgData.dataUrl;
    }

    function createImageCard(dataUrl, fileName, width, height, originalSize, isCompressed) {
        const card = document.createElement('div');
        card.className = 'image-card';
        
        // 添加個性化設置
        card.dataset.useCustomSettings = 'false';
        card.dataset.customQuality = '1.0';
        card.dataset.customScale = '1.0';

        // 添加狀態圖標
        const statusIcon = document.createElement('div');
        statusIcon.className = isCompressed ? 'status-icon completed' : 'status-icon pending';
        statusIcon.innerHTML = isCompressed ? 
            '<i class="fas fa-check"></i>' : 
            '<i class="fas fa-clock"></i>';
        card.appendChild(statusIcon);

        // 添加操作按鈕
        const actions = document.createElement('div');
        actions.className = 'card-actions';

        // 設置按鈕
        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'action-button custom-settings';
        settingsBtn.innerHTML = '<i class="fas fa-cog"></i>';
        
        // 創建設置彈出框
        const settingsPopup = document.createElement('div');
        settingsPopup.className = 'settings-popup';
        settingsPopup.innerHTML = `
            <h4>${t('imageCard.customSettings')}</h4>
            <div class="custom-settings">
                <label>
                    <input type="checkbox" class="use-custom-settings">
                    ${t('imageCard.useCustomSettings')}
                </label>
                <div class="quality-settings">
                    <h4>${t('settings.quality.title')}</h4>
                    <div class="buttons">
                        <button data-quality="0.1">${t('settings.quality.options.10')}</button>
                        <button data-quality="0.3">${t('settings.quality.options.30')}</button>
                        <button data-quality="0.5">${t('settings.quality.options.50')}</button>
                        <button data-quality="0.7">${t('settings.quality.options.70')}</button>
                        <button data-quality="0.9">${t('settings.quality.options.90')}</button>
                        <button data-quality="1.0">${t('settings.quality.options.100')}</button>
                    </div>
                </div>
                <div class="scale-settings">
                    <h4>${t('settings.scale.title')}</h4>
                    <div class="buttons">
                        <button data-scale="1">${t('settings.scale.options.100')}</button>
                        <button data-scale="0.75">${t('settings.scale.options.75')}</button>
                        <button data-scale="0.5">${t('settings.scale.options.50')}</button>
                        <button data-scale="0.25">${t('settings.scale.options.25')}</button>
                    </div>
                </div>
            </div>
        `;

        // 在創建設置按鈕後，設置默認選中的按鈕
        settingsPopup.querySelector('[data-quality="1.0"]').classList.add('active');
        settingsPopup.querySelector('[data-scale="1"]').classList.add('active');

        // 修改 checkbox 事件處理程序
        const checkbox = settingsPopup.querySelector('.use-custom-settings');
        checkbox.addEventListener('change', () => {
            const useCustom = checkbox.checked;
            const fileName = card.querySelector('.filename').textContent.split(': ')[1];
            const originalImage = originalImages.find(img => img.fileName === fileName);
            
            if (originalImage) {
                originalImage.settings.useCustomSettings = useCustom;
                // 切換設置按鈕的顏色
                settingsBtn.classList.toggle('active', useCustom);
                
                if (useCustom) {
                    // 使用自定義設置
                    updateCardPreviewSize(
                        card,
                        originalImage.settings.customSettings.quality,
                        originalImage.settings.customSettings.scale
                    );
                } else {
                    // 使用全局設置
                    updateCardPreviewSize(card, currentQuality, currentScale);
                }
            }

            // 更新按鈕狀態
            const qualityButtons = settingsPopup.querySelectorAll('[data-quality]');
            const scaleButtons = settingsPopup.querySelectorAll('[data-scale]');
            
            if (useCustom) {
                qualityButtons.forEach(btn => btn.disabled = false);
                scaleButtons.forEach(btn => btn.disabled = false);
            } else {
                qualityButtons.forEach(btn => {
                    btn.disabled = true;
                    btn.classList.toggle('active', btn.dataset.quality === '1.0');
                });
                scaleButtons.forEach(btn => {
                    btn.disabled = true;
                    btn.classList.toggle('active', btn.dataset.scale === '1');
                });
            }
        });

        // 初始狀態態下禁用所有按鈕
        settingsPopup.querySelectorAll('button').forEach(btn => btn.disabled = true);

        actions.appendChild(settingsBtn);
        actions.appendChild(settingsPopup);

        // 下載按鈕
        if (isCompressed) {
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'action-button download';
            downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
            downloadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
            actions.appendChild(downloadBtn);
        }

        // 刪除按鈕
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-button delete';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // 找到圖片所屬的分類
            const categoryContent = card.closest('.category-content');
            const category = categoryContent.closest('.category');
            const categoryName = category.dataset.name;
            
            // 從 DOM 中移除卡片
            card.remove();
            
            // 從數組中移除圖片
            originalImages = originalImages.filter(img => img.fileName !== fileName);
            if (categories[categoryName]) {
                categories[categoryName].images = categories[categoryName].images.filter(img => img.fileName !== fileName);
            }
            
            // 更新分類計數
            updateCategoryCount(categoryName);
            
            // 如果是未分類，且沒有圖片了，就隱藏未分類區域
            if (categoryName === 'uncategorized') {
                const uncategorizedContent = document.querySelector('.category.uncategorized .category-content');
                if (uncategorizedContent && uncategorizedContent.children.length === 0) {
                    document.querySelector('.category.uncategorized').style.display = 'none';
                }
            }
            
            saveToLocalStorage();
            updateButtonsVisibility();
        });
        actions.appendChild(deleteBtn);

        card.appendChild(actions);

        // 添加圖片
        const img = document.createElement('img');
        img.src = dataUrl;
        img.alt = fileName;
        img.addEventListener('click', () => {
            modal.style.display = 'block';
            modalImg.src = dataUrl;
            document.body.style.overflow = 'hidden';
        });
        card.appendChild(img);

        // 添加圖片信息
        const info = document.createElement('div');
        info.className = 'image-info';

        const previewSize = isCompressed ? 
            Math.round((dataUrl.length - 22) * 0.75) : 
            calculatePreviewSize(originalSize, currentQuality, currentScale);

        const compressionRatio = isCompressed ? 
            Math.round((previewSize/originalSize)*100) :
            Math.round((previewSize/originalSize)*100);

        info.innerHTML = `
            <p class="filename">${t('imageCard.filename')}: ${fileName}</p>
            <p>${t('imageCard.size')}: ${Math.round(width)}x${Math.round(height)}</p>
            <p>${t('imageCard.originalSize')}: ${formatSize(originalSize)}</p>
            <p class="compressed-size ${isCompressed ? 'actual' : ''}">
                ${isCompressed ? t('imageCard.compressedSize') : t('imageCard.estimatedSize')}: ${formatSize(previewSize)}
                <small>${t('imageCard.compressionRatio')} ${compressionRatio}%</small>
            </p>
        `;
        card.appendChild(info);

        // 添加設置按鈕事件
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // 關閉其他打開的設置彈出框
            document.querySelectorAll('.settings-popup.show').forEach(popup => {
                if (popup !== settingsPopup) {
                    popup.classList.remove('show');
                }
            });
            settingsPopup.classList.toggle('show');
        });

        // 添加點擊外部關閉彈出框
        document.addEventListener('click', (e) => {
            if (!settingsPopup.contains(e.target) && !settingsBtn.contains(e.target)) {
                settingsPopup.classList.remove('show');
            }
        });

        // 防止彈出框內部點擊事件冒泡
        settingsPopup.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // 添加質量按鈕點擊事件
        settingsPopup.querySelectorAll('[data-quality]').forEach(btn => {
            btn.addEventListener('click', () => {
                const fileName = card.querySelector('.filename').textContent.split(': ')[1];
                const originalImage = originalImages.find(img => img.fileName === fileName);
                
                if (originalImage && originalImage.settings.useCustomSettings) {
                    const newQuality = parseFloat(btn.dataset.quality);
                    originalImage.settings.customSettings.quality = newQuality;
                    
                    // 更新按鈕狀態
                    settingsPopup.querySelectorAll('[data-quality]').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    updateCardPreviewSize(
                        card,
                        newQuality,
                        originalImage.settings.customSettings.scale
                    );
                }
            });
        });

        // 添加縮放按鈕點擊事件
        settingsPopup.querySelectorAll('[data-scale]').forEach(btn => {
            btn.addEventListener('click', () => {
                const fileName = card.querySelector('.filename').textContent.split(': ')[1];
                const originalImage = originalImages.find(img => img.fileName === fileName);
                
                if (originalImage && originalImage.settings.useCustomSettings) {
                    const newScale = parseFloat(btn.dataset.scale);
                    originalImage.settings.customSettings.scale = newScale;
                    
                    // 更新按鈕狀態
                    settingsPopup.querySelectorAll('[data-scale]').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    updateCardPreviewSize(
                        card,
                        originalImage.settings.customSettings.quality,
                        newScale
                    );
                }
            });
        });

        return card; // 返回創建的卡片元素
    }

    function formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    }

    // 設置默認選中的按鈕
    document.querySelector('[data-quality="1.0"]').classList.add('active');
    document.querySelector('[data-scale="1"]').classList.add('active');

    // 修改壓縮大小的計算方式
    function calculatePreviewSize(originalSize, quality, scale) {
        // 更準確的預覽大小計算
        const scaleFactor = scale * scale; // 面積放
        const qualityFactor = quality; // 直接使用質量值
        const estimatedSize = Math.round(originalSize * scaleFactor * qualityFactor);
        
       
        return estimatedSize;
    }

    // 修改 updatePreviewSizes 函數
    function updatePreviewSizes() {
        if (!i18n) return;

        // 獲獲取所有卡片，不僅是未壓縮的
        document.querySelectorAll('.image-card').forEach(card => {
            const fileName = card.querySelector('.filename').textContent.split(': ')[1];
            const originalImage = originalImages.find(img => img.fileName === fileName);
            
            // 只更新未壓縮的卡片
            if (originalImage && card.querySelector('.status-icon.pending')) {
                // 根據是否使用自定義設置決定使用哪個設置
                const quality = originalImage.settings.useCustomSettings 
                    ? originalImage.settings.customSettings.quality 
                    : currentQuality;
                const scale = originalImage.settings.useCustomSettings 
                    ? originalImage.settings.customSettings.scale 
                    : currentScale;

                // 計算新的預覽大小
                const previewSize = calculatePreviewSize(originalImage.size, quality, scale);
                const compressionRatio = Math.round((previewSize/originalImage.size)*100);
                
                const compressedSizeElement = card.querySelector('.compressed-size');
                compressedSizeElement.innerHTML = `
                    ${t('imageCard.estimatedSize')}: ${formatSize(previewSize)}
                    <small>${t('imageCard.compressionRatio')} ${compressionRatio}%</small>
                `;
            }
        });
    }

    // 修改一鍵下載功能
    downloadAllBtn.addEventListener('click', async () => {
        const zip = new JSZip();

        // 遍歷所有分類
        for (const [categoryName, category] of Object.entries(categories)) {
            if (category.images.length > 0) {
                // 找出該分類中已壓縮的圖片
                const compressedCategoryImages = compressedImages.filter(compressed => {
                    const original = originalImages.find(orig => orig.fileName === compressed.fileName);
                    return original && original.category === categoryName;
                });

                if (compressedCategoryImages.length > 0) {
                    // 如果是未分類，直接添加到根目錄
                    if (categoryName === 'uncategorized') {
                        compressedCategoryImages.forEach(img => {
                            const imageData = img.dataUrl.split(',')[1];
                            zip.file(img.fileName, imageData, {base64: true});
                        });
                    } else {
                        // 其他分類創建子文件夾
                        const folder = zip.folder(categoryName);
                        compressedCategoryImages.forEach(img => {
                            const imageData = img.dataUrl.split(',')[1];
                            folder.file(img.fileName, imageData, {base64: true});
                        });
                    }
                }
            }
        }

        const content = await zip.generateAsync({type: 'blob'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'compressed_images.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    });

    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeModal = document.querySelector('.close-modal');

    // 關閉模態框的方法
    function closeImageModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // 恢復背景滾動
    }

    // 點擊關閉按鈕關閉模態框
    closeModal.addEventListener('click', closeImageModal);

    // 點擊擊模態框背景關閉
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target === modalImg) {
            closeImageModal();
        }
    });

    // ESC 鍵關閉模態框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeImageModal();
        }
    });

    // 添加一鍵刪除功能
    deleteAllBtn.addEventListener('click', () => {
        if (confirm(t('alerts.deleteConfirm'))) {
            // 清空所有分類中的圖片
            document.querySelectorAll('.category-content').forEach(content => {
                content.innerHTML = '';
            });
            
            // 重置分類計數
            document.querySelectorAll('.category').forEach(category => {
                const categoryName = category.dataset.name;
                if (categories[categoryName]) {
                    categories[categoryName].images = [];
                }
                category.querySelector('.image-count').textContent = '(0)';
            });

            // 清空存儲的圖片
            originalImages = [];
            compressedImages = [];
            
            // 更新 localStorage
            saveToLocalStorage();
            
            // 更新按鈕顯示狀態
            updateButtonsVisibility();

            // 隱藏未分類
            document.querySelector('.category.uncategorized').style.display = 'none';
        }
    });

    // 防止模態框內容區域的點擊事件冒泡
    document.querySelector('.modal-content').addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // 修改更新按鈕顯示狀態的函數
    function updateButtonsVisibility() {
        // 從所有分類中獲取圖片卡片
        const imageCards = document.querySelectorAll('.category-content .image-card');
        const hasImages = imageCards.length > 0;
        
        // 獲取壓縮後的圖片卡片數量
        const compressedCards = document.querySelectorAll('.category-content .image-card:has(.status-icon.completed)');
        const hasCompressedImages = compressedCards.length > 0;

        // 獲取設置區域的所有元素
        const settingsArea = document.querySelector('.settings');
        const compressionButtons = settingsArea.querySelectorAll('[data-quality]');
        const scaleButtons = settingsArea.querySelectorAll('[data-scale]');
        const startCompressBtn = document.getElementById('startCompress');

        if (hasImages) {
            // 有圖片時啟用所有設置
            settingsArea.classList.remove('disabled');
            compressionButtons.forEach(btn => btn.disabled = false);
            scaleButtons.forEach(btn => btn.disabled = false);
            startCompressBtn.disabled = false;
        } else {
            // 沒有圖片時禁用所有設置
            settingsArea.classList.add('disabled');
            compressionButtons.forEach(btn => btn.disabled = true);
            scaleButtons.forEach(btn => btn.disabled = true);
            startCompressBtn.disabled = true;
        }

        // 更新刪除和下載按鈕
        deleteAllBtn.style.display = hasImages ? 'inline-flex' : 'none';
        downloadAllBtn.style.display = hasCompressedImages ? 'inline-flex' : 'none';

        // 同步更新數組
        if (!hasImages) {
            originalImages = [];
            compressedImages = [];
            saveToLocalStorage();
        }
    }

    // 主題切換
    function updateTheme() {
        document.body.classList.toggle('dark-theme', isDarkTheme);
        themeToggle.innerHTML = isDarkTheme ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('darkTheme', isDarkTheme);
    }

    themeToggle.addEventListener('click', () => {
        isDarkTheme = !isDarkTheme;
        updateTheme();
    });

    // 語言切換
    function updateLanguage() {
        langToggle.querySelector('span').textContent = currentLang;
        localStorage.setItem('language', currentLang);
        loadLanguage(currentLang);
    }

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'TW' ? 'EN' : 'TW';
        updateLanguage();
    });

    // 初始化主題和語言
    updateTheme();
    updateLanguage();

    // 加載初始語言
    loadLanguage(currentLang);

    // 添加分類相關的全局變量
    let categories = {
        'uncategorized': {
            name: '未分類',
            images: []
        }
    };

    // 修改處理拖放的函數
    async function handleDrop(e) {
        e.preventDefault();
        dropArea.classList.remove('dragover');
        
        const items = e.dataTransfer.items;
        for (const item of items) {
            if (item.kind === 'file') {
                const entry = item.webkitGetAsEntry();
                if (entry) {
                    if (entry.isDirectory) {
                        await handleDirectory(entry);
                    } else if (entry.isFile && entry.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
                        const file = await getFileFromEntry(entry);
                        await processImage(file, 'uncategorized');
                    }
                }
            }
        }
    }

    // 添加處理文件夾的函數
    async function handleDirectory(dirEntry) {
        const categoryName = dirEntry.name;
        if (!categories[categoryName]) {
            categories[categoryName] = {
                name: categoryName,
                images: []
            };
            createCategoryElement(categoryName);
        }
        await readDirectory(dirEntry, categoryName);
    }

    // 讀取文件夾內容
    function readDirectory(dirEntry, categoryName) {
        return new Promise((resolve) => {
            const dirReader = dirEntry.createReader();
            const readEntries = () => {
                dirReader.readEntries(async (entries) => {
                    if (entries.length === 0) {
                        resolve();
                        return;
                    }

                    for (const entry of entries) {
                        if (entry.isFile && entry.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
                            const file = await getFileFromEntry(entry);
                            await processImage(file, categoryName);
                        } else if (entry.isDirectory) {
                            // 遞歸處理子文件夾
                            await handleDirectory(entry);
                        }
                    }
                    // 繼續讀取，直到所有條目都被處理
                    readEntries();
                });
            };
            readEntries();
        });
    }

    // 從 Entry 獲獲取 File 對象
    function getFileFromEntry(entry) {
        return new Promise((resolve) => {
            entry.file(resolve);
        });
    }

    // 修改圖片處理函數
    async function processImage(file, categoryName = 'uncategorized') {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const imgData = {
                        fileName: file.name,
                        width: img.width,
                        height: img.height,
                        size: file.size,
                        dataUrl: e.target.result,
                        category: categoryName,
                        // 添加設置信息
                        settings: {
                            useCustomSettings: false,
                            quality: 1.0,
                            scale: 1.0,
                            customSettings: {
                                quality: 1.0,
                                scale: 1.0
                            }
                        }
                    };
                    
                    originalImages.push(imgData);
                    
                    // 添加到對應分類
                    if (!categories[categoryName]) {
                        categories[categoryName] = {
                            name: categoryName,
                            images: []
                        };
                        createCategoryElement(categoryName);
                    }
                    categories[categoryName].images.push(imgData);
                    
                    // 創建圖片卡片
                    const card = createImageCard(
                        imgData.dataUrl,
                        imgData.fileName,
                        imgData.width,
                        imgData.height,
                        imgData.size,
                        false
                    );

                    // 如果是未分類，確保它顯示出來
                    if (categoryName === 'uncategorized') {
                        const uncategorized = document.querySelector('.category.uncategorized');
                        if (uncategorized) {
                            uncategorized.style.display = 'block';
                        }
                    }

                    // 添加到對應的分類內容域
                    const categoryContent = document.querySelector(`.category[data-name="${categoryName}"] .category-content`);
                    if (categoryContent) {
                        categoryContent.insertBefore(card, categoryContent.firstChild);
                        updateCategoryCount(categoryName);
                    }

                    saveToLocalStorage();
                    updateButtonsVisibility();
                    resolve();
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // 修改創建分類元素的函數
    function createCategoryElement(categoryName) {
        // 不允許刪除未分類
        const isDeletable = categoryName !== 'uncategorized';
        
        const categoryElement = document.createElement('div');
        categoryElement.className = 'category';
        categoryElement.dataset.name = categoryName;
        categoryElement.innerHTML = `
            <div class="category-header">
                <div class="category-title">
                    <i class="fas fa-chevron-down"></i>
                    <span>${categoryName}</span>
                    <span class="image-count">(0)</span>
                </div>
                ${isDeletable ? `
                    <button class="category-delete-btn">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                ` : ''}
            </div>
            <div class="category-content">
            </div>
        `;

        const header = categoryElement.querySelector('.category-header');
        const content = categoryElement.querySelector('.category-content');
        
        // 添加收縮功能
        header.querySelector('.category-title').addEventListener('click', () => {
            header.classList.toggle('collapsed');
            content.classList.toggle('collapsed');
            const isCollapsed = content.classList.contains('collapsed');
            header.querySelector('i').style.transform = isCollapsed ? 'rotate(-90deg)' : '';
        });

        // 添加刪除功能
        if (isDeletable) {
            const deleteBtn = categoryElement.querySelector('.category-delete-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm(t('alerts.deleteCategoryConfirm', { category: categoryName }))) {
                    // 從數組中移除該分類的圖片
                    if (categories[categoryName]) {
                        categories[categoryName].images.forEach(img => {
                            originalImages = originalImages.filter(origImg => origImg.fileName !== img.fileName);
                            compressedImages = compressedImages.filter(compImg => compImg.fileName !== img.fileName);
                        });
                        delete categories[categoryName];
                    }
                    
                    // 從 DOM 中移除分類元素
                    categoryElement.remove();
                    
                    // 更新存儲和按鈕狀態
                    saveToLocalStorage();
                    updateButtonsVisibility();
                }
            });
        }

        document.querySelector('.category-list').appendChild(categoryElement);
    }

    // 更新分類中的圖片數量
    function updateCategoryCount(categoryName) {
        const category = document.querySelector(`.category[data-name="${categoryName}"]`);
        if (category) {
            const count = category.querySelector('.category-content').children.length;
            category.querySelector('.image-count').textContent = `(${count})`;
        }
    }

    // 修改收縮功能的事件監聽
    function initializeCategoryCollapse() {
        document.querySelectorAll('.category-header').forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                header.classList.toggle('collapsed');
                content.classList.toggle('collapsed');
                
                // 更新箭頭方向
                const arrow = header.querySelector('i');
                if (content.classList.contains('collapsed')) {
                    arrow.style.transform = 'rotate(-90deg)';
                } else {
                    arrow.style.transform = 'rotate(0deg)';
                }
            });
        });
    }

    // 更新預覽大小的輔助函數
    function updateCardPreviewSize(card, quality, scale) {
        const fileName = card.querySelector('.filename').textContent.split(': ')[1];
        const originalImage = originalImages.find(img => img.fileName === fileName);
        
        if (originalImage) {
            const previewSize = calculatePreviewSize(originalImage.size, quality, scale);
            const compressionRatio = Math.round((previewSize/originalImage.size)*100);
            
            const compressedSizeElement = card.querySelector('.compressed-size');
            compressedSizeElement.innerHTML = `
                ${t('imageCard.estimatedSize')}: ${formatSize(previewSize)}
                <small>${t('imageCard.compressionRatio')} ${compressionRatio}%</small>
            `;
        }
    }

    // 添加返回首頁功能
    document.getElementById('backtoHome').addEventListener('click', function() {
        window.location.href = '../index.html';
    });
}); 