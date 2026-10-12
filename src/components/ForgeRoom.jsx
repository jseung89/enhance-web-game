import React from 'react';

// Vector scenery keeps the room crisp without another large image download.
export default function ForgeRoom() {
  return <svg className="forge-room" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="forge-wall" x2="0" y2="1"><stop stopColor="#162a3c"/><stop offset="1" stopColor="#0a1421"/></linearGradient>
      <radialGradient id="forge-warm"><stop stopColor="#ffb64b" stopOpacity=".38"/><stop offset="1" stopColor="#f87c32" stopOpacity="0"/></radialGradient>
      <pattern id="forge-bricks" width="180" height="90" patternUnits="userSpaceOnUse"><path d="M0 0H180M0 45H180M90 0V45M0 45V90M180 45V90" fill="none" stroke="#567082" strokeOpacity=".12" strokeWidth="3"/></pattern>
    </defs>
    <path fill="url(#forge-wall)" d="M0 0H1440V600H0z"/><path fill="url(#forge-bricks)" d="M0 0H1440V460H0z"/>
    <path d="M0 32H1440M40 0V470M1400 0V470" fill="none" stroke="#08121d" strokeWidth="28"/>
    <g transform="translate(94 98)"><path d="M0 198V57Q0 0 72 0T144 57V198Z" fill="#080f1b" stroke="#3d4c59" strokeWidth="12"/><path d="M15 183V57Q15 15 72 15T129 57V183Z" fill="#223d56"/><path d="M72 15V190M8 100H137" stroke="#101c2b" strokeWidth="8"/><circle cx="106" cy="47" r="15" fill="#d5dfc9"/><path d="M0 192H144" stroke="#5e6b70" strokeWidth="12"/></g>
    <g transform="translate(700 58)"><path d="M0 0H220V327H0Z" fill="#24303b" stroke="#101820" strokeWidth="12"/><path d="M20 170Q110 80 200 170V327H20Z" fill="#0a1017" stroke="#47505a" strokeWidth="18"/><ellipse cx="110" cy="330" rx="230" ry="240" fill="url(#forge-warm)"/><g className="forge-fire"><path d="M45 320Q20 282 75 238Q66 275 101 243Q117 220 119 193Q185 258 166 282Q204 261 182 320Z" fill="#da702e"/><path d="M78 320Q52 294 103 267Q102 287 126 258Q159 285 149 320Z" fill="#ffd477"/></g><path d="M34 329H188" stroke="#1d2027" strokeWidth="20"/></g>
    <g stroke="#7c8e93" strokeWidth="7" fill="none"><path d="M346 103H620" stroke="#56616b" strokeWidth="12"/><path d="M389 108V199M455 108V183M535 108V201"/><path d="M366 174H412V193H366Z" fill="#7c8e93"/><path d="M440 163L455 186L472 162M520 201L535 179L550 201"/></g>
    <path d="M0 456L1440 436V600H0Z" fill="#151b23"/><path d="M160 458L737 419L846 477L239 527Z" fill="#8a6a4d" stroke="#221f21" strokeWidth="9"/><path d="M239 527L846 477V527L239 577Z" fill="#4e3b2e" stroke="#221f21" strokeWidth="8"/><path d="M280 567V600M800 531V600" stroke="#4e3b2e" strokeWidth="38"/>
    <path d="M420 413L619 402L669 424L603 448L595 480L480 488L476 448L422 438Z" fill="#617481" stroke="#26323c" strokeWidth="7"/><path d="M437 414L620 408L645 423L479 438Z" fill="#91a0a4"/>
  </svg>;
}
