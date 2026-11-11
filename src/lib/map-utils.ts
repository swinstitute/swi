export type MapInputType =
  | 'iframe'
  | 'embed-url'
  | 'maps-url'
  | 'coordinates'
  | 'search-query'
  | 'short-url'
  | 'empty';

export interface ParsedMapLocation {
  ok: boolean;
  inputType: MapInputType;
  embedUrl: string;
  mapLink: string;
  queryDisplay: string;
  coordinates?: { lat: number; lng: number };
  zoom: number;
  summary: string;
  error?: string;
  requiresShortUrlResolution?: boolean;
}

const DEFAULT_ZOOM = 16;

const clampZoom = (z?: number): number => {
  if (typeof z !== 'number' || Number.isNaN(z)) return DEFAULT_ZOOM;
  return Math.min(20, Math.max(3, Math.round(z)));
};

const isValidLatLng = (lat: number, lng: number): boolean =>
  Number.isFinite(lat) &&
  Number.isFinite(lng) &&
  lat >= -90 &&
  lat <= 90 &&
  lng >= -180 &&
  lng <= 180;

export const isSafeHttpUrl = (raw: string | undefined): boolean => {
  if (!raw || typeof raw !== 'string') return false;
  try {
    const parsed = new URL(raw.trim());
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
};

export const isAllowedMapEmbedHost = (hostname: string): boolean => {
  const host = hostname.toLowerCase();
  return /^(?:(?:www|maps)\.)?google\.(?:com|[a-z]{2,3}(?:\.[a-z]{2})?)$/.test(host);
};

export const isAllowedGoogleShortHost = (hostname: string): boolean => {
  const host = hostname.toLowerCase();
  return host === 'maps.app.goo.gl' || host === 'goo.gl' || host === 'g.page' || host === 'www.g.page';
};

export const isGoogleMapsShortUrl = (raw: string): boolean => {
  const candidate = normalizeUrlInput(raw);
  try {
    const url = new URL(candidate);
    if (!isAllowedGoogleShortHost(url.hostname)) return false;
    if (url.hostname.toLowerCase() === 'goo.gl') {
      return url.pathname.toLowerCase().startsWith('/maps');
    }
    return true;
  } catch {
    return false;
  }
};

export const extractEmbeddedGoogleMapsUrl = (raw: string): string | null => {
  const match = raw.match(
    /https?:\/\/(?:maps\.app\.goo\.gl|goo\.gl\/maps|g\.page|(?:www\.|maps\.)?google\.[a-z.]{2,12}(?:\/maps|\?))[^\s"'<>]+/i
  );
  return match ? match[0] : null;
};

const normalizeUrlInput = (raw: string): string => {
  const trimmed = raw.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^(?:www\.)?(?:google\.|maps\.google\.|maps\.app\.goo\.gl|goo\.gl\/maps|g\.page\/)/i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  const embedded = extractEmbeddedGoogleMapsUrl(trimmed);
  if (embedded) return embedded;
  return trimmed;
};

export const buildMapsEmbedUrl = (query: string, zoom = DEFAULT_ZOOM): string => {
  const safeZoom = clampZoom(zoom);
  const cleanQuery = query.trim();
  return `https://maps.google.com/maps?q=${encodeURIComponent(cleanQuery)}&t=&z=${safeZoom}&ie=UTF8&iwloc=&output=embed`;
};

export const buildMapsLinkUrl = (query: string): string => {
  const cleanQuery = query.trim();
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanQuery)}`;
};

const decodePlus = (val: string): string => {
  try {
    return decodeURIComponent(val.replace(/\+/g, ' ')).trim();
  } catch {
    return val.replace(/\+/g, ' ').trim();
  }
};

const extractCoordsPair = (text: string): { lat: number; lng: number } | undefined => {
  const match = text.trim().match(/^([+-]?\d{1,2}(?:\.\d+)?)\s*,\s*([+-]?\d{1,3}(?:\.\d+)?)$/);
  if (!match) return undefined;
  const lat = Number(match[1]);
  const lng = Number(match[2]);
  if (!isValidLatLng(lat, lng)) return undefined;
  return { lat, lng };
};

const extractCoordsFromGoogleMapsUrl = (rawUrl: string): {
  coords?: { lat: number; lng: number };
  zoom?: number;
  placeName?: string;
} => {
  let coords: { lat: number; lng: number } | undefined;
  let zoom: number | undefined;
  let placeName: string | undefined;

  // 1. Exact pin marker coords in Google Maps data/pb payload: !3d<lat>!4d<lng>
  const pinMatch = rawUrl.match(/!3d(-?\d{1,2}(?:\.\d+)?)!4d(-?\d{1,3}(?:\.\d+)?)/);
  if (pinMatch) {
    const lat = Number(pinMatch[1]);
    const lng = Number(pinMatch[2]);
    if (isValidLatLng(lat, lng)) {
      coords = { lat, lng };
    }
  }

  // 2. Embed protobuf coords fallback: !2d<lng>!3d<lat>
  if (!coords) {
    const pbCenterMatch = rawUrl.match(/!2d(-?\d{1,3}(?:\.\d+)?)!3d(-?\d{1,2}(?:\.\d+)?)/);
    if (pbCenterMatch) {
      const lng = Number(pbCenterMatch[1]);
      const lat = Number(pbCenterMatch[2]);
      if (isValidLatLng(lat, lng)) {
        coords = { lat, lng };
      }
    }
  }

  // 3. Path viewport center & zoom: /@lat,lng,17z
  const viewportMatch = rawUrl.match(/@(-?\d{1,2}(?:\.\d+)?),(-?\d{1,3}(?:\.\d+)?)(?:,(\d+(?:\.\d+)?)z)?/);
  if (viewportMatch) {
    if (!coords) {
      const lat = Number(viewportMatch[1]);
      const lng = Number(viewportMatch[2]);
      if (isValidLatLng(lat, lng)) {
        coords = { lat, lng };
      }
    }
    if (viewportMatch[3]) {
      zoom = clampZoom(Number(viewportMatch[3]));
    }
  }

  // 4. Embed mfe zoom (!6i<zoom>)
  const mfeZoomMatch = rawUrl.match(/!6i(\d{1,2})(?:!|$)/);
  if (!zoom && mfeZoomMatch) {
    zoom = clampZoom(Number(mfeZoomMatch[1]));
  }

  // 5. Place name from /place/<name>/, /search/<name>/, or /dir/<origin>/<dest>/
  const placePathMatch =
    rawUrl.match(/\/maps\/(?:place|search)\/([^/@?#]+)/i) ||
    rawUrl.match(/\/maps\/dir\/[^/]*\/([^/@?#]+)/i);
  if (placePathMatch && placePathMatch[1]) {
    const decoded = decodePlus(placePathMatch[1]);
    if (decoded && !extractCoordsPair(decoded)) {
      placeName = decoded;
    }
  }

  // 6. Place name from pb=!1s0x...!2s<name> or !1m3!2m1!1s<name>
  if (!placeName) {
    const pbPlaceMatch = rawUrl.match(/!1m3!2m1!1s([^!&]+)|!1s0x[^!]+!2s([^!&]+)/);
    const captured = pbPlaceMatch?.[1] || pbPlaceMatch?.[2];
    if (captured) {
      const unescaped = decodePlus(captured.replace(/\*21/g, '!').replace(/\*2A/gi, '*'));
      if (unescaped && !extractCoordsPair(unescaped)) {
        placeName = unescaped;
      }
    }
  }

  return { coords, zoom, placeName };
};

const extractIframeSrc = (html: string): string | null => {
  const match = html.match(/<iframe\b[^>]*\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i);
  const rawSrc = match?.[1] || match?.[2] || match?.[3];
  if (!rawSrc) return null;
  return rawSrc.replace(/&amp;/gi, '&').trim();
};

const isDirectEmbedUrl = (urlObj: URL): boolean => {
  const path = urlObj.pathname.toLowerCase();
  if (path.startsWith('/maps/embed/v1/')) {
    return urlObj.searchParams.has('key');
  }
  if (path.startsWith('/maps/embed') || path.startsWith('/maps/d/embed') || path.startsWith('/maps/d/u/0/embed')) {
    return true;
  }
  return urlObj.searchParams.get('output') === 'embed';
};

export const supportsAdjustableZoom = (embedUrl: string | undefined): boolean => {
  if (!embedUrl) return false;
  try {
    const parsed = new URL(embedUrl);
    return parsed.searchParams.get('output') === 'embed' && parsed.searchParams.has('q');
  } catch {
    return false;
  }
};

export const getZoomFromEmbedUrl = (embedUrl: string | undefined): number => {
  if (!embedUrl) return DEFAULT_ZOOM;
  try {
    const parsed = new URL(embedUrl);
    const zParam = parsed.searchParams.get('z');
    if (zParam) return clampZoom(Number(zParam));
    const mfeZoom = embedUrl.match(/!6i(\d{1,2})(?:!|$)/);
    if (mfeZoom) return clampZoom(Number(mfeZoom[1]));
  } catch {}
  return DEFAULT_ZOOM;
};

export const updateEmbedUrlZoom = (embedUrl: string, zoom: number): string => {
  const safeZoom = clampZoom(zoom);
  try {
    const parsed = new URL(embedUrl);
    if (parsed.searchParams.get('output') === 'embed' && parsed.searchParams.has('q')) {
      parsed.searchParams.set('z', String(safeZoom));
      return parsed.toString();
    }
  } catch {}
  return embedUrl;
};

export const parseSmartMapInput = (
  rawInput: string,
  options?: { zoom?: number; fallbackLabel?: string }
): ParsedMapLocation => {
  const zoom = clampZoom(options?.zoom);
  const trimmed = (rawInput || '').trim();

  if (!trimmed) {
    return {
      ok: false,
      inputType: 'empty',
      embedUrl: '',
      mapLink: '',
      queryDisplay: '',
      zoom,
      summary: 'Enter a location, coordinates, Google Maps link, or iframe embed code.',
      error: 'Location input cannot be empty.',
    };
  }

  // 1. Full <iframe> HTML snippet
  if (/<iframe\b/i.test(trimmed)) {
    const extractedSrc = extractIframeSrc(trimmed);
    if (!extractedSrc || !isSafeHttpUrl(extractedSrc)) {
      return {
        ok: false,
        inputType: 'iframe',
        embedUrl: '',
        mapLink: '',
        queryDisplay: '',
        zoom,
        summary: 'Invalid iframe snippet',
        error: 'Could not find a valid https:// Google Maps src attribute inside the <iframe> tag.',
      };
    }

    const srcUrl = new URL(extractedSrc);
    const isRootMapsIframeHost = /^maps\.google\.[a-z.]{2,12}$/i.test(srcUrl.hostname);
    if (!isAllowedMapEmbedHost(srcUrl.hostname) || (!srcUrl.pathname.toLowerCase().includes('/maps') && !isRootMapsIframeHost)) {
      return {
        ok: false,
        inputType: 'iframe',
        embedUrl: '',
        mapLink: '',
        queryDisplay: '',
        zoom,
        summary: 'Unsupported iframe source',
        error: 'Only official Google Maps embed iframe snippets (google.com/maps) are allowed.',
      };
    }

    // If someone wrapped a non-embed /maps/place URL inside an iframe, convert via URL branch
    if (!isDirectEmbedUrl(srcUrl)) {
      const converted = parseSmartMapInput(extractedSrc, options);
      return {
        ...converted,
        inputType: 'iframe',
      };
    }

    const { coords, zoom: urlZoom, placeName } = extractCoordsFromGoogleMapsUrl(extractedSrc);
    const qParam = srcUrl.searchParams.get('q') || srcUrl.searchParams.get('query') || '';
    const coordStr = coords ? `${coords.lat},${coords.lng}` : '';
    const queryDisplay =
      qParam ||
      placeName ||
      (coords ? `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}` : options?.fallbackLabel || 'Custom Google Maps Embed');
    const mapLink = coordStr
      ? buildMapsLinkUrl(coordStr)
      : qParam
      ? buildMapsLinkUrl(qParam)
      : placeName
      ? buildMapsLinkUrl(placeName)
      : buildMapsLinkUrl(queryDisplay);

    return {
      ok: true,
      inputType: 'iframe',
      embedUrl: srcUrl.toString(),
      mapLink,
      queryDisplay,
      coordinates: coords,
      zoom: urlZoom || zoom,
      summary: placeName
        ? `Extracted embed iframe for "${placeName}"`
        : coordStr
        ? `Extracted embed iframe (${coordStr})`
        : 'Extracted official Google Maps <iframe> embed',
    };
  }

  // 2. Direct numeric coordinates: "21.216391, 81.332308"
  const directCoords = extractCoordsPair(trimmed);
  if (directCoords) {
    const normalized = `${directCoords.lat},${directCoords.lng}`;
    return {
      ok: true,
      inputType: 'coordinates',
      embedUrl: buildMapsEmbedUrl(normalized, zoom),
      mapLink: buildMapsLinkUrl(normalized),
      queryDisplay: `${directCoords.lat}, ${directCoords.lng}`,
      coordinates: directCoords,
      zoom,
      summary: `Pinned exact GPS coordinates (${directCoords.lat.toFixed(5)}, ${directCoords.lng.toFixed(5)})`,
    };
  }

  // 3. Google Maps shortlinks (maps.app.goo.gl, goo.gl/maps, g.page)
  if (isGoogleMapsShortUrl(trimmed)) {
    const normalizedUrl = normalizeUrlInput(trimmed);
    return {
      ok: false,
      inputType: 'short-url',
      embedUrl: '',
      mapLink: normalizedUrl,
      queryDisplay: normalizedUrl,
      zoom,
      requiresShortUrlResolution: true,
      summary: 'Short Google Maps share link detected — resolving full map coordinates...',
    };
  }

  // 4. Google Maps URLs (browser URLs, share URLs, or direct embed URLs)
  const maybeUrl = normalizeUrlInput(trimmed);
  if (/^https?:\/\//i.test(maybeUrl)) {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(maybeUrl);
    } catch {
      return {
        ok: false,
        inputType: 'maps-url',
        embedUrl: '',
        mapLink: '',
        queryDisplay: '',
        zoom,
        summary: 'Invalid URL format',
        error: 'The pasted URL could not be parsed. Please copy the full link from Google Maps.',
      };
    }

    if (!isAllowedMapEmbedHost(parsedUrl.hostname) || !parsedUrl.pathname.toLowerCase().includes('/maps')) {
      // Also allow maps.google.com/?q=... where pathname is "/"
      const isRootMapsHost = /^maps\.google\.[a-z.]{2,12}$/i.test(parsedUrl.hostname);
      if (!isRootMapsHost) {
        return {
          ok: false,
          inputType: 'maps-url',
          embedUrl: '',
          mapLink: '',
          queryDisplay: '',
          zoom,
          summary: 'Non-Google Maps URL',
          error: 'Please paste a Google Maps URL (google.com/maps, maps.google.com, or maps.app.goo.gl), coordinates, or a place/address.',
        };
      }
    }

    const { coords, zoom: urlZoom, placeName } = extractCoordsFromGoogleMapsUrl(parsedUrl.toString());
    const effectiveZoom = clampZoom(urlZoom ?? options?.zoom);
    const rawQueryParam =
      parsedUrl.searchParams.get('q') ||
      parsedUrl.searchParams.get('query') ||
      parsedUrl.searchParams.get('destination') ||
      parsedUrl.searchParams.get('daddr') ||
      parsedUrl.searchParams.get('ll') ||
      parsedUrl.searchParams.get('center') ||
      '';
    const paramCoords = rawQueryParam ? extractCoordsPair(rawQueryParam) : undefined;
    const finalCoords = coords || paramCoords;

    // 4a. Direct embed URL
    if (isDirectEmbedUrl(parsedUrl)) {
      const cleanParam = rawQueryParam ? decodePlus(rawQueryParam) : '';
      const coordStr = finalCoords ? `${finalCoords.lat},${finalCoords.lng}` : '';
      const label =
        cleanParam ||
        placeName ||
        (finalCoords ? `${finalCoords.lat}, ${finalCoords.lng}` : options?.fallbackLabel || 'Google Maps Embed');

      let mapLink = '';
      if (parsedUrl.searchParams.get('output') === 'embed' && cleanParam) {
        mapLink = buildMapsLinkUrl(cleanParam);
      } else if (coordStr) {
        mapLink = buildMapsLinkUrl(coordStr);
      } else if (placeName) {
        mapLink = buildMapsLinkUrl(placeName);
      } else {
        mapLink = buildMapsLinkUrl(label);
      }

      return {
        ok: true,
        inputType: 'embed-url',
        embedUrl: parsedUrl.toString(),
        mapLink,
        queryDisplay: label,
        coordinates: finalCoords,
        zoom: effectiveZoom,
        summary: placeName
          ? `Connected Google Maps embed URL ("${placeName}")`
          : `Connected Google Maps embed URL`,
      };
    }

    // 4b. Standard browser/share Google Maps URL -> convert into embeddable URL + clean Maps link
    const coordStr = finalCoords ? `${finalCoords.lat},${finalCoords.lng}` : '';
    const cleanedParamQuery = rawQueryParam ? decodePlus(rawQueryParam) : '';
    const cidParam = parsedUrl.searchParams.get('cid');

    const embedTarget =
      coordStr ||
      placeName ||
      cleanedParamQuery ||
      '';

    if (!embedTarget && !cidParam) {
      return {
        ok: false,
        inputType: 'maps-url',
        embedUrl: '',
        mapLink: parsedUrl.toString(),
        queryDisplay: '',
        zoom: effectiveZoom,
        summary: 'Missing place or coordinates in Google Maps link',
        error: 'This Google Maps URL does not contain a specific place or coordinates. Open a pin in Google Maps first and copy its link.',
      };
    }

    const embedUrl = cidParam && !embedTarget
      ? `https://maps.google.com/maps?cid=${encodeURIComponent(cidParam)}&output=embed`
      : buildMapsEmbedUrl(embedTarget, effectiveZoom);

    // Keep clean full Google Maps URL (especially if /place/ has business details), capped safely
    const safeDirectUrl = parsedUrl.toString().length <= 450 ? parsedUrl.toString() : '';
    const mapLink = safeDirectUrl || buildMapsLinkUrl(embedTarget || `cid:${cidParam}`);
    const queryDisplay =
      placeName && coordStr
        ? `${placeName} (${coordStr})`
        : placeName || cleanedParamQuery || coordStr || `CID ${cidParam}`;

    return {
      ok: true,
      inputType: 'maps-url',
      embedUrl,
      mapLink,
      queryDisplay,
      coordinates: finalCoords,
      zoom: effectiveZoom,
      summary: placeName
        ? `Mapped "${placeName}"${coordStr ? ` @ ${coordStr}` : ''}`
        : `Mapped location from Google Maps URL (${queryDisplay})`,
    };
  }

  // 5. Reject unsafe protocols like javascript:, data:, file:
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
    return {
      ok: false,
      inputType: 'maps-url',
      embedUrl: '',
      mapLink: '',
      queryDisplay: '',
      zoom,
      summary: 'Unsupported URL scheme',
      error: 'Only valid https:// Google Maps URLs, iframe codes, coordinates, or text addresses are allowed.',
    };
  }

  // 6. Plain address or place search string
  if (trimmed.length < 2) {
    return {
      ok: false,
      inputType: 'search-query',
      embedUrl: '',
      mapLink: '',
      queryDisplay: '',
      zoom,
      summary: 'Search query too short',
      error: 'Please enter at least 2 characters for an address or place name.',
    };
  }

  return {
    ok: true,
    inputType: 'search-query',
    embedUrl: buildMapsEmbedUrl(trimmed, zoom),
    mapLink: buildMapsLinkUrl(trimmed),
    queryDisplay: trimmed,
    zoom,
    summary: `Mapped place / address: "${trimmed}"`,
  };
};

export const sanitizeMapEmbedUrl = (url: string | undefined, fallback: string): string => {
  if (!url || typeof url !== 'string' || !url.trim()) return fallback;
  const trimmed = url.trim();

  // Handle legacy or raw <iframe> pasted directly into field
  if (/<iframe\b/i.test(trimmed) || !isSafeHttpUrl(trimmed)) {
    const parsed = parseSmartMapInput(trimmed);
    return parsed.ok && parsed.embedUrl ? parsed.embedUrl : fallback;
  }

  try {
    const parsedUrl = new URL(trimmed);
    if (!isAllowedMapEmbedHost(parsedUrl.hostname)) {
      return fallback;
    }
    if (isDirectEmbedUrl(parsedUrl)) {
      return parsedUrl.toString();
    }
    // Automatically convert non-embed Google Maps URLs (e.g. /maps/place/...) into embed URLs
    const converted = parseSmartMapInput(trimmed);
    return converted.ok && converted.embedUrl ? converted.embedUrl : fallback;
  } catch {
    return fallback;
  }
};

export const sanitizeMapLinkUrl = (url: string | undefined, fallback: string): string => {
  if (!url || typeof url !== 'string' || !url.trim()) return fallback;
  const trimmed = url.trim();
  if (!isSafeHttpUrl(trimmed)) return fallback;
  try {
    const parsed = new URL(trimmed);
    if (isAllowedMapEmbedHost(parsed.hostname) || isAllowedGoogleShortHost(parsed.hostname)) {
      return parsed.toString();
    }
  } catch {}
  return fallback;
};
