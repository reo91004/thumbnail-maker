import React from 'react';
import './TemplateSection.scss';
import layoutList from '../../../constants/layoutList.json';

const ratioPresets = [
  {
    id: 'velog',
    name: 'Velog',
    ratio: '768×402',
    width: 768,
    height: 402,
    icon: 'V',
    color: '#20c997',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    ratio: '16:9',
    width: 1280,
    height: 720,
    icon: '▶',
    color: '#ef4444',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    ratio: '1:1',
    width: 1080,
    height: 1080,
    icon: '📷',
    color: '#ec4899',
  },
  {
    id: 'twitter',
    name: 'Twitter',
    ratio: '2:1',
    width: 1200,
    height: 600,
    icon: '🐦',
    color: '#3b82f6',
  },
];

function TemplateSection({ setRatio, setCanvasAssets, setCanvasSize, canvasAssets }) {
  const [selectedRatio, setSelectedRatio] = React.useState('velog');
  const [selectedLayout, setSelectedLayout] = React.useState(2);
  const [customSize, setCustomSize] = React.useState({ width: '', height: '' });
  let layoutCount = 0;

  React.useEffect(() => {
    // canvasAssets가 비어있을 때만 초기값 설정
    if (!canvasAssets || canvasAssets.length === 0) {
      // 초기 로드 시 Velog 크기 설정
      const velogPreset = ratioPresets.find((p) => p.id === 'velog');
      if (velogPreset) {
        setCanvasSize({ width: velogPreset.width, height: velogPreset.height });
      }

      // 초기 로드 시 기본 레이아웃 설정 (제목 + 부제 + 소제목)
      if (layoutList[2]) {
        const initialLayout = layoutList[2].layout.map((layout, idx) => {
          return { ...layout, id: 'layout' + idx };
        });
        setCanvasAssets(initialLayout);
      }
    }
  }, [canvasAssets, setCanvasAssets, setCanvasSize]);

  const handleRatioSelect = (preset) => {
    setSelectedRatio(preset.id);
    setCanvasSize({ width: preset.width, height: preset.height });
  };

  const handleLayoutSelect = (index) => {
    setSelectedLayout(index);
    const layout = layoutList[index].layout.map((layout) => {
      layout.id = 'layout' + layoutCount++;
      return layout;
    });
    setCanvasAssets(layout);
  };

  const handleCustomSize = () => {
    if (customSize.width && customSize.height) {
      setSelectedRatio('custom');
      setCanvasSize({
        width: parseInt(customSize.width),
        height: parseInt(customSize.height),
      });
    }
  };

  const getLayoutPreview = (layout) => {
    return layout.layout.map((element, i) => {
      const style = element.style || {};
      const x = style.x ? parseInt(style.x) : 50;
      const y = style.y ? parseInt(style.y) : 50;

      if (element.type === 'text') {
        const fontSize = parseInt(style.fontSize) || 20;
        const isTitle = fontSize > 30;
        return (
          <div
            key={i}
            className={`preview-text ${isTitle ? 'title' : 'subtitle'}`}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
              width: isTitle ? '80%' : '60%',
              height: isTitle ? '12px' : '8px',
            }}
          />
        );
      } else if (element.type === 'figure') {
        if (element.shape === 'line') {
          return (
            <div
              key={i}
              className="preview-line"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                width: '50%',
              }}
            />
          );
        } else if (element.shape === 'circle') {
          return (
            <div
              key={i}
              className="preview-circle"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          );
        }
      }
      return null;
    });
  };

  return (
    <div className="template-section">
      {/* 캔버스 크기 선택 */}
      <div className="size-section">
        <h3 className="section-header">캔버스 크기</h3>
        <div className="size-grid">
          {ratioPresets.map((preset) => (
            <div
              key={preset.id}
              className={`size-card ${selectedRatio === preset.id ? 'active' : ''}`}
              onClick={() => handleRatioSelect(preset)}
              style={{ '--accent-color': preset.color }}
            >
              <div className="card-icon">{preset.icon}</div>
              <div className="card-name">{preset.name}</div>
              <div className="card-size">
                {preset.width}×{preset.height}
              </div>
            </div>
          ))}

          {/* 커스텀 크기 */}
          <div className={`size-card custom ${selectedRatio === 'custom' ? 'active' : ''}`}>
            <div className="card-icon">⚙️</div>
            <div className="card-name">커스텀</div>
            <div className="custom-inputs">
              <input
                type="number"
                placeholder="가로"
                value={customSize.width}
                onChange={(e) => setCustomSize({ ...customSize, width: e.target.value })}
                onBlur={handleCustomSize}
              />
              <span>×</span>
              <input
                type="number"
                placeholder="세로"
                value={customSize.height}
                onChange={(e) => setCustomSize({ ...customSize, height: e.target.value })}
                onBlur={handleCustomSize}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 레이아웃 템플릿 */}
      <div className="layout-section">
        <h3 className="section-header">레이아웃 템플릿</h3>
        <div className="layout-grid">
          {layoutList.map((layout, index) => (
            <div
              key={index}
              className={`layout-card ${selectedLayout === index ? 'active' : ''}`}
              onClick={() => handleLayoutSelect(index)}
            >
              <div className="layout-preview">{getLayoutPreview(layout)}</div>
              <div className="layout-name">
                {index === 0 && '중앙 제목'}
                {index === 1 && '제목 + 부제'}
                {index === 2 && '제목 + 부제 + 소제목'}
              </div>
              {selectedLayout === index && <div className="selected-badge">✓</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TemplateSection;
