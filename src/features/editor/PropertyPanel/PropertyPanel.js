// src/components/PropertyPanel/PropertyPanel.js
import React from 'react';
import './PropertyPanel.scss';
import {
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
  MdLock,
  MdLockOpen,
} from 'react-icons/md';

function PropertyPanel({
  selectedTool,
  selectedAsset,
  onUpdateAsset,
  onDeleteAsset,
  canvasSize,
  onCanvasSizeChange,
  background,
  onBackgroundChange,
  assets,
  onSelectAsset,
}) {
  const presetSizes = [
    { name: 'YouTube Thumbnail', width: 1280, height: 720 },
    { name: 'Instagram Post', width: 1080, height: 1080 },
    { name: 'Twitter Header', width: 1500, height: 500 },
    { name: 'Facebook Cover', width: 820, height: 312 },
  ];

  const fonts = [
    'Pretendard',
    'Noto Sans KR',
    'Nanum Gothic',
    'Nanum Myeongjo',
    'Black Han Sans',
    'Do Hyeon',
    'Jua',
  ];

  const gradientPresets = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  ];

  const renderToolProperties = () => {
    switch (selectedTool) {
      case 'background':
        return (
          <div className="panel-section">
            <h3>Background</h3>
            <div className="property-group">
              <label>Type</label>
              <select
                value={background.type}
                onChange={(e) => onBackgroundChange({ ...background, type: e.target.value })}
              >
                <option value="solid">Solid Color</option>
                <option value="gradient">Gradient</option>
                <option value="image">Image</option>
              </select>
            </div>

            {background.type === 'solid' && (
              <div className="property-group">
                <label>Color</label>
                <input
                  type="color"
                  value={background.value || '#1a1a2e'}
                  onChange={(e) => onBackgroundChange({ ...background, value: e.target.value })}
                />
              </div>
            )}

            {background.type === 'gradient' && (
              <>
                <div className="property-group">
                  <label>Gradient Presets</label>
                  <div className="gradient-presets">
                    {gradientPresets.map((gradient, index) => (
                      <button
                        key={index}
                        className="gradient-preset"
                        style={{ background: gradient }}
                        onClick={() => onBackgroundChange({ ...background, value: gradient })}
                      />
                    ))}
                  </div>
                </div>
                <div className="property-group">
                  <label>Custom Gradient</label>
                  <input
                    type="text"
                    value={background.value}
                    onChange={(e) => onBackgroundChange({ ...background, value: e.target.value })}
                    placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  />
                </div>
              </>
            )}

            {background.type === 'image' && (
              <div className="property-group">
                <label>Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const imageUrl = `url(${event.target.result})`;
                        onBackgroundChange({
                          ...background,
                          value: imageUrl,
                        });
                        // Save to localStorage
                        localStorage.setItem('canvasBackgroundImage', event.target.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {background.value && background.value.startsWith('url(') && (
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      onBackgroundChange({
                        type: 'gradient',
                        value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      });
                      localStorage.removeItem('canvasBackgroundImage');
                    }}
                  >
                    Remove Image
                  </button>
                )}
              </div>
            )}
          </div>
        );

      case 'template':
        return (
          <div className="panel-section">
            <h3>Templates</h3>
            <div className="template-grid">
              <div className="template-item" onClick={() => applyTemplate('youtube')}>
                <div className="template-preview youtube-template"></div>
                <span>YouTube</span>
              </div>
              <div className="template-item" onClick={() => applyTemplate('instagram')}>
                <div className="template-preview instagram-template"></div>
                <span>Instagram</span>
              </div>
              <div className="template-item" onClick={() => applyTemplate('twitter')}>
                <div className="template-preview twitter-template"></div>
                <span>Twitter</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderAssetProperties = () => {
    if (!selectedAsset) return null;

    return (
      <>
        <div className="panel-section">
          <h3>Transform</h3>
          <div className="property-row">
            <div className="property-group half">
              <label>X</label>
              <input
                type="number"
                value={Math.round(selectedAsset.position.x)}
                onChange={(e) =>
                  onUpdateAsset(selectedAsset.id, {
                    position: { ...selectedAsset.position, x: parseInt(e.target.value) },
                  })
                }
              />
            </div>
            <div className="property-group half">
              <label>Y</label>
              <input
                type="number"
                value={Math.round(selectedAsset.position.y)}
                onChange={(e) =>
                  onUpdateAsset(selectedAsset.id, {
                    position: { ...selectedAsset.position, y: parseInt(e.target.value) },
                  })
                }
              />
            </div>
          </div>
          <div className="property-row">
            <div className="property-group half">
              <label>Width</label>
              <input
                type="number"
                value={Math.round(selectedAsset.size.width)}
                onChange={(e) =>
                  onUpdateAsset(selectedAsset.id, {
                    size: { ...selectedAsset.size, width: parseInt(e.target.value) },
                  })
                }
              />
            </div>
            <div className="property-group half">
              <label>Height</label>
              <input
                type="number"
                value={Math.round(selectedAsset.size.height)}
                onChange={(e) =>
                  onUpdateAsset(selectedAsset.id, {
                    size: { ...selectedAsset.size, height: parseInt(e.target.value) },
                  })
                }
              />
            </div>
          </div>
          <div className="property-group">
            <label>Lock Position</label>
            <button
              className={`lock-btn ${selectedAsset.locked ? 'locked' : ''}`}
              onClick={() => onUpdateAsset(selectedAsset.id, { locked: !selectedAsset.locked })}
            >
              {selectedAsset.locked ? <MdLock /> : <MdLockOpen />}
              {selectedAsset.locked ? 'Locked' : 'Unlocked'}
            </button>
          </div>
        </div>

        {selectedAsset.type === 'text' && (
          <div className="panel-section">
            <h3>Text Properties</h3>
            <div className="property-group">
              <label>Content</label>
              <textarea
                value={selectedAsset.content}
                onChange={(e) => onUpdateAsset(selectedAsset.id, { content: e.target.value })}
                rows="3"
              />
            </div>
            <div className="property-group">
              <label>Font</label>
              <select
                value={selectedAsset.fontFamily}
                onChange={(e) => onUpdateAsset(selectedAsset.id, { fontFamily: e.target.value })}
              >
                {fonts.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>
            <div className="property-row">
              <div className="property-group half">
                <label>Size</label>
                <input
                  type="number"
                  value={selectedAsset.fontSize}
                  onChange={(e) =>
                    onUpdateAsset(selectedAsset.id, { fontSize: parseInt(e.target.value) })
                  }
                  min="8"
                  max="200"
                />
              </div>
              <div className="property-group half">
                <label>Weight</label>
                <select
                  value={selectedAsset.fontWeight}
                  onChange={(e) => onUpdateAsset(selectedAsset.id, { fontWeight: e.target.value })}
                >
                  <option value="300">Light</option>
                  <option value="400">Regular</option>
                  <option value="500">Medium</option>
                  <option value="700">Bold</option>
                  <option value="900">Black</option>
                </select>
              </div>
            </div>
            <div className="property-group">
              <label>Color</label>
              <input
                type="color"
                value={selectedAsset.color}
                onChange={(e) => onUpdateAsset(selectedAsset.id, { color: e.target.value })}
              />
            </div>
            <div className="property-group">
              <label>Alignment</label>
              <div className="alignment-buttons">
                <button
                  className={selectedAsset.textAlign === 'left' ? 'active' : ''}
                  onClick={() => onUpdateAsset(selectedAsset.id, { textAlign: 'left' })}
                >
                  <MdFormatAlignLeft />
                </button>
                <button
                  className={selectedAsset.textAlign === 'center' ? 'active' : ''}
                  onClick={() => onUpdateAsset(selectedAsset.id, { textAlign: 'center' })}
                >
                  <MdFormatAlignCenter />
                </button>
                <button
                  className={selectedAsset.textAlign === 'right' ? 'active' : ''}
                  onClick={() => onUpdateAsset(selectedAsset.id, { textAlign: 'right' })}
                >
                  <MdFormatAlignRight />
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedAsset.type === 'shape' && (
          <div className="panel-section">
            <h3>Shape Properties</h3>
            <div className="property-group">
              <label>Shape Type</label>
              <select
                value={selectedAsset.shapeType}
                onChange={(e) => onUpdateAsset(selectedAsset.id, { shapeType: e.target.value })}
              >
                <option value="rectangle">Rectangle</option>
                <option value="circle">Circle</option>
                <option value="triangle">Triangle</option>
                <option value="hexagon">Hexagon</option>
              </select>
            </div>
            <div className="property-group">
              <label>Background Color</label>
              <input
                type="color"
                value={selectedAsset.backgroundColor}
                onChange={(e) =>
                  onUpdateAsset(selectedAsset.id, { backgroundColor: e.target.value })
                }
              />
            </div>
            <div className="property-group">
              <label>Border Radius</label>
              <input
                type="range"
                value={selectedAsset.borderRadius || 0}
                onChange={(e) =>
                  onUpdateAsset(selectedAsset.id, { borderRadius: parseInt(e.target.value) })
                }
                min="0"
                max="50"
              />
              <span>{selectedAsset.borderRadius || 0}px</span>
            </div>
            <div className="property-group">
              <label>Opacity</label>
              <input
                type="range"
                value={(selectedAsset.opacity || 1) * 100}
                onChange={(e) =>
                  onUpdateAsset(selectedAsset.id, { opacity: parseInt(e.target.value) / 100 })
                }
                min="0"
                max="100"
              />
              <span>{Math.round((selectedAsset.opacity || 1) * 100)}%</span>
            </div>
          </div>
        )}

        {selectedAsset.type === 'image' && (
          <div className="panel-section">
            <h3>Image Properties</h3>
            <div className="property-group">
              <label>Opacity</label>
              <input
                type="range"
                value={(selectedAsset.opacity || 1) * 100}
                onChange={(e) =>
                  onUpdateAsset(selectedAsset.id, { opacity: parseInt(e.target.value) / 100 })
                }
                min="0"
                max="100"
              />
              <span>{Math.round((selectedAsset.opacity || 1) * 100)}%</span>
            </div>
            <div className="property-group">
              <label>Border Radius</label>
              <input
                type="range"
                value={selectedAsset.borderRadius || 0}
                onChange={(e) =>
                  onUpdateAsset(selectedAsset.id, { borderRadius: parseInt(e.target.value) })
                }
                min="0"
                max="50"
              />
              <span>{selectedAsset.borderRadius || 0}px</span>
            </div>
          </div>
        )}

        <div className="panel-section">
          <button className="btn-danger full-width" onClick={() => onDeleteAsset(selectedAsset.id)}>
            Delete Asset
          </button>
        </div>
      </>
    );
  };

  const applyTemplate = (templateType) => {
    switch (templateType) {
      case 'youtube':
        onCanvasSizeChange({ width: 1280, height: 720 });
        onBackgroundChange({
          type: 'gradient',
          value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        });
        break;
      case 'instagram':
        onCanvasSizeChange({ width: 1080, height: 1080 });
        onBackgroundChange({
          type: 'gradient',
          value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        });
        break;
      case 'twitter':
        onCanvasSizeChange({ width: 1500, height: 500 });
        onBackgroundChange({
          type: 'gradient',
          value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="property-panel">
      <div className="panel-header">
        <h2>Properties</h2>
      </div>

      <div className="panel-content">
        <div className="panel-section">
          <h3>Canvas</h3>
          <div className="property-group">
            <label>Preset Sizes</label>
            <select
              onChange={(e) => {
                const preset = presetSizes[e.target.value];
                if (preset) onCanvasSizeChange({ width: preset.width, height: preset.height });
              }}
            >
              <option value="">Select preset...</option>
              {presetSizes.map((preset, index) => (
                <option key={index} value={index}>
                  {preset.name} ({preset.width}×{preset.height})
                </option>
              ))}
            </select>
          </div>
          <div className="property-row">
            <div className="property-group half">
              <label>Width</label>
              <input
                type="number"
                value={canvasSize.width}
                onChange={(e) =>
                  onCanvasSizeChange({ ...canvasSize, width: parseInt(e.target.value) })
                }
              />
            </div>
            <div className="property-group half">
              <label>Height</label>
              <input
                type="number"
                value={canvasSize.height}
                onChange={(e) =>
                  onCanvasSizeChange({ ...canvasSize, height: parseInt(e.target.value) })
                }
              />
            </div>
          </div>
        </div>

        {renderToolProperties()}
        {renderAssetProperties()}
      </div>
    </div>
  );
}

export default PropertyPanel;
