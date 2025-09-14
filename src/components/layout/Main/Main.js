import React, { useEffect, useState, useRef } from 'react';
import './_Main-new.scss';
import TemplateSection from '../../../features/templates/TemplateSection/TemplateSection.js';
import BackgroundForm from '../../../features/background/BackgroundForm.js';
import AssetsPanel from '../../../features/editor/AssetsPanel/AssetsPanel.js';
import Asset from '../../../features/canvas/Asset/Asset.js';
import ThemeToggle from '../../ui/ThemeToggle/ThemeToggle';
import { BsDownload } from 'react-icons/bs';
import { MdSave, MdFolderOpen } from 'react-icons/md';
// import domtoimage from 'dom-to-image';
import html2canvas from 'html2canvas';

function Main() {
  const [canvasSize, setCanvasSize] = useState({ width: 768, height: 402.094 });
  // const [ratio, setRatio] = useState(null); // Currently unused
  const [background, setBackground] = useState({
    type: 'gradient',
    background: 'linear-gradient(45deg, rgba(255,206,217,1), rgba(160,193,238,1))',
    index: null,
  });
  const [assetStyle, setAssetStyle] = useState({ fontSize: '14px', height: 'auto', width: 'auto' });
  const canvasBox = useRef(null);
  const [canvasAssets, setCanvasAssets] = useState([]);
  const [currentAsset, setCurrentAsset] = useState({
    index: null,
    type: null,
    style: {},
    position: {},
  });
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [activeTab, setActiveTab] = useState('template');
  const Spinner = () => {
    return (
      <img
        alt="loading"
        src={require('../../../assets/images/loading.gif')}
        style={{ width: 16, height: 16 }}
      ></img>
    );
  };

  useEffect(() => {
    if (currentAsset.index !== null) {
      setAssetStyle({ ...currentAsset.style });
    }
  }, [currentAsset]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const filterNumber = /^[+]?\d+(?:[.]\d+)?$/g;
  function handleResizeCanvas(e) {
    let { name, value } = e.target;
    if (!filterNumber.test(value)) {
      if (value === '') {
        value = 0;
      } else {
        e.preventDefault();
        return;
      }
    }
    // setRatio(null);
    setCanvasSize({ ...canvasSize, [name]: Number(value) });
  }

  function handleDownload() {
    setLoading(true);

    html2canvas(document.getElementById('canvas'), {
      height: document.getElementById('canvas').clientHeight,
    }).then((canvas) => {
      setLoading(false);
      handleCaptureCanvas(canvas.toDataURL('image/png'), 'thumbnail.png');
    });
  }

  function handleCaptureCanvas(uri, fileName) {
    let link = document.createElement('a');
    document.body.appendChild(link);
    link.href = uri;
    link.download = fileName;
    link.click();
    document.body.removeChild(link);
  }

  function removeAsset(targetId) {
    let filteredAssets = canvasAssets.filter(({ id }) => id !== targetId);
    setCanvasAssets(filteredAssets);
  }

  function updateAssetContent(assetId, newContent) {
    const updatedAssets = canvasAssets.map((asset) => {
      if (asset.id === assetId) {
        return { ...asset, name: newContent };
      }
      return asset;
    });
    setCanvasAssets(updatedAssets);
  }

  function handleSaveProject() {
    const project = {
      canvasSize,
      background,
      canvasAssets,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem('thumbnailProject', JSON.stringify(project));
    alert('프로젝트가 저장되었습니다.');
  }

  function handleLoadProject() {
    const saved = localStorage.getItem('thumbnailProject');
    if (saved) {
      const project = JSON.parse(saved);
      setCanvasSize(project.canvasSize);
      setBackground(project.background);
      setCanvasAssets(project.canvasAssets);
      alert('프로젝트를 불러왔습니다.');
    }
  }
  return (
    <main className={`theme-${theme}`}>
      <header className="app-header">
        <div className="header-left">
          <h1 className="app-title">Thumbnail Maker</h1>
        </div>
        <div className="header-center">
          <div className="canvas-size-controls">
            <label>Width:</label>
            <input
              type="text"
              name="width"
              value={canvasSize.width}
              onChange={handleResizeCanvas}
            />
            <span className="separator">×</span>
            <label>Height:</label>
            <input
              type="text"
              name="height"
              value={canvasSize.height}
              onChange={handleResizeCanvas}
            />
          </div>
        </div>
        <div className="header-right">
          <button onClick={handleSaveProject} className="btn-icon" title="저장">
            <MdSave />
          </button>
          <button onClick={handleLoadProject} className="btn-icon" title="불러오기">
            <MdFolderOpen />
          </button>
          <ThemeToggle
            theme={theme}
            onToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          />
        </div>
      </header>

      <div className="main-container">
        <section className="canvas-section">
          <div className="canvas-wrapper" ref={canvasBox}>
            <div
              id="canvas"
              className="canvas"
              style={Object.assign(
                {
                  width: canvasSize.width,
                  height: canvasSize.height,
                },
                background.type === 'image'
                  ? { backgroundImage: `url(${background.background})` }
                  : { background: background.background }
              )}
            >
              {canvasAssets.map((element, index) => (
                <Asset
                  setCurrentAsset={setCurrentAsset}
                  currentAsset={currentAsset}
                  key={element.id}
                  id={element.id}
                  canvasSize={canvasSize}
                  newAsset={element}
                  assetStyle={assetStyle}
                  setAssetStyle={setAssetStyle}
                  removeAsset={removeAsset}
                  updateAssetContent={updateAssetContent}
                ></Asset>
              ))}
            </div>
          </div>
          <div className="canvas-actions">
            <button onClick={handleDownload} className="btn-download">
              {loading ? (
                <Spinner></Spinner>
              ) : (
                <>
                  <BsDownload /> 다운로드
                </>
              )}
            </button>
          </div>
        </section>

        <aside className="sidebar">
          <div className="sidebar-tabs">
            <button
              className={`tab-btn ${activeTab === 'template' ? 'active' : ''}`}
              onClick={() => setActiveTab('template')}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="9" y1="9" x2="15" y2="9" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
              템플릿
            </button>
            <button
              className={`tab-btn ${activeTab === 'background' ? 'active' : ''}`}
              onClick={() => setActiveTab('background')}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              배경
            </button>
            <button
              className={`tab-btn ${activeTab === 'assets' ? 'active' : ''}`}
              onClick={() => setActiveTab('assets')}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                <path d="M2 17L12 22L22 17" />
                <path d="M2 12L12 17L22 12" />
              </svg>
              요소
            </button>
          </div>

          <div className="sidebar-content">
            {activeTab === 'template' && (
              <TemplateSection
                setRatio={() => {}}
                setCanvasAssets={setCanvasAssets}
                setCanvasSize={setCanvasSize}
                canvasAssets={canvasAssets}
              />
            )}
            {activeTab === 'background' && (
              <div className="background-section">
                <BackgroundForm setBackground={setBackground} />
              </div>
            )}
            {activeTab === 'assets' && (
              <div className="assets-section">
                <AssetsPanel
                  assets={canvasAssets}
                  setCanvasAssets={setCanvasAssets}
                  currentAsset={currentAsset}
                  setCurrentAsset={setCurrentAsset}
                />
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}

export default Main;
