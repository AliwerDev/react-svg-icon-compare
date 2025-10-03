import React, { useState, useMemo, useRef } from 'react';
import {
  getSvgPixelData,
  comparePixelData,
  normalizeSvg,
  renderIconToSvg,
} from '../utils/svgComparison';
import type { IconCompareProps, ComparisonProgress } from '../utils/types';

export const IconCompare: React.FC<IconCompareProps> = ({
  icons,
  className = '',
  onComparisonComplete,
  duplicateThreshold = 90,
  similarThreshold = 70,
  gridColumns = 8,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pastedSvg, setPastedSvg] = useState('');
  const [similarityScores, setSimilarityScores] = useState<Record<string, number>>({});
  const [showPasteArea, setShowPasteArea] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [compareProgress, setCompareProgress] = useState<ComparisonProgress>({
    current: 0,
    total: 0,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const compareSvgWithIcons = async (svgString: string) => {
    if (isComparing) return;

    setIsComparing(true);
    setSimilarityScores({});

    const normalizedSvg = normalizeSvg(svgString);
    if (!normalizedSvg) {
      alert('Invalid SVG format!');
      setIsComparing(false);
      return;
    }

    const pastedData = await getSvgPixelData(normalizedSvg);
    if (!pastedData) {
      alert('Failed to load SVG. Please check the format.');
      setIsComparing(false);
      return;
    }

    const scores: Record<string, number> = {};
    const iconEntries = Object.entries(icons);
    setCompareProgress({ current: 0, total: iconEntries.length });

    for (let i = 0; i < iconEntries.length; i++) {
      const [name, IconComponent] = iconEntries[i];
      setCompareProgress({ current: i + 1, total: iconEntries.length });

      try {
        const iconSvgString = await renderIconToSvg(IconComponent);
        if (!iconSvgString) continue;

        const iconData = await getSvgPixelData(iconSvgString);
        if (iconData) {
          const similarity = comparePixelData(pastedData, iconData);
          scores[name] = similarity;
        }
      } catch (error) {
        console.error(`Error processing ${name}:`, error);
      }
    }

    setSimilarityScores(scores);
    setIsComparing(false);
    setCompareProgress({ current: 0, total: 0 });

    if (onComparisonComplete) {
      onComparisonComplete(scores);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const text = e.clipboardData.getData('text');
    if (text.includes('<svg') && text.includes('</svg>')) {
      setPastedSvg(text);
      setTimeout(() => {
        compareSvgWithIcons(text);
      }, 100);
    }
  };

  const filteredIcons = useMemo(() => {
    const entries = Object.entries(icons);

    if (Object.keys(similarityScores).length > 0) {
      return entries
        .map(([name, Icon]) => ({
          name,
          Icon,
          similarity: similarityScores[name] || 0,
        }))
        .sort((a, b) => b.similarity - a.similarity);
    }

    if (searchTerm) {
      return entries
        .filter(([name]) => name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(([name, Icon]) => ({ name, Icon, similarity: 0 }));
    }

    return entries.map(([name, Icon]) => ({ name, Icon, similarity: 0 }));
  }, [searchTerm, similarityScores, icons]);

  const resetComparison = () => {
    setPastedSvg('');
    setSimilarityScores({});
    setIsComparing(false);
    setCompareProgress({ current: 0, total: 0 });
  };

  return (
    <div className={`p-6 space-y-6 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Icons ({Object.keys(icons).length})</h1>
          <button
            onClick={() => {
              if (showPasteArea) {
                setShowPasteArea(false);
                resetComparison();
              } else {
                setShowPasteArea(true);
              }
            }}
            className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showPasteArea ? 'Close' : 'Search SVG'}
          </button>
        </div>

        <input
          type="text"
          placeholder="Search icon name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSimilarityScores({});
            setPastedSvg('');
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {showPasteArea && (
          <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 space-y-3">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">
                    Paste new SVG icon here:
                  </label>
                </div>
                <textarea
                  placeholder="Paste <svg>...</svg> code here..."
                  onPaste={handlePaste}
                  value={pastedSvg}
                  readOnly
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm bg-gray-50 cursor-text"
                />
                <p className="mt-2 text-sm text-gray-600">
                  💡 Comparison will start automatically after pasting SVG code
                </p>
              </div>

              {pastedSvg && (
                <div>
                  <button
                    onClick={resetComparison}
                    className="px-3 py-2 w-32 bg-red-400 cursor-pointer mb-3 text-white rounded hover:bg-red-500 transition-colors"
                  >
                    Reset
                  </button>
                  <div
                    className="w-32 h-32 flex items-center justify-center border-2 border-gray-300 rounded-lg bg-white [&>svg]:w-24 [&>svg]:h-24"
                    dangerouslySetInnerHTML={{ __html: pastedSvg }}
                  />
                </div>
              )}
            </div>

            {isComparing && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-medium text-yellow-900">
                  ⏳ Comparing... {compareProgress.current}/{compareProgress.total}
                </p>
                <div className="mt-2 w-full bg-yellow-200 rounded-full h-2">
                  <div
                    className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(compareProgress.current / compareProgress.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {!isComparing && Object.keys(similarityScores).length > 0 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900">
                  ✅ Comparison complete! Similar icons are shown at the top.
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  {duplicateThreshold}%+ similarity - likely duplicate, {similarThreshold}-
                  {duplicateThreshold}% - very similar design
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` }}
      >
        {filteredIcons.map(({ name, Icon, similarity }) => (
          <div
            key={name}
            className={`flex flex-col items-center gap-2 text-center text-sm p-3 rounded-lg transition-all ${
              similarity > duplicateThreshold
                ? 'bg-red-100 border-2 border-red-500'
                : similarity > similarThreshold
                ? 'bg-yellow-100 border-2 border-yellow-500'
                : similarity > 50
                ? 'bg-blue-50 border border-blue-300'
                : 'hover:bg-gray-50'
            }`}
          >
            <Icon className="w-7 h-7 text-gray-800" />
            <span className="text-xs break-all">{name}</span>
            {similarity > 0 && (
              <span
                className={`text-xs font-bold ${
                  similarity > duplicateThreshold
                    ? 'text-red-700'
                    : similarity > similarThreshold
                    ? 'text-yellow-700'
                    : 'text-blue-700'
                }`}
              >
                {similarity.toFixed(1)}%
              </span>
            )}
          </div>
        ))}
      </div>

      {filteredIcons.length === 0 && (
        <div className="text-center py-12 text-gray-500">No icons found</div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
