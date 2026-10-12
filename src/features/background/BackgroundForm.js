import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import './_BackgroundForm-new.scss';
import { RiUploadLine } from 'react-icons/ri';
import { getRgba, getGradient } from '../../utils/color.js';

function getRandomChannel() {
  return Math.floor(Math.random() * 160) + 80;
}

function getRandomRgba() {
  return { r: getRandomChannel(), g: getRandomChannel(), b: getRandomChannel(), a: 1 };
}

function saveImages(images) {
  try {
    localStorage.setItem('thumbnailMakerImages', JSON.stringify(images));
  } catch {
    alert('이미지 용량이 커서 브라우저에 저장하지 못했습니다. 새로고침하면 목록에서 사라집니다.');
  }
}

function BackgroundForm({ background, setBackground }) {
  const [color, setColor] = useState({ r: 205, g: 106, b: 131, a: 1 });
  const [uploadedImages, setUploadedImages] = useState(() => {
    const savedImages = localStorage.getItem('thumbnailMakerImages');
    return savedImages ? JSON.parse(savedImages) : [];
  });
  const [showColorPicker, setShowColorPicker] = useState(false);

  function handleCustomColor(selectedColor) {
    setColor(selectedColor.rgb);
    setBackground({ type: 'color', background: getRgba(selectedColor.rgb) });
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const updatedImages = [...uploadedImages, { url: reader.result, name: file.name }];
        setUploadedImages(updatedImages);
        setBackground({ type: 'image', background: reader.result });
        saveImages(updatedImages);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleImageDelete(index) {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
    saveImages(updatedImages);
  }

  function getRandomColor() {
    setBackground({ type: 'color', background: getRgba(getRandomRgba()) });
  }

  function getRandomGradient() {
    setBackground({
      type: 'gradient',
      background: getGradient({
        form: 'linear',
        direction: 135,
        from: getRandomRgba(),
        to: getRandomRgba(),
      }),
    });
  }

  // 새로운 프리셋 색상 및 그라데이션
  const presetColors = [
    '#ef4444',
    '#f97316',
    '#eab308',
    '#84cc16',
    '#22c55e',
    '#14b8a6',
    '#06b6d4',
    '#3b82f6',
    '#6366f1',
    '#8b5cf6',
    '#a855f7',
    '#ec4899',
    '#f43f5e',
    '#64748b',
    '#171717',
    '#ffffff',
  ];

  const presetGradients = [
    { name: '일몰', from: '#ff6b6b', to: '#4ecdc4', type: 'linear' },
    { name: '보라', from: 'rgb(255,206,217)', to: 'rgb(160,193,238)', type: 'linear' },
    { name: '숯불', from: '#f093fb', to: '#f5576c', type: 'linear' },
    { name: '바다', from: '#4facfe', to: '#00f2fe', type: 'linear' },
    { name: '숲', from: '#38ef7d', to: '#11998e', type: 'linear' },
    { name: '황금', from: '#f6d365', to: '#fda085', type: 'linear' },
  ];

  function handlePresetColor(color) {
    setBackground({ type: 'color', background: color });
  }

  function handlePresetGradient(gradient) {
    const bg =
      gradient.type === 'linear'
        ? `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`
        : `radial-gradient(circle, ${gradient.from} 0%, ${gradient.to} 100%)`;
    setBackground({ type: 'gradient', background: bg });
  }

  return (
    <div className="section-form-background-new">
      <h3 className="section-header">배경</h3>
      <div className="background-section">
        {/* 랜덤 버튼 */}
        <div className="random-section">
          <button onClick={getRandomColor} className="btn-random">
            랜덤 색상
          </button>
          <button onClick={getRandomGradient} className="btn-random">
            랜덤 그라데이션
          </button>
        </div>

        {/* 이미지 배경 */}
        <div className="preset-section">
          <h4 className="section-title">이미지 배경</h4>
          <div className="image-grid">
            {uploadedImages.map((image, index) => (
              <div
                key={index}
                className={`image-item ${background.type === 'image' && background.background === image.url ? 'active' : ''}`}
                style={{ backgroundImage: `url(${image.url})` }}
                onClick={() => setBackground({ type: 'image', background: image.url })}
              >
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageDelete(index);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
            <label className="image-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <RiUploadLine />
              <span>업로드</span>
            </label>
          </div>
        </div>

        {/* 프리셋 색상 */}
        <div className="preset-section">
          <h4 className="section-title">프리셋 색상</h4>
          <div className="color-grid">
            {presetColors.map((color, index) => (
              <div
                key={index}
                className="color-item"
                style={{ backgroundColor: color }}
                onClick={() => handlePresetColor(color)}
              />
            ))}
          </div>
        </div>

        {/* 그라데이션 프리셋 */}
        <div className="preset-section">
          <h4 className="section-title">그라데이션</h4>
          <div className="gradient-grid">
            {presetGradients.map((gradient, index) => (
              <div
                key={index}
                className="gradient-item"
                style={{
                  background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
                }}
                onClick={() => handlePresetGradient(gradient)}
              >
                <span className="gradient-name">{gradient.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 커스텀 색상 */}
        <div className="custom-section">
          <button className="btn-custom-color" onClick={() => setShowColorPicker(!showColorPicker)}>
            커스텀 색상 선택
          </button>

          {showColorPicker && (
            <div className="color-picker-modal">
              <div className="color-picker-backdrop" onClick={() => setShowColorPicker(false)} />
              <div className="color-picker-content">
                <SketchPicker color={color} onChangeComplete={handleCustomColor} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BackgroundForm;
