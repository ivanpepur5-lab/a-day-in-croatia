import { useId } from 'react';

/**
 * Original illustrated "travel poster" art for each destination.
 * Used whenever a location has no licensed photo (`location.photo`).
 * viewBox is 400×500 and rendered with `slice`, so any aspect ratio works.
 */

const PALETTES = {
  'split-hero': { sky: ['#f7c9a3', '#f39a7b', '#3c5a7d'], sea: ['#2c6e8f', '#0f3550'], sun: '#ffe2b8' },
  'diocletians-palace': { sky: ['#fbe3c4', '#f1b48a'], sea: ['#3a86a3', '#14445e'], sun: '#fff1d6' },
  marjan: { sky: ['#dff1ee', '#b6dbd4'], sea: ['#3f93a5', '#185166'], sun: '#fffbe9' },
  bacvice: { sky: ['#c7ecf4', '#8fd4e6'], sea: ['#2fb3c4', '#0b6f8a'], sun: '#fff7d1' },
  salona: { sky: ['#fde2b3', '#eea96f'], sea: ['#9a8a6b', '#6e5f45'], sun: '#fff0cc' },
  klis: { sky: ['#e6e3f3', '#b7b2d8'], sea: ['#6b89b5', '#3d5986'], sun: '#fff5e1' },
  trogir: { sky: ['#ffd9c2', '#f19d86'], sea: ['#3e7f9c', '#163f57'], sun: '#ffe9d5' },
  omis: { sky: ['#d5efe6', '#9fd2c3'], sea: ['#2b9c93', '#0e5753'], sun: '#fffbe6' },
  krka: { sky: ['#e2f4dc', '#b6e0a9'], sea: ['#43c1c0', '#167b80'], sun: '#ffffee' },
};

export default function LocationArt({ id, className = '', title }) {
  const uid = useId().replace(/:/g, '');
  const p = PALETTES[id] ?? PALETTES['split-hero'];
  const g = (name) => `${uid}-${name}`;
  const Scene = SCENES[id] ?? SCENES['split-hero'];
  return (
    <svg
      className={`art ${className}`}
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <linearGradient id={g('sky')} x1="0" y1="0" x2="0" y2="1">
          {p.sky.map((c, i) => (
            <stop key={c} offset={`${(i / (p.sky.length - 1)) * 100}%`} stopColor={c} />
          ))}
        </linearGradient>
        <linearGradient id={g('sea')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.sea[0]} />
          <stop offset="100%" stopColor={p.sea[1]} />
        </linearGradient>
        <radialGradient id={g('sun')} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.sun} />
          <stop offset="60%" stopColor={p.sun} stopOpacity="0.9" />
          <stop offset="100%" stopColor={p.sun} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={g('shade')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="55%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill={`url(#${g('sky')})`} />
      <Scene g={g} />
      <rect width="400" height="500" fill={`url(#${g('shade')})`} />
    </svg>
  );
}

const Sun = ({ g, cx = 290, cy = 140, r = 70 }) => (
  <circle cx={cx} cy={cy} r={r} fill={`url(#${g('sun')})`} />
);

const Sea = ({ g, y = 360 }) => (
  <>
    <rect y={y} width="400" height={500 - y} fill={`url(#${g('sea')})`} />
    {[0, 1, 2, 3].map((i) => (
      <path
        key={i}
        d={`M${20 + i * 37} ${y + 22 + i * 26} h${60 - i * 6}`}
        stroke="#fff"
        strokeOpacity={0.35 - i * 0.06}
        strokeWidth="3"
        strokeLinecap="round"
      />
    ))}
    {[0, 1, 2].map((i) => (
      <path
        key={`r${i}`}
        d={`M${230 + i * 30} ${y + 40 + i * 30} h${70 - i * 10}`}
        stroke="#fff"
        strokeOpacity={0.25}
        strokeWidth="3"
        strokeLinecap="round"
      />
    ))}
  </>
);

const Palm = ({ x, y, s = 1, color = '#24343f' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={color}>
    <path d="M-3 0 C-2 -40 4 -80 2 -120 L7 -120 C9 -80 4 -40 4 0 Z" />
    {[-70, -35, 0, 35, 70, 110, -110].map((a) => (
      <path
        key={a}
        d="M4 -120 C24 -132 46 -128 62 -110 C44 -118 24 -118 4 -114 Z"
        transform={`rotate(${a} 4 -120)`}
      />
    ))}
  </g>
);

const Pine = ({ x, y, s = 1, color = '#1f4d3f' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={color}>
    <rect x="-3" y="-40" width="6" height="40" />
    <ellipse cx="0" cy="-48" rx="34" ry="14" />
    <ellipse cx="-14" cy="-58" rx="20" ry="10" />
    <ellipse cx="12" cy="-60" rx="22" ry="11" />
  </g>
);

const Cypress = ({ x, y, s = 1, color = '#2f4a35' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={color}>
    <path d="M0 0 C-14 -30 -12 -90 0 -130 C12 -90 14 -30 0 0 Z" />
  </g>
);

const BellTower = ({ x, y, s = 1, color = '#e9d9bf', shade = '#c9b393' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-18" y="-150" width="36" height="150" fill={color} />
    <rect x="-18" y="-150" width="10" height="150" fill={shade} opacity="0.5" />
    {[0, 1, 2, 3].map((i) => (
      <path
        key={i}
        d={`M-9 ${-30 - i * 32} v-14 a9 9 0 0 1 18 0 v14 Z`}
        fill="#5b4a3a"
        opacity="0.75"
      />
    ))}
    <path d="M-22 -150 L0 -195 L22 -150 Z" fill={shade} />
  </g>
);

const SCENES = {
  'split-hero': ({ g }) => (
    <>
      <Sun g={g} cx={250} cy={250} r={110} />
      <path d="M0 300 C60 250 120 240 170 270 C200 285 230 300 260 330 L0 340 Z" fill="#3e5a52" />
      <path d="M0 320 C50 290 110 290 160 310 L0 345 Z" fill="#2d4640" />
      <BellTower x={300} y={345} s={0.95} color="#f0dcc0" shade="#d0b38f" />
      <path d="M180 345 h220 v-46 h-12 v-10 h-20 v10 h-26 v-18 h-24 v18 h-30 v-12 h-22 v12 h-34 v-8 h-20 v8 h-32 Z" fill="#e3c9a6" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <path key={i} d={`M${190 + i * 23} 345 v-14 a7 7 0 0 1 14 0 v14 Z`} fill="#8a6c51" opacity="0.6" />
      ))}
      <Sea g={g} y={345} />
      <rect y="343" width="400" height="6" fill="#efe2cc" opacity="0.8" />
      <Palm x={40} y={350} s={0.9} color="#1d2b33" />
      <Palm x={92} y={352} s={0.7} color="#1d2b33" />
      <Palm x={150} y={350} s={0.82} color="#1d2b33" />
    </>
  ),
  'diocletians-palace': ({ g }) => (
    <>
      <Sun g={g} cx={300} cy={110} r={80} />
      <BellTower x={270} y={300} s={1.2} />
      <rect x="20" y="200" width="360" height="160" fill="#efdcbf" />
      <rect x="20" y="200" width="360" height="14" fill="#d9bf98" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <rect x={40 + i * 56} y="230" width="20" height="130" fill="#e3caa5" />
          <path d={`M60 ${360} v-90 a18 18 0 0 1 36 0 v90 Z`} transform={`translate(${i * 56 - 20} 0)`} fill="#7a5c43" opacity="0.55" />
        </g>
      ))}
      <rect x="20" y="214" width="360" height="10" fill="#c8ab83" opacity="0.6" />
      <Sea g={g} y={360} />
      <Palm x={30} y={370} s={1} />
      <Palm x={360} y={372} s={0.85} />
    </>
  ),
  marjan: ({ g }) => (
    <>
      <Sun g={g} cx={110} cy={120} r={70} />
      <path d="M0 230 C80 160 170 150 260 190 C320 215 360 210 400 200 V380 H0 Z" fill="#5f9b7c" />
      <path d="M0 280 C90 230 190 230 280 260 C330 278 370 270 400 262 V380 H0 Z" fill="#3e7b5e" />
      {[30, 90, 150, 220, 300, 360].map((x, i) => (
        <Pine key={x} x={x} y={262 - (i % 2) * 18} s={0.8 + (i % 3) * 0.1} color="#24563f" />
      ))}
      {[60, 180, 260, 340].map((x) => (
        <Pine key={x} x={x} y={320} s={1.1} color="#1a4232" />
      ))}
      <path d="M0 340 h400 v40 H0 Z" fill="#ead7b9" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <rect key={i} x={10 + i * 40} y={326 - (i % 3) * 6} width="30" height={20 + (i % 3) * 6} fill={i % 2 ? '#f3e3c8' : '#e6cda8'} />
      ))}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <path key={`r${i}`} d={`M${8 + i * 40} ${326 - (i % 3) * 6} l17 -10 l17 10 Z`} fill="#c8674b" />
      ))}
      <Sea g={g} y={380} />
    </>
  ),
  bacvice: ({ g }) => (
    <>
      <Sun g={g} cx={300} cy={110} r={75} />
      <path d="M0 250 C120 230 280 230 400 250 V300 H0 Z" fill="#9cc7b4" opacity="0.6" />
      <Sea g={g} y={280} />
      <path d="M0 400 C120 360 280 360 400 400 V500 H0 Z" fill="#f1dfbf" />
      <path d="M0 400 C120 360 280 360 400 400" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="5" />
      {[
        [80, 430, '#e2574c'],
        [210, 415, '#f2b134'],
        [320, 440, '#2a7f9e'],
      ].map(([x, y, c]) => (
        <g key={x}>
          <rect x={x - 2} y={y - 60} width="4" height="62" fill="#5b4a3a" />
          <path d={`M${x - 46} ${y - 56} Q${x} ${y - 100} ${x + 46} ${y - 56} Z`} fill={c} />
          <path d={`M${x - 15} ${y - 58} Q${x} ${y - 98} ${x + 15} ${y - 58} Z`} fill="#fff" opacity="0.45" />
        </g>
      ))}
      <circle cx="150" cy="320" r="9" fill="#fff" stroke="#e2574c" strokeWidth="3" />
      <path d="M140 345 q10 -8 20 0" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
    </>
  ),
  salona: ({ g }) => (
    <>
      <Sun g={g} cx={200} cy={210} r={110} />
      <path d="M0 300 C100 280 300 280 400 300 V500 H0 Z" fill="#d8b98a" />
      <path d="M0 360 C120 340 280 340 400 360 V500 H0 Z" fill="#c6a372" />
      <path d="M60 350 v-110 a50 50 0 0 1 100 0 v110 h-22 v-108 a28 28 0 0 0 -56 0 v108 Z" fill="#f0dfc3" />
      {[
        [220, 170],
        [262, 120],
        [304, 150],
        [346, 90],
      ].map(([x, h]) => (
        <g key={x}>
          <rect x={x} y={350 - h} width="22" height={h} fill="#f3e4ca" />
          <rect x={x} y={350 - h} width="7" height={h} fill="#d9c09a" />
          <rect x={x - 5} y={350 - h - 8} width="32" height="8" fill="#e6d1ad" />
        </g>
      ))}
      <rect x="40" y="350" width="340" height="12" fill="#b99467" />
      <Cypress x={30} y={350} s={1.1} />
      <Cypress x={196} y={352} s={0.8} />
      <Cypress x={385} y={356} s={0.9} />
    </>
  ),
  klis: ({ g }) => (
    <>
      <Sun g={g} cx={90} cy={110} r={70} />
      <path d="M0 360 C60 350 120 340 200 345 C280 350 340 340 400 350 V500 H0 Z" fill="#7c93b9" opacity="0.5" />
      <path d="M0 420 L60 330 L110 300 L170 230 L230 210 L290 250 L340 230 L400 290 V500 H0 Z" fill="#8e8a7e" />
      <path d="M0 420 L60 330 L110 300 L170 230 L180 300 L120 380 L40 440 Z" fill="#6f6b61" />
      <path d="M100 302 l10 -24 h14 v-12 h10 v12 h20 l14 -38 h10 v-14 h12 v14 h24 v-14 h12 v14 h14 l20 30 h12 v-12 h10 v12 h12 l24 22 h12 v-12 h10 v12 l26 40 Z" fill="#e8dcc5" />
      <rect x="196" y="160" width="34" height="56" fill="#efe3cd" />
      <path d="M192 160 h42 l-6 -10 h-30 Z" fill="#d8c8a8" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={204 + i * 8} y="176" width="4" height="10" fill="#5b4a3a" opacity="0.7" />
      ))}
      <path d="M0 500 V460 C100 440 300 440 400 460 V500 Z" fill="#4c5a4a" />
    </>
  ),
  trogir: ({ g }) => (
    <>
      <Sun g={g} cx={120} cy={150} r={85} />
      <path d="M0 330 h400 v-20 H0 Z" fill="#e7cfae" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <g key={i}>
          <rect x={i * 38} y={300 - (i % 4) * 14} width="34" height={40 + (i % 4) * 14} fill={i % 2 ? '#f1dcbc' : '#e4c49c'} />
          <path d={`M${i * 38 - 2} ${300 - (i % 4) * 14} l19 -14 l19 14 Z`} fill="#c45f45" />
          <rect x={i * 38 + 12} y={314 - (i % 4) * 14} width="8" height="12" fill="#6a5442" opacity="0.6" />
        </g>
      ))}
      <BellTower x={180} y={300} s={1.05} color="#f2e1c6" shade="#d6bb94" />
      <g>
        <rect x="300" y="180" width="70" height="150" fill="#e9d6b7" />
        <path d="M300 180 h70 v-10 h-8 v-8 h-10 v8 h-12 v-8 h-10 v8 h-12 v-8 h-10 v8 h-8 Z" fill="#e9d6b7" />
        <rect x="300" y="180" width="18" height="150" fill="#cdb38c" opacity="0.6" />
      </g>
      <Sea g={g} y={340} />
      <path d="M0 340 h400" stroke="#f8e6cd" strokeWidth="4" opacity="0.7" />
      <rect x="170" y="352" width="24" height="70" fill="#f2e1c6" opacity="0.18" />
      <rect x="310" y="352" width="56" height="90" fill="#e9d6b7" opacity="0.14" />
    </>
  ),
  omis: ({ g }) => (
    <>
      <Sun g={g} cx={200} cy={110} r={70} />
      <path d="M0 0 H130 C150 80 120 160 160 230 C180 270 170 320 190 380 H0 Z" fill="#8a8173" />
      <path d="M0 0 H90 C110 90 80 180 120 260 C140 300 130 340 150 400 H0 Z" fill="#6f675b" />
      <path d="M400 0 H280 C260 90 300 170 250 240 C230 280 240 330 220 380 H400 Z" fill="#9a907f" />
      <path d="M400 0 H320 C300 100 340 180 300 260 C280 300 290 340 270 400 H400 Z" fill="#7b7264" />
      <rect x="40" y="70" width="26" height="40" fill="#e8dcc5" />
      <path d="M36 70 h34 v-8 h-6 v-6 h-6 v6 h-4 v-6 h-6 v6 h-6 v-6 h-6 Z" fill="#e8dcc5" />
      {[[110, 200], [300, 220], [70, 300], [330, 320]].map(([x, y]) => (
        <Pine key={x} x={x} y={y} s={0.55} color="#3d6b50" />
      ))}
      <path d="M150 380 C170 340 230 340 250 380 L400 380 V500 H0 V380 Z" fill={`url(#${g('sea')})`} />
      <path d="M170 380 C190 360 210 360 230 380" stroke="#fff" strokeOpacity="0.4" strokeWidth="3" fill="none" />
      <g transform="translate(200 430)">
        <path d="M-40 0 C-20 10 20 10 40 0 C20 -6 -20 -6 -40 0 Z" fill="#f2b134" />
        <circle cx="0" cy="-12" r="6" fill="#26323a" />
        <path d="M-30 -22 L30 6" stroke="#26323a" strokeWidth="3" strokeLinecap="round" />
      </g>
    </>
  ),
  krka: ({ g }) => (
    <>
      <Sun g={g} cx={300} cy={90} r={70} />
      <path d="M0 160 C100 130 300 130 400 160 V260 H0 Z" fill="#6fae6a" />
      {[20, 70, 130, 270, 330, 380].map((x, i) => (
        <circle key={x} cx={x} cy={170 + (i % 2) * 12} r={34} fill={i % 2 ? '#4f8f52' : '#5d9e5e'} />
      ))}
      {[
        [210, '#3fb6b6'],
        [280, '#36a6a8'],
        [350, '#2b9195'],
        [430, '#1d7b80'],
      ].map(([y, c], i) => (
        <g key={y}>
          <path d={`M0 ${y} C100 ${y - 14} 300 ${y - 14} 400 ${y} V${y + 80} H0 Z`} fill={c} />
          <path d={`M0 ${y} C100 ${y - 14} 300 ${y - 14} 400 ${y}`} stroke="#d8c9a3" strokeWidth="7" fill="none" />
          {[40, 95, 150, 205, 260, 315, 370].map((x, j) => (
            <rect
              key={x}
              x={x + ((i + j) % 2) * 8}
              y={y - 10}
              width={10 + ((i + j) % 3) * 4}
              height={52}
              rx="5"
              fill="#fff"
              opacity={0.55 + ((i + j) % 3) * 0.12}
            />
          ))}
        </g>
      ))}
      <Pine x={40} y={210} s={0.6} color="#2f6a3c" />
      <Pine x={365} y={212} s={0.7} color="#2f6a3c" />
    </>
  ),
};
