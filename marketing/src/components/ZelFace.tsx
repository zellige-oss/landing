import { useId } from "react";

export type Mood = "hello" | "look" | "thinking" | "excited" | "curious" | "focused" | "wink" | "content";
export const moods: Mood[] = ["hello", "look", "thinking", "excited", "curious", "focused", "wink", "content"];

/*
 * Zel's face: the emblem's whole centre star glazed in obsidian, inside its brass
 * rim, and one pair of eyes per mood. Drawn in the emblem's 1254-px space so it can
 * sit on top of the emblem image (web) or be composited onto it
 * (scripts/build-brand.mjs). Eye coordinates are at the original mascot's scale
 * (eyes at x 521 / 723, y 622), scaled onto the star by the outer transform.
 */
// The centre star's glaze, traced from brand/zellige-emblem.png (tips and inner
// corners) and grown 2.5% so no teal shows between it and the rim.
const STAR = "828,642 770,699 775,783 688,772 624,837 560,769 477,783 486,703 420,644 491,584 478,507 562,521 624,456 688,519 774,506 762,580";
// Light catching the upper-left sides, just inside the rim.
const GLINT = "455,644 514,594 504,530 573,542 624,488";
const EYE_L = 521;
const EYE_R = 723;
const EYE_Y = 622;

function Arc({ x, up = true }: { x: number; up?: boolean }) {
  // ∩ for a smile-squint, ∪ for closed, relaxed eyes.
  const d = up ? `M${x - 44} ${EYE_Y + 22}Q${x} ${EYE_Y - 44} ${x + 44} ${EYE_Y + 22}` : `M${x - 42} ${EYE_Y - 8}Q${x} ${EYE_Y + 44} ${x + 42} ${EYE_Y - 8}`;
  return <path d={d} fill="none" stroke="#f8f6ef" strokeWidth="24" strokeLinecap="round" />;
}

function Open({ x, squint = false }: { x: number; squint?: boolean }) {
  return (
    <g className="companion-eye">
      <ellipse cx={x} cy={EYE_Y} rx="30" ry={squint ? 13 : 40} fill="#f8f6ef" />
      {!squint && <circle cx={x - 9} cy={EYE_Y - 14} r="8" fill="#0b1d29" opacity=".18" />}
    </g>
  );
}

export function Eyes({ mood }: { mood: Mood }) {
  switch (mood) {
    case "hello":
      return <><Arc x={EYE_L} /><Arc x={EYE_R} /></>;
    case "content":
      return <><Arc x={EYE_L} up={false} /><Arc x={EYE_R} up={false} /></>;
    case "wink":
      return <><Arc x={EYE_L} /><g className="companion-look"><Open x={EYE_R} /></g></>;
    case "excited":
      return (
        <g fill="none" stroke="#f8f6ef" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round">
          <path d={`M${EYE_L - 34} ${EYE_Y - 36}L${EYE_L + 30} ${EYE_Y}L${EYE_L - 34} ${EYE_Y + 36}`} />
          <path d={`M${EYE_R + 34} ${EYE_Y - 36}L${EYE_R - 30} ${EYE_Y}L${EYE_R + 34} ${EYE_Y + 36}`} />
        </g>
      );
    case "focused":
      return <g className="companion-look"><Open x={EYE_L} squint /><Open x={EYE_R} squint /></g>;
    case "thinking":
      return (
        <>
          <path d={`M${EYE_L - 40} ${EYE_Y + 4}H${EYE_L + 38}`} stroke="#f8f6ef" strokeWidth="22" strokeLinecap="round" />
          <g transform="translate(14 -22)"><Open x={EYE_R} /></g>
        </>
      );
    case "curious":
      return (
        <g className="companion-look">
          <Open x={EYE_L} />
          <g transform={`rotate(-8 ${EYE_R} ${EYE_Y})`}><ellipse cx={EYE_R} cy={EYE_Y} rx="34" ry="46" fill="#f8f6ef" className="companion-eye" /></g>
        </g>
      );
    default:
      return <g className="companion-look"><Open x={EYE_L} /><Open x={EYE_R} /></g>;
  }
}

/** The face group, in emblem coordinates (viewBox 0 0 1254 1254). */
export function ZelFace({ mood, lively = false }: { mood: Mood; lively?: boolean }) {
  const gradient = `zel-face-${useId().replaceAll(":", "")}`;
  return (
    <>
      <defs>
        <radialGradient id={gradient} cx="40%" cy="30%" r="75%">
          <stop offset="0" stopColor="#1a2433" />
          <stop offset=".55" stopColor="#05080d" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
      </defs>
      <polygon points={STAR} fill={`url(#${gradient})`} />
      <polyline points={GLINT} fill="none" stroke="#fff" strokeOpacity=".12" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <g className="zel-face" transform="translate(625 644) scale(0.88) translate(-622 -622)">
        {lively ? (
          <>
            <g className="zel-attentive-eyes"><Eyes mood={mood} /></g>
            <g className="zel-happy-eyes companion-look"><Eyes mood="hello" /></g>
          </>
        ) : <Eyes mood={mood} />}
      </g>
    </>
  );
}
