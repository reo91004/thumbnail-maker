import React, { useEffect, useState } from 'react';
import { SketchPicker } from 'react-color';
import './_BackgroundForm-new.scss';
import { RiUploadLine } from 'react-icons/ri';
import { getRgba, getGradient } from '../../utils/color.js';
import defaultColorList from '../../constants/defaultColorList.json';

const randomColorIndex = defaultColorList.length - 2;
const randomGradientIndex = defaultColorList.length - 1;

function BackgroundForm(props) {
  const { setBackground, background } = props;
  const gradientItemStartIndex = 8;
  const [colorList, setColorList] = useState(defaultColorList);
  const [currentColorItem, setCurrentColorItem] = useState({
    index: gradientItemStartIndex,
    isFrom: true,
    type: 'gradient',
    isRand: false,
  });
  const [gradientStyle, setGradientStyle] = useState(defaultColorList[gradientItemStartIndex]);
  const [color, setColor] = useState(defaultColorList[0].rgb);
  const [uploadedImages, setUploadedImages] = useState(() => {
    const savedImages = localStorage.getItem('thumbnailMakerImages');
    return savedImages ? JSON.parse(savedImages) : [];
  });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(() => {
    // 배경이 이미지인 경우 선택된 이미지 인덱스 찾기
    if (background && background.type === 'image') {
      const images = localStorage.getItem('thumbnailMakerImages');
      if (images) {
        const savedImages = JSON.parse(images);
        return savedImages.findIndex(img => img === background.background);
      }
    }
    return null;
  });
  useEffect(() => {
    if (currentColorItem.index !== null) {
      const current = colorList[currentColorItem.index];
      const newColor =
        current.type === 'color'
          ? current.rgb
          : currentColorItem.isFrom
            ? current.from
            : current.to;
      setColor((color) => ({ ...color, ...newColor }));
      if (current.type === 'gradient') {
        setGradientStyle(current);
      }
    }
  }, [currentColorItem]);

  function getBackgroundStyle(colorItem) {
    return colorItem.type === 'color' ? getRgba(colorItem.rgb) : getGradient(colorItem);
  }

  function handleGradientOneColor(e) {
    let name = e.target.getAttribute('name');
    setCurrentColorItem({ ...currentColorItem, isFrom: name === 'from', type: 'gradient' });
  }

  const handleChange = (selectedColor) => {
    let currentColorList = [...colorList];
    const newColor = selectedColor.rgb;
    if (currentColorItem.type === 'color') {
      currentColorList[currentColorItem.index].rgb = newColor;
    } else {
      const keyword = currentColorItem.isFrom ? 'from' : 'to';
      currentColorList[currentColorItem.index][keyword] = newColor;
    }
    setColor({ ...color, ...newColor });
    setColorList(currentColorList);

    // 색상 변경 시 배경 업데이트
    setBackground({
      type: currentColorItem.type,
      background: getBackgroundStyle(currentColorList[currentColorItem.index]),
    });
  };

  function handleGradient(e) {
    const form = e.target.name;
    let newObject = { ...gradientStyle, form };
    if (form === 'linear' && gradientStyle.form === form) {
      newObject.direction = gradientStyle.direction === 315 ? 0 : gradientStyle.direction + 45;
    }
    if (currentColorItem.index) {
      let currentColorList = [...colorList];
      currentColorList[currentColorItem.index].form = form;
    }
    setGradientStyle(newObject);
    setBackground({ ...background, type: 'gradient', background: getGradient(newObject) });
  }


  function handleBackground(url, index) {
    setSelectedImage(index);
    setBackground({ type: 'image', background: url });
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target.result;
        const newImage = { url, name: file.name };
        const updatedImages = [...uploadedImages, newImage];
        setUploadedImages(updatedImages);
        // localStorage에 저장
        localStorage.setItem('thumbnailMakerImages', JSON.stringify(updatedImages));
        handleBackground(url, uploadedImages.length);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleImageDelete(index) {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
    localStorage.setItem('thumbnailMakerImages', JSON.stringify(updatedImages));
    if (selectedImage === index) {
      setSelectedImage(null);
    }
  }

  function getRandNumber(prevNum) {
    const max = 240;
    const min = 80;
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function getRandomRgba() {
    let randomColor = {
      r: getRandNumber(),
      g: getRandNumber(),
      b: getRandNumber(),
      a: 1,
    };
    return randomColor;
  }
  function getRandomColor() {
    const newRandomColor = getRandomRgba();
    let currentColorList = [...colorList];
    currentColorList[randomColorIndex].rgb = newRandomColor;
    setCurrentColorItem({ index: randomColorIndex, type: 'color', isRand: true });
    setColorList(currentColorList);
  }

  function getRandomGradient() {
    const from = getRandomRgba();
    const to = getRandomRgba();
    let currentColorList = [...colorList];
    currentColorList[randomGradientIndex] = { ...currentColorList[randomGradientIndex], from, to };
    setCurrentColorItem({
      index: randomGradientIndex,
      type: 'gradient',
      isFrom: true,
      isRand: true,
    });
    setColorList(currentColorList);
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
                className={`image-item ${selectedImage === index ? 'active' : ''}`}
                style={{ backgroundImage: `url(${image.url})` }}
                onClick={() => handleBackground(image.url, index)}
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
                <SketchPicker color={color} onChangeComplete={handleChange} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BackgroundForm;
