import React, { useState } from 'react';

function ThemedVisualAsset({ asset }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    if (asset.fallbackBehavior === 'replace_with_shape') {
      return (
        <div
          className="themed-asset-fallback"
          data-testid={`themed-asset-fallback-${asset.id}`}
          aria-hidden="true"
        />
      );
    }

    return null;
  }

  const imageAlt = asset.altText || '';
  const isDecorative = !asset.altText;

  return (
    <img
      className="themed-asset"
      src={asset.localPath}
      alt={imageAlt}
      aria-hidden={isDecorative}
      onError={() => setHasError(true)}
    />
  );
}

export default ThemedVisualAsset;
