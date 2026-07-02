import { useEffect, useRef, useState } from "react";
import svgPaths from "@/imports/UserProfileSuperAdmin/svg-xk5e4n6bqf";
import imgNavbarAvatar from "@/imports/Navbar/b05cd1e8675ab35e56864ebc2d270fe6b85f3041.png";
import FigmaLogo from "./GravityLogo";
import imgAlessiLogo from "@/imports/unnamed.png";
import imgMovingUpLogo from "@/imports/image__1_.png";

const settingsPaths: Record<string, string> = {
  pbe9f500:
    "M10 0a2 2 0 0 0-2 2v.6a7.9 7.9 0 0 0-2.1 1.2l-.5-.3a2 2 0 0 0-2.7.7l-.6 1a2 2 0 0 0 .7 2.7l.5.3a8 8 0 0 0 0 2.4l-.5.3a2 2 0 0 0-.7 2.7l.6 1a2 2 0 0 0 2.7.7l.5-.3A7.9 7.9 0 0 0 8 16.4V17a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-.6a7.9 7.9 0 0 0 2.1-1.2l.5.3a2 2 0 0 0 2.7-.7l.6-1a2 2 0 0 0-.7-2.7l-.5-.3a8 8 0 0 0 0-2.4l.5-.3a2 2 0 0 0 .7-2.7l-.6-1a2 2 0 0 0-2.7-.7l-.5.3A7.9 7.9 0 0 0 12 2.6V2a2 2 0 0 0-2-2zm0 6.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7z",
};

// ─── Tenant mock data ────────────────────────────────────────────────────────

type SpaceItem = {
  code: string;
  city: string;
  type: string;
  status: "available" | "booked" | "expiring";
  occupancy: number;
};

type TaskMock = {
  title: string;
  desc: string;
  time: string;
  priority?: "high" | "medium" | "low";
};

type TenantData = {
  key: string;
  name: string;
  company: string;
  email: string;
  area: string;
  user: string;
  metrics: { label: string; value: string; trend: string; trendUp: boolean }[];
  spaces: SpaceItem[];
  pending: TaskMock[];
  inProgress: TaskMock[];
};

const TENANTS: Record<string, TenantData> = {
  alessi: {
    key: "alessi",
    name: "Alessi Platform",
    company: "Alessi Media S.p.A.",
    email: "m.rossi@alessimedia.it",
    area: "Inventory & Delivery — Nord Italia",
    user: "Mario Rossi",
    metrics: [
      { label: "Spazi disponibili", value: "128", trend: "+12 vs sett.", trendUp: true },
      { label: "Permessi in scadenza", value: "9", trend: "entro 30 gg", trendUp: false },
      { label: "Campagne in delivery", value: "17", trend: "+3 oggi", trendUp: true },
      { label: "Occupazione media", value: "73,4%", trend: "+2,1%", trendUp: true },
    ],
    spaces: [
      { code: "MI-DUO-014", city: "Milano", type: "Maxi LED · P. Duomo", status: "booked", occupancy: 92 },
      { code: "TO-PNZ-031", city: "Torino", type: "DOOH 75'' · P. Crociera", status: "available", occupancy: 41 },
      { code: "BG-CEN-009", city: "Bergamo", type: "6x3 OOH · Centro", status: "expiring", occupancy: 68 },
      { code: "VR-AR-022", city: "Verona", type: "Affissione 4x3 · Arena", status: "booked", occupancy: 81 },
      { code: "BO-FIE-019", city: "Bologna", type: "Totem DOOH · Fiera", status: "available", occupancy: 55 },
    ],
    pending: [
      { title: "Permesso BG-CEN-009", desc: "Rinnovo concessione comunale", time: "scade in 8 gg", priority: "high" },
      { title: "Anomalia delivery MI-DUO-014", desc: "Player offline dalle 06:12", time: "1 ora fa", priority: "high" },
      { title: "Conflitto pianificazione", desc: "Ordine #4821 vs #4855 — Verona", time: "3 ore fa", priority: "medium" },
      { title: "Verifica fornitore", desc: "Affissioni Nord Ovest — SLA Q2", time: "ieri", priority: "medium" },
      { title: "Aggiornamento listino", desc: "DOOH Bologna Fiera Q3", time: "2 gg fa", priority: "low" },
    ],
    inProgress: [
      { title: "Pianificazione ordine #4861", desc: "BrandX — 12 spazi MI/TO", time: "20 min fa", priority: "high" },
      { title: "Upload materiali creativi", desc: "Campagna Estate · 4 esecutivi", time: "1 ora fa", priority: "medium" },
      { title: "Audit inventario DOOH", desc: "Nord Italia — 47 spazi", time: "2 ore fa", priority: "medium" },
      { title: "Report delivery settimanale", desc: "Cliente AutoMove S.p.A.", time: "ieri", priority: "low" },
      { title: "Onboarding fornitore", desc: "Affissioni Veneto Srl", time: "2 gg fa", priority: "low" },
    ],
  },
  movingup: {
    key: "movingup",
    name: "Moving Up",
    company: "Moving Up Italia Srl",
    email: "m.rossi@movingup.it",
    area: "Inventory & Delivery — Centro Sud",
    user: "Mario Rossi",
    metrics: [
      { label: "Spazi disponibili", value: "86", trend: "+4 vs sett.", trendUp: true },
      { label: "Permessi in scadenza", value: "14", trend: "entro 30 gg", trendUp: false },
      { label: "Campagne in delivery", value: "11", trend: "-1 oggi", trendUp: false },
      { label: "Occupazione media", value: "81,2%", trend: "+3,6%", trendUp: true },
    ],
    spaces: [
      { code: "RM-TER-082", city: "Roma", type: "6x3 OOH · Termini", status: "expiring", occupancy: 78 },
      { code: "NA-VOM-007", city: "Napoli", type: "Affissione 4x3 · Vomero", status: "booked", occupancy: 86 },
      { code: "BA-MUR-044", city: "Bari", type: "DOOH 65'' · Murat", status: "available", occupancy: 62 },
      { code: "CT-ETN-013", city: "Catania", type: "Maxi LED · V. Etnea", status: "booked", occupancy: 90 },
      { code: "PA-POL-028", city: "Palermo", type: "Totem DOOH · Politeama", status: "expiring", occupancy: 49 },
    ],
    pending: [
      { title: "Permesso RM-TER-082", desc: "Rinnovo concessione FS", time: "scade in 4 gg", priority: "high" },
      { title: "Anomalia delivery CT-ETN-013", desc: "Luminanza fuori soglia", time: "40 min fa", priority: "high" },
      { title: "Reclamo cliente", desc: "Esecutivo campagna ricevuto in ritardo", time: "2 ore fa", priority: "medium" },
      { title: "Verifica permessi PA", desc: "Documenti Comune Palermo", time: "ieri", priority: "medium" },
      { title: "Listino estivo Sud", desc: "Aggiornamento prezzi Q3", time: "3 gg fa", priority: "low" },
    ],
    inProgress: [
      { title: "Pianificazione ordine #5912", desc: "BeverageCo — 9 spazi RM/NA", time: "15 min fa", priority: "high" },
      { title: "Upload creativi PA-POL-028", desc: "Campagna Sicilia 2026", time: "1 ora fa", priority: "medium" },
      { title: "Audit DOOH Centro", desc: "32 spazi Lazio + Campania", time: "3 ore fa", priority: "medium" },
      { title: "Report mensile cliente", desc: "TurismoSud S.r.l.", time: "ieri", priority: "low" },
      { title: "Onboarding affissioni Bari", desc: "Nuovo fornitore locale", time: "2 gg fa", priority: "low" },
    ],
  },
};

// ─── Inline replacements for missing Figma imports ───────────────────────────

function Logo() {
  return (
    <div className="h-[33.378px] shrink-0">
      <FigmaLogo />
    </div>
  );
}

function Avatar({
  editable = false,
  src: srcProp,
  onChange,
}: {
  editable?: boolean;
  src?: string | null;
  onChange?: (src: string) => void;
}) {
  const [localSrc, setLocalSrc] = useState<string | null>(null);
  const src = srcProp !== undefined ? srcProp : localSrc;
  const inputRef = useRef<HTMLInputElement>(null);

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (onChange) onChange(url);
      else setLocalSrc(url);
    }
  };

  return (
    <div
      className={`relative rounded-full size-full overflow-hidden bg-[rgba(0,0,0,0.25)] ${editable ? "cursor-pointer group" : ""}`}
      onClick={editable ? () => inputRef.current?.click() : undefined}
    >
      {src ? (
        <img src={src} alt="Avatar" className="size-full object-cover" />
      ) : (
        <div className="flex items-center justify-center size-full">
          <svg width="50%" height="50%" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" fill="white" />
            <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="white" />
          </svg>
        </div>
      )}
      {editable && (
        <>
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-[4px]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h3l2-2h6l2 2h3v12H4z" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
              <circle cx="12" cy="13" r="3.5" stroke="white" strokeWidth="1.6" />
            </svg>
            <span className="font-['Inter',sans-serif] text-[11px] text-white font-medium">Modifica</span>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPick}
          />
        </>
      )}
    </div>
  );
}

function NavItemInline({ label, icon, active }: { label: string; icon: React.ReactNode; active?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center px-[16px] self-stretch shrink-0 relative">
      {active && <div aria-hidden="true" className="absolute border-b-2 border-[#3e00fb] inset-0 pointer-events-none" />}
      <div className="flex gap-[8px] items-center justify-center py-[12px]">
        {icon}
        <p className="font-['Inter',sans-serif] text-[14px] leading-[22px] whitespace-nowrap" style={{ color: active ? "#3E00FB" : "rgba(0,0,0,0.88)" }}>
          {label}
        </p>
      </div>
    </div>
  );
}

function NavIcon({ d, active }: { d: string; active?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d={d} fill={active ? "#3E00FB" : "black"} fillOpacity={active ? 1 : 0.88} />
    </svg>
  );
}

function Navbar({ tenant, onTenantChange, loading, avatarSrc }: { tenant: TenantData; onTenantChange: (k: string) => void; loading?: boolean; avatarSrc?: string | null }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white flex items-center justify-between w-full relative" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
      <div className="bg-white h-[73.378px] flex items-start">
        <div className="flex items-center p-[20px] self-stretch">
          <Logo />
        </div>
        <NavItemInline
          active
          label="Overview"
          icon={<NavIcon active d="M1.5 1.5h4v4h-4zM8.5 1.5h4v4h-4zM1.5 8.5h4v4h-4zM8.5 8.5h4v4h-4z" />}
        />
        <NavItemInline
          label="Inventory"
          icon={<NavIcon d="M2 3h10v3H2zM2 6h10v5H2z" />}
        />
        <NavItemInline
          label="Delivery"
          icon={<NavIcon d="M1 7l12-5-5 12-2-5z" />}
        />
      </div>
      <div className="flex items-center gap-[24px] px-[20px] self-stretch">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6zM9 19a3 3 0 0 0 6 0" stroke="rgba(0,0,0,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        {/* Avatar + dropdown trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-[8px] rounded-[8px] px-[6px] py-[4px] hover:bg-[rgba(0,0,0,0.04)] transition-colors"
          >
            <div className="rounded-full size-[32px] overflow-hidden shrink-0 bg-[rgba(0,0,0,0.25)] flex items-center justify-center">
              {avatarSrc ? (
                <img alt="" src={avatarSrc} className="size-full object-cover" />
              ) : (
                <svg width="50%" height="50%" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" fill="white" />
                  <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="white" />
                </svg>
              )}
            </div>
            <div className="flex flex-col items-start leading-tight">
              <span className="font-['Inter',sans-serif] text-[11px] text-[rgba(0,0,0,0.45)]">Tenant</span>
              <span className="font-['Inter',sans-serif] text-[13px] font-semibold text-[rgba(0,0,0,0.88)]">{tenant.name}</span>
            </div>
            {loading ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="animate-spin">
                <circle cx="12" cy="12" r="9" stroke="rgba(0,0,0,0.12)" strokeWidth="2.5" />
                <path d="M21 12a9 9 0 0 0-9-9" stroke="#3E00FB" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 3.5l3 3 3-3" stroke="rgba(0,0,0,0.45)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div
                className="absolute right-0 top-[calc(100%+8px)] z-20 bg-white rounded-[8px] min-w-[220px] py-[6px]"
                style={{ border: "1px solid #f0f0f0", boxShadow: "0 6px 16px rgba(0,0,0,0.08)" }}
              >
                <div className="px-[12px] py-[6px] font-['Inter',sans-serif] text-[11px] uppercase tracking-[0.08em] text-[rgba(0,0,0,0.45)]">
                  Cambia tenant
                </div>
                {Object.values(TENANTS).map((t) => {
                  const active = t.key === tenant.key;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => {
                        onTenantChange(t.key);
                        setOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-[10px] px-[12px] py-[8px] hover:bg-[rgba(62,0,251,0.04)]"
                    >
                      <div className="size-[28px] rounded-[6px] overflow-hidden shrink-0 bg-white" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
                        <img
                          src={t.key === "movingup" ? imgMovingUpLogo : imgAlessiLogo}
                          alt={t.name}
                          className="size-full object-contain"
                        />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-['Inter',sans-serif] text-[13px] font-semibold text-[rgba(0,0,0,0.88)]">{t.name}</span>
                        <span className="font-['Inter',sans-serif] text-[11px] text-[rgba(0,0,0,0.45)] truncate">{t.company}</span>
                      </div>
                      {active && (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M3 7.5l3 3 5-6" stroke="#3E00FB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ButtonEdit() {
  return (
    <div
      className="bg-white flex items-center justify-center px-[15px] rounded-[6px] size-full"
      style={{ border: "1px solid #d9d9d9", boxShadow: "0px 2px 0px rgba(0,0,0,0.02)" }}
    >
      <div className="flex gap-[8px] h-[32px] items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M11.5 2.5l2 2L5 13H3v-2l8.5-8.5z" fill="black" fillOpacity="0.88" />
        </svg>
        <p className="font-['Inter',sans-serif] text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)] whitespace-nowrap">Modifica</p>
      </div>
    </div>
  );
}

function PasswordModal({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState<{ current: boolean; next: boolean; confirm: boolean }>({
    current: false,
    next: false,
    confirm: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!current || !next || !confirm) return setError("Compila tutti i campi.");
    if (next.length < 8) return setError("La nuova password deve avere almeno 8 caratteri.");
    if (next !== confirm) return setError("Le due password non coincidono.");
    setError(null);
    setSuccess(true);
    setTimeout(onClose, 1200);
  };

  const inputClass =
    "w-full px-[12px] py-[8px] rounded-[6px] font-['Inter',sans-serif] text-[14px] text-[rgba(0,0,0,0.88)] outline-none focus:border-[#3E00FB] transition-colors";
  const inputStyle = { border: "1px solid #d9d9d9" } as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-[12px] w-[440px] max-w-[92vw] p-[24px] flex flex-col gap-[16px]"
        style={{ boxShadow: "0 12px 32px rgba(0,0,0,0.18)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[10px]">
            <div className="size-[36px] rounded-[8px] flex items-center justify-center" style={{ background: "rgba(62,0,251,0.1)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" stroke="#3E00FB" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="font-['Inter',sans-serif] font-semibold text-[16px] text-[rgba(0,0,0,0.88)]">Cambia password</p>
              <p className="font-['Inter',sans-serif] text-[12px] text-[rgba(0,0,0,0.45)]">Aggiorna le tue credenziali di accesso</p>
            </div>
          </div>
          <button onClick={onClose} className="size-[28px] rounded-[6px] flex items-center justify-center hover:bg-[rgba(0,0,0,0.05)]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="rgba(0,0,0,0.65)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-[10px] py-[24px]">
            <div className="size-[44px] rounded-full flex items-center justify-center" style={{ background: "rgba(82,196,26,0.12)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#52c41a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="font-['Inter',sans-serif] text-[14px] font-semibold text-[rgba(0,0,0,0.88)]">Password aggiornata</p>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-[12px]">
            <div
              className="flex items-start gap-[10px] p-[12px] rounded-[8px]"
              style={{ background: "rgba(62,0,251,0.06)", border: "1px solid rgba(62,0,251,0.18)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mt-[1px] shrink-0">
                <circle cx="12" cy="12" r="10" stroke="#3E00FB" strokeWidth="1.6" />
                <path d="M12 8v5M12 16v.5" stroke="#3E00FB" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <p className="font-['Inter',sans-serif] text-[12px] leading-[18px] text-[rgba(0,0,0,0.75)]">
                La modifica riguarda il tuo account Gravity e si applica a <strong>tutti i tenant</strong> a cui hai accesso, non solo a quello selezionato. Dovrai riautenticarti su tutti i dispositivi.
              </p>
            </div>
            {[
              { label: "Password attuale", val: current, set: setCurrent, key: "current" as const },
              { label: "Nuova password", val: next, set: setNext, key: "next" as const },
              { label: "Conferma nuova password", val: confirm, set: setConfirm, key: "confirm" as const },
            ].map((f) => {
              const visible = show[f.key];
              return (
                <div key={f.label} className="flex flex-col gap-[4px]">
                  <label className="font-['Inter',sans-serif] text-[13px] text-[rgba(0,0,0,0.65)]">{f.label}</label>
                  <div className="relative">
                    <input
                      type={visible ? "text" : "password"}
                      className={`${inputClass} pr-[40px]`}
                      style={inputStyle}
                      value={f.val}
                      onChange={(e) => f.set(e.target.value)}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      aria-label={visible ? "Nascondi password" : "Mostra password"}
                      onClick={() => setShow((s) => ({ ...s, [f.key]: !s[f.key] }))}
                      className="absolute right-[8px] top-1/2 -translate-y-1/2 p-[4px] rounded-[4px] hover:bg-[rgba(0,0,0,0.05)]"
                    >
                      {visible ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M3 3l18 18M10.6 6.2A10.6 10.6 0 0 1 12 6c5 0 9.3 3.3 11 6-.7 1.1-1.7 2.3-3 3.3M6.7 6.7C4.6 8.1 3 9.9 1 12c1.7 2.7 6 6 11 6 1.7 0 3.3-.4 4.7-1M9.9 9.9a3 3 0 0 0 4.2 4.2"
                            stroke="rgba(0,0,0,0.55)"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M1 12c1.7-2.7 6-6 11-6s9.3 3.3 11 6c-1.7 2.7-6 6-11 6S2.7 14.7 1 12z"
                            stroke="rgba(0,0,0,0.55)"
                            strokeWidth="1.6"
                            strokeLinejoin="round"
                          />
                          <circle cx="12" cy="12" r="3" stroke="rgba(0,0,0,0.55)" strokeWidth="1.6" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}

            {error && (
              <p className="font-['Inter',sans-serif] text-[13px] text-[#ff4d4f]">{error}</p>
            )}

            <div className="flex justify-end gap-[8px] pt-[4px]">
              <button
                type="button"
                onClick={onClose}
                className="px-[15px] h-[32px] rounded-[6px] bg-white font-['Inter',sans-serif] text-[14px] text-[rgba(0,0,0,0.88)]"
                style={{ border: "1px solid #d9d9d9" }}
              >
                Annulla
              </button>
              <button
                type="submit"
                className="px-[15px] h-[32px] rounded-[6px] bg-[#3e00fb] font-['Inter',sans-serif] text-[14px] text-white"
                style={{ border: "1px solid #3e00fb" }}
              >
                Aggiorna password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function ButtonShare() {
  const [open, setOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const items = [
    {
      label: "Password",
      onClick: () => setPwOpen(true),
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" stroke="rgba(0,0,0,0.65)" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: "Notifiche",
      onClick: () => {},
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6zM9 19a3 3 0 0 0 6 0" stroke="rgba(0,0,0,0.65)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative h-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="bg-white flex items-center justify-center px-[15px] rounded-[6px] h-full"
        style={{ border: "1px solid #d9d9d9", boxShadow: "0px 2px 0px rgba(0,0,0,0.02)" }}
      >
        <div className="flex gap-[8px] h-[32px] items-center justify-center">
          <svg className="size-[16px]" viewBox="0 0 19.8797 20.9985" fill="none" preserveAspectRatio="none">
            <path d={settingsPaths.pbe9f500} fill="rgba(0,0,0,0.88)" />
          </svg>
          <p className="font-['Inter',sans-serif] text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)] whitespace-nowrap">Gestisci</p>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 3.5l3 3 3-3" stroke="rgba(0,0,0,0.45)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-[calc(100%+6px)] z-20 bg-white rounded-[8px] min-w-[180px] py-[6px]"
            style={{ border: "1px solid #f0f0f0", boxShadow: "0 6px 16px rgba(0,0,0,0.08)" }}
          >
            {items.map((it) => (
              <button
                key={it.label}
                type="button"
                onClick={() => {
                  setOpen(false);
                  it.onClick();
                }}
                className="w-full text-left flex items-center gap-[10px] px-[12px] py-[8px] hover:bg-[rgba(62,0,251,0.04)]"
              >
                {it.icon}
                <span className="font-['Inter',sans-serif] text-[14px] text-[rgba(0,0,0,0.88)]">{it.label}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {pwOpen && <PasswordModal onClose={() => setPwOpen(false)} />}
    </div>
  );
}

// ─── Icons (stub paths) ──────────────────────────────────────────────────────

function IconInfo() {
  return (
    <div className="overflow-clip relative shrink-0 size-[16px]">
      <div className="absolute inset-[6.25%]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
          <path d={svgPaths.p2ddbee00} fill="black" fillOpacity="0.45" />
          <path d={svgPaths.p88a5000} fill="black" fillOpacity="0.45" />
        </svg>
      </div>
    </div>
  );
}

function IconEdit() {
  return (
    <div className="overflow-clip relative shrink-0 size-[16px]">
      <div className="absolute inset-[10.94%]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.5 12.5">
          <path d={svgPaths.p6696770} fill="black" fillOpacity="0.88" />
        </svg>
      </div>
    </div>
  );
}

function IconShare() {
  return (
    <div className="overflow-clip relative shrink-0 size-[16px]">
      <div className="absolute inset-[11.72%_14.84%]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.25 12.25">
          <path d={svgPaths.p7897c00} fill="white" />
        </svg>
      </div>
    </div>
  );
}

function IconExternalLink() {
  return (
    <div className="relative shrink-0 size-[16px]">
      <div className="absolute inset-[4.17%]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.666 14.666">
          <path d={svgPaths.p1d013480} fill="#3E00FB" />
        </svg>
      </div>
    </div>
  );
}

// Inline glyphs used inside cards (kept lightweight so they render even with stub svgPaths)
function MapPin({ color = "#3E00FB" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9" r="2.4" fill={color} />
    </svg>
  );
}

function Truck({ color = "#3E00FB" }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 7h11v9H3zM14 11h4l3 3v2h-7z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="18" r="1.8" fill={color} />
      <circle cx="17.5" cy="18" r="1.8" fill={color} />
    </svg>
  );
}

// ─── Header Card ─────────────────────────────────────────────────────────────

function HeaderCard({ tenant, avatarSrc, onAvatarChange }: { tenant: TenantData; avatarSrc: string | null; onAvatarChange: (src: string) => void }) {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" style={{ border: "1px solid #f0f0f0" }}>
      <div className="content-stretch flex gap-[24px] items-center p-[20px] relative w-full">
        {/* Avatar */}
        <div className="size-[88px] shrink-0 rounded-full overflow-hidden">
          <Avatar editable src={avatarSrc} onChange={onAvatarChange} />
        </div>

        {/* Info block */}
        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start justify-center min-w-px relative">
          {/* Welcome + badge */}
          <div className="flex items-center gap-[12px]">
            <p className="font-['Inter',sans-serif] font-semibold leading-[32px] text-[24px] text-[rgba(0,0,0,0.88)] whitespace-nowrap">
              Benvenuto, {tenant.user}
            </p>
            <span
              className="font-['Inter',sans-serif] text-[14px] font-semibold px-[10px] py-[2px] rounded-[4px] whitespace-nowrap"
              style={{ color: "rgba(0,0,0,0.65)", background: "rgba(0,0,0,0.06)" }}
            >
              Operation Manager
            </span>
          </div>

          <div className="flex flex-wrap gap-x-[24px] gap-y-[6px] items-center font-['Inter',sans-serif] text-[14px]">
            <div className="flex gap-[6px] items-center whitespace-nowrap">
              <span className="text-[rgba(0,0,0,0.45)]">Azienda:</span>
              <span className="text-[rgba(0,0,0,0.88)]">{tenant.company}</span>
            </div>
            <div className="flex gap-[6px] items-center whitespace-nowrap">
              <span className="text-[rgba(0,0,0,0.45)]">Area di competenza:</span>
              <span className="text-[rgba(0,0,0,0.88)]">{tenant.area}</span>
            </div>
            <div className="flex gap-[6px] items-center whitespace-nowrap">
              <span className="text-[rgba(0,0,0,0.45)]">Email aziendale:</span>
              <span className="text-[rgba(0,0,0,0.88)]">{tenant.email}</span>
            </div>
          </div>
        </div>

        {/* Right action buttons */}
        <div className="content-stretch flex gap-[16px] items-center justify-end relative shrink-0">
          <div className="h-[32px] shrink-0 cursor-pointer">
            <ButtonShare />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── KPI ─────────────────────────────────────────────────────────────────────

type MetricCardProps = {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
};

function MetricCard({ label, value, trend, trendUp }: MetricCardProps) {
  return (
    <div className="bg-white content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative rounded-[8px]" style={{ border: "1px solid #f0f0f0" }}>
      <div className="relative shrink-0 w-full">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative size-full">
            <p className="font-['Inter',sans-serif] flex-[1_0_0] font-semibold h-[22px] leading-[22px] min-w-px text-[14px] text-[rgba(0,0,0,0.88)] truncate">
              {label}
            </p>
            <IconInfo />
          </div>
        </div>
      </div>
      <div className="relative shrink-0 w-full" style={{ borderTop: "1px solid #f0f0f0" }}>
        <div className="content-stretch flex flex-col items-start justify-center p-[12px] relative size-full">
          <div className="content-stretch flex items-center py-[8px] relative shrink-0 w-full">
            <p className="font-['Inter',sans-serif] font-semibold leading-[28px] text-[32px] text-[rgba(0,0,0,0.88)] whitespace-nowrap">
              {value}
            </p>
            {trend && (
              <span
                className="ml-[12px] font-['Inter',sans-serif] text-[12px] font-semibold px-[6px] py-[2px] rounded-[4px]"
                style={{
                  color: trendUp ? "#52c41a" : "#ff4d4f",
                  background: trendUp ? "rgba(82,196,26,0.1)" : "rgba(255,77,79,0.1)",
                }}
              >
                {trend}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCardsRow({ tenant }: { tenant: TenantData }) {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0 w-full">
      {tenant.metrics.map((m) => (
        <MetricCard key={m.label} {...m} />
      ))}
    </div>
  );
}

// ─── Inventory Spaces ────────────────────────────────────────────────────────

type SpaceCardProps = {
  code: string;
  city: string;
  type: string;
  status: "available" | "booked" | "expiring";
  occupancy: number;
};

const spaceStatus = {
  available: { label: "Disponibile", color: "#52c41a", bg: "rgba(82,196,26,0.1)" },
  booked: { label: "Prenotato", color: "#3E00FB", bg: "rgba(62,0,251,0.1)" },
  expiring: { label: "Permesso in scadenza", color: "#fa8c16", bg: "rgba(250,140,22,0.1)" },
};

function SpaceCard({ code, city, type, status, occupancy }: SpaceCardProps) {
  const s = spaceStatus[status];
  return (
    <div className="bg-white content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-w-px overflow-clip relative rounded-[8px]" style={{ border: "1px solid #f0f0f0" }}>
      <div className="content-stretch flex gap-[16px] h-[96px] items-start px-[16px] py-[16px] relative shrink-0 w-full">
        <div
          className="content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0"
          style={{ background: "rgba(62,0,251,0.1)" }}
        >
          <MapPin />
        </div>
        <div className="content-stretch flex flex-col items-start relative shrink-0 flex-1 min-w-0 pt-[2px]">
          <div className="flex gap-[6px] items-center w-full">
            <div className="font-['Inter',sans-serif] font-semibold text-[15px] leading-[22px] text-[rgba(0,0,0,0.88)] truncate">
              {code} · {city}
            </div>
          </div>
          <div className="font-['Inter',sans-serif] text-[12px] text-[rgba(0,0,0,0.65)] leading-[20px] truncate w-full">
            {type}
          </div>
          <div className="flex items-center gap-[6px] mt-[6px]">
            <span
              className="font-['Inter',sans-serif] text-[10px] font-semibold px-[5px] py-[1px] rounded-[3px]"
              style={{ color: s.color, background: s.bg }}
            >
              {s.label}
            </span>
            <span className="font-['Inter',sans-serif] text-[11px] text-[rgba(0,0,0,0.45)]">
              · occ. {occupancy}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpacesSection({ tenant }: { tenant: TenantData }) {
  return (
    <>
      <div className="flex gap-[4px] items-center shrink-0">
        <p className="font-['Inter',sans-serif] font-semibold leading-[28px] text-[20px] text-[rgba(0,0,0,0.88)]">
          I tuoi spazi
        </p>
      </div>
      <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
        {tenant.spaces.map((s) => (
          <SpaceCard key={s.code} {...s} />
        ))}
      </div>
    </>
  );
}

// ─── Task columns ────────────────────────────────────────────────────────────

type TaskItem = {
  title: string;
  desc: string;
  time: string;
  priority?: "high" | "medium" | "low";
};

function TaskCard({ title, desc, time, priority }: TaskItem) {
  const dot: Record<string, string> = { high: "#ff4d4f", medium: "#fa8c16", low: "#52c41a" };
  return (
    <div className="bg-white content-stretch flex flex-col items-start overflow-clip relative rounded-[8px] shrink-0 w-full" style={{ border: "1px solid #f0f0f0" }}>
      <div className="content-stretch flex gap-[8px] items-center px-[16px] py-[10px] relative w-full">
        <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center min-w-px">
          <div
            className="flex items-center justify-center p-[7px] rounded-[6px] shrink-0 size-[32px]"
            style={{ background: "rgba(62,0,251,0.12)" }}
          >
            <Truck />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-[6px]">
              <div className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)] whitespace-nowrap">
                {title}
              </div>
              {priority && (
                <span className="w-[6px] h-[6px] rounded-full shrink-0" style={{ background: dot[priority] }} />
              )}
            </div>
            <div className="font-['Inter',sans-serif] text-[12px] leading-[18px] text-[rgba(0,0,0,0.65)]">
              {desc}
            </div>
          </div>
        </div>
        <div className="font-['Inter',sans-serif] text-[12px] text-[rgba(0,0,0,0.45)] whitespace-nowrap">
          {time}
        </div>
      </div>
    </div>
  );
}

function TaskColumn({ tasks, columnLabel }: { tasks: TaskItem[]; columnLabel: string }) {
  return (
    <div className="flex-[1_0_0] min-w-px">
      <div className="content-stretch flex flex-col gap-[10px] items-start p-[10px] size-full">
        <div className="flex items-center gap-[8px] px-[6px] pb-[4px]">
          <p className="font-['Inter',sans-serif] font-semibold text-[12px] uppercase tracking-[0.08em] text-[rgba(0,0,0,0.45)]">
            {columnLabel}
          </p>
          <span
            className="font-['Inter',sans-serif] text-[11px] font-semibold px-[6px] py-[1px] rounded-[10px]"
            style={{ color: "#3E00FB", background: "rgba(62,0,251,0.08)" }}
          >
            {tasks.length}
          </span>
        </div>
        {tasks.map((t, i) => (
          <TaskCard key={i} {...t} />
        ))}
      </div>
    </div>
  );
}

function ActivitiesSection({ tenant }: { tenant: TenantData }) {
  return (
    <>
      <div className="flex gap-[4px] items-center shrink-0">
        <p className="font-['Inter',sans-serif] font-semibold leading-[28px] text-[20px] text-[rgba(0,0,0,0.88)]">
          Le tue attività
        </p>
      </div>
      <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
        <TaskColumn tasks={tenant.pending} columnLabel="Da gestire" />
        <TaskColumn tasks={tenant.inProgress} columnLabel="In corso" />
      </div>
    </>
  );
}

// ─── Skeletons ───────────────────────────────────────────────────────────────

function Skel({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse rounded-[4px] bg-[rgba(0,0,0,0.06)] ${className}`}
      style={style}
    />
  );
}

function HeaderSkeleton() {
  return (
    <div className="bg-white rounded-[8px] w-full p-[20px] flex gap-[24px] items-center" style={{ border: "1px solid #f0f0f0" }}>
      <Skel className="size-[88px] rounded-full shrink-0" />
      <div className="flex-1 flex flex-col gap-[12px]">
        <div className="flex items-center gap-[12px]">
          <Skel className="h-[28px] w-[260px]" />
          <Skel className="h-[22px] w-[140px]" />
        </div>
        <Skel className="h-[18px] w-[280px]" />
        <div className="flex gap-[24px]">
          <Skel className="h-[18px] w-[220px]" />
          <Skel className="h-[18px] w-[300px]" />
        </div>
      </div>
      <Skel className="h-[32px] w-[130px] shrink-0" />
    </div>
  );
}

function MetricsSkeleton() {
  return (
    <div className="flex gap-[10px] w-full">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex-1 bg-white rounded-[8px]" style={{ border: "1px solid #f0f0f0" }}>
          <div className="px-[12px] py-[8px]" style={{ borderBottom: "1px solid #f0f0f0" }}>
            <Skel className="h-[16px] w-[140px]" />
          </div>
          <div className="px-[12px] py-[20px] flex items-center gap-[12px]">
            <Skel className="h-[28px] w-[80px]" />
            <Skel className="h-[18px] w-[70px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SpacesSkeleton() {
  return (
    <>
      <Skel className="h-[24px] w-[120px]" />
      <div className="flex gap-[16px] w-full">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex-1 bg-white rounded-[8px] p-[16px] flex gap-[16px]" style={{ border: "1px solid #f0f0f0" }}>
            <Skel className="size-[40px] rounded-[8px] shrink-0" />
            <div className="flex-1 flex flex-col gap-[6px]">
              <Skel className="h-[16px] w-[120px]" />
              <Skel className="h-[12px] w-[140px]" />
              <Skel className="h-[12px] w-[90px] mt-[4px]" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function ActivitiesSkeleton() {
  return (
    <>
      <Skel className="h-[24px] w-[130px]" />
      <div className="flex gap-[8px] w-full">
        {Array.from({ length: 2 }).map((_, col) => (
          <div key={col} className="flex-1 p-[10px] flex flex-col gap-[10px]">
            <Skel className="h-[16px] w-[110px]" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-[8px] p-[12px] flex items-center gap-[10px]" style={{ border: "1px solid #f0f0f0" }}>
                <Skel className="size-[32px] rounded-[6px] shrink-0" />
                <div className="flex-1 flex flex-col gap-[6px]">
                  <Skel className="h-[14px] w-[180px]" />
                  <Skel className="h-[12px] w-[220px]" />
                </div>
                <Skel className="h-[12px] w-[50px]" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Root ────────────────────────────────────────────────────────────────────

export default function App() {
  const [tenantKey, setTenantKey] = useState("alessi");
  const [loading, setLoading] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const tenant = TENANTS[tenantKey];

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, [tenantKey]);

  return (
    <div className="bg-[#f5f5f5] min-h-screen w-full flex flex-col">
      <div className="w-full">
        <Navbar tenant={tenant} onTenantChange={setTenantKey} loading={loading} avatarSrc={avatarSrc} />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="content-stretch flex flex-col gap-[16px] items-start px-[24px] py-[16px] relative w-full">
          {loading ? (
            <>
              <HeaderSkeleton />
              <MetricsSkeleton />
              <SpacesSkeleton />
              <ActivitiesSkeleton />
            </>
          ) : (
            <>
              <HeaderCard tenant={tenant} avatarSrc={avatarSrc} onAvatarChange={setAvatarSrc} />
              <MetricCardsRow tenant={tenant} />
              <SpacesSection tenant={tenant} />
              <ActivitiesSection tenant={tenant} />
            </>
          )}
          <div className="h-[24px] shrink-0" />
        </div>
      </div>
    </div>
  );
}
