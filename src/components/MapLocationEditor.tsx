'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Crosshair,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Code2,
  ZoomIn,
  Building2,
  Save,
} from 'lucide-react';
import { SiteContent } from '@/lib/types';
import { INITIAL_SITE_CONTENT } from '@/lib/cms-store';
import {
  parseSmartMapInput,
  sanitizeMapEmbedUrl,
  sanitizeMapLinkUrl,
  supportsAdjustableZoom,
  getZoomFromEmbedUrl,
  updateEmbedUrlZoom,
  buildMapsEmbedUrl,
  buildMapsLinkUrl,
  isGoogleMapsShortUrl,
  isAllowedMapEmbedHost,
  extractEmbeddedGoogleMapsUrl,
} from '@/lib/map-utils';

interface MapLocationEditorProps {
  siteContent: SiteContent;
  onChange: React.Dispatch<React.SetStateAction<SiteContent>>;
  onPublish?: (updatedContent: SiteContent) => void;
  variant?: 'section' | 'settings';
}

const ZOOM_PRESETS = [
  { zoom: 14, label: '14× Area' },
  { zoom: 15, label: '15× District' },
  { zoom: 16, label: '16× Street' },
  { zoom: 17, label: '17× Building' },
  { zoom: 18, label: '18× Exact Pin' },
];

export const MapLocationEditor: React.FC<MapLocationEditorProps> = ({
  siteContent,
  onChange,
  onPublish,
  variant = 'section',
}) => {
  const [draftInput, setDraftInput] = useState<string | null>(null);
  const [hasUnpublishedEdits, setHasUnpublishedEdits] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const fallbackEmbed =
    INITIAL_SITE_CONTENT.contactMapEmbedUrl ||
    buildMapsEmbedUrl('Gurunanak Market, Vaishali Nagar, Bhilai, Chhattisgarh', 16);
  const fallbackLink =
    INITIAL_SITE_CONTENT.contactMapLink ||
    buildMapsLinkUrl('Gurunanak Market, Vaishali Nagar, Bhilai, Chhattisgarh');

  const activeEmbedUrl = sanitizeMapEmbedUrl(siteContent.contactMapEmbedUrl, fallbackEmbed);
  const activeMapLink = sanitizeMapLinkUrl(siteContent.contactMapLink, fallbackLink);
  const activeZoom = getZoomFromEmbedUrl(activeEmbedUrl);
  const canAdjustZoom = supportsAdjustableZoom(activeEmbedUrl);
  const mapLabel = siteContent.contactMapLabel ?? 'BHILAI CAMPUS';
  const inputValue = draftInput ?? (siteContent.contactMapQuery || siteContent.contactAddress || '');

  const applyLocationInput = async (raw: string, preferredZoom?: number): Promise<SiteContent | null> => {
    const trimmed = raw.trim();
    if (!trimmed) {
      setStatusMessage({
        type: 'error',
        text: 'Please type a place/address, paste a Google Maps URL or <iframe> embed, or enter coordinates.',
      });
      return null;
    }

    const zoomToUse = preferredZoom ?? activeZoom;
    const parsed = parseSmartMapInput(trimmed, {
      zoom: zoomToUse,
      fallbackLabel: mapLabel || 'Campus Location',
    });

    if (parsed.requiresShortUrlResolution || isGoogleMapsShortUrl(trimmed)) {
      const cleanShortUrl = parsed.mapLink || extractEmbeddedGoogleMapsUrl(trimmed) || trimmed;
      setIsResolving(true);
      setStatusMessage({
        type: 'info',
        text: 'Resolving short Google Maps link (maps.app.goo.gl)...',
      });

      try {
        const res = await fetch('/api/resolve-map-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: cleanShortUrl }),
        });
        const data = await res.json();
        if (!res.ok || !data?.resolvedUrl) {
          setStatusMessage({
            type: 'error',
            text:
              data?.error ||
              'Could not expand short link automatically. Open it in a browser and paste the full google.com/maps URL.',
          });
          return null;
        }

        const resolvedParsed = parseSmartMapInput(data.resolvedUrl, {
          zoom: zoomToUse,
          fallbackLabel: mapLabel || 'Campus Location',
        });

        if (!resolvedParsed.ok || !resolvedParsed.embedUrl) {
          setStatusMessage({
            type: 'error',
            text:
              resolvedParsed.error ||
              'Expanded shortlink did not include map coordinates or place details.',
          });
          return null;
        }

        const nextContent: SiteContent = {
          ...siteContent,
          contactMapQuery: resolvedParsed.queryDisplay || data.resolvedUrl,
          contactMapEmbedUrl: resolvedParsed.embedUrl,
          contactMapLink: resolvedParsed.mapLink,
        };
        onChange((prev) => ({
          ...prev,
          contactMapQuery: nextContent.contactMapQuery,
          contactMapEmbedUrl: nextContent.contactMapEmbedUrl,
          contactMapLink: nextContent.contactMapLink,
        }));
        setDraftInput(null);
        setHasUnpublishedEdits(true);
        setStatusMessage({
          type: 'success',
          text: `${resolvedParsed.summary} — Live preview updated. Publish to save changes live.`,
        });
        return nextContent;
      } catch {
        setStatusMessage({
          type: 'error',
          text: 'Network error while expanding short link. Please paste the full Google Maps URL.',
        });
        return null;
      } finally {
        setIsResolving(false);
      }
    }

    if (!parsed.ok || !parsed.embedUrl) {
      setStatusMessage({
        type: 'error',
        text: parsed.error || 'Could not interpret that location input.',
      });
      return null;
    }

    const nextContent: SiteContent = {
      ...siteContent,
      contactMapQuery: parsed.queryDisplay,
      contactMapEmbedUrl: parsed.embedUrl,
      contactMapLink: parsed.mapLink,
    };
    onChange((prev) => ({
      ...prev,
      contactMapQuery: nextContent.contactMapQuery,
      contactMapEmbedUrl: nextContent.contactMapEmbedUrl,
      contactMapLink: nextContent.contactMapLink,
    }));
    setDraftInput(null);
    setHasUnpublishedEdits(true);
    setStatusMessage({
      type: 'success',
      text: `${parsed.summary} — Live preview updated. Publish to save changes live.`,
    });
    return nextContent;
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text');
    if (!pasted) return;
    const trimmed = pasted.trim();
    const looksStructured =
      /<iframe\b/i.test(trimmed) ||
      /^https?:\/\//i.test(trimmed) ||
      Boolean(extractEmbeddedGoogleMapsUrl(trimmed)) ||
      /^(?:maps\.app\.goo\.gl|goo\.gl\/maps|maps\.google\.|www\.google\.)/i.test(trimmed) ||
      /^[+-]?\d{1,2}(?:\.\d+)?\s*,\s*[+-]?\d{1,3}(?:\.\d+)?$/.test(trimmed);

    if (looksStructured) {
      e.preventDefault();
      setDraftInput(trimmed);
      void applyLocationInput(trimmed);
    }
  };

  const handleUseCampusAddress = () => {
    const addr = (siteContent.contactAddress || '').trim();
    if (!addr) {
      setStatusMessage({
        type: 'error',
        text: 'Campus Physical Address is empty. Enter an address first.',
      });
      return;
    }
    setDraftInput(addr);
    void applyLocationInput(addr);
  };

  const handleUseCurrentGps = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setStatusMessage({
        type: 'error',
        text: 'Geolocation is not supported in this browser.',
      });
      return;
    }

    setIsLocatingGps(true);
    setStatusMessage({
      type: 'info',
      text: 'Requesting GPS coordinates from your browser...',
    });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocatingGps(false);
        const coords = `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`;
        setDraftInput(coords);
        void applyLocationInput(coords, 17);
      },
      (err) => {
        setIsLocatingGps(false);
        const reason =
          err.code === err.PERMISSION_DENIED
            ? 'Location permission denied. Allow browser location access or paste coordinates manually.'
            : 'Unable to detect GPS coordinates right now. Try entering an address or Google Maps link.';
        setStatusMessage({ type: 'error', text: reason });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleResetDefault = () => {
    onChange((prev) => ({
      ...prev,
      contactMapQuery: INITIAL_SITE_CONTENT.contactMapQuery,
      contactMapLabel: INITIAL_SITE_CONTENT.contactMapLabel || 'BHILAI CAMPUS',
      contactMapEmbedUrl: INITIAL_SITE_CONTENT.contactMapEmbedUrl,
      contactMapLink: INITIAL_SITE_CONTENT.contactMapLink,
    }));
    setDraftInput(null);
    setHasUnpublishedEdits(true);
    setStatusMessage({
      type: 'info',
      text: 'Restored default Gurunanak Market, Bhilai campus location. Publish to save changes live.',
    });
  };

  const handleZoomChange = (newZoom: number) => {
    if (!canAdjustZoom) return;
    const zoomedEmbed = updateEmbedUrlZoom(activeEmbedUrl, newZoom);
    onChange((prev) => ({
      ...prev,
      contactMapEmbedUrl: zoomedEmbed,
    }));
    setHasUnpublishedEdits(true);
    setStatusMessage({
      type: 'success',
      text: `Updated preview zoom to ${newZoom}×. Publish to save changes live.`,
    });
  };

  const handlePublishNow = async () => {
    if (!onPublish) return;
    let contentToPublish = siteContent;
    if (draftInput !== null && draftInput.trim() !== '' && draftInput.trim() !== (siteContent.contactMapQuery || '').trim()) {
      const applied = await applyLocationInput(draftInput);
      if (!applied) return;
      contentToPublish = applied;
    }
    onPublish(contentToPublish);
    setHasUnpublishedEdits(false);
    setStatusMessage({
      type: 'success',
      text: '✓ Google Map location saved & synced to Firebase Cloud Firestore!',
    });
  };

  const rawEmbedLooksNonEmbed = (() => {
    const raw = (siteContent.contactMapEmbedUrl || '').trim();
    if (!raw) return false;
    try {
      const u = new URL(raw);
      return (
        isAllowedMapEmbedHost(u.hostname) &&
        !u.pathname.toLowerCase().startsWith('/maps/embed') &&
        !u.pathname.toLowerCase().startsWith('/maps/d/embed') &&
        u.searchParams.get('output') !== 'embed'
      );
    } catch {
      return /<iframe\b/i.test(raw);
    }
  })();

  const wrapperClass =
    variant === 'settings'
      ? 'p-5 rounded-2xl bg-black/40 border border-white/15 space-y-5'
      : 'p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6';

  return (
    <div className={wrapperClass} data-testid={`map-location-editor-${variant}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-[#F20D63]/15 text-[#F20D63] border border-[#F20D63]/30 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white flex items-center gap-2 flex-wrap">
              <span>Google Map Pin &amp; Directions</span>
              <span
                className={`px-2 py-0.5 rounded-full border text-[10px] font-mono font-bold ${
                  hasUnpublishedEdits
                    ? 'bg-amber-500/15 border-amber-500/35 text-amber-300'
                    : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                }`}
              >
                {hasUnpublishedEdits ? 'UNSAVED PREVIEW' : 'LIVE READY'}
              </span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Search an address, enter <span className="text-neutral-200 font-mono">lat, lng</span>, paste a Google Maps URL (<span className="text-neutral-200 font-mono">maps.app.goo.gl</span> / full link), or paste an <span className="text-neutral-200 font-mono">&lt;iframe&gt;</span> code.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center shrink-0">
          {onPublish && (
            <button
              type="button"
              disabled={isResolving || isLocatingGps}
              onClick={() => void handlePublishNow()}
              className={`px-3.5 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 ${
                hasUnpublishedEdits
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/25'
                  : 'bg-[#F20D63] hover:bg-white hover:text-black text-white'
              }`}
              title="Save and publish this Google Map location immediately to Firebase Cloud Firestore"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{hasUnpublishedEdits ? 'Publish Map Changes' : 'Publish Map'}</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleResetDefault}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-[11px] font-mono font-bold uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Restore default Bhilai campus map"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>
        </div>
      </div>

      {/* Main Responsive Grid: Controls + Live Interactive Map Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Controls */}
        <div className="lg:col-span-7 space-y-4">
          {/* Smart Location Input */}
          <div>
            <label className="block text-[11px] font-mono font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
              Smart Location Search / Paste Maps Link or Embed Code
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setDraftInput(e.target.value);
                    setHasUnpublishedEdits(true);
                    if (statusMessage?.type === 'error') setStatusMessage(null);
                  }}
                  onPaste={handlePaste}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      void applyLocationInput(inputValue);
                    }
                  }}
                  placeholder="Paste Google Maps link, <iframe>, 21.216391, 81.332308, or place address..."
                  aria-label="Smart Google Map Location Input"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black border border-white/20 focus:border-[#F20D63] focus:outline-none text-white text-xs font-medium"
                />
              </div>
              <button
                type="button"
                disabled={isResolving}
                onClick={() => void applyLocationInput(inputValue)}
                className="px-4 py-2.5 rounded-xl bg-[#F20D63] hover:bg-white hover:text-black text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-60 shrink-0"
              >
                {isResolving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Resolving...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Apply to Map</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Helper Action Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleUseCampusAddress}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-neutral-200 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-[#1749C6]" />
              <span>Use Campus Address</span>
            </button>

            <button
              type="button"
              onClick={handleUseCurrentGps}
              disabled={isLocatingGps}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-neutral-200 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLocatingGps ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FFB800]" />
              ) : (
                <Crosshair className="w-3.5 h-3.5 text-[#FFB800]" />
              )}
              <span>{isLocatingGps ? 'Detecting GPS...' : 'Use Current GPS'}</span>
            </button>

            <a
              href={activeMapLink}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-neutral-200 text-[11px] font-bold flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span>Test Open in Maps</span>
            </a>
          </div>

          {/* Feedback Banner */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl border text-xs font-medium flex items-start gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : statusMessage.type === 'error'
                  ? 'bg-red-500/10 border-red-500/30 text-red-300'
                  : 'bg-[#1749C6]/15 border-[#1749C6]/40 text-blue-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              ) : statusMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              ) : (
                <Loader2 className={`w-4 h-4 shrink-0 mt-0.5 ${isResolving || isLocatingGps ? 'animate-spin' : ''}`} />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Badge Label & Zoom Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase mb-1">
                Map Card Badge Label
              </label>
              <input
                type="text"
                value={mapLabel}
                onChange={(e) => {
                  onChange((prev) => ({ ...prev, contactMapLabel: e.target.value }));
                  setHasUnpublishedEdits(true);
                }}
                placeholder="BHILAI CAMPUS"
                aria-label="Map Card Badge Label"
                className="w-full px-3.5 py-2 rounded-xl bg-black border border-white/20 focus:border-[#1749C6] focus:outline-none text-white text-xs font-bold uppercase"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase mb-1 flex items-center gap-1.5">
                <ZoomIn className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>Map Zoom Level</span>
              </label>
              {canAdjustZoom ? (
                <div className="flex items-center gap-1 flex-wrap">
                  {ZOOM_PRESETS.map((preset) => (
                    <button
                      key={preset.zoom}
                      type="button"
                      onClick={() => handleZoomChange(preset.zoom)}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer border ${
                        activeZoom === preset.zoom
                          ? 'bg-[#1749C6] border-[#1749C6] text-white'
                          : 'bg-black border-white/15 text-neutral-400 hover:text-white hover:border-white/30'
                      }`}
                    >
                      {preset.zoom}×
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-neutral-400 bg-black/60 border border-white/10 rounded-xl px-3 py-2">
                  Custom embed zoom active — search/apply a place or coordinates to adjust zoom.
                </p>
              )}
            </div>
          </div>

          {/* Collapsible Advanced Raw URLs */}
          <div className="border-t border-white/10 pt-3">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5 text-[#1749C6]" />
              <span>Advanced: Raw Embed &amp; Directions URLs</span>
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showAdvanced && (
              <div className="mt-3 space-y-3 p-4 rounded-2xl bg-black/70 border border-white/10 text-xs">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <label className="text-[11px] font-mono font-bold text-neutral-300 uppercase">
                      Google Maps Embed URL (contactMapEmbedUrl)
                    </label>
                    {rawEmbedLooksNonEmbed && (
                      <button
                        type="button"
                        onClick={() => void applyLocationInput(siteContent.contactMapEmbedUrl || '')}
                        className="px-2 py-0.5 rounded bg-[#F20D63] text-white text-[10px] font-bold uppercase cursor-pointer"
                      >
                        Convert to Embed URL
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={siteContent.contactMapEmbedUrl || ''}
                    onChange={(e) => {
                      onChange((prev) => ({ ...prev, contactMapEmbedUrl: e.target.value }));
                      setHasUnpublishedEdits(true);
                    }}
                    placeholder="https://maps.google.com/maps?q=...&output=embed"
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0B0D] border border-white/20 text-neutral-200 font-mono text-[11px]"
                  />
                  {rawEmbedLooksNonEmbed && (
                    <p className="text-[11px] text-amber-400 mt-1">
                      This looks like a regular Google Maps page URL rather than an embed URL — click &quot;Convert to Embed URL&quot; or it will be auto-converted safely.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-neutral-300 uppercase mb-1">
                    External &quot;MAPS ↗&quot; Directions Link (contactMapLink)
                  </label>
                  <input
                    type="url"
                    value={siteContent.contactMapLink || ''}
                    onChange={(e) => {
                      onChange((prev) => ({ ...prev, contactMapLink: e.target.value }));
                      setHasUnpublishedEdits(true);
                    }}
                    placeholder="https://www.google.com/maps/search/?api=1&query=..."
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0B0D] border border-white/20 text-neutral-200 font-mono text-[11px]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Live Map Preview Matching Public Contact Card */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 px-1">
            <span className="uppercase font-bold text-neutral-300">Live Public Map Preview</span>
            <span className="text-emerald-400 truncate max-w-[180px]" title={activeEmbedUrl}>
              ● {siteContent.contactMapQuery || 'Active Pin'}
            </span>
          </div>

          <div className="relative h-[300px] sm:h-[320px] rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-neutral-900">
            <iframe
              key={activeEmbedUrl}
              title="Admin Google Map Location Preview"
              src={activeEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-neutral-200 shadow-lg flex items-center justify-between text-[11px]">
              <span className="font-bold text-[#0B0B0D] uppercase truncate pr-2">
                {mapLabel.trim() || 'BHILAI CAMPUS'}
              </span>
              <a
                href={activeMapLink}
                target="_blank"
                rel="noreferrer"
                className="text-[#F20D63] font-mono hover:underline font-black shrink-0"
              >
                MAPS ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
