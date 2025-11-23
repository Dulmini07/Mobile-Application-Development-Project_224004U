import React, { useEffect, useState } from 'react';
import { Image, ImageProps, ImageStyle, StyleProp } from 'react-native';

type Props = {
  uris: (string | undefined | null)[];
  style?: StyleProp<ImageStyle>;
  imageProps?: Partial<ImageProps>;
  placeholder?: string;
};

export default function ImageWithFallback({ uris, style, imageProps, placeholder = 'https://via.placeholder.com/60' }: Props) {
  const [index, setIndex] = useState(0);
  const [current, setCurrent] = useState<string | undefined>(undefined);

  useEffect(() => {
    setIndex(0);
    setCurrent(uris && uris.length > 0 ? normalizeUri(uris[0]) : undefined);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(uris)]);

  function normalizeUri(u: any) {
    if (!u) return undefined;
    if (typeof u !== 'string') return undefined;
    return u;
  }

  const onError = () => {
    const next = index + 1;
    if (uris && next < uris.length) {
      setIndex(next);
      setCurrent(normalizeUri(uris[next]));
    } else {
      setCurrent(placeholder);
    }
  };

  return (
    // current may be undefined initially — Image handles that
    <Image
      {...(imageProps as any)}
      source={current ? { uri: current } : undefined}
      onError={onError}
      style={style}
      resizeMode="contain"
    />
  );
}
