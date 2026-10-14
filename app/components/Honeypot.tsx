"use client";

/**
 * A field people never see and bots fill in. A form that comes back with it
 * filled is dropped without a word, so the bot learns nothing. It is the
 * cheap first line before the server's CAPTCHA and rate limits
 * (docs/API-CONTRACT.md), and it costs a real person nothing: no puzzle,
 * which matters on a slow phone or with a screen reader.
 *
 * Hidden off-screen rather than with display:none, which some bots skip;
 * out of the tab order and away from assistive technology, so nobody lands in it.
 */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden className="absolute -start-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}
