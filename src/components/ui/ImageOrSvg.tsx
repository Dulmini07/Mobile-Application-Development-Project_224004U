import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageStyle, StyleProp, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

type Props = {
  uri?: string | null;
  style?: StyleProp<ImageStyle>;
  width?: number | string;
  height?: number | string;
  placeholder?: string;
};

export default function ImageOrSvg({ uri, style, width, height, placeholder }: Props) {
  const [svgXml, setSvgXml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const isSvg = typeof uri === 'string' && /\.svg(\?|$)/i.test(uri);

  useEffect(() => {
    let mounted = true;
    setSvgXml(null);
    setError(false);

    if (!isSvg) return;

    if (!uri) return;

    setLoading(true);
    fetch(uri)
      .then((res) => res.text())
      .then((text) => {
        if (!mounted) return;
        setSvgXml(text);
      })
      .catch(() => {
        if (!mounted) return;
        setError(true);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [uri, isSvg]);

  // Render SVG if available
  if (isSvg) {
    if (loading) {
      return (
        <View style={[{ justifyContent: 'center', alignItems: 'center' }, (style as any) || {}]}>
          <ActivityIndicator />
        </View>
      );
    }
    if (svgXml && !error) {
      return <SvgXml xml={svgXml} width={width ?? (style as any)?.width ?? '100%'} height={height ?? (style as any)?.height ?? '100%'} />;
    }
    // fall through to image fallback if error or svg not loaded
  }

  // Fallback: regular Image (works for PNG/JPG)
  const src = uri ? { uri } : placeholder ? { uri: placeholder } : undefined;
  return <Image source={src} style={style} resizeMode="contain" onError={() => setError(true)} />;
}
