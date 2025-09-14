import React, { useState } from 'react';
import './AssetsPanel.scss';
import { MdDelete, MdLock, MdLockOpen } from 'react-icons/md';

function AssetsPanel({ assets, setCanvasAssets, currentAsset, setCurrentAsset }) {
  const [assetTexts, setAssetTexts] = useState({});

  const handleTextChange = (assetId, newText) => {
    setAssetTexts({ ...assetTexts, [assetId]: newText });

    // 캔버스의 에셋 업데이트
    const updatedAssets = assets.map((asset) => {
      if (asset.id === assetId) {
        return { ...asset, name: newText };
      }
      return asset;
    });
    setCanvasAssets(updatedAssets);
  };

  const handleDeleteAsset = (assetId) => {
    const filteredAssets = assets.filter((asset) => asset.id !== assetId);
    setCanvasAssets(filteredAssets);
    if (currentAsset?.id === assetId) {
      setCurrentAsset({ index: null, type: null, style: {}, position: {} });
    }
  };

  const toggleLockAsset = (assetId) => {
    const updatedAssets = assets.map((asset) => {
      if (asset.id === assetId) {
        return { ...asset, locked: !asset.locked };
      }
      return asset;
    });
    setCanvasAssets(updatedAssets);
  };

  const handleAssetClick = (asset) => {
    setCurrentAsset({
      id: asset.id,
      index: assets.indexOf(asset),
      type: asset.type,
      style: asset.style || {},
      position: { x: asset.style?.x || 0, y: asset.style?.y || 0 },
    });
  };

  const handleStyleChange = (assetId, property, value) => {
    const updatedAssets = assets.map((asset) => {
      if (asset.id === assetId) {
        return {
          ...asset,
          style: {
            ...asset.style,
            [property]: value,
          },
        };
      }
      return asset;
    });
    setCanvasAssets(updatedAssets);
  };

  const addNewText = (type) => {
    const textTemplates = {
      title: {
        name: '제목을 입력하세요',
        style: {
          fontSize: '48px',
          fontWeight: 'bold',
          x: '50%',
          y: '50%',
          color: 'rgba(255,255,255,1)',
          textShadow: '2px 2px 2px rgba(0,0,0,.5)',
        },
      },
      subtitle: {
        name: '부제목을 입력하세요',
        style: {
          fontSize: '28px',
          x: '50%',
          y: '60%',
          color: 'rgba(255,255,255,1)',
          textShadow: '2px 2px 2px rgba(0,0,0,.5)',
        },
      },
      body: {
        name: '본문을 입력하세요',
        style: {
          fontSize: '16px',
          x: '50%',
          y: '70%',
          color: 'rgba(255,255,255,1)',
          textShadow: '1px 1px 1px rgba(0,0,0,.3)',
        },
      },
    };

    const newAsset = {
      ...textTemplates[type],
      type: 'text',
      id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    setCanvasAssets([...assets, newAsset]);
  };

  return (
    <div className="assets-panel">
      {/* 빠른 추가 섹션 */}
      <div className="quick-add-section">
        <h4>텍스트 추가</h4>
        <div className="quick-add-buttons">
          <button onClick={() => addNewText('title')} className="add-btn">
            <span className="icon">T</span>
            <span>제목</span>
          </button>
          <button onClick={() => addNewText('subtitle')} className="add-btn">
            <span className="icon">t</span>
            <span>부제</span>
          </button>
          <button onClick={() => addNewText('body')} className="add-btn">
            <span className="icon">𝘵</span>
            <span>본문</span>
          </button>
        </div>
      </div>

      {/* 에셋 목록 섹션 */}
      <div className="assets-list-section">
        <h4>현재 요소 ({assets.length})</h4>
        <div className="assets-list">
          {assets.length === 0 ? (
            <div className="empty-state">
              <p>캔버스에 요소가 없습니다</p>
              <p className="hint">위에서 텍스트를 추가하세요</p>
            </div>
          ) : (
            assets.map((asset, index) => (
              <div
                key={asset.id}
                className={`asset-item ${currentAsset?.id === asset.id ? 'selected' : ''} ${asset.locked ? 'locked' : ''}`}
                onClick={() => handleAssetClick(asset)}
              >
                <div className="asset-header">
                  <span className="asset-number">{index + 1}</span>
                  <span className="asset-type">
                    {asset.type === 'text'
                      ? '텍스트'
                      : asset.type === 'image'
                        ? '이미지'
                        : asset.type === 'figure'
                          ? '도형'
                          : asset.type}
                  </span>
                  <div className="asset-actions">
                    <button
                      className="btn-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLockAsset(asset.id);
                      }}
                      title={asset.locked ? '잠금 해제' : '위치 잠금'}
                    >
                      {asset.locked ? <MdLock /> : <MdLockOpen />}
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAsset(asset.id);
                      }}
                      title="삭제"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>

                {asset.type === 'text' && (
                  <div className="asset-content">
                    <input
                      type="text"
                      value={assetTexts[asset.id] !== undefined ? assetTexts[asset.id] : asset.name}
                      onChange={(e) => handleTextChange(asset.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="텍스트 입력"
                      className="text-input"
                    />
                  </div>
                )}

                {currentAsset?.id === asset.id && asset.type === 'text' && (
                  <div className="asset-properties">
                    <div className="property-group">
                      <h5>텍스트 스타일</h5>
                      <div className="property-row">
                        <label>크기</label>
                        <input
                          type="number"
                          value={parseInt(asset.style?.fontSize) || 16}
                          onChange={(e) =>
                            handleStyleChange(asset.id, 'fontSize', `${e.target.value}px`)
                          }
                          onClick={(e) => e.stopPropagation()}
                          min="10"
                          max="200"
                        />
                        <span>px</span>
                      </div>
                      <div className="property-row">
                        <label>색상</label>
                        <input
                          type="color"
                          value={
                            asset.style?.color?.replace(/rgba?\([^)]+\)/, '#ffffff') || '#ffffff'
                          }
                          onChange={(e) => handleStyleChange(asset.id, 'color', e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="property-row">
                        <label>굵기</label>
                        <select
                          value={asset.style?.fontWeight || 'normal'}
                          onChange={(e) =>
                            handleStyleChange(asset.id, 'fontWeight', e.target.value)
                          }
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="normal">보통</option>
                          <option value="bold">굵게</option>
                          <option value="300">얇게</option>
                          <option value="600">세미볼드</option>
                        </select>
                      </div>
                      <div className="property-row">
                        <label>글꼴</label>
                        <select
                          value={asset.style?.fontFamily || 'Pretendard'}
                          onChange={(e) =>
                            handleStyleChange(asset.id, 'fontFamily', e.target.value)
                          }
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="Pretendard">Pretendard</option>
                          <option value="'Noto Sans KR', sans-serif">Noto Sans KR</option>
                          <option value="'Nanum Gothic', sans-serif">나눔고딕</option>
                          <option value="'Nanum Myeongjo', serif">나눔명조</option>
                          <option value="'Black Han Sans', sans-serif">Black Han Sans</option>
                          <option value="'Jua', sans-serif">주아체</option>
                          <option value="'Do Hyeon', sans-serif">도현체</option>
                          <option value="'Nanum Pen Script', cursive">나눔펜체</option>
                          <option value="'Gamja Flower', cursive">감자꽃체</option>
                          <option value="'Gothic A1', sans-serif">Gothic A1</option>
                        </select>
                      </div>
                      <div className="property-row">
                        <label>정렬</label>
                        <div className="align-buttons">
                          <button
                            className={asset.style?.textAlign === 'left' ? 'active' : ''}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStyleChange(asset.id, 'textAlign', 'left');
                            }}
                            title="왼쪽 정렬"
                          >
                            ⬅
                          </button>
                          <button
                            className={
                              !asset.style?.textAlign || asset.style?.textAlign === 'center'
                                ? 'active'
                                : ''
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStyleChange(asset.id, 'textAlign', 'center');
                            }}
                            title="가운데 정렬"
                          >
                            ⬆
                          </button>
                          <button
                            className={asset.style?.textAlign === 'right' ? 'active' : ''}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStyleChange(asset.id, 'textAlign', 'right');
                            }}
                            title="오른쪽 정렬"
                          >
                            ➡
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="property-group">
                      <h5>효과</h5>
                      <div className="effect-buttons">
                        <button
                          className={`effect-btn ${asset.style?.textShadow ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStyleChange(
                              asset.id,
                              'textShadow',
                              asset.style?.textShadow ? '' : '2px 2px 2px rgba(0,0,0,.5)'
                            );
                          }}
                          title="텍스트 그림자"
                        >
                          <span style={{ textShadow: '2px 2px 2px rgba(0,0,0,.3)' }}>T</span>
                          <span className="label">그림자</span>
                        </button>
                        <button
                          className={`effect-btn ${asset.style?.fontStyle === 'italic' ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStyleChange(
                              asset.id,
                              'fontStyle',
                              asset.style?.fontStyle === 'italic' ? 'normal' : 'italic'
                            );
                          }}
                          title="기울임체"
                        >
                          <span style={{ fontStyle: 'italic' }}>T</span>
                          <span className="label">기울임</span>
                        </button>
                        <button
                          className={`effect-btn ${asset.style?.textDecoration === 'underline' ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStyleChange(
                              asset.id,
                              'textDecoration',
                              asset.style?.textDecoration === 'underline' ? 'none' : 'underline'
                            );
                          }}
                          title="밑줄"
                        >
                          <span style={{ textDecoration: 'underline' }}>T</span>
                          <span className="label">밑줄</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AssetsPanel;
