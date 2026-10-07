import { useId } from "react";

export type Mood = "hello" | "look" | "thinking" | "excited" | "curious" | "focused" | "wink" | "content" | "surprised";
// The moods with a generated image (scripts/build-brand.mjs); "surprised" only plays on the web.
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
// How far the open lids rest beyond the eye, per eye half-height (see .lid-* in styles.css).
const LID_CLEAR_UP = .45;
const LID_CLEAR_DOWN = .2;
// The cheek: a lower lid shaped like the eye, parked just below the eye's socket and
// raised until its centre is this far below the eye's (per half-height), leaving a
// smiling ∩ crescent.
const CHEEK_SMILE = .62;
// How far a smile lifts the whole eye (the hero animates the same lift, styles.css).
const SMILE_LIFT = 7;

function Closed({ x }: { x: number }) {
  // ∪ for closed, relaxed eyes.
  return <path d={`M${x - 42} ${EYE_Y - 8}Q${x} ${EYE_Y + 44} ${x + 42} ${EYE_Y - 8}`} fill="none" stroke="#f8f6ef" strokeWidth="24" strokeLinecap="round" />;
}

/*
 * An open eye under obsidian lids. Blinks and sleep lower the upper lid (and raise a
 * short lower one) over the eye instead of squashing it. At rest both lids sit just
 * clear of the eye, shadow included, so an open eye shows its whole bead. The lids
 * are drawn open, so without CSS (the generated mood images) the eye is open. CSS
 * moves them by the travel set for each eye height (.lid-13, .lid-40, ...).
 * A smile raises a third, eye-shaped lid from below, the cheek, which leaves a ∩
 * crescent of the same glaze: drawn raised with `smile`, or raised by --zel-happy.
 */
function Open({ x, rx = 30, ry = 40, squint = false, smile = false }: { x: number; rx?: number; ry?: number; squint?: boolean; smile?: boolean }) {
  const id = useId().replaceAll(":", "");
  const h = squint ? 13 : ry, left = x - rx - 8, right = x + rx + 8;
  // Resting lid edges: above the eye by more than the lid's shadow reaches, below by a margin.
  const top = EYE_Y - h - LID_CLEAR_UP * h, bottom = EYE_Y + h + LID_CLEAR_DOWN * h;
  const cheekY = smile ? EYE_Y + CHEEK_SMILE * h : EYE_Y + 2 * h + 4, cheekL = x - rx - 2, cheekR = x + rx + 2;
  const cheekEdge = `M${cheekL} ${cheekY}A${rx + 2} ${h} 0 0 1 ${cheekR} ${cheekY}`;
  return (
    <g className="companion-eye" transform={smile ? `translate(0 ${-SMILE_LIFT})` : undefined}>
      <defs>
        <clipPath id={`${id}-eye`}><ellipse cx={x} cy={EYE_Y} rx={rx} ry={h} /></clipPath>
        {/* A little wider than the eye, so a shut lid also hides the eye's edge. */}
        <clipPath id={`${id}-socket`}><ellipse cx={x} cy={EYE_Y} rx={rx + 3} ry={h + 3} /></clipPath>
        {/* The face's own obsidian gradient, placed where the face draws it, so a
            shut lid blends into the face and only its crease shows. */}
        <radialGradient id={`${id}-lid`} gradientUnits="userSpaceOnUse" cx="574" cy="538" r="336">
          <stop offset="0" stopColor="#1a2433" />
          <stop offset=".55" stopColor="#05080d" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <radialGradient id={`${id}-glaze`} cx="42%" cy="34%" r="70%">
          <stop offset="0" stopColor="#fffdf8" />
          <stop offset=".62" stopColor="#f3ecdd" />
          <stop offset="1" stopColor="#d8ccb4" />
        </radialGradient>
        <mask id={`${id}-cheek`}>
          <g className={`companion-cheek lid-${h}`}>
            <path d={`M${left} ${cheekY}H${cheekL}A${rx + 2} ${h} 0 0 1 ${cheekR} ${cheekY}H${right}V${cheekY + 3 * h}H${left}Z`} fill="#fff" />
          </g>
        </mask>
        <filter id={`${id}-shade`} x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy={h * .08} stdDeviation={h * .07} floodColor="#000" floodOpacity=".55" />
        </filter>
      </defs>
      {/* A glazed bead: lit from the top left, warmer towards the edge. */}
      <ellipse cx={x} cy={EYE_Y} rx={rx} ry={h} fill={`url(#${id}-glaze)`} />
      <g clipPath={`url(#${id}-socket)`}>
        <g className={`companion-lid lid-${h}`} filter={`url(#${id}-shade)`}>
          <path d={`M${left} ${top - 2 * h}H${right}V${top}Q${x} ${top + h * .12} ${left} ${top}Z`} fill={`url(#${id}-lid)`} />
        </g>
        <g className={`companion-lid-lower lid-${h}`}>
          <path d={`M${left} ${bottom}Q${x} ${bottom - h * .12} ${right} ${bottom}V${bottom + h}H${left}Z`} fill={`url(#${id}-lid)`} />
        </g>
        {/* The cheek's shape moves inside a mask over a still fill, so its obsidian
            stays in step with the face's gradient while it rises. */}
        <rect x={left} y={EYE_Y - h - 4} width={right - left} height={2 * h + 8} fill={`url(#${id}-lid)`} mask={`url(#${id}-cheek)`} />
      </g>
      {/* The lid's edge catches the light: the crease that stays when the eye shuts. */}
      <g clipPath={`url(#${id}-eye)`}>
        <g className={`companion-lid lid-${h}`}>
          <path d={`M${left} ${top - 1.5}Q${x} ${top + h * .12 - 1.5} ${right} ${top - 1.5}`} fill="none" stroke="#4a6079" strokeOpacity=".9" strokeWidth="4.5" strokeLinecap="round" />
        </g>
        <g className={`companion-cheek lid-${h}`}>
          <path d={cheekEdge} fill="none" stroke="#4a6079" strokeOpacity=".9" strokeWidth="4.5" strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
}

export function Eyes({ mood }: { mood: Mood }) {
  switch (mood) {
    case "hello":
      return <g className="companion-look"><Open x={EYE_L} smile /><Open x={EYE_R} smile /></g>;
    case "content":
      return <><Closed x={EYE_L} /><Closed x={EYE_R} /></>;
    case "wink":
      return <g className="companion-look"><Open x={EYE_L} smile /><Open x={EYE_R} /></g>;
    case "excited":
      return (
        <g fill="none" stroke="#f8f6ef" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round">
          <path d={`M${EYE_L - 34} ${EYE_Y - 36}L${EYE_L + 30} ${EYE_Y}L${EYE_L - 34} ${EYE_Y + 36}`} />
          <path d={`M${EYE_R + 34} ${EYE_Y - 36}L${EYE_R - 30} ${EYE_Y}L${EYE_R + 34} ${EYE_Y + 36}`} />
        </g>
      );
    case "surprised":
      return <g className="companion-look"><Open x={EYE_L} rx={38} ry={54} /><Open x={EYE_R} rx={38} ry={54} /></g>;
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
          <g transform={`rotate(-8 ${EYE_R} ${EYE_Y})`}><Open x={EYE_R} rx={34} ry={46} /></g>
        </g>
      );
    default:
      return <g className="companion-look"><Open x={EYE_L} /><Open x={EYE_R} /></g>;
  }
}

/** The face group, in emblem coordinates (viewBox 0 0 1254 1254). */
export function ZelFace({ mood }: { mood: Mood }) {
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
        <Eyes mood={mood} />
      </g>
    </>
  );
}
