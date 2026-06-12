import { useState, useEffect } from 'react';

import fallbackImg from '../assets/images/fallback-service.svg';

export const FALLBACK_IMAGE = fallbackImg;

export const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

/** Resolve profile/upload URLs from the backend */
export const resolveImageUrl = (src) => {
  if (!src) return FALLBACK_IMAGE;
  if (src.startsWith('data:') || src.startsWith('http')) return src;
  if (src.startsWith('/uploads') || src.startsWith('/images')) {
    return `${API_BASE}${src}`;
  }
  return src;
};

const SafeImage = ({
  src,
  alt = '',
  className = '',
  fallback = FALLBACK_IMAGE,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(() => resolveImageUrl(src) || fallback);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(resolveImageUrl(src) || fallback);
    setHasError(false);
  }, [src, fallback]);

  const handleError = () => {
    if (!hasError && imgSrc !== fallback) {
      setHasError(true);
      setImgSrc(fallback);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      referrerPolicy="no-referrer"
      {...props}
    />
  );
};

export default SafeImage;
