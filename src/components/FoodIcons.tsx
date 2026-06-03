// FoodIcons.tsx — 料理アイコン全62種（タイル方式）
// @ts-nocheck
import React from 'react';

// 各料理を fill（塗り）/ line（線）2モードで描画。viewBox 0 0 64 64。
// パレットはプロトタイプ(PB)の世界観に合わせた、やわらかく食欲のある色。

const C = {
  ware:   "#FFFFFF", wareRim:"#DCE7F2", wareSh:"#EAF2FB",
  ink:    "#2B4866",  // line モードの主線
  rice:   "#FBF7EC", riceSh:"#ECE2CB",
  broth:  "#EBA23E", brothD:"#CC7C22",
  noodle: "#F2D98C", noodleD:"#DEBF63",
  meat:   "#B26A3C", meatD:"#7E4A2A", meatT:"#C98552",
  nori:   "#33414E",
  yolk:   "#FBC53D", egg:"#FFF4DE",
  green:  "#73BD55", greenD:"#4F9A3E",
  red:    "#E85B49", salmon:"#FF9A72",
  cheese: "#FFCB5E", crust:"#E0AE63",
  lemon:  "#F2D24A",
  fry:    "#D79A52", fryD:"#B97A33",
  curry:  "#C57C2C", curryD:"#A25C18",
  wood:   "#CBA06A",
  steam:  "#BFD6EC",
};

// 線モード共通 props
const ln = (extra) => ({ fill: "none", stroke: C.ink, strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round", ...(extra || {}) });
// 線モードの面（白抜き）
const lnFill = (fill, extra) => ({ fill, stroke: C.ink, strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round", ...(extra || {}) });

// ---- 共通: どんぶり（麺・汁物） ----
const BOWL = "M7,25 C7,42 18,52 32,52 C46,52 56,42 56,25 Z";
function Bowl({ mode, broth, children }) {
  if (mode === "line") {
    return (
      <g>
        <path d="M7,25 C7,42 18,52 32,52 C46,52 56,42 56,25" {...ln()} />
        <ellipse cx="31.5" cy="25" rx="24.5" ry="7.5" {...ln()} />
        {children}
      </g>
    );
  }
  return (
    <g>
      <path d={BOWL} fill={C.ware} />
      <ellipse cx="31.5" cy="25" rx="24.5" ry="7.5" fill={C.wareSh} />
      <ellipse cx="31.5" cy="24" rx="21" ry="6.4" fill={broth} />
      {children}
      <path d="M9,30 C12,40 20,48 31.5,48" fill="none" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="2.4" strokeLinecap="round" />
    </g>
  );
}

// ---- 共通: 平皿 ----
function Plate({ mode, cy = 40, rx = 25, ry = 11 }) {
  if (mode === "line") {
    return <ellipse cx="32" cy={cy} rx={rx} ry={ry} {...ln()} />;
  }
  return (
    <g>
      <ellipse cx="32" cy={cy} rx={rx} ry={ry} fill={C.wareSh} />
      <ellipse cx="32" cy={cy - 0.6} rx={rx} ry={ry} fill={C.ware} />
      <ellipse cx="32" cy={cy - 0.6} rx={rx - 5} ry={ry - 4} fill={C.wareSh} opacity="0.7" />
    </g>
  );
}

function Steam({ mode, x = 32, y = 12 }) {
  const col = mode === "line" ? C.ink : C.steam;
  const op = mode === "line" ? 0.45 : 1;
  return (
    <g stroke={col} strokeWidth="2.4" strokeLinecap="round" fill="none" opacity={op}>
      <path d={`M${x - 7},${y + 6} c-2,-3 2,-5 0,-8`} />
      <path d={`M${x + 6},${y + 6} c-2,-3 2,-5 0,-8`} />
    </g>
  );
}

// ============ 各料理 ============
const DISHES = {
  // ラーメン
  ramen: { label: "ラーメン", tint: "#FBEAD2", draw: (mode) => (
    <g>
      <Steam mode={mode} x={32} y={8} />
      <Bowl mode={mode} broth={C.broth}>
        {mode === "line" ? (
          <g>
            <path d="M16,23 q4,-3 9,0 M22,26 q5,-3 10,0 M30,23 q5,-3 10,1" {...ln({ strokeWidth: 2.2 })} />
            <ellipse cx="22" cy="22" rx="5.2" ry="3.6" {...lnFill(C.egg, { strokeWidth: 2.2 })} />
            <circle cx="22" cy="22" r="2" fill={C.yolk} />
            <rect x="38" y="16" width="7" height="9" rx="1.5" {...lnFill(C.nori, { strokeWidth: 2.2 })} />
          </g>
        ) : (
          <g>
            <path d="M14,24 q5,-3.5 10,0 M21,21 q5,-3 10,0 M29,24 q5,-3.5 10,0" stroke={C.noodleD} strokeWidth="2" fill="none" strokeLinecap="round" />
            <ellipse cx="21.5" cy="21.5" rx="5.4" ry="3.7" fill={C.egg} />
            <circle cx="21.5" cy="21.5" r="2.2" fill={C.yolk} />
            <rect x="38" y="14.5" width="7.5" height="10" rx="1.5" fill={C.nori} />
            <circle cx="33" cy="26" r="1.4" fill={C.green} />
            <circle cx="28" cy="27" r="1.4" fill={C.greenD} />
          </g>
        )}
        <g transform="rotate(24 46 18)">
          <rect x="44" y="6" width="2.6" height="24" rx="1.3" fill={mode === "line" ? "none" : C.wood} {...(mode === "line" ? ln({ strokeWidth: 2.4 }) : {})} />
          <rect x="48" y="6" width="2.6" height="24" rx="1.3" fill={mode === "line" ? "none" : C.wood} {...(mode === "line" ? ln({ strokeWidth: 2.4 }) : {})} />
        </g>
      </Bowl>
    </g>
  )},

  // カレーライス
  curry: { label: "カレー", tint: "#F6E1C0", draw: (mode) => (
    <g>
      <Plate mode={mode} cy={38} rx={26} ry={12} />
      {mode === "line" ? (
        <g>
          <ellipse cx="32" cy="37" rx="21" ry="9" {...lnFill(C.rice, { strokeWidth: 2.4 })} />
          <path d="M32,28 A21,9 0 0,1 32,46 Z" {...lnFill(C.curry, { strokeWidth: 2.4 })} />
          <path d="M13,34 q4,-4 8,0 q4,-4 7,1" {...ln({ strokeWidth: 2 })} />
        </g>
      ) : (
        <g>
          <ellipse cx="32" cy="37.5" rx="23" ry="10" fill={C.rice} />
          <path d="M32,28 C44,28 51,33 51,37.5 C51,42 44,47 32,47.5 Z" fill={C.curry} />
          <path d="M32,30 C42,30.5 48,34 48,37.5 C48,40.5 42,44.5 32,45 Z" fill={C.curryD} opacity="0.45" />
          <circle cx="42" cy="35" r="2.4" fill="#E0913F" />
          <circle cx="38" cy="41" r="2.2" fill={C.red} />
          <circle cx="45" cy="40" r="1.8" fill={C.green} />
        </g>
      )}
    </g>
  )},

  // ハンバーグ
  hamburg: { label: "ハンバーグ", tint: "#EAD7C4", draw: (mode) => (
    <g>
      <Steam mode={mode} x={26} y={9} />
      {mode === "line" ? (
        <g>
          <ellipse cx="32" cy="45" rx="24" ry="5.5" {...ln()} />
          <ellipse cx="30" cy="38" rx="17" ry="8.5" {...lnFill(C.meat)} />
          <path d="M15,40 q15,7 30,-1" {...ln({ strokeWidth: 2.2 })} />
          <g transform="translate(45,38)"><circle cx="4" cy="4" r="3.2" {...lnFill(C.green, { strokeWidth: 2.2 })} /><path d="M4,7 v3" {...ln({ strokeWidth: 2.2 })} /></g>
        </g>
      ) : (
        <g>
          <ellipse cx="32" cy="46" rx="24" ry="6" fill={C.wareSh} />
          <ellipse cx="32" cy="45" rx="24" ry="6" fill={C.ware} />
          <ellipse cx="29" cy="40" rx="17" ry="9.5" fill={C.meatD} />
          <ellipse cx="29" cy="38" rx="16.5" ry="9" fill={C.meat} />
          <ellipse cx="27" cy="35.5" rx="12" ry="4.5" fill={C.meatT} opacity="0.85" />
          <path d="M14,41 C20,46 38,46 44,40 C45,43 43,45 40,45 C30,46 18,45 14,41 Z" fill={C.meatD} />
          <g transform="translate(46,38)">
            <circle cx="3" cy="4" r="3.4" fill={C.green} />
            <circle cx="6.5" cy="6" r="3" fill={C.greenD} />
            <rect x="3" y="6" width="2" height="4" rx="1" fill={C.greenD} />
          </g>
          <rect x="40" y="44" width="9" height="3.4" rx="1.7" fill="#E79A4A" transform="rotate(-12 44 45)" />
        </g>
      )}
    </g>
  )},

  // 寿司（にぎり）
  sushi: { label: "寿司", tint: "#FBDAC8", draw: (mode) => (
    <g>
      {mode === "line" ? (
        <g>
          <path d="M12,42 q20,-9 40,0 q-20,8 -40,0 Z" {...lnFill(C.rice)} />
          <path d="M14,33 q18,-12 36,0 q-18,9 -36,0 Z" {...lnFill(C.salmon)} />
          <path d="M22,30 q10,-3 20,0 M20,34 q12,-2 24,1" {...ln({ strokeWidth: 2, opacity: 0.7 })} />
        </g>
      ) : (
        <g>
          <path d="M11,43 q21,-10 42,0 q-21,9 -42,0 Z" fill={C.riceSh} />
          <path d="M11,41 q21,-10 42,0 q-21,9 -42,0 Z" fill={C.rice} />
          <path d="M13,34 q19,-13 38,0 q-19,10 -38,0 Z" fill={C.salmon} />
          <path d="M21,30.5 q11,-3.5 22,0" stroke="#FFD9C4" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M18,34.5 q14,-3 28,0.5" stroke="#FFD9C4" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M30,28 q2,-2 6,-1 q-3,2 -6,1 Z" fill="#FFB79A" />
        </g>
      )}
    </g>
  )},

  // 焼き魚
  fish: { label: "焼き魚", tint: "#D9E6F1", draw: (mode) => (
    <g>
      <Plate mode={mode} cy={42} rx={27} ry={7} />
      {mode === "line" ? (
        <g>
          <path d="M10,38 C18,30 40,30 47,38 C44,42 44,42 47,38 L54,33 L54,43 L47,38 C40,46 18,46 10,38 Z" {...lnFill("#C7D2DC", { strokeWidth: 2.6 })} />
          <circle cx="18" cy="37" r="1.6" fill={C.ink} />
          <path d="M26,34 v8 M33,34 v8 M40,35 v6" {...ln({ strokeWidth: 2 })} />
        </g>
      ) : (
        <g>
          <path d="M9,38 C18,29 41,29 48,38 L55,32 L55,44 L48,38 C41,47 18,47 9,38 Z" fill="#C2CDD7" />
          <path d="M9,38 C18,31 41,31 48,38 C41,45 18,45 9,38 Z" fill="#CED9E2" />
          <circle cx="17" cy="36.5" r="1.7" fill="#5A6B7A" />
          <g stroke="#9AA8B6" strokeWidth="2.2" strokeLinecap="round">
            <path d="M25,34 l-2,8" /><path d="M32,33 l-1,9" /><path d="M39,34 l1,7" />
          </g>
          <path d="M44,44 l5,2 4,-1 -1,3 -6,0 Z" fill={C.lemon} />
          <circle cx="14" cy="42" r="2.2" fill={C.green} />
        </g>
      )}
    </g>
  )},

  // 牛丼
  gyudon: { label: "牛丼", tint: "#F4E3C5", draw: (mode) => (
    <g>
      <Bowl mode={mode} broth={C.rice}>
        {mode === "line" ? (
          <g>
            <path d="M14,24 q6,-5 11,0 q5,5 11,0 q5,-4 10,1" {...ln({ strokeWidth: 2.4 })} />
            <path d="M16,27 q7,-3 14,1" {...ln({ strokeWidth: 2.2 })} />
          </g>
        ) : (
          <g>
            <path d="M13,24 q5,-4 10,0 q5,4 10,0 q5,-4 10,0 q3,3 5,1 q-2,5 -10,5 q-9,1 -15,-2 q-7,-1 -10,-4 Z" fill={C.meat} />
            <path d="M15,23 q5,-3 10,0 q5,3 10,0 q5,-3 9,0" stroke={C.meatT} strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <circle cx="40" cy="26" r="1.5" fill={C.red} />
            <circle cx="22" cy="27" r="1.4" fill={C.green} />
            <circle cx="30" cy="25" r="1.3" fill={C.greenD} />
          </g>
        )}
      </Bowl>
    </g>
  )},

  // パスタ
  pasta: { label: "パスタ", tint: "#F3DCBE", draw: (mode) => (
    <g>
      <Plate mode={mode} cy={40} rx={26} ry={12} />
      {mode === "line" ? (
        <g>
          <path d="M16,38 q4,-9 16,-9 q16,0 16,9" {...lnFill(C.noodle, { strokeWidth: 2.4 })} />
          <path d="M20,36 q3,-6 12,-6 M24,38 q4,-7 16,-5" {...ln({ strokeWidth: 2 })} />
          <circle cx="38" cy="34" r="2.4" {...lnFill(C.red, { strokeWidth: 2 })} />
        </g>
      ) : (
        <g>
          <path d="M15,39 q2,-11 17,-11 q15,0 17,11 q-17,6 -34,0 Z" fill={C.noodle} />
          <g stroke={C.noodleD} strokeWidth="1.8" fill="none" strokeLinecap="round">
            <path d="M19,37 q3,-7 13,-7" /><path d="M24,39 q5,-8 17,-6" /><path d="M17,35 q3,-5 10,-6" />
          </g>
          <circle cx="38" cy="34" r="2.6" fill={C.red} />
          <circle cx="26" cy="36" r="2.2" fill={C.red} />
          <path d="M30,28 q3,-3 6,-1 q-2,3 -6,1 Z" fill={C.green} />
        </g>
      )}
    </g>
  )},

  // ピザ
  pizza: { label: "ピザ", tint: "#FBE3B8", draw: (mode) => (
    <g>
      {mode === "line" ? (
        <g>
          <path d="M32,52 L16,18 q16,-7 32,0 Z" {...lnFill(C.cheese)} />
          <path d="M16,18 q16,-7 32,0 l-2,5 q-14,-6 -28,0 Z" {...lnFill(C.crust, { strokeWidth: 2.4 })} />
          <circle cx="27" cy="32" r="2.6" {...lnFill(C.red, { strokeWidth: 2 })} />
          <circle cx="36" cy="40" r="2.6" {...lnFill(C.red, { strokeWidth: 2 })} />
        </g>
      ) : (
        <g>
          <path d="M32,53 L15,17 q17,-7 34,0 Z" fill={C.cheese} />
          <path d="M15,17 q17,-7 34,0 l-2.5,6 q-15,-6 -29,0 Z" fill={C.crust} />
          <circle cx="26" cy="31" r="3" fill={C.red} />
          <circle cx="37" cy="38" r="3" fill={C.red} />
          <circle cx="30" cy="44" r="2.6" fill={C.red} />
          <path d="M33,30 q2,-2 4,-1 q-2,2 -4,1 Z" fill={C.greenD} />
          <circle cx="24" cy="40" r="1.6" fill={C.greenD} />
        </g>
      )}
    </g>
  )},

  // からあげ
  karaage: { label: "からあげ", tint: "#F2DCB0", draw: (mode) => (
    <g>
      <Plate mode={mode} cy={43} rx={25} ry={8} />
      {mode === "line" ? (
        <g>
          <path d="M16,36 q-2,-7 6,-8 q9,-2 9,6 q1,6 -7,7 q-7,1 -8,-5 Z" {...lnFill(C.fry)} />
          <path d="M34,40 q-2,-6 5,-7 q8,-1 8,5 q1,6 -6,6 q-6,1 -7,-4 Z" {...lnFill(C.fry)} />
          <path d="M42,46 l5,2 4,-1 -1,3 -6,0 Z" {...lnFill(C.lemon, { strokeWidth: 2.2 })} />
        </g>
      ) : (
        <g>
          <path d="M15,37 q-2,-8 7,-9 q10,-2 10,6 q1,7 -8,8 q-8,1 -9,-5 Z" fill={C.fryD} />
          <path d="M15,35 q-2,-8 7,-9 q10,-2 10,6 q1,7 -8,8 q-8,1 -9,-5 Z" fill={C.fry} />
          <path d="M33,41 q-2,-7 6,-8 q9,-1 9,6 q0,6 -7,6 q-7,1 -8,-4 Z" fill={C.fryD} />
          <path d="M33,39 q-2,-7 6,-8 q9,-1 9,6 q0,6 -7,6 q-7,1 -8,-4 Z" fill={C.fry} />
          <circle cx="22" cy="30" r="1.6" fill={C.fryD} opacity="0.6" />
          <circle cx="40" cy="35" r="1.6" fill={C.fryD} opacity="0.6" />
          <path d="M41,46 l6,2 4,-1 -1,4 -7,-1 Z" fill={C.lemon} />
          <circle cx="13" cy="41" r="2.2" fill={C.green} />
        </g>
      )}
    </g>
  )},

  // サラダ
  salad: { label: "サラダ", tint: "#DDF0CE", draw: (mode) => (
    <g>
      {mode === "line" ? (
        <g>
          <path d="M10,33 C10,46 20,52 32,52 C44,52 54,46 54,33" {...ln()} />
          <path d="M10,33 q22,9 44,0" {...ln()} />
          <path d="M18,30 q5,-7 11,-3 M30,29 q6,-6 12,-1 M24,33 q5,-5 11,-1" {...lnFill(C.green, { strokeWidth: 2.2 })} />
          <circle cx="38" cy="32" r="2.6" {...lnFill(C.red, { strokeWidth: 2 })} />
        </g>
      ) : (
        <g>
          <path d="M9,32 C9,45 19,52 32,52 C45,52 55,45 55,32 Z" fill="#EAF6E1" />
          <path d="M9,32 q23,10 46,0 q-23,8 -46,0 Z" fill="#D7EFC6" />
          <g>
            <ellipse cx="20" cy="30" rx="7" ry="5" fill={C.green} transform="rotate(-18 20 30)" />
            <ellipse cx="34" cy="28" rx="8" ry="5.5" fill={C.greenD} transform="rotate(12 34 28)" />
            <ellipse cx="44" cy="31" rx="6.5" ry="4.5" fill={C.green} transform="rotate(-10 44 31)" />
            <ellipse cx="27" cy="33" rx="6" ry="4" fill={C.greenD} transform="rotate(20 27 33)" />
          </g>
          <circle cx="38" cy="33" r="2.8" fill={C.red} />
          <circle cx="22" cy="35" r="2.4" fill={C.red} />
          <circle cx="31" cy="31" r="2" fill={C.yolk} />
          <circle cx="46" cy="35" r="2" fill={C.yolk} />
        </g>
      )}
    </g>
  )},

  // おにぎり
  onigiri: { label: "おにぎり", tint: "#E7EDF2", draw: (mode) => (
    <g>
      {mode === "line" ? (
        <g>
          <path d="M32,14 C36,14 38,18 50,40 C52,44 49,50 44,50 L20,50 C15,50 12,44 14,40 C26,18 28,14 32,14 Z" {...lnFill(C.rice)} />
          <path d="M19,38 L45,38 L45,50 L19,50 Z" {...lnFill(C.nori, { strokeWidth: 2.4 })} />
          <circle cx="32" cy="30" r="3" {...lnFill(C.red, { strokeWidth: 2 })} />
        </g>
      ) : (
        <g>
          <path d="M32,13 C36,13 38,17 50,40 C52,44 49,50 44,50 L20,50 C15,50 12,44 14,40 C26,17 28,13 32,13 Z" fill={C.riceSh} />
          <path d="M32,13 C35.5,13 37.5,17 49,39.5 C51,43.5 48,49 43.5,49 L20.5,49 C16,49 13,43.5 15,39.5 C26.5,17 28.5,13 32,13 Z" fill={C.rice} />
          <path d="M18,37 L46,37 C46,46 44,49 43,49 L21,49 C20,49 18,46 18,37 Z" fill={C.nori} />
          <circle cx="32" cy="28" r="3.2" fill={C.red} />
          <ellipse cx="26" cy="24" rx="2.4" ry="3.4" fill="#FFFFFF" opacity="0.5" transform="rotate(-20 26 24)" />
        </g>
      )}
    </g>
  )},

  // 餃子
  gyoza: { label: "餃子", tint: "#EDE2C6", draw: (mode) => (
    <g>
      <Plate mode={mode} cy={43} rx={26} ry={8} />
      {mode === "line" ? (
        <g>
          <path d="M11,34 q9,-12 22,-7 q12,5 5,12 q-15,5 -27,-5 Z" {...lnFill("#EBD9AE")} />
          <path d="M22,42 q9,-11 22,-6 q11,5 4,11 q-15,5 -26,-5 Z" {...lnFill("#EBD9AE")} />
          <path d="M14,32 l4,-3 4,2 4,-3 4,2 4,-3" {...ln({ strokeWidth: 2 })} />
        </g>
      ) : (
        <g>
          {[[ "translate(0,0)" ], ["translate(13,7)"]].map((t, i) => (
            <g key={i} transform={t[0]}>
              <path d="M10,33 q9,-13 22,-8 q13,5 6,13 q-16,6 -28,-5 Z" fill={C.crust} />
              <path d="M10,33 q9,-13 22,-8 q13,5 6,12 q-16,5 -28,-4 Z" fill="#EAD8AD" />
              <path d="M37,38 q-14,5 -27,-5 q14,8 27,5 Z" fill={C.fryD} opacity="0.55" />
              <path d="M13,30 l3.5,-3 3.5,2 3.5,-3 3.5,2 3.5,-3 3.5,2" stroke="#D8C089" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ))}
        </g>
      )}
    </g>
  )},
};

const C2 = C;

// 追加カラー
const X = {
  ink: C2.ink,
  noodleW: "#F6F0E0", noodleWD: "#E0D6BC",  // 白い麺(うどん)
  sobaN: "#9A7B57", sobaND: "#7C5F3F",       // そば
  yaki: "#A9712F", yakiD: "#83531F",          // 焼きそば/ソース
  egg: "#FBC53D", eggW: "#FFF4DE", eggD: "#E5A92B",
  katsu: "#D79A52", katsuD: "#B97A33", katsuM: "#F4D8AB",
  cab: "#CDE7B0", cabD: "#A9D183",
  ketchup: "#E0503C",
  tako: "#E07B6B", takoBall: "#C98A4A", takoBallD: "#A56B30",
  bonito: "#E7B488",
  daikon: "#F3EEE3", konjac: "#B8A98E",
  pot: "#5E6B78", potD: "#3F4A55", potRim: "#7D8995",
  miso: "#C8893E", wakame: "#3C5A3E",
  tofu: "#F7F4E8", tofuSh: "#E5E0CC",
  pod: "#7FB85A", podD: "#5E9A3E",
  steakM: "#7E4A2A", steakMD: "#5E3420", steakSe: "#A9683C", sear: "#3E2A1C",
  shumai: "#F0E3B8", shumaiW: "#E6D49A", pea: "#67A93E",
};

const DISHES2 = {
  udon: { label: "うどん", tint: "#EAF1E8", draw: (m) => (
    <g>
      <Steam mode={m} x={32} y={8} />
      <Bowl mode={m} broth="#EBD9A8">
        {m === "line" ? (
          <g><path d="M15,24 q5,-4 10,0 M21,21 q5,-3 10,0 M29,24 q5,-4 10,0" {...ln({ strokeWidth: 2.4 })} />
            <rect x="38" y="16" width="6" height="8" rx="1.5" {...lnFill(X.yaki, { strokeWidth: 2 })} /></g>
        ) : (
          <g><path d="M14,24 q5,-4 10,0 M21,21 q5,-3 10,0 M29,24 q5,-4 10,0 M36,23 q4,-3 9,1" stroke={X.noodleWD} strokeWidth="3.2" fill="none" strokeLinecap="round" />
            <rect x="37" y="14.5" width="7" height="9" rx="2" fill={X.yaki} />
            <circle cx="24" cy="27" r="1.5" fill={X.pod} /></g>
        )}
      </Bowl>
    </g>
  )},

  soba: { label: "そば", tint: "#E4DECF", draw: (m) => (
    <g>
      {m === "line" ? (
        <g><rect x="9" y="30" width="34" height="20" rx="3" {...lnFill("#fff")} />
          <path d="M14,40 q6,-5 12,0 q5,4 11,-1" {...ln({ strokeWidth: 2.4 })} />
          <ellipse cx="51" cy="44" rx="7" ry="5" {...lnFill("#fff")} /></g>
      ) : (
        <g><rect x="8" y="29" width="35" height="21" rx="3" fill="#E7DFCB" />
          <rect x="8" y="29" width="35" height="4" rx="2" fill="#C9BE9E" />
          <g stroke={X.sobaN} strokeWidth="3" fill="none" strokeLinecap="round">
            <path d="M13,41 q6,-6 12,-1" /><path d="M22,43 q6,-6 13,-1" /><path d="M14,38 q5,-5 11,-2" /></g>
          <rect x="13" y="27" width="26" height="3" rx="1.5" fill="#3C4650" />
          <ellipse cx="51" cy="45" rx="7.5" ry="5.5" fill="#fff" />
          <ellipse cx="51" cy="44.5" rx="5.5" ry="3.8" fill={X.yakiD} /></g>
      )}
    </g>
  )},

  yakisoba: { label: "焼きそば", tint: "#EDD6B6", draw: (m) => (
    <g>
      <Plate mode={m} cy={40} rx={26} ry={11} />
      {m === "line" ? (
        <g><path d="M16,38 q4,-9 16,-9 q16,0 16,9" {...lnFill(X.yaki, { strokeWidth: 2.4 })} />
          <path d="M20,36 q3,-6 12,-6" {...ln({ strokeWidth: 2 })} />
          <rect x="36" y="30" width="5" height="3" rx="1.5" {...ln({ strokeWidth: 2 })} /></g>
      ) : (
        <g><path d="M15,39 q2,-11 17,-11 q15,0 17,11 q-17,6 -34,0 Z" fill={X.yaki} />
          <g stroke={X.yakiD} strokeWidth="1.8" fill="none" strokeLinecap="round">
            <path d="M19,37 q3,-7 13,-7" /><path d="M24,39 q5,-8 17,-6" /></g>
          <rect x="34" y="31" width="6" height="2.6" rx="1.3" fill={X.ketchup} transform="rotate(-12 37 32)" />
          <rect x="22" y="34" width="6" height="2.6" rx="1.3" fill={X.ketchup} transform="rotate(10 25 35)" />
          <circle cx="30" cy="33" r="1.6" fill={X.cabD} /><circle cx="40" cy="37" r="1.4" fill={X.pod} /></g>
      )}
    </g>
  )},

  friedrice: { label: "チャーハン", tint: "#F4E6C2", draw: (m) => (
    <g>
      <Plate mode={m} cy={42} rx={25} ry={9} />
      {m === "line" ? (
        <g><path d="M14,40 q3,-13 18,-13 q15,0 18,13" {...lnFill(C2.rice, { strokeWidth: 2.4 })} />
          <circle cx="26" cy="34" r="1.4" {...ln({ strokeWidth: 1.6 })} /><circle cx="36" cy="36" r="1.4" {...ln({ strokeWidth: 1.6 })} /></g>
      ) : (
        <g><path d="M13,41 q2,-15 19,-15 q17,0 19,15 q-19,6 -38,0 Z" fill={C2.rice} />
          <g><circle cx="24" cy="33" r="1.6" fill={X.eggD} /><circle cx="33" cy="30" r="1.6" fill={X.pod} />
          <circle cx="40" cy="35" r="1.6" fill={X.ketchup} /><circle cx="30" cy="37" r="1.5" fill={X.eggD} />
          <circle cx="37" cy="40" r="1.4" fill={X.pod} /><circle cx="20" cy="38" r="1.4" fill={X.katsuD} />
          <circle cx="44" cy="39" r="1.3" fill={X.eggD} /></g></g>
      )}
    </g>
  )},

  omurice: { label: "オムライス", tint: "#FBE2B0", draw: (m) => (
    <g>
      <Plate mode={m} cy={43} rx={26} ry={8} />
      {m === "line" ? (
        <g><path d="M14,42 q4,-16 18,-16 q14,0 18,16 Z" {...lnFill(X.egg, { strokeWidth: 2.4 })} />
          <path d="M30,30 q4,8 0,14" {...ln({ strokeWidth: 2.4, stroke: X.ketchup })} /></g>
      ) : (
        <g><path d="M13,43 q4,-18 19,-18 q15,0 19,18 q-19,5 -38,0 Z" fill={X.egg} />
          <path d="M13,43 q4,-18 19,-18 q4,2 6,7 q-12,3 -25,11 Z" fill={X.eggW} opacity="0.45" />
          <path d="M31,28 q5,6 1,13 q-2,2 1,4" stroke={X.ketchup} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M26,33 q3,5 0,9" stroke={X.ketchup} strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.8" /></g>
      )}
    </g>
  )},

  katsudon: { label: "カツ丼", tint: "#F2DBB0", draw: (m) => (
    <g>
      <Bowl mode={m} broth={C2.rice}>
        {m === "line" ? (
          <g><path d="M14,20 l5,-4 5,3 5,-4 5,3 5,-3" {...ln({ strokeWidth: 2.4 })} />
            <path d="M15,26 q9,4 18,0" {...lnFill(X.egg, { strokeWidth: 2 })} /></g>
        ) : (
          <g><path d="M13,24 q5,-3 9,2 q5,-4 9,1 q5,-4 9,2 q-5,5 -13,5 q-9,0 -14,-5 Z" fill={X.egg} />
            {[14,24,34].map((x,i)=><path key={i} d={`M${x},19 l4,-3 4,3 -1,5 -7,0 Z`} fill={X.katsu} stroke={X.katsuD} strokeWidth="1" />)}
            <circle cx="20" cy="27" r="1.4" fill={X.pod} /><circle cx="32" cy="26" r="1.4" fill={X.pod} /></g>
        )}
      </Bowl>
    </g>
  )},

  oyakodon: { label: "親子丼", tint: "#F6E2A8", draw: (m) => (
    <g>
      <Bowl mode={m} broth={C2.rice}>
        {m === "line" ? (
          <g><path d="M14,24 q9,-6 18,0 q5,4 0,5 q-12,4 -20,-1 Z" {...lnFill(X.egg, { strokeWidth: 2.2 })} /></g>
        ) : (
          <g><path d="M13,24 q10,-6 20,-1 q5,3 0,6 q-13,4 -22,-1 Z" fill={X.egg} />
            <path d="M16,22 q8,-3 15,0" stroke={X.eggW} strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.7" />
            <ellipse cx="22" cy="25" rx="3.5" ry="2.6" fill={X.katsu} /><ellipse cx="31" cy="24" rx="3" ry="2.2" fill={X.katsu} />
            <circle cx="36" cy="26" r="1.4" fill={X.pod} /></g>
        )}
      </Bowl>
    </g>
  )},

  tendon: { label: "天丼", tint: "#EFD7A8", draw: (m) => (
    <g>
      <Bowl mode={m} broth={C2.rice}>
        {m === "line" ? (
          <g><path d="M16,24 q4,-10 8,-10 q3,5 1,11" {...lnFill(X.katsuM, { strokeWidth: 2.2 })} />
            <path d="M28,24 q5,-9 9,-8 q2,5 -1,10" {...lnFill(X.katsuM, { strokeWidth: 2.2 })} /></g>
        ) : (
          <g><path d="M15,25 q4,-12 9,-11 q3,1 3,4 q-1,7 -4,10 Z" fill={X.katsu} />
            <path d="M24,15 q5,-1 5,3" stroke={X.salmon||"#FF9A72"} strokeWidth="3" strokeLinecap="round" />
            <path d="M28,26 q5,-11 10,-10 q3,1 2,5 q-2,6 -5,8 Z" fill={X.katsuD} />
            <path d="M40,24 q3,-8 7,-7" stroke={X.cabD} strokeWidth="3" fill="none" strokeLinecap="round" /></g>
        )}
      </Bowl>
    </g>
  )},

  unadon: { label: "うな重", tint: "#E2C49A", draw: (m) => (
    <g>
      {m === "line" ? (
        <g><rect x="9" y="26" width="46" height="24" rx="4" {...lnFill("#fff")} />
          <rect x="15" y="31" width="34" height="14" rx="3" {...lnFill(X.katsuD, { strokeWidth: 2.4 })} />
          <path d="M22,38 h22" {...ln({ strokeWidth: 2 })} /></g>
      ) : (
        <g><rect x="8" y="25" width="48" height="26" rx="5" fill="#3C4650" />
          <rect x="10" y="27" width="44" height="22" rx="4" fill="#5A2E1C" />
          <rect x="14" y="30" width="36" height="16" rx="3" fill={X.katsuD} />
          <rect x="14" y="30" width="36" height="16" rx="3" fill="none" />
          <g stroke="#6E3A20" strokeWidth="2" fill="none">
            <path d="M14,33 h36" /><path d="M14,38 h36" /><path d="M14,43 h36" /></g>
          <path d="M18,30 v16 M30,30 v16 M42,30 v16" stroke={X.sear} strokeWidth="1.6" opacity="0.5" /></g>
      )}
    </g>
  )},

  nikujaga: { label: "肉じゃが", tint: "#F0DCB8", draw: (m) => (
    <g>
      <Bowl mode={m} broth="#D8A65E">
        {m === "line" ? (
          <g><circle cx="22" cy="22" r="5" {...lnFill(C2.rice, { strokeWidth: 2.2 })} />
            <circle cx="34" cy="24" r="4" {...lnFill(X.steakM, { strokeWidth: 2.2 })} /></g>
        ) : (
          <g><circle cx="21" cy="22" r="5.4" fill={C2.rice} /><circle cx="38" cy="21" r="4.6" fill={C2.rice} />
            <path d="M28,25 q5,-4 9,0 q-4,4 -9,0 Z" fill={X.steakM} />
            <rect x="24" y="18" width="6" height="3" rx="1.5" fill="#E0913F" transform="rotate(20 27 19)" />
            <circle cx="44" cy="25" r="1.6" fill={X.pod} /></g>
        )}
      </Bowl>
    </g>
  )},

  tonkatsu: { label: "とんかつ", tint: "#EAD8B4", draw: (m) => (
    <g>
      <Plate mode={m} cy={43} rx={26} ry={8} />
      {m === "line" ? (
        <g><g transform="rotate(-14 30 36)">{[0,1,2,3].map(i=>(
            <path key={i} d={`M${16+i*7},28 l5,0 1,14 -6,0 Z`} {...lnFill(X.katsu, { strokeWidth: 2 })} />))}</g>
          <path d="M44,42 q5,-4 8,-1" {...ln({ strokeWidth: 2, stroke: X.cabD })} /></g>
      ) : (
        <g><g transform="rotate(-14 30 36)">{[0,1,2,3].map(i=>(
            <g key={i}><path d={`M${15+i*7},27 l6,0 1,15 -7,0 Z`} fill={X.katsuD} />
              <path d={`M${15+i*7},27 l6,0 0.5,4 -7,0 Z`} fill={X.katsuM} />
              <path d={`M${16+i*7},32 l5,0 0.7,9 -6,0 Z`} fill="#F2D2A0" /></g>))}</g>
          <g transform="translate(40,38)"><path d="M0,3 q4,-5 8,-2 q3,4 -2,6 q-5,2 -6,-4 Z" fill={X.cab} />
            <path d="M2,1 q4,-3 7,0" stroke={X.cabD} strokeWidth="1.6" fill="none" /></g></g>
      )}
    </g>
  )},

  tempura: { label: "天ぷら", tint: "#F2E0B6", draw: (m) => (
    <g>
      <Plate mode={m} cy={44} rx={26} ry={7} />
      {m === "line" ? (
        <g><path d="M20,42 q-4,-16 4,-22 q4,8 3,22" {...lnFill(X.katsuM, { strokeWidth: 2.2 })} />
          <ellipse cx="38" cy="36" rx="8" ry="6" {...lnFill(X.katsuM, { strokeWidth: 2.2 })} /></g>
      ) : (
        <g><path d="M19,43 q-5,-18 4,-25 q2,1 2,3 q1,12 -1,22 Z" fill={X.katsu} />
          <path d="M22,20 q3,-2 4,1" stroke={X.tako} strokeWidth="3.4" strokeLinecap="round" />
          <ellipse cx="38" cy="37" rx="9" ry="6.5" fill={X.katsu} />
          <g fill={X.katsuM}><circle cx="20" cy="30" r="1.4" /><circle cx="24" cy="36" r="1.4" /><circle cx="36" cy="35" r="1.5" /><circle cx="42" cy="38" r="1.5" /></g></g>
      )}
    </g>
  )},

  yakitori: { label: "焼き鳥", tint: "#EBD3A8", draw: (m) => (
    <g>
      {m === "line" ? (
        <g><path d="M10,50 L46,18" {...ln({ strokeWidth: 2.4 })} />
          {[0,1,2].map(i=><rect key={i} x={20+i*0} y={0} width="11" height="9" rx="3" transform={`translate(${14+i*9},${36-i*9}) rotate(-42)`} {...lnFill(X.katsu, { strokeWidth: 2.2 })} />)}</g>
      ) : (
        <g><path d="M9,51 L48,17" stroke={X.wood||"#CBA06A"} strokeWidth="3" strokeLinecap="round" />
          {[0,1,2].map(i=>(<g key={i} transform={`translate(${13+i*9.5},${37-i*9.5}) rotate(-42)`}>
            <rect x="0" y="0" width="12" height="10" rx="4" fill={X.katsuD} />
            <rect x="0" y="0" width="12" height="5" rx="3" fill={X.katsu} /></g>))}</g>
      )}
    </g>
  )},

  takoyaki: { label: "たこ焼き", tint: "#E8C99B", draw: (m) => (
    <g>
      {m === "line" ? (
        <g><path d="M8,40 q24,8 48,0 l-3,8 q-21,6 -42,0 Z" {...lnFill("#fff")} />
          {[[18,34],[32,32],[46,34],[25,40],[39,40]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="5.5" {...lnFill(X.takoBall, { strokeWidth: 2 })} />)}</g>
      ) : (
        <g><path d="M7,40 q25,9 50,0 l-3,9 q-22,6 -44,0 Z" fill="#6E5236" />
          <path d="M7,40 q25,9 50,0 l-1,3 q-24,8 -48,0 Z" fill="#8A6A44" />
          {[[18,36],[32,33],[46,36],[25,42],[39,42]].map(([x,y],i)=>(<g key={i}>
            <circle cx={x} cy={y} r="6" fill={X.takoBallD} /><circle cx={x} cy={y-0.6} r="6" fill={X.takoBall} />
            <path d={`M${x-3},${y-2} q3,5 6,0`} stroke={X.ketchup} strokeWidth="1.6" fill="none" />
            <circle cx={x+1} cy={y+2} r="1" fill="#fff" opacity="0.6" /></g>))}</g>
      )}
    </g>
  )},

  okonomiyaki: { label: "お好み焼き", tint: "#E7C49A", draw: (m) => (
    <g>
      <Plate mode={m} cy={42} rx={24} ry={9} />
      {m === "line" ? (
        <g><ellipse cx="32" cy="36" rx="20" ry="13" {...lnFill(X.katsu, { strokeWidth: 2.4 })} />
          <path d="M20,33 q12,4 24,0" {...ln({ strokeWidth: 2 })} /></g>
      ) : (
        <g><ellipse cx="32" cy="37" rx="21" ry="14" fill={X.katsuD} />
          <ellipse cx="32" cy="35.5" rx="21" ry="13.5" fill={X.katsu} />
          <path d="M16,33 q16,6 32,0 M18,40 q14,5 28,0" stroke={X.yakiD} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M24,28 q8,-3 16,0" stroke="#5C7A4A" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <g fill={X.bonito} opacity="0.9"><path d="M22,30 q3,-4 7,-2 q-3,4 -7,2 Z" /><path d="M36,29 q4,-3 7,0 q-4,3 -7,0 Z" /></g>
          <circle cx="30" cy="36" r="1.6" fill={X.ketchup} /></g>
      )}
    </g>
  )},

  oden: { label: "おでん", tint: "#E7DCC2", draw: (m) => (
    <g>
      <Bowl mode={m} broth="#E3D4AE">
        {m === "line" ? (
          <g><rect x="14" y="14" width="10" height="11" rx="2" {...lnFill(X.daikon, { strokeWidth: 2.2 })} />
            <ellipse cx="34" cy="22" rx="6" ry="5" {...lnFill(X.eggW, { strokeWidth: 2.2 })} />
            <path d="M44,14 l4,4 -4,4 -4,-4 Z" {...lnFill(X.konjac, { strokeWidth: 2 })} /></g>
        ) : (
          <g><path d="M15,25 L23,25 L23,12 L15,12 Z" fill={X.daikon} />
            <ellipse cx="34" cy="21" rx="6.2" ry="5.4" fill={X.eggW} /><circle cx="34" cy="21" r="2.4" fill={X.egg} />
            <path d="M44,13 l5,5 -5,5 -5,-5 Z" fill={X.konjac} />
            <path d="M19,11 v-3 M34,11 v-4 M44,9 v-3" stroke={X.wood||"#CBA06A"} strokeWidth="2" strokeLinecap="round" /></g>
        )}
      </Bowl>
    </g>
  )},

  nabe: { label: "鍋", tint: "#DCE3E8", draw: (m) => (
    <g>
      <Steam mode={m} x={32} y={8} />
      {m === "line" ? (
        <g><path d="M10,28 C10,44 22,52 32,52 C42,52 54,44 54,28 Z" {...ln()} />
          <ellipse cx="32" cy="28" rx="23" ry="7" {...ln()} />
          <line x1="6" y1="28" x2="12" y2="28" {...ln()} /><line x1="52" y1="28" x2="58" y2="28" {...ln()} /></g>
      ) : (
        <g><path d="M9,28 C9,44 21,52 32,52 C43,52 55,44 55,28 Z" fill={X.pot} />
          <path d="M9,28 C9,40 20,48 32,48 C44,48 55,40 55,28 Z" fill={X.potD} opacity="0.5" />
          <ellipse cx="32" cy="28" rx="23" ry="7" fill={X.potRim} />
          <ellipse cx="32" cy="27" rx="20" ry="5.6" fill="#E9D9B0" />
          <circle cx="24" cy="26" r="3" fill={X.steakM} /><circle cx="34" cy="27" r="2.6" fill={X.cab} />
          <circle cx="40" cy="25" r="2.4" fill={X.ketchup} /><circle cx="29" cy="28" r="2.2" fill={X.eggW} />
          <rect x="3" y="26" width="8" height="4" rx="2" fill={X.potRim} /><rect x="53" y="26" width="8" height="4" rx="2" fill={X.potRim} /></g>
      )}
    </g>
  )},

  misosoup: { label: "みそ汁", tint: "#E6D3B0", draw: (m) => (
    <g>
      <Steam mode={m} x={32} y={12} />
      {m === "line" ? (
        <g><path d="M14,30 C14,42 22,48 32,48 C42,48 50,42 50,30 Z" {...ln()} />
          <ellipse cx="32" cy="30" rx="18" ry="5.5" {...ln()} /></g>
      ) : (
        <g><path d="M13,30 C13,42 21,48 32,48 C43,48 51,42 51,30 Z" fill="#7A3B22" />
          <path d="M13,30 C13,40 21,46 32,46 C43,46 51,40 51,30 Z" fill="#8E4A2C" opacity="0.5" />
          <ellipse cx="32" cy="30" rx="18" ry="5.5" fill="#5A2C1A" />
          <ellipse cx="32" cy="29.5" rx="15.5" ry="4.4" fill={X.miso} />
          <rect x="27" y="27" width="4" height="4" rx="1" fill={X.tofu} /><rect x="34" y="28.5" width="3.5" height="3.5" rx="1" fill={X.tofu} />
          <path d="M22,29 q2,-2 4,0" stroke={X.wakame} strokeWidth="2" fill="none" strokeLinecap="round" /></g>
      )}
    </g>
  )},

  rice: { label: "ごはん", tint: "#EFEFE6", draw: (m) => (
    <g>
      <Bowl mode={m} broth={C2.rice}>
        {m === "line" ? (
          <path d="M14,24 q18,-9 36,0" {...ln({ strokeWidth: 2 })} />
        ) : (
          <g><path d="M13,24 q19,-10 38,0 q-19,7 -38,0 Z" fill={C2.rice} />
            <g fill={C2.riceSh} opacity="0.7"><circle cx="22" cy="22" r="1.3" /><circle cx="30" cy="20" r="1.3" /><circle cx="38" cy="22" r="1.3" /><circle cx="34" cy="23.5" r="1.2" /><circle cx="26" cy="23.5" r="1.2" /></g></g>
        )}
      </Bowl>
    </g>
  )},

  tamagoyaki: { label: "卵焼き", tint: "#FBE6B0", draw: (m) => (
    <g>
      <Plate mode={m} cy={44} rx={24} ry={7} />
      {m === "line" ? (
        <g>{[0,1,2].map(i=><rect key={i} x={14+i*12} y="28" width="11" height="14" rx="2.5" {...lnFill(X.egg, { strokeWidth: 2.2 })} />)}
          <path d="M19,30 q0,5 0,10 M31,30 q0,5 0,10 M43,30 q0,5 0,10" {...ln({ strokeWidth: 1.6, opacity: 0.5 })} /></g>
      ) : (
        <g>{[0,1,2].map(i=>(<g key={i}><rect x={13+i*12} y="27" width="12" height="15" rx="3" fill={X.eggD} />
          <rect x={13+i*12} y="27" width="12" height="15" rx="3" fill={X.egg} />
          <path d={`M${19+i*12},28 q0,6 0,13`} stroke={X.eggD} strokeWidth="1.6" opacity="0.6" />
          <path d={`M${16+i*12},31 q0,4 0,8`} stroke={X.eggD} strokeWidth="1.4" opacity="0.4" /></g>))}</g>
      )}
    </g>
  )},

  natto: { label: "納豆", tint: "#E6D9B2", draw: (m) => (
    <g>
      <Bowl mode={m} broth="#C9B57E">
        {m === "line" ? (
          <g>{[[20,22],[28,24],[36,22],[24,25],[32,26]].map(([x,y],i)=><ellipse key={i} cx={x} cy={y} rx="3" ry="2.2" {...lnFill("#A98A4A", { strokeWidth: 1.8 })} />)}
            <path d="M18,20 q14,8 28,-2" {...ln({ strokeWidth: 1.4, opacity: 0.5 })} /></g>
        ) : (
          <g>{[[20,22],[28,23],[36,21],[24,25],[32,25],[40,24],[26,20]].map(([x,y],i)=>(<g key={i}>
            <ellipse cx={x} cy={y} rx="3.2" ry="2.4" fill="#9A7B3E" /><ellipse cx={x} cy={y-0.4} rx="3.2" ry="2.4" fill="#B89A52" /></g>))}
            <g stroke="#E8DCBC" strokeWidth="1" fill="none" opacity="0.8"><path d="M22,21 q6,5 12,2" /><path d="M28,24 q6,3 11,-1" /></g></g>
        )}
      </Bowl>
    </g>
  )},

  tofu: { label: "冷奴", tint: "#E9E5D4", draw: (m) => (
    <g>
      <Plate mode={m} cy={44} rx={25} ry={7} />
      {m === "line" ? (
        <g><path d="M18,40 L32,32 L46,40 L46,30 L32,22 L18,30 Z" {...lnFill(X.tofu, { strokeWidth: 2.4 })} />
          <path d="M32,32 L32,22 M18,30 L32,32 L46,30" {...ln({ strokeWidth: 2 })} />
          <ellipse cx="32" cy="26" rx="3" ry="1.6" {...ln({ strokeWidth: 1.6, stroke: X.pod })} /></g>
      ) : (
        <g><path d="M18,40 L32,33 L46,40 L46,30 L32,23 L18,30 Z" fill={X.tofuSh} />
          <path d="M18,30 L32,37 L46,30 L46,40 L32,33 Z" fill={X.tofu} />
          <path d="M18,30 L32,23 L46,30 L32,37 Z" fill="#FFFDF4" />
          <ellipse cx="31" cy="27" rx="3.4" ry="1.8" fill={X.pod} />
          <circle cx="35" cy="30" r="1.4" fill={X.wakame} /></g>
      )}
    </g>
  )},

  edamame: { label: "枝豆", tint: "#DCEEC4", draw: (m) => (
    <g>
      {m === "line" ? (
        <g><path d="M14,40 q-3,-12 8,-16 q10,-3 12,5 q2,9 -7,13 q-9,3 -13,-2 Z" {...lnFill(X.pod, { strokeWidth: 2.4 })} />
          <circle cx="22" cy="32" r="2" {...ln({ strokeWidth: 1.6 })} /><circle cx="28" cy="34" r="2" {...ln({ strokeWidth: 1.6 })} />
          <path d="M30,46 q8,-10 18,-12" {...ln({ strokeWidth: 2.4 })} /></g>
      ) : (
        <g><path d="M30,47 q9,-12 20,-13" stroke={X.podD} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M13,41 q-4,-14 9,-18 q11,-3 13,6 q2,10 -8,14 q-10,3 -14,-2 Z" fill={X.podD} />
          <path d="M13,39 q-4,-14 9,-18 q11,-3 13,6 q2,10 -8,14 q-10,3 -14,-2 Z" fill={X.pod} />
          <ellipse cx="21" cy="31" rx="2.4" ry="2.8" fill={X.podD} opacity="0.5" />
          <ellipse cx="27" cy="34" rx="2.4" ry="2.8" fill={X.podD} opacity="0.5" />
          <path d="M16,28 q6,-4 14,-3" stroke="#A6D67E" strokeWidth="1.6" fill="none" /></g>
      )}
    </g>
  )},

  shumai: { label: "シュウマイ", tint: "#EDE3BC", draw: (m) => (
    <g>
      <Plate mode={m} cy={44} rx={25} ry={7} />
      {m === "line" ? (
        <g>{[[22,36],[36,36],[29,30]].map(([x,y],i)=><path key={i} d={`M${x-7},${y+5} q-1,-11 7,-11 q8,0 7,11 Z`} {...lnFill(X.shumai, { strokeWidth: 2.2 })} />)}</g>
      ) : (
        <g>{[[22,38],[37,38],[29,31]].map(([x,y],i)=>(<g key={i}>
          <path d={`M${x-7.5},${y+6} q-1,-13 7.5,-13 q8.5,0 7.5,13 Z`} fill={X.shumaiW} />
          <path d={`M${x-7.5},${y-2} q1,-5 7.5,-5 q6.5,0 7.5,5 q-7.5,4 -15,0 Z`} fill={X.shumai} />
          <circle cx={x} cy={y-5} r="1.8" fill={X.pea} /></g>))}</g>
      )}
    </g>
  )},

  steak: { label: "ステーキ", tint: "#E4C9B0", draw: (m) => (
    <g>
      <Plate mode={m} cy={43} rx={27} ry={8} />
      {m === "line" ? (
        <g><path d="M14,38 q0,-9 12,-10 q16,-1 22,5 q3,6 -5,9 q-16,5 -26,1 q-4,-2 -3,-5 Z" {...lnFill(X.steakM, { strokeWidth: 2.4 })} />
          <path d="M20,34 q12,-2 22,2" {...ln({ strokeWidth: 1.6, opacity: 0.5 })} /></g>
      ) : (
        <g><path d="M13,39 q0,-11 13,-12 q18,-1 24,6 q3,7 -6,10 q-18,5 -28,1 q-4,-2 -3,-5 Z" fill={X.steakMD} />
          <path d="M13,37 q0,-11 13,-12 q18,-1 24,6 q3,7 -6,10 q-18,5 -28,1 q-4,-2 -3,-5 Z" fill={X.steakM} />
          <path d="M20,30 q14,-2 26,3" stroke={X.steakSe} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
          <path d="M18,36 q14,-1 28,3" stroke={X.sear} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.4" />
          <path d="M44,40 q4,-4 8,-2" stroke={X.cabD} strokeWidth="2.4" fill="none" strokeLinecap="round" /></g>
      )}
    </g>
  )},
};

const C3 = C;

const Y = {
  ink: C3.ink,
  bun: "#E2A95B", bunD: "#C98A3C", patty: "#7E4A2A", lettuce: "#7FBF58", tomato: "#E0503C", cheese: "#FBC95E",
  bread: "#F0D9A8", breadD: "#D8B870", crust: "#C98A3C", toastIn: "#FBEFCB",
  fry: "#E2B65C", fryD: "#C99536",
  egg: "#FBC53D", eggW: "#FFF8EC", eggWD: "#EFE6CC",
  cream: "#FFF3E0", strawb: "#E8485C", strawbD: "#C2354A", choco: "#7A4A2C",
  pink: "#F7B7C4", mint: "#B6E3D4", iceC: "#FAEFD8",
  caramel: "#C77E36", pudding: "#F4D77A",
  donut: "#E0AA6B", glaze: "#F49BB6", sprinkle1: "#67C2E8", sprinkle2: "#F4D34A",
  taiyaki: "#D89B52", taiyakiD: "#B97A33",
  apple: "#E5485A", appleD: "#C2354A", leaf: "#6FAE4E",
  banana: "#F4D24A", bananaD: "#D8B43E", bananaT: "#6E4A2A",
  glass: "#DCEAF5", glassR: "#BCD2E6", juice: "#F4A23C", beer: "#F2C14E", foam: "#FFF6E0",
  coffee: "#5A3A28", coffeeL: "#8A5A3E", cup: "#FFFFFF", cupR: "#E0E7EE",
  tea: "#C98A52", milk: "#E8D9C0",
};

const DISHES3 = {
  burger: { label: "ハンバーガー", tint: "#F4E0BE", draw: (m) => (
    <g>
      {m === "line" ? (
        <g><path d="M12,24 q20,-14 40,0 q-20,5 -40,0 Z" {...lnFill(Y.bun, { strokeWidth: 2.4 })} />
          <path d="M13,26 q19,7 38,0" {...ln({ strokeWidth: 2.4, stroke: Y.lettuce })} />
          <rect x="12" y="30" width="40" height="7" rx="3" {...lnFill(Y.patty, { strokeWidth: 2.4 })} />
          <path d="M12,42 q20,9 40,0 q0,-4 0,-5 q-20,5 -40,0 Z" {...lnFill(Y.bun, { strokeWidth: 2.4 })} /></g>
      ) : (
        <g><path d="M11,24 q21,-15 42,0 q-21,5 -42,0 Z" fill={Y.bun} />
          <g fill={Y.eggW} opacity="0.7"><circle cx="22" cy="18" r="1.1" /><circle cx="32" cy="16" r="1.1" /><circle cx="42" cy="18" r="1.1" /></g>
          <path d="M11,25 q21,7 42,0 l0,3 q-21,6 -42,0 Z" fill={Y.lettuce} />
          <rect x="11" y="29" width="42" height="4" fill={Y.cheese} />
          <rect x="11" y="32" width="42" height="7" rx="2" fill={Y.patty} />
          <path d="M11,42 q21,11 42,0 q0,-5 0,-6 q-21,6 -42,0 Z" fill={Y.bunD} />
          <path d="M11,42 q21,9 42,0 q0,-3 0,-3 q-21,5 -42,0 Z" fill={Y.bun} /></g>
      )}
    </g>
  )},

  hotdog: { label: "ホットドッグ", tint: "#F2D9A6", draw: (m) => (
    <g transform="rotate(-18 32 32)">
      {m === "line" ? (
        <g><rect x="8" y="28" width="48" height="14" rx="7" {...lnFill(Y.bun, { strokeWidth: 2.4 })} />
          <rect x="12" y="26" width="40" height="9" rx="4.5" {...lnFill(Y.patty, { strokeWidth: 2.2 })} />
          <path d="M14,30 q10,5 20,0 q8,4 16,-1" {...ln({ strokeWidth: 2, stroke: Y.tomato })} /></g>
      ) : (
        <g><rect x="7" y="27" width="50" height="16" rx="8" fill={Y.bunD} />
          <rect x="9" y="26" width="46" height="13" rx="6.5" fill={Y.bun} />
          <rect x="12" y="25" width="40" height="10" rx="5" fill="#9A5A38" />
          <rect x="12" y="25" width="40" height="10" rx="5" fill={Y.patty} />
          <path d="M14,29 q9,5 19,0 q8,5 17,-1" stroke={Y.tomato} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M16,33 q9,-4 18,1 q8,-4 16,0" stroke={Y.cheese} strokeWidth="2" fill="none" strokeLinecap="round" /></g>
      )}
    </g>
  )},

  sandwich: { label: "サンドイッチ", tint: "#EFE2C2", draw: (m) => (
    <g>
      {m === "line" ? (
        <g><path d="M14,46 L14,30 L34,22 L34,38 Z" {...lnFill(Y.toastIn, { strokeWidth: 2.4 })} />
          <path d="M14,30 L34,22 L50,30 L34,38 Z" {...lnFill(Y.bread, { strokeWidth: 2.4 })} />
          <path d="M16,38 q8,2 16,-2" {...ln({ strokeWidth: 2, stroke: Y.lettuce })} /></g>
      ) : (
        <g><path d="M13,47 L13,30 L34,21 L34,38 Z" fill={Y.toastIn} />
          <path d="M34,38 L34,21 L51,30 L51,47 Z" fill={Y.toastIn} />
          <path d="M13,30 L34,21 L51,30 L34,39 Z" fill={Y.bread} />
          <path d="M13,38 L34,46 L34,38 L13,30 Z" fill="#FFFFFF" />
          <path d="M34,46 L51,38 L51,30 L34,38 Z" fill="#FFFFFF" />
          <path d="M14,33 q10,5 20,1 l0,3 q-10,4 -20,-1 Z" fill={Y.lettuce} />
          <path d="M34,34 q9,-4 17,0 l0,3 q-9,4 -17,0 Z" fill={Y.tomato} /></g>
      )}
    </g>
  )},

  friedchicken: { label: "フライドチキン", tint: "#F0D5A2", draw: (m) => (
    <g>
      {m === "line" ? (
        <g><path d="M22,50 L30,30 q3,-8 11,-6 q8,3 4,11 L38,52 Z" {...lnFill(Y.fry, { strokeWidth: 2.4 })} />
          <line x1="26" y1="50" x2="30" y2="54" {...ln({ strokeWidth: 3 })} /></g>
      ) : (
        <g><path d="M24,52 L31,12" stroke="#F2EAD6" strokeWidth="5" strokeLinecap="round" />
          <path d="M20,48 L29,26 q4,-11 14,-7 q10,4 5,15 L40,52 q-10,4 -20,-4 Z" fill={Y.fryD} />
          <path d="M20,46 L29,26 q4,-11 14,-7 q10,4 5,15 L40,50 q-10,4 -20,-4 Z" fill={Y.fry} />
          <g fill={Y.fryD} opacity="0.6"><circle cx="30" cy="30" r="1.6" /><circle cx="36" cy="26" r="1.6" /><circle cx="34" cy="38" r="1.6" /><circle cx="28" cy="40" r="1.4" /></g></g>
      )}
    </g>
  )},

  fries: { label: "ポテト", tint: "#F2DBA8", draw: (m) => (
    <g>
      {m === "line" ? (
        <g><path d="M18,30 L46,30 L42,52 L22,52 Z" {...lnFill(Y.tomato, { strokeWidth: 2.4 })} />
          <path d="M18,30 L46,30 L45,36 L19,36 Z" {...lnFill("#fff", { strokeWidth: 2 })} />
          {[24,30,36,42].map((x,i)=><rect key={i} x={x} y={14} width="4" height="18" rx="2" {...lnFill(Y.fry, { strokeWidth: 2 })} />)}</g>
      ) : (
        <g>{[22,28,34,40,46].map((x,i)=><rect key={i} x={x-1.8} y={13+(i%2)*3} width="4.4" height={22-(i%2)*3} rx="2.2" fill={i%2?Y.fryD:Y.fry} />)}
          <path d="M17,30 L47,30 L43,53 L21,53 Z" fill={Y.tomato} />
          <path d="M17,30 L47,30 L46,37 L18,37 Z" fill="#fff" />
          <path d="M20,33 L44,33" stroke={Y.tomato} strokeWidth="1.4" opacity="0.4" /></g>
      )}
    </g>
  )},

  omelette: { label: "オムレツ", tint: "#FBE6B0", draw: (m) => (
    <g>
      <Plate mode={m} cy={43} rx={26} ry={8} />
      {m === "line" ? (
        <path d="M14,40 q2,-14 18,-14 q16,0 18,14 q-18,6 -36,0 Z" {...lnFill(Y.egg, { strokeWidth: 2.4 })} />
      ) : (
        <g><path d="M13,41 q2,-16 19,-16 q17,0 19,16 q-19,6 -38,0 Z" fill={Y.eggWD} />
          <path d="M13,41 q2,-16 19,-16 q17,0 19,16 q-19,6 -38,0 Z" fill={Y.egg} opacity="0.92" />
          <path d="M22,30 q10,-3 20,1" stroke={Y.eggWD} strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.7" />
          <path d="M40,38 q4,-3 8,-1" stroke={Y.lettuce||"#7FBF58"} strokeWidth="2.4" fill="none" strokeLinecap="round" /></g>
      )}
    </g>
  )},

  friedegg: { label: "目玉焼き", tint: "#FBEFD0", draw: (m) => (
    <g>
      <Plate mode={m} cy={42} rx={25} ry={9} />
      {m === "line" ? (
        <g><path d="M16,38 q-3,-12 12,-12 q12,0 16,4 q8,9 -2,13 q-20,7 -26,-5 Z" {...lnFill(Y.eggW, { strokeWidth: 2.4 })} />
          <circle cx="34" cy="32" r="6" {...lnFill(Y.egg, { strokeWidth: 2.4 })} /></g>
      ) : (
        <g><path d="M15,38 q-4,-13 13,-13 q13,0 17,4 q9,10 -3,14 q-21,7 -27,-5 Z" fill={Y.eggWD} />
          <path d="M15,37 q-4,-13 13,-13 q13,0 17,4 q9,10 -3,14 q-21,7 -27,-5 Z" fill={Y.eggW} />
          <circle cx="34" cy="33" r="6.5" fill={Y.eggWD} /><circle cx="34" cy="32" r="6.5" fill={Y.egg} />
          <circle cx="32" cy="30" r="2.2" fill="#FFE8A0" opacity="0.7" /></g>
      )}
    </g>
  )},

  taco: { label: "タコス", tint: "#F2DDA8", draw: (m) => (
    <g>
      {m === "line" ? (
        <g><path d="M10,46 q22,-30 44,0 q-22,8 -44,0 Z" {...lnFill(Y.bun, { strokeWidth: 2.4 })} />
          <path d="M14,44 q18,-7 36,0" {...lnFill(Y.lettuce, { strokeWidth: 2.2 })} />
          <circle cx="26" cy="42" r="2.2" {...ln({ strokeWidth: 2, stroke: Y.tomato })} /></g>
      ) : (
        <g><path d="M9,47 q23,-32 46,0 q-23,8 -46,0 Z" fill={Y.bunD} />
          <path d="M9,47 q23,-30 46,0 q-23,7 -46,0 Z" fill={Y.bun} />
          <path d="M13,45 q19,-9 38,0 q-19,6 -38,0 Z" fill={Y.lettuce} />
          <circle cx="24" cy="43" r="2.4" fill={Y.tomato} /><circle cx="38" cy="43" r="2.4" fill={Y.tomato} />
          <path d="M28,41 q4,-3 8,0" stroke={Y.patty} strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="44" cy="42" r="1.6" fill={Y.cheese} /></g>
      )}
    </g>
  )},

  soup: { label: "スープ", tint: "#F2E2C0", draw: (m) => (
    <g>
      <Steam mode={m} x={32} y={12} />
      {m === "line" ? (
        <g><path d="M12,30 C12,43 20,49 32,49 C44,49 52,43 52,30 Z" {...ln()} />
          <ellipse cx="32" cy="30" rx="20" ry="6" {...ln()} />
          <path d="M50,32 q7,0 7,6 q0,5 -6,5" {...ln()} /></g>
      ) : (
        <g><path d="M11,30 C11,43 19,49 32,49 C45,49 53,43 53,30 Z" fill="#fff" />
          <ellipse cx="32" cy="30" rx="20" ry="6" fill={Y.cupR} />
          <ellipse cx="32" cy="29.5" rx="17" ry="4.8" fill="#F6E2A8" />
          <circle cx="28" cy="29" r="1.6" fill={Y.fryD} /><circle cx="36" cy="30" r="1.4" fill={Y.lettuce||"#7FBF58"} />
          <path d="M51,32 q8,0 8,7 q0,6 -7,6" stroke={Y.cupR} strokeWidth="3" fill="none" /></g>
      )}
    </g>
  )},

  toast: { label: "トースト", tint: "#F4DCA6", draw: (m) => (
    <g>
      {m === "line" ? (
        <g><path d="M16,50 L16,26 q0,-8 8,-8 L40,18 q8,0 8,8 L48,50 Z" {...lnFill(Y.bread, { strokeWidth: 2.4 })} />
          <path d="M22,46 L42,46 L42,30 q0,-4 -4,-4 L26,26 q-4,0 -4,4 Z" {...ln({ strokeWidth: 2, stroke: Y.crust })} /></g>
      ) : (
        <g><path d="M15,51 L15,26 q0,-9 9,-9 L40,17 q9,0 9,9 L49,51 Z" fill={Y.crust} />
          <path d="M18,49 L18,28 q0,-7 7,-7 L39,21 q7,0 7,7 L46,49 Z" fill={Y.toastIn} />
          <rect x="24" y="27" width="16" height="14" rx="3" fill="#E8A93C" opacity="0.7" />
          <rect x="24" y="27" width="16" height="14" rx="3" fill="#F4C76A" /></g>
      )}
    </g>
  )},

  croissant: { label: "クロワッサン", tint: "#F2DDA8", draw: (m) => (
    <g>
      {m === "line" ? (
        <path d="M10,42 q4,-12 22,-12 q18,0 22,12 q-8,-3 -12,2 q-4,-4 -10,-3 q-6,-1 -10,3 q-4,-5 -12,-2 Z" {...lnFill(Y.bun, { strokeWidth: 2.4 })} />
      ) : (
        <g><path d="M9,43 q4,-14 23,-14 q19,0 23,14 q-8,-4 -13,2 q-4,-5 -10,-3 q-6,-2 -10,3 q-5,-6 -13,-1 Z" fill={Y.bunD} />
          <path d="M9,42 q4,-13 23,-13 q19,0 23,13 q-8,-4 -13,2 q-4,-5 -10,-3 q-6,-2 -10,3 q-5,-6 -13,-2 Z" fill={Y.bun} />
          <g stroke={Y.bunD} strokeWidth="1.6" fill="none" opacity="0.6"><path d="M20,37 q2,-4 5,-5" /><path d="M32,34 q1,-3 3,-4" /><path d="M40,37 q2,-4 4,-4" /></g></g>
      )}
    </g>
  )},

  pancake: { label: "パンケーキ", tint: "#F4DDA4", draw: (m) => (
    <g>
      <Plate mode={m} cy={46} rx={25} ry={6} />
      {m === "line" ? (
        <g>{[0,1,2].map(i=><ellipse key={i} cx="32" cy={42-i*7} rx="16" ry="6" {...lnFill(Y.bun, { strokeWidth: 2.2 })} />)}
          <rect x="29" y="14" width="6" height="6" rx="1.5" {...lnFill(Y.egg, { strokeWidth: 2 })} /></g>
      ) : (
        <g>{[0,1,2].map(i=>(<g key={i}><ellipse cx="32" cy={43-i*7} rx="16.5" ry="6.5" fill={Y.bunD} />
          <ellipse cx="32" cy={42-i*7} rx="16.5" ry="6.5" fill={Y.bun} /></g>))}
          <path d="M18,26 q14,6 28,0 q-3,7 -14,7 q-11,0 -14,-7 Z" fill="#F4B84A" opacity="0.85" />
          <rect x="28" y="14" width="8" height="7" rx="2" fill="#FBE7A0" /></g>
      )}
    </g>
  )},

  cake: { label: "ショートケーキ", tint: "#F8DDE2", draw: (m) => (
    <g>
      {m === "line" ? (
        <g><path d="M16,48 L16,30 L48,22 L48,40 Z" {...lnFill(Y.cream, { strokeWidth: 2.4 })} />
          <path d="M16,30 L48,22 L48,28 L16,36 Z" {...ln({ strokeWidth: 2, stroke: Y.strawb })} />
          <circle cx="40" cy="18" r="4" {...lnFill(Y.strawb, { strokeWidth: 2 })} /></g>
      ) : (
        <g><path d="M16,48 L16,30 L42,24 L42,42 Z" fill="#FFFCF5" />
          <path d="M42,42 L42,24 L48,27 L48,45 Z" fill={Y.eggWD} />
          <path d="M16,30 L42,24 L48,27 L22,33 Z" fill={Y.cream} />
          <path d="M19,38 L19,34 L39,29 L39,33 Z" fill={Y.strawb} />
          <path d="M16,30 q13,5 26,-1 q3,1 6,-2" stroke="none" />
          <circle cx="38" cy="19" r="4.4" fill={Y.strawbD} /><circle cx="38" cy="18.5" r="4.4" fill={Y.strawb} />
          <path d="M16,30 L16,48 L20,45 L20,33 Z" fill={Y.cream} opacity="0.5" /></g>
      )}
    </g>
  )},

  icecream: { label: "アイス", tint: "#FBE7D2", draw: (m) => (
    <g>
      {m === "line" ? (
        <g><path d="M24,32 L40,32 L32,54 Z" {...lnFill(Y.bun, { strokeWidth: 2.4 })} />
          <circle cx="32" cy="24" r="10" {...lnFill(Y.pink, { strokeWidth: 2.4 })} /></g>
      ) : (
        <g><path d="M23,32 L41,32 L32,55 Z" fill={Y.bunD} />
          <path d="M23,32 L41,32 L32,55 Z" fill={Y.bun} opacity="0.85" />
          <g stroke={Y.bunD} strokeWidth="1.2" opacity="0.6"><path d="M28,36 L34,33" /><path d="M30,42 L36,39" /><path d="M26,38 L31,35" /></g>
          <circle cx="32" cy="25" r="11" fill="#F49BB6" />
          <circle cx="27" cy="20" r="6.5" fill={Y.iceC} /><circle cx="37" cy="22" r="6" fill={Y.mint} />
          <circle cx="32" cy="14" r="3" fill={Y.strawb} /></g>
      )}
    </g>
  )},

  parfait: { label: "パフェ", tint: "#F8DEE6", draw: (m) => (
    <g>
      {m === "line" ? (
        <g><path d="M22,28 L42,28 L36,52 L28,52 Z" {...lnFill(Y.glass, { strokeWidth: 2.4 })} />
          <path d="M22,28 q10,-12 20,0 Z" {...lnFill(Y.cream, { strokeWidth: 2.2 })} />
          <circle cx="32" cy="16" r="3" {...lnFill(Y.strawb, { strokeWidth: 2 })} /></g>
      ) : (
        <g><path d="M22,30 L42,30 L36,54 L28,54 Z" fill={Y.glassR} />
          <path d="M23,30 L41,30 L36,53 L28,53 Z" fill={Y.glass} />
          <rect x="24" y="40" width="16" height="6" fill={Y.choco} opacity="0.6" />
          <rect x="25" y="34" width="14" height="6" fill={Y.strawb} opacity="0.7" />
          <path d="M21,30 q11,-14 22,0 q-11,5 -22,0 Z" fill={Y.cream} />
          <circle cx="27" cy="22" r="3.4" fill={Y.strawb} /><circle cx="36" cy="23" r="3" fill={Y.mint} />
          <rect x="38" y="12" width="3" height="14" rx="1.5" fill={Y.bun} transform="rotate(12 39 18)" />
          <circle cx="32" cy="15" r="2.6" fill={Y.strawbD} /></g>
      )}
    </g>
  )},

  pudding: { label: "プリン", tint: "#F8E6B0", draw: (m) => (
    <g>
      {m === "line" ? (
        <g><path d="M18,28 L46,28 L42,46 q-10,5 -20,0 Z" {...lnFill(Y.pudding, { strokeWidth: 2.4 })} />
          <path d="M18,28 q14,6 28,0 q0,-4 -4,-5 q-10,4 -20,0 q-4,1 -4,5 Z" {...lnFill(Y.caramel, { strokeWidth: 2.2 })} /></g>
      ) : (
        <g><path d="M18,28 L46,28 L42,47 q-10,5 -20,0 Z" fill="#EFC85E" />
          <path d="M18,28 L46,28 L42,47 q-10,5 -20,0 Z" fill={Y.pudding} opacity="0.92" />
          <path d="M16,27 q16,7 32,0 q0,-5 -5,-6 q-11,4 -22,0 q-5,1 -5,6 Z" fill={Y.caramel} />
          <ellipse cx="32" cy="14" rx="5" ry="3" fill="#FFFCF5" />
          <ellipse cx="32" cy="13" rx="2" ry="1.6" fill={Y.strawb} /></g>
      )}
    </g>
  )},

  donut: { label: "ドーナツ", tint: "#F8DCE6", draw: (m) => (
    <g>
      {m === "line" ? (
        <g><circle cx="32" cy="34" r="18" {...lnFill(Y.donut, { strokeWidth: 2.4 })} />
          <circle cx="32" cy="34" r="6" {...lnFill("#fff", { strokeWidth: 2.4 })} /></g>
      ) : (
        <g><circle cx="32" cy="35" r="18" fill={Y.donut} />
          <path d="M32,17 a18,18 0 0,1 0,36 a12,12 0 0,0 0,-24 a6,6 0 0,1 0,-12 Z" fill={Y.glaze} />
          <path d="M14,35 a18,18 0 0,1 36,0 a6,6 0 0,0 -8,-2 q-10,-4 -20,0 a6,6 0 0,0 -8,2 Z" fill={Y.glaze} />
          <circle cx="32" cy="35" r="6.5" fill="#FBEFD8" />
          <g><rect x="22" y="24" width="4" height="2" rx="1" fill={Y.sprinkle1} transform="rotate(30 24 25)" />
            <rect x="40" y="28" width="4" height="2" rx="1" fill={Y.sprinkle2} transform="rotate(-20 42 29)" />
            <rect x="44" y="40" width="4" height="2" rx="1" fill={Y.strawb} transform="rotate(40 46 41)" />
            <rect x="20" y="42" width="4" height="2" rx="1" fill={Y.sprinkle2} transform="rotate(-30 22 43)" />
            <rect x="33" y="22" width="4" height="2" rx="1" fill={Y.lettuce||"#7FBF58"} transform="rotate(10 35 23)" /></g></g>
      )}
    </g>
  )},

  taiyaki: { label: "たい焼き", tint: "#EDD3A8", draw: (m) => (
    <g transform="rotate(-8 32 32)">
      {m === "line" ? (
        <path d="M8,32 q4,-12 22,-12 q14,0 18,7 l8,-6 -2,11 2,11 -8,-6 q-4,7 -18,7 q-18,0 -22,-12 Z" {...lnFill(Y.taiyaki, { strokeWidth: 2.4 })} />
      ) : (
        <g><path d="M8,32 q4,-13 23,-13 q15,0 19,8 l9,-7 -3,12 3,12 -9,-7 q-4,8 -19,8 q-19,0 -23,-13 Z" fill={Y.taiyakiD} />
          <path d="M8,32 q4,-13 23,-13 q15,0 19,8 l9,-7 -3,12 3,12 -9,-7 q-4,8 -19,8 q-19,0 -23,-13 Z" fill={Y.taiyaki} opacity="0.92" />
          <circle cx="16" cy="28" r="2" fill={Y.taiyakiD} />
          <g stroke={Y.taiyakiD} strokeWidth="1.4" fill="none" opacity="0.6"><path d="M24,24 q3,8 0,16" /><path d="M32,23 q3,9 0,18" /><path d="M40,25 q2,7 0,14" /></g></g>
      )}
    </g>
  )},

  apple: { label: "りんご", tint: "#FBD9DC", draw: (m) => (
    <g>
      {m === "line" ? (
        <g><path d="M32,22 q-12,-6 -16,6 q-3,16 8,22 q8,4 8,-2 q0,6 8,2 q11,-6 8,-22 q-4,-12 -16,-6 Z" {...lnFill(Y.apple, { strokeWidth: 2.4 })} />
          <path d="M32,22 q1,-6 6,-8" {...ln({ strokeWidth: 2.4, stroke: Y.bananaT })} /></g>
      ) : (
        <g><path d="M32,23 q-13,-7 -17,6 q-3,17 9,23 q8,4 8,-2 q0,6 8,2 q12,-6 9,-23 q-4,-13 -17,-6 Z" fill={Y.appleD} />
          <path d="M32,23 q-13,-7 -17,6 q-3,17 9,23 q8,4 8,-2 q0,6 8,2 q12,-6 9,-23 q-4,-13 -17,-6 Z" fill={Y.apple} opacity="0.9" />
          <ellipse cx="24" cy="28" rx="4" ry="6" fill="#fff" opacity="0.35" transform="rotate(-20 24 28)" />
          <path d="M32,22 q1,-7 7,-9" stroke={Y.bananaT} strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d="M34,17 q6,-4 10,-1 q-5,4 -10,1 Z" fill={Y.leaf} /></g>
      )}
    </g>
  )},

  banana: { label: "バナナ", tint: "#FBEEB8", draw: (m) => (
    <g>
      {m === "line" ? (
        <path d="M14,22 q-2,22 18,26 q16,2 20,-6 q-4,4 -14,2 q-18,-4 -16,-22 q-1,-3 -4,-3 q-3,0 -4,3 Z" {...lnFill(Y.banana, { strokeWidth: 2.4 })} />
      ) : (
        <g><path d="M13,21 q-3,24 19,28 q17,2 21,-6 q-5,4 -15,2 q-19,-4 -17,-23 q-1,-4 -4,-4 q-3,0 -4,3 Z" fill={Y.bananaD} />
          <path d="M13,21 q-3,23 19,27 q17,2 21,-6 q-5,3 -15,1 q-19,-4 -17,-22 q-1,-4 -4,-4 q-3,0 -4,4 Z" fill={Y.banana} />
          <path d="M50,42 l4,-2" stroke={Y.bananaT} strokeWidth="3" strokeLinecap="round" />
          <path d="M13,21 q-2,20 16,25" stroke="#FBF3C8" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" /></g>
      )}
    </g>
  )},

  strawberry: { label: "いちご", tint: "#FBD2DA", draw: (m) => (
    <g>
      {m === "line" ? (
        <g><path d="M20,28 q12,-6 24,0 q2,12 -12,24 q-14,-12 -12,-24 Z" {...lnFill(Y.strawb, { strokeWidth: 2.4 })} />
          <path d="M24,26 q8,-5 16,0 q-3,-6 -8,-6 q-5,0 -8,6 Z" {...lnFill(Y.leaf, { strokeWidth: 2 })} /></g>
      ) : (
        <g><path d="M19,28 q13,-7 26,0 q2,13 -13,26 q-15,-13 -13,-26 Z" fill={Y.strawbD} />
          <path d="M19,28 q13,-7 26,0 q2,13 -13,26 q-15,-13 -13,-26 Z" fill={Y.strawb} opacity="0.92" />
          <g fill="#FFE0A0"><circle cx="27" cy="33" r="1.2" /><circle cx="35" cy="32" r="1.2" /><circle cx="31" cy="38" r="1.2" /><circle cx="39" cy="37" r="1.2" /><circle cx="32" cy="45" r="1.2" /><circle cx="24" cy="38" r="1.1" /></g>
          <path d="M23,27 q9,-6 18,0 q-2,-7 -9,-7 q-7,0 -9,7 Z" fill={Y.leaf} />
          <rect x="30" y="14" width="3" height="6" rx="1.5" fill={Y.bananaT} /></g>
      )}
    </g>
  )},

  coffee: { label: "コーヒー", tint: "#E4D3C2", draw: (m) => (
    <g>
      <Steam mode={m} x={30} y={12} />
      {m === "line" ? (
        <g><path d="M16,28 L46,28 L43,46 q-12,5 -24,0 Z" {...lnFill(Y.cup, { strokeWidth: 2.4 })} />
          <ellipse cx="31" cy="28" rx="15" ry="4.5" {...ln()} />
          <path d="M44,31 q7,0 7,6 q0,6 -7,6" {...ln()} /></g>
      ) : (
        <g><path d="M15,28 L47,28 L44,47 q-13,5 -26,0 Z" fill={Y.cupR} />
          <path d="M16,28 L46,28 L43,46 q-12,5 -24,0 Z" fill={Y.cup} />
          <ellipse cx="31" cy="28" rx="15" ry="4.5" fill={Y.cupR} />
          <ellipse cx="31" cy="27.5" rx="12.5" ry="3.5" fill={Y.coffee} />
          <ellipse cx="31" cy="27" rx="6" ry="1.6" fill={Y.coffeeL} opacity="0.6" />
          <path d="M45,31 q8,0 8,7 q0,7 -8,7 l0,-3 q5,0 5,-4 q0,-4 -5,-4 Z" fill={Y.cupR} /></g>
      )}
    </g>
  )},

  juice: { label: "ジュース", tint: "#FBE2C0", draw: (m) => (
    <g>
      {m === "line" ? (
        <g><path d="M20,20 L44,20 L41,50 q-9,4 -18,0 Z" {...lnFill(Y.glass, { strokeWidth: 2.4 })} />
          <path d="M20,28 L44,28 L42,46 q-10,4 -20,0 Z" {...ln({ strokeWidth: 2.2, stroke: Y.juice })} />
          <line x1="38" y1="10" x2="34" y2="30" {...ln({ strokeWidth: 2.4 })} /></g>
      ) : (
        <g><path d="M19,19 L45,19 L42,51 q-10,4 -20,0 Z" fill={Y.glassR} opacity="0.5" />
          <path d="M20,19 L44,19 L41,50 q-9,4 -18,0 Z" fill={Y.glass} />
          <path d="M21,29 L43,29 L40,48 q-9,4 -18,0 Z" fill={Y.juice} />
          <circle cx="29" cy="34" r="2" fill="#fff" opacity="0.4" />
          <rect x="36" y="9" width="3.5" height="24" rx="1.75" fill={Y.strawb} transform="rotate(10 37 20)" />
          <path d="M40,17 q5,-4 9,-2 q-4,4 -9,2 Z" fill={Y.leaf} /></g>
      )}
    </g>
  )},

  beer: { label: "ビール", tint: "#F8E6B0", draw: (m) => (
    <g>
      {m === "line" ? (
        <g><path d="M20,24 L42,24 L40,50 q-9,4 -18,0 Z" {...lnFill(Y.beer, { strokeWidth: 2.4 })} />
          <path d="M18,24 q14,-10 26,0 q-13,5 -26,0 Z" {...lnFill(Y.foam, { strokeWidth: 2.2 })} />
          <path d="M42,30 q8,1 8,7 q0,6 -8,6" {...ln()} /></g>
      ) : (
        <g><path d="M20,24 L42,24 L40,50 q-9,4 -18,0 Z" fill="#E8B43E" />
          <path d="M20,24 L42,24 L40,50 q-9,4 -18,0 Z" fill={Y.beer} opacity="0.9" />
          <g fill="#fff" opacity="0.35"><circle cx="27" cy="34" r="1.6" /><circle cx="33" cy="40" r="1.4" /><circle cx="30" cy="46" r="1.2" /></g>
          <path d="M17,24 q15,-12 28,0 q-3,-2 -6,1 q-4,-3 -8,0 q-4,-3 -8,0 q-3,-3 -6,-1 Z" fill={Y.foam} />
          <path d="M42,29 q9,1 9,8 q0,7 -9,7 l0,-3 q6,0 6,-5 q0,-4 -6,-4 Z" fill="#E8B43E" /></g>
      )}
    </g>
  )},

  milktea: { label: "ミルクティー", tint: "#EAD9C0", draw: (m) => (
    <g>
      {m === "line" ? (
        <g><path d="M20,22 L44,22 L41,50 q-9,4 -18,0 Z" {...lnFill(Y.milk, { strokeWidth: 2.4 })} />
          <ellipse cx="32" cy="22" rx="12" ry="3.5" {...ln()} />
          <line x1="38" y1="8" x2="34" y2="48" {...ln({ strokeWidth: 2.6 })} />
          {[[28,44],[34,46],[30,40]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="2.4" {...ln({ strokeWidth: 1.8 })} />)}</g>
      ) : (
        <g><path d="M19,21 L45,21 L42,51 q-10,4 -20,0 Z" fill="#DCC8AC" opacity="0.5" />
          <path d="M20,21 L44,21 L41,50 q-9,4 -18,0 Z" fill={Y.tea} opacity="0.55" />
          <path d="M21,30 L43,30 L41,49 q-9,4 -18,0 Z" fill={Y.milk} />
          {[[27,45],[33,47],[31,41],[37,44],[25,40]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="2.6" fill={Y.bananaT} />)}
          <rect x="35" y="6" width="3.5" height="44" rx="1.75" fill={Y.strawb} transform="rotate(8 36 28)" />
          <ellipse cx="32" cy="21" rx="12" ry="3.5" fill="#fff" opacity="0.5" /></g>
      )}
    </g>
  )},
};

// ===== 統合・公開API =====
export const FOOD_ICONS = { ...DISHES, ...DISHES2, ...DISHES3 };
export const FOOD_KEYS = Object.keys(FOOD_ICONS);

// カテゴリ分類（ピッカーのグループ表示に利用）
export const FOOD_CATEGORIES = [
  { name: '麺類',          keys: ['ramen','udon','soba','yakisoba','pasta'] },
  { name: '丼・ごはん',    keys: ['rice','onigiri','friedrice','omurice','curry','gyudon','katsudon','oyakodon','tendon','unadon'] },
  { name: '和食のおかず',  keys: ['sushi','fish','tempura','tonkatsu','karaage','yakitori','takoyaki','okonomiyaki','gyoza','shumai','tamagoyaki','nikujaga','hamburg'] },
  { name: '鍋・汁・小鉢',  keys: ['nabe','oden','misosoup','natto','tofu','edamame'] },
  { name: '洋食',          keys: ['steak','burger','hotdog','sandwich','pizza','fries','omelette','friedegg','taco','friedchicken'] },
  { name: 'サラダ・スープ',keys: ['salad','soup'] },
  { name: 'パン・スイーツ',keys: ['toast','croissant','pancake','cake','icecream','parfait','pudding','donut','taiyaki'] },
  { name: '果物',          keys: ['apple','banana','strawberry'] },
  { name: 'ドリンク',      keys: ['coffee','juice','beer','milktea'] },
];

// アイコン単体（SVG）。mode='fill'（既定）/ 'line'
export function FoodIcon({ name, mode = 'fill', size = 56, ...rest }) {
  const d = FOOD_ICONS[name];
  if (!d) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ display: 'block' }} {...rest}>
      {d.draw(mode)}
    </svg>
  );
}

// 色タイル付きアイコン（採用案）。記録ピッカーのボタンに利用
export function FoodTile({
  name, size = 56, tile = 78, radius = 22,
  selected = false, onClick, showLabel = false, style,
}) {
  const d = FOOD_ICONS[name];
  if (!d) return null;
  const box = {
    width: tile, height: tile, borderRadius: radius, background: d.tint,
    display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
    border: selected ? '2.5px solid #3D9BFF' : '2.5px solid transparent',
    boxShadow: selected ? '0 6px 16px rgba(61,155,255,0.30)' : '0 6px 16px rgba(20,40,70,0.07)',
    cursor: onClick ? 'pointer' : 'default', transition: 'transform .12s ease, box-shadow .12s ease',
    ...style,
  };
  const wrap = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 };
  const tileEl = (
    <div style={box}>
      <FoodIcon name={name} mode="fill" size={size} />
      {selected && (
        <span style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%',
          background: '#3D9BFF', color: '#fff', fontSize: 12, fontWeight: 800, display: 'flex',
          alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>✓</span>
      )}
    </div>
  );
  const content = showLabel
    ? <div style={wrap}>{tileEl}<span style={{ fontSize: 11, fontWeight: 800,
        color: selected ? '#2E7BE0' : '#8AA0B8' }}>{d.label}</span></div>
    : tileEl;
  if (onClick) {
    return <button onClick={() => onClick(name)} style={{ border: 'none', background: 'transparent', padding: 0, font: 'inherit' }}>{content}</button>;
  }
  return content;
}

// 日本語ラベル取得ヘルパー
export const foodLabel = (name) => (FOOD_ICONS[name] ? FOOD_ICONS[name].label : '');
