import React from 'react';
import './AssetsPanel.scss';
import { MdDelete, MdLock, MdLockOpen, MdRestartAlt } from 'react-icons/md';

function AssetsPanel({
  assets,
  setCanvasAssets,
  updateAsset,
  removeAsset,
  selectedId,
  setSelectedId,
  selectedLayoutIndex,
}) {
  const handleDeleteAsset = (assetId) => {
    removeAsset(assetId);
    if (selectedId === assetId) {
      setSelectedId(null);
    }
  };

  const resetAssetPosition = (asset) => {
    updateAsset(asset.id, {
      style: { ...asset.style, x: asset.originalX || '50%', y: asset.originalY || '50%' },
    });
  };

  const handleStyleChange = (asset, property, value) => {
    updateAsset(asset.id, { style: { ...asset.style, [property]: value } });
  };

  const addNewText = (type) => {
    const layoutIndex = selectedLayoutIndex !== undefined ? selectedLayoutIndex : 2;

    const layoutPositions = {
      0: { title: '50%', subtitle: '60%', body: '70%' },
      1: { title: '44%', subtitle: '60%', body: '70%' },
      2: { title: '45%', subtitle: '60%', body: '90%' },
    };

    const positions = layoutPositions[layoutIndex] || layoutPositions[2];

    const textTemplates = {
      title: {
        name: '제목을 입력하세요',
        style: {
          fontSize: '48px',
          fontWeight: 'bold',
          x: '50%',
          y: positions.title,
          color: 'rgba(255,255,255,1)',
          textShadow: '2px 2px 2px rgba(0,0,0,.5)',
        },
        originalX: '50%',
        originalY: positions.title,
      },
      subtitle: {
        name: '부제목을 입력하세요',
        style: {
          fontSize: '28px',
          x: '50%',
          y: positions.subtitle,
          color: 'rgba(255,255,255,1)',
          textShadow: '2px 2px 2px rgba(0,0,0,.5)',
        },
        originalX: '50%',
        originalY: positions.subtitle,
      },
      body: {
        name: '본문을 입력하세요',
        style: {
          fontSize: '16px',
          x: '50%',
          y: positions.body,
          color: 'rgba(255,255,255,1)',
          textShadow: '1px 1px 1px rgba(0,0,0,.3)',
        },
        originalX: '50%',
        originalY: positions.body,
      },
    };

    const template = textTemplates[type];
    const newAsset = {
      ...template,
      type: 'text',
      id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      originalX: template.originalX,
      originalY: template.originalY,
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
                className={`asset-item ${selectedId === asset.id ? 'selected' : ''} ${asset.locked ? 'locked' : ''}`}
                onClick={() => setSelectedId(asset.id)}
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
                    {asset.type === 'text' && (
                      <button
                        className="btn-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          resetAssetPosition(asset);
                        }}
                        title="위치 초기화"
                      >
                        <MdRestartAlt />
                      </button>
                    )}
                    <button
                      className="btn-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateAsset(asset.id, { locked: !asset.locked });
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
                      value={asset.name}
                      onChange={(e) => updateAsset(asset.id, { name: e.target.value })}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="텍스트 입력"
                      className="text-input"
                    />
                  </div>
                )}

                {selectedId === asset.id && asset.type === 'text' && (
                  <div className="asset-properties">
                    <div className="property-group">
                      <h5>텍스트 스타일</h5>
                      <div className="property-row">
                        <label>크기</label>
                        <input
                          type="number"
                          value={parseInt(asset.style?.fontSize) || 16}
                          onChange={(e) =>
                            handleStyleChange(asset, 'fontSize', `${e.target.value}px`)
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
                          onChange={(e) => handleStyleChange(asset, 'color', e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="property-row">
                        <label>굵기</label>
                        <select
                          value={asset.style?.fontWeight || 'normal'}
                          onChange={(e) => handleStyleChange(asset, 'fontWeight', e.target.value)}
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
                          onChange={(e) => handleStyleChange(asset, 'fontFamily', e.target.value)}
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
                              handleStyleChange(asset, 'textAlign', 'left');
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
                              handleStyleChange(asset, 'textAlign', 'center');
                            }}
                            title="가운데 정렬"
                          >
                            ⬆
                          </button>
                          <button
                            className={asset.style?.textAlign === 'right' ? 'active' : ''}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStyleChange(asset, 'textAlign', 'right');
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
                              asset,
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
                              asset,
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
                              asset,
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
