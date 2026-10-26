import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Printer, QrCode, Check, ShieldCheck, ExternalLink, Copy, Globe, UtensilsCrossed } from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { SectionLabel } from '@/components/section-label';

export function QRPage() {
  const [tableNumber, setTableNumber] = useState('1');
  const [stationType, setStationType] = useState<'table' | 'banda'>('table');
  const [targetDestination, setTargetDestination] = useState<'order' | 'menu'>('order');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const VERCEL_PRODUCTION_URL = 'https://hacienda-nine.vercel.app';
  const PUBLIC_PREVIEW_URL = 'https://ais-pre-3fnonwn7je3erecw633mdg-620457192074.europe-west2.run.app';

  // Compute public base origin:
  // Defaults to production Vercel domain https://hacienda-nine.vercel.app so mobile cameras scan with zero login friction.
  const computeDefaultBase = () => {
    if (typeof window === 'undefined') return VERCEL_PRODUCTION_URL;
    const origin = window.location.origin;
    if (origin.includes('vercel.app')) {
      return origin;
    }
    return VERCEL_PRODUCTION_URL;
  };

  const [baseUrl, setBaseUrl] = useState(computeDefaultBase);
  const [customHost, setCustomHost] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<'vercel' | 'preview' | 'custom'>('vercel');

  // Sync selected preset
  const handlePresetChange = (preset: 'vercel' | 'preview' | 'custom') => {
    setSelectedPreset(preset);
    if (preset === 'vercel') {
      setBaseUrl(VERCEL_PRODUCTION_URL);
    } else if (preset === 'preview') {
      setBaseUrl(PUBLIC_PREVIEW_URL);
    } else if (preset === 'custom') {
      setBaseUrl(customHost || 'https://hacienda.ke');
    }
  };

  const activeStationLabel = stationType === 'table' ? `Table ${tableNumber}` : `Banda ${tableNumber}`;
  const queryParam = stationType === 'table' ? tableNumber : `Banda-${tableNumber}`;
  const pathSegment = targetDestination === 'order' ? 'order' : 'menu';
  const targetUrl = `${baseUrl.replace(/\/$/, '')}/${pathSegment}?table=${encodeURIComponent(queryParam)}`;

  useEffect(() => {
    QRCode.toDataURL(targetUrl, {
      width: 760,
      margin: 2,
      color: {
        dark: '#0D0B09',
        light: '#F3E9D2',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR generation error:', err));
  }, [targetUrl]);

  const downloadPNG = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `hacienda-${stationType}-${tableNumber}-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isPublicPreview = baseUrl.includes('ais-pre-');
  const isPrivateDev = baseUrl.includes('ais-dev-');

  return (
    <div className="pt-[74px]">
      <section className="no-print border-b border-[#C9A24B]/20 bg-[#120B08] py-14 sm:py-20">
        <div className="container-hacienda">
          <SectionLabel number="QR">Digital Table Tent System</SectionLabel>
          <h1 className="font-playfair mt-3 text-3xl sm:text-4xl md:text-5xl text-[#F3E9D2]">
            Table Tent & Banda QR Codes
          </h1>
          <p className="mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed text-[#F3E9D2]/65">
            Generate high-resolution printable table tents for tables 1 through 30 and private bandas.
            Each code is linked to our public digital ordering station so guests can scan with any phone
            camera to order and pay via M-Pesa immediately without authentication errors.
          </p>

          {/* Access status alert */}
          <div className="mt-6 flex flex-wrap items-center gap-3 border border-[#C9A24B]/35 bg-[#1F1510] p-4 text-xs">
            <ShieldCheck className="h-5 w-5 shrink-0 text-[#C9A24B]" />
            <div className="flex-1">
              <span className="font-semibold text-[#F3E9D2]">Public Guest Access Verified: </span>
              <span className="text-[#F3E9D2]/70">
                {isPublicPreview ? (
                  <>Codes are encoded with the public preview endpoint (<code>ais-pre-...</code>), allowing direct mobile scanning without requiring Google login.</>
                ) : isPrivateDev ? (
                  <span className="text-[#D9822B]">Notice: Switch to Public Preview or Vercel Domain below so mobile phone cameras do not hit private Google Cloud login.</span>
                ) : (
                  <>Encoded for production domain: <code>{baseUrl}</code></>
                )}
              </span>
            </div>
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-[#C9A24B]/40 bg-[#C9A24B]/10 px-3 py-1.5 font-mono text-[11px] text-[#C9A24B] hover:bg-[#C9A24B]/20"
            >
              Test Scan URL <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </section>

      <section className="section-pad bg-[#0E0B09]">
        <div className="container-hacienda">
          <div className="grid gap-12 lg:grid-cols-[1fr_420px]">
            {/* Left: The Printable A5 Tent Mockup */}
            <div className="print-sheet mx-auto w-full max-w-md border border-[#C9A24B]/35 bg-[#F3E9D2] p-8 sm:p-12 text-[#0D0B09] shadow-2xl">
              <div className="flex flex-col items-center text-center">
                {/* Brand Seal */}
                <div className="flex h-12 w-12 items-center justify-center border-2 border-[#0D0B09] bg-transparent">
                  <span className="font-cinzel text-base font-bold text-[#0D0B09]">
                    H
                  </span>
                </div>

                <span className="font-cinzel mt-4 text-xl font-bold tracking-[0.24em] text-[#0D0B09]">
                  HACIENDA
                </span>
                <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#4A2E1F]/80">
                  Sports Bar & Grill · Nairobi
                </span>

                <div className="my-6 h-px w-24 bg-[#C9A24B]" />

                {/* Scannable QR Code */}
                <div className="p-3 border border-[#0D0B09]/20 bg-[#F3E9D2]">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt={`QR code for ${activeStationLabel} at Hacienda`}
                      className="h-56 w-56 sm:h-64 sm:w-64 object-contain"
                    />
                  ) : (
                    <div className="flex h-56 w-56 sm:h-64 sm:w-64 items-center justify-center text-xs">
                      Rendering QR…
                    </div>
                  )}
                </div>

                {/* Scan Headline & Station Callout */}
                <h2 className="font-playfair mt-6 text-3xl font-semibold text-[#0D0B09]">
                  Scan to Order
                </h2>
                <div className="mt-2 border-y border-[#0D0B09]/30 py-1.5 px-6">
                  <span className="font-cinzel text-sm font-bold tracking-[0.2em] text-[#4A2E1F]">
                    {activeStationLabel.toUpperCase()}
                  </span>
                </div>

                <p className="mt-4 text-[11px] leading-relaxed text-[#4A2E1F]/80">
                  Browse live charcoal cuts & craft cocktails directly on your phone.
                </p>

                {/* Payment trust notice on tent */}
                <div className="mt-3 flex items-center justify-center gap-2 text-[9px] font-semibold text-[#4A2E1F]/80">
                  <span className="rounded bg-[#0D0B09]/10 px-2 py-0.5">Lipa Na M-Pesa (174379)</span>
                  <span className="rounded bg-[#0D0B09]/10 px-2 py-0.5">Card</span>
                  <span className="rounded bg-[#0D0B09]/10 px-2 py-0.5">Cash</span>
                </div>

                <div className="mt-6 text-[8px] uppercase tracking-[0.2em] text-[#4A2E1F]/60">
                  Ngara Road, Nairobi · Open 24 Hours
                </div>
              </div>
            </div>

            {/* Right: Controls & Host Selector */}
            <div className="no-print h-fit border border-[#C9A24B]/30 bg-[#140E0A] p-6 sm:p-8">
              <span className="eyebrow">Generator Controls</span>
              <h2 className="font-playfair mt-1 text-2xl text-[#F3E9D2]">
                Configure Station
              </h2>

              <div className="mt-6 space-y-5">
                {/* 1. Host Domain Selector */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                    QR Destination Host Domain
                  </label>
                  <p className="mt-0.5 text-[10px] text-[#F3E9D2]/50">
                    Determines what URL is encoded in the QR code for mobile scanners.
                  </p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handlePresetChange('vercel')}
                      className={`min-h-[44px] border px-2 text-[10px] font-bold uppercase tracking-wider transition ${
                        selectedPreset === 'vercel'
                          ? 'border-[#C9A24B] bg-[#C9A24B] text-[#0D0B09]'
                          : 'border-[#C9A24B]/20 bg-[#0D0B09]/60 text-[#F3E9D2]/70 hover:border-[#C9A24B]/40'
                      }`}
                    >
                      Vercel Live
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePresetChange('preview')}
                      className={`min-h-[44px] border px-2 text-[10px] font-bold uppercase tracking-wider transition ${
                        selectedPreset === 'preview'
                          ? 'border-[#C9A24B] bg-[#C9A24B] text-[#0D0B09]'
                          : 'border-[#C9A24B]/20 bg-[#0D0B09]/60 text-[#F3E9D2]/70 hover:border-[#C9A24B]/40'
                      }`}
                    >
                      Preview Link
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePresetChange('custom')}
                      className={`min-h-[44px] border px-2 text-[10px] font-bold uppercase tracking-wider transition ${
                        selectedPreset === 'custom'
                          ? 'border-[#C9A24B] bg-[#C9A24B] text-[#0D0B09]'
                          : 'border-[#C9A24B]/20 bg-[#0D0B09]/60 text-[#F3E9D2]/70 hover:border-[#C9A24B]/40'
                      }`}
                    >
                      Custom URL
                    </button>
                  </div>

                  {selectedPreset === 'custom' && (
                    <input
                      type="url"
                      value={customHost}
                      onChange={(e) => {
                        setCustomHost(e.target.value);
                        setBaseUrl(e.target.value);
                      }}
                      placeholder="https://yourdomain.com"
                      className="input-hacienda mt-2 text-xs"
                    />
                  )}
                </div>

                {/* 2. Station Type & Destination */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                      Station Type
                    </label>
                    <div className="mt-1.5 flex gap-1 border border-[#C9A24B]/20 bg-[#0D0B09] p-1">
                      <button
                        type="button"
                        onClick={() => setStationType('table')}
                        className={`flex-1 py-1.5 text-center text-[10px] font-bold uppercase tracking-wider ${
                          stationType === 'table' ? 'bg-[#C9A24B] text-[#0D0B09]' : 'text-[#F3E9D2]/60'
                        }`}
                      >
                        Table
                      </button>
                      <button
                        type="button"
                        onClick={() => setStationType('banda')}
                        className={`flex-1 py-1.5 text-center text-[10px] font-bold uppercase tracking-wider ${
                          stationType === 'banda' ? 'bg-[#C9A24B] text-[#0D0B09]' : 'text-[#F3E9D2]/60'
                        }`}
                      >
                        Banda
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                      Landing Page
                    </label>
                    <div className="mt-1.5 flex gap-1 border border-[#C9A24B]/20 bg-[#0D0B09] p-1">
                      <button
                        type="button"
                        onClick={() => setTargetDestination('order')}
                        className={`flex-1 py-1.5 text-center text-[10px] font-bold uppercase tracking-wider ${
                          targetDestination === 'order' ? 'bg-[#C9A24B] text-[#0D0B09]' : 'text-[#F3E9D2]/60'
                        }`}
                      >
                        Order Station
                      </button>
                      <button
                        type="button"
                        onClick={() => setTargetDestination('menu')}
                        className={`flex-1 py-1.5 text-center text-[10px] font-bold uppercase tracking-wider ${
                          targetDestination === 'menu' ? 'bg-[#C9A24B] text-[#0D0B09]' : 'text-[#F3E9D2]/60'
                        }`}
                      >
                        Menu Browse
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Station Number Input */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                    {stationType === 'table' ? 'Table Number (1 - 30)' : 'Banda Number (1 - 5)'}
                  </label>
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      max={stationType === 'table' ? 30 : 5}
                      value={tableNumber}
                      onChange={(e) => {
                        const maxVal = stationType === 'table' ? 30 : 5;
                        const val = Math.max(1, Math.min(maxVal, parseInt(e.target.value) || 1));
                        setTableNumber(String(val));
                      }}
                      className="input-hacienda w-28 text-center font-mono text-base font-bold"
                    />
                    <span className="text-xs text-[#F3E9D2]/70">
                      Generating: <strong className="text-[#C9A24B]">{activeStationLabel}</strong>
                    </span>
                  </div>

                  {/* Quick Pick Buttons */}
                  <div className="mt-3">
                    <span className="text-[10px] uppercase tracking-wider text-[#F3E9D2]/45">
                      Quick Pick:
                    </span>
                    <div className="mt-1.5 flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                      {Array.from(
                        { length: stationType === 'table' ? 30 : 5 },
                        (_, i) => String(i + 1)
                      ).map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setTableNumber(num)}
                          className={`h-8 w-8 text-xs font-mono transition ${
                            tableNumber === num
                              ? 'bg-[#C9A24B] text-[#0D0B09] font-bold'
                              : 'border border-[#C9A24B]/20 bg-[#0D0B09] text-[#F3E9D2]/70 hover:border-[#C9A24B]/50'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. Target URL Display with Copy and Test */}
                <div className="border-t border-[#C9A24B]/20 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-[#F3E9D2]/50">
                      Scannable URL:
                    </span>
                    <button
                      type="button"
                      onClick={copyUrl}
                      className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#C9A24B] hover:underline"
                    >
                      {copied ? (
                        <>
                          <Check size={11} /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={11} /> Copy Link
                        </>
                      )}
                    </button>
                  </div>
                  <p className="mt-1 break-all rounded border border-[#C9A24B]/20 bg-[#0D0B09] p-2.5 font-mono text-[10px] text-[#C9A24B]">
                    {targetUrl}
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={downloadPNG}
                    className="button-gold w-full text-xs"
                  >
                    {downloadSuccess ? (
                      <span className="inline-flex items-center gap-2">
                        <Check size={14} /> Downloaded PNG
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <Download size={14} /> Download High-Res PNG
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="button-quiet w-full text-xs"
                  >
                    <Printer size={14} className="mr-2" /> Print / Save A5 PDF
                  </button>
                </div>

                <p className="text-[10px] leading-relaxed text-[#F3E9D2]/40">
                  Tip: Print directly onto A5 cardstock or matte photo paper for the brass tabletop tent stands.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
