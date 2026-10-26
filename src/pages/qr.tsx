import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Printer, QrCode, Check } from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { SectionLabel } from '@/components/section-label';

export function QRPage() {
  const [tableNumber, setTableNumber] = useState('1');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const currentOrigin =
    typeof window !== 'undefined' ? window.location.origin : 'https://hacienda.ke';

  const targetUrl = `${currentOrigin}/order?table=${tableNumber}`;

  useEffect(() => {
    QRCode.toDataURL(targetUrl, {
      width: 720,
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
    a.download = `hacienda-table-${tableNumber}-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pt-[74px]">
      <section className="no-print border-b border-[#C9A24B]/20 bg-[#120B08] py-14 sm:py-20">
        <div className="container-hacienda">
          <SectionLabel number="QR">Digital Table Tent System</SectionLabel>
          <h1 className="font-playfair mt-3 text-3xl sm:text-4xl md:text-5xl text-[#F3E9D2]">
            Table Tent & Banda QR Codes
          </h1>
          <p className="mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed text-[#F3E9D2]/65">
            Generate high-resolution printable table tents for tables 1 through 30.
            When a guest scans with their smartphone camera, their table number is
            automatically locked in their cart for seamless kitchen routing.
          </p>
        </div>
      </section>

      <section className="section-pad bg-[#0E0B09]">
        <div className="container-hacienda">
          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
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
                      alt={`QR code for Table ${tableNumber} at Hacienda`}
                      className="h-56 w-56 sm:h-64 sm:w-64 object-contain"
                    />
                  ) : (
                    <div className="flex h-56 w-56 sm:h-64 sm:w-64 items-center justify-center text-xs">
                      Rendering QR…
                    </div>
                  )}
                </div>

                {/* Scan Headline & Table Callout */}
                <h2 className="font-playfair mt-6 text-3xl font-semibold text-[#0D0B09]">
                  Scan to Order
                </h2>
                <div className="mt-2 border-y border-[#0D0B09]/30 py-1.5 px-6">
                  <span className="font-cinzel text-sm font-bold tracking-[0.2em] text-[#4A2E1F]">
                    TABLE {tableNumber}
                  </span>
                </div>

                <p className="mt-4 text-[11px] leading-relaxed text-[#4A2E1F]/80">
                  Browse live charcoal cuts & craft cocktails directly on your phone.
                </p>

                <div className="mt-6 text-[8px] uppercase tracking-[0.2em] text-[#4A2E1F]/60">
                  Ngara Road, Nairobi · Open 24 Hours
                </div>
              </div>
            </div>

            {/* Right: Controls & Table Selector */}
            <div className="no-print h-fit border border-[#C9A24B]/30 bg-[#140E0A] p-6 sm:p-8">
              <span className="eyebrow">Generator Controls</span>
              <h2 className="font-playfair mt-1 text-2xl text-[#F3E9D2]">
                Configure Station
              </h2>

              <div className="mt-6">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                  Select Table Number (1 - 30)
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={tableNumber}
                    onChange={(e) => {
                      const val = Math.max(1, Math.min(30, parseInt(e.target.value) || 1));
                      setTableNumber(String(val));
                    }}
                    className="input-hacienda w-28 text-center font-mono text-base font-bold"
                  />
                  <span className="text-xs text-[#F3E9D2]/60">
                    Station #{tableNumber}
                  </span>
                </div>

                {/* Quick Table Selection Grid */}
                <div className="mt-4">
                  <span className="text-[10px] uppercase tracking-wider text-[#F3E9D2]/45">
                    Quick Pick Table:
                  </span>
                  <div className="mt-2 flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {Array.from({ length: 30 }, (_, i) => String(i + 1)).map((num) => (
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

                {/* Target URL Preview */}
                <div className="mt-6 border-t border-[#C9A24B]/20 pt-4">
                  <span className="text-[10px] uppercase tracking-wider text-[#F3E9D2]/50">
                    Encoded Destination URL:
                  </span>
                  <p className="mt-1 break-all font-mono text-[10px] text-[#C9A24B]">
                    {targetUrl}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-6 space-y-3">
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

                <p className="mt-5 text-[10px] leading-relaxed text-[#F3E9D2]/40">
                  Tip: Print directly onto A5 heavy cardstock or matte photo paper for the
                  hacienda brass tabletop stands.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
