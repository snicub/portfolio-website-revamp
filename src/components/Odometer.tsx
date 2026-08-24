"use client";

import { memo, type CSSProperties } from "react";
import { createAnimatable } from "animejs";
import { DUR, EASE } from "@/lib/motion";

/** Ten digits on a ten-sided prism, so one face is one tenth of a turn. */
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const STEP = 360 / DIGITS.length;

interface OdometerProps {
  /** How many digit drums. Read right to left, ones place first. */
  places?: number;
  /** Printed flat beside the drums — a unit, not a digit. */
  unit?: string;
  className?: string;
}

/**
 * A number printed on turning drums instead of set as type.
 *
 * Markup only: every face is placed by CSS on the surface of a ten-sided
 * prism, and the one thing that moves — the ring's rotation — is driven by
 * whoever owns the number, through `createOdometer` below. The nav's scroll
 * observer already runs every frame, so it costs nothing to hand it this too.
 *
 * Without the motion gate the whole drum collapses: `globals.css` shows only
 * the first face and leaves it unrotated, so the readout degrades to the
 * plain digits it was before.
 */
function Odometer({ places = 2, unit, className }: OdometerProps) {
  return (
    <span className={className ? `odo ${className}` : "odo"} aria-hidden="true">
      {/* The carry. A ten-faced drum cannot show a blank, so the digit that
          only ever appears at the very top of the range is plain type held
          in permanently reserved space — it fades in rather than pushing the
          rest of the bar sideways at 100%. */}
      <span className="odo__carry">1</span>

      {Array.from({ length: places }, (_, place) => (
        <span className="odo__col" key={place}>
          <span className="odo__ring">
            {DIGITS.map((digit) => (
              <span
                className="odo__face"
                key={digit}
                style={{ "--i": digit } as CSSProperties}
              >
                {digit}
              </span>
            ))}
          </span>
        </span>
      ))}

      {unit ? <span className="odo__unit">{unit}</span> : null}
    </span>
  );
}

/**
 * Wire an odometer's drums up and hand back a setter.
 *
 * Call it inside an anime.js Scope: the animatables it builds are registered
 * there and torn down with everything else on revert.
 *
 * Each drum is driven from the *value*, never from the digit it is showing.
 * That is the whole trick — a ring told to display "0" after "9" would unwind
 * 324 degrees backwards, whereas `value * 36` simply keeps counting up and
 * the ring keeps turning the way it was already going. It also means each
 * place turns a tenth as fast as the one to its right, which is exactly the
 * gearing the object being imitated has.
 */
export function createOdometer(el: HTMLElement) {
  const rings = Array.from(el.querySelectorAll<HTMLElement>(".odo__ring"));
  const drums = rings.map((ring, i) => ({
    // Leftmost ring is the highest place.
    place: 10 ** (rings.length - 1 - i),
    ring: createAnimatable(ring, {
      // Slower than a UI acknowledgement on purpose: the lag is the weight.
      // Scroll fast enough and the ones drum spins, which is the point.
      rotateX: { duration: DUR.fast + 90, ease: EASE.out },
    }),
  }));
  const ceiling = 10 ** rings.length;
  let shown = -1;

  return (value: number) => {
    // The observer driving this runs on every scroll frame, but the number it
    // reports only changes a hundred times over a whole document. Without
    // this guard each drum is re-targeted sixty times a second to the angle
    // it is already turning toward, which is both wasted work and a tween
    // that never gets to finish arriving.
    if (value === shown) return;
    shown = value;

    for (const drum of drums) {
      drum.ring.rotateX(Math.floor(value / drum.place) * STEP);
    }
    el.classList.toggle("is-carrying", value >= ceiling);
  };
}

export default memo(Odometer);
