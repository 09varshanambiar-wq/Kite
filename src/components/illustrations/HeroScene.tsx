import './HeroScene.css';

/*
 * The hero scene: a low-poly papercraft kite festival.
 *
 * Built as vector rather than a flat image so every moving part — the
 * kites, the windsock, the anemometer, the pinwheels, the dog — is its
 * own node that can be animated independently. A bitmap could not do
 * that, and this stays crisp at any width for a fraction of the weight.
 *
 * viewBox is 1600x600 with a transparent sky, so the page's own cream
 * shows through above the horizon and the scene bleeds off both edges.
 */
export function HeroScene() {
  return (
    <div className="kite-scene" aria-hidden="true">
      <svg
        className="kite-scene-svg"
        viewBox="0 0 1600 600"
        preserveAspectRatio="xMidYMax slice"
        role="img"
      >
        <defs>
          <linearGradient id="ks-field" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9CC97A" />
            <stop offset="100%" stopColor="#6FA653" />
          </linearGradient>
          <linearGradient id="ks-field-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B4D694" />
            <stop offset="100%" stopColor="#8FBF6B" />
          </linearGradient>
        </defs>

        {/* ---------- clouds, drifting ---------- */}
        <g className="ks-cloud ks-cloud--a" opacity="0.85">
          <ellipse cx="250" cy="90" rx="52" ry="20" fill="#FFFFFF" />
          <ellipse cx="292" cy="80" rx="36" ry="17" fill="#FFFFFF" />
          <ellipse cx="212" cy="82" rx="28" ry="14" fill="#FDF7EC" />
        </g>
        <g className="ks-cloud ks-cloud--b" opacity="0.7">
          <ellipse cx="1180" cy="70" rx="44" ry="17" fill="#FFFFFF" />
          <ellipse cx="1214" cy="62" rx="30" ry="14" fill="#FDF7EC" />
        </g>

        {/* ---------- layered faceted hills ---------- */}
        <path d="M0 392 L150 330 L310 372 L470 318 L640 366 L820 322 L1010 370 L1180 328 L1360 368 L1520 334 L1600 360 L1600 420 L0 420 Z" fill="#1C2FB0" opacity="0.92" />
        <path d="M0 404 L180 366 L340 398 L520 358 L700 396 L900 360 L1090 398 L1280 366 L1460 400 L1600 374 L1600 430 L0 430 Z" fill="#4A73C4" opacity="0.9" />
        <path d="M0 414 L210 388 L420 412 L640 386 L860 414 L1080 388 L1300 414 L1520 392 L1600 406 L1600 440 L0 440 Z" fill="#7FB3B3" opacity="0.85" />
        <path d="M0 424 L260 406 L520 426 L800 404 L1080 426 L1360 406 L1600 422 L1600 452 L0 452 Z" fill="#E8B84B" opacity="0.55" />

        {/* ---------- field ---------- */}
        <path d="M0 430 L1600 430 L1600 600 L0 600 Z" fill="url(#ks-field-far)" />
        <path d="M0 470 C 300 452, 640 486, 980 464 C 1240 448, 1420 480, 1600 466 L1600 600 L0 600 Z" fill="url(#ks-field)" />

        {/* ---------- kites in the sky, swaying on their lines ---------- */}
        {/* big diamond kite, upper right */}
        <g className="ks-kite ks-kite--lead">
          <line x1="1268" y1="176" x2="886" y2="436" stroke="#C9BFA6" strokeWidth="1.6" />
          <path d="M1268 100 L1330 172 L1268 244 L1206 172 Z" fill="#1C2FB0" />
          <path d="M1268 100 L1330 172 L1268 172 Z" fill="#E8B84B" />
          <path d="M1268 244 L1206 172 L1268 172 Z" fill="#3E56C8" />
          <path className="ks-tail" d="M1268 244 q 26 34 -6 62 q -30 28 4 60" fill="none" stroke="#E8B84B" strokeWidth="6" strokeLinecap="round" />
        </g>
        {/* small kites */}
        <line x1="470" y1="242" x2="668" y2="470" stroke="#C9BFA6" strokeWidth="1.2" />
        <line x1="1470" y1="286" x2="1306" y2="464" stroke="#C9BFA6" strokeWidth="1.2" />
        <g className="ks-kite ks-kite--a">
          <path d="M470 150 L508 196 L470 242 L432 196 Z" fill="#7FB3B3" />
          <path d="M470 150 L508 196 L470 196 Z" fill="#A9D3D3" />
          <path d="M470 242 L432 196 L470 196 Z" fill="#5E9797" />
          <path className="ks-tail" d="M470 242 q 16 22 -4 40" fill="none" stroke="#E07A5F" strokeWidth="4" strokeLinecap="round" />
        </g>
        <g className="ks-kite ks-kite--b">
          <path d="M760 96 L792 136 L760 176 L728 136 Z" fill="#E07A5F" />
          <path d="M760 96 L792 136 L760 136 Z" fill="#F0A088" />
          <path d="M760 176 L728 136 L760 136 Z" fill="#C2604A" />
          <path className="ks-tail" d="M760 176 q 14 20 -4 36" fill="none" stroke="#1C2FB0" strokeWidth="4" strokeLinecap="round" />
        </g>
        <g className="ks-kite ks-kite--c">
          <path d="M1470 210 L1500 248 L1470 286 L1440 248 Z" fill="#E8B84B" />
          <path d="M1470 210 L1500 248 L1470 248 Z" fill="#F3D286" />
          <path d="M1470 286 L1440 248 L1470 248 Z" fill="#C89A34" />
          <path className="ks-tail" d="M1470 286 q 12 18 -4 32" fill="none" stroke="#1C2FB0" strokeWidth="4" strokeLinecap="round" />
        </g>

        {/* ---------- left: kite display rack ---------- */}
        <g>
          <path d="M96 366 L96 508" stroke="#B98354" strokeWidth="7" strokeLinecap="round" />
          <path d="M366 366 L366 508" stroke="#B98354" strokeWidth="7" strokeLinecap="round" />
          <path d="M84 368 L378 368" stroke="#8A5F3C" strokeWidth="8" strokeLinecap="round" />
          {/* hanging kites */}
          <g className="ks-hang ks-hang--1">
            <path d="M150 380 L178 414 L150 448 L122 414 Z" fill="#1C2FB0" />
            <path d="M150 380 L178 414 L150 414 Z" fill="#80AFFF" />
          </g>
          <g className="ks-hang ks-hang--2">
            <path d="M232 380 L262 418 L232 456 L202 418 Z" fill="#E8B84B" />
            <path d="M232 380 L262 418 L232 418 Z" fill="#F3D286" />
          </g>
          <g className="ks-hang ks-hang--3">
            {/* butterfly kite */}
            <ellipse cx="306" cy="404" rx="20" ry="26" fill="#E07A5F" />
            <ellipse cx="330" cy="404" rx="20" ry="26" fill="#F0A088" />
            <rect x="316" y="382" width="4" height="48" rx="2" fill="#8A5F3C" />
          </g>
        </g>

        {/* ---------- windsock pole + anemometer ---------- */}
        <g>
          <rect x="556" y="300" width="9" height="216" rx="4" fill="#D8CDB6" />
          <g className="ks-anemo" style={{ transformOrigin: '560px 306px' }}>
            <circle cx="560" cy="306" r="5" fill="#1C2FB0" />
            <g>
              <line x1="560" y1="306" x2="530" y2="292" stroke="#1C2FB0" strokeWidth="3" />
              <circle cx="528" cy="291" r="9" fill="#7FB3B3" />
            </g>
            <g>
              <line x1="560" y1="306" x2="592" y2="294" stroke="#1C2FB0" strokeWidth="3" />
              <circle cx="594" cy="293" r="9" fill="#1C2FB0" />
            </g>
            <g>
              <line x1="560" y1="306" x2="562" y2="342" stroke="#1C2FB0" strokeWidth="3" />
              <circle cx="562" cy="344" r="9" fill="#80AFFF" />
            </g>
          </g>
          {/* windsock */}
          <g className="ks-windsock" style={{ transformOrigin: '566px 352px' }}>
            <path d="M566 336 L646 344 L646 372 L566 368 Z" fill="#1C2FB0" />
            <path d="M594 338 L620 341 L620 371 L594 370 Z" fill="#F7F1E3" />
            <path d="M646 344 L678 350 L678 366 L646 372 Z" fill="#E8B84B" />
          </g>
        </g>

        {/* ---------- notice board ---------- */}
        <g>
          <rect x="640" y="396" width="96" height="76" rx="5" fill="#4A5BC8" />
          <rect x="650" y="406" width="34" height="26" rx="3" fill="#F7F1E3" />
          <rect x="692" y="406" width="34" height="26" rx="3" fill="#E8B84B" />
          <rect x="650" y="438" width="34" height="26" rx="3" fill="#E8B84B" />
          <rect x="692" y="438" width="34" height="26" rx="3" fill="#F7F1E3" />
          <rect x="654" y="472" width="8" height="44" fill="#B98354" />
          <rect x="714" y="472" width="8" height="44" fill="#B98354" />
        </g>

        {/* ---------- trees ---------- */}
        {/* faceted canopies: a lit face, a mid face and a shadow face
            per tree, which is what reads as folded paper rather than
            a flat triangle */}
        <g>
          <rect x="1216" y="436" width="14" height="66" rx="4" fill="#8A5F3C" />
          <path d="M1223 366 L1258 396 L1272 432 L1223 446 L1174 432 L1188 396 Z" fill="#6FA653" />
          <path d="M1223 366 L1258 396 L1272 432 L1223 446 Z" fill="#8FBF6B" />
          <path d="M1223 446 L1174 432 L1188 396 Z" fill="#4E7A4B" />
          <path d="M1223 366 L1188 396 L1223 404 Z" fill="#A8D183" />
        </g>
        <g>
          <rect x="1500" y="448" width="13" height="62" rx="4" fill="#8A5F3C" />
          <path d="M1506 388 L1538 414 L1550 446 L1506 458 L1462 446 L1474 414 Z" fill="#6FA653" />
          <path d="M1506 388 L1538 414 L1550 446 L1506 458 Z" fill="#8FBF6B" />
          <path d="M1506 458 L1462 446 L1474 414 Z" fill="#4E7A4B" />
          <path d="M1506 388 L1474 414 L1506 422 Z" fill="#A8D183" />
        </g>
        <g>
          <rect x="196" y="452" width="11" height="52" rx="4" fill="#8A5F3C" />
          <path d="M201 404 L228 426 L238 452 L201 462 L164 452 L174 426 Z" fill="#6FA653" />
          <path d="M201 404 L228 426 L238 452 L201 462 Z" fill="#8FBF6B" />
          <path d="M201 462 L164 452 L174 426 Z" fill="#4E7A4B" />
        </g>

        {/* ---------- market cart with awning + pinwheels ---------- */}
        <g>
          {/* awning */}
          <path d="M1332 402 L1470 402 L1478 430 L1324 430 Z" fill="#F7F1E3" />
          <path d="M1354 402 L1362 430 L1332 430 L1338 402 Z" fill="#E07A5F" />
          <path d="M1394 402 L1400 430 L1372 430 L1378 402 Z" fill="#1C2FB0" />
          <path d="M1434 402 L1440 430 L1412 430 L1418 402 Z" fill="#E8B84B" />
          {/* body */}
          <rect x="1336" y="430" width="132" height="56" rx="5" fill="#B98354" />
          <rect x="1336" y="444" width="132" height="8" fill="#8A5F3C" />
          <circle cx="1364" cy="494" r="18" fill="#E8B84B" />
          <circle cx="1364" cy="494" r="6" fill="#F7F1E3" />
          <circle cx="1444" cy="494" r="18" fill="#1C2FB0" />
          <circle cx="1444" cy="494" r="6" fill="#F7F1E3" />
          {/* pinwheels on the cart, spinning */}
          <g>
            <rect x="1356" y="366" width="3" height="40" fill="#D8CDB6" />
            <g className="ks-pinwheel ks-pinwheel--a" style={{ transformOrigin: '1357px 366px' }}>
              <path d="M1357 366 L1357 344 L1375 352 Z" fill="#1C2FB0" />
              <path d="M1357 366 L1379 366 L1371 384 Z" fill="#E8B84B" />
              <path d="M1357 366 L1357 388 L1339 380 Z" fill="#E07A5F" />
              <path d="M1357 366 L1335 366 L1343 348 Z" fill="#7FB3B3" />
              <circle cx="1357" cy="366" r="3.5" fill="#F7F1E3" />
            </g>
          </g>
          <g>
            <rect x="1408" y="374" width="3" height="32" fill="#D8CDB6" />
            <g className="ks-pinwheel ks-pinwheel--b" style={{ transformOrigin: '1409px 374px' }}>
              <path d="M1409 374 L1409 356 L1424 363 Z" fill="#E8B84B" />
              <path d="M1409 374 L1427 374 L1420 389 Z" fill="#1C2FB0" />
              <path d="M1409 374 L1409 392 L1394 385 Z" fill="#7FB3B3" />
              <path d="M1409 374 L1391 374 L1398 359 Z" fill="#E07A5F" />
              <circle cx="1409" cy="374" r="3" fill="#F7F1E3" />
            </g>
          </g>
        </g>

        {/* vendor behind the cart */}
        <g>
          <path d="M1494 500 L1492 522" stroke="#C89A34" strokeWidth="7" strokeLinecap="round" />
          <path d="M1508 500 L1512 522" stroke="#E8B84B" strokeWidth="7" strokeLinecap="round" />
          <path d="M1490 470 L1518 468 L1522 504 L1492 506 Z" fill="#E8B84B" />
          <path d="M1508 469 L1518 468 L1522 504 L1512 505 Z" fill="#C89A34" />
          <path d="M1490 478 L1470 490" stroke="#E8B48A" strokeWidth="7" strokeLinecap="round" />
          <circle cx="1504" cy="454" r="13" fill="#E8B48A" />
          <path d="M1491 450 a 13 13 0 0 1 26 0 a 13 7 0 0 0 -26 0 Z" fill="#5A4632" />
        </g>

        {/* ---------- park bench ---------- */}
        <g>
          <rect x="1046" y="452" width="118" height="9" rx="3" fill="#B98354" />
          <rect x="1046" y="434" width="118" height="8" rx="3" fill="#C79468" />
          <rect x="1056" y="461" width="8" height="26" fill="#8A5F3C" />
          <rect x="1146" y="461" width="8" height="26" fill="#8A5F3C" />
        </g>

        {/* ---------- picnic blanket, two friends talking ---------- */}
        <g>
          <path d="M596 520 L790 508 L812 560 L610 574 Z" fill="#4A5BC8" />
          <path d="M596 520 L790 508 L800 532 L604 544 Z" fill="#5E6ED4" opacity="0.7" />
          {/* seated figure left — knees drawn up, leaning slightly in */}
          <g>
            <path d="M660 528 L706 522 L708 536 L662 542 Z" fill="#C79468" />
            <path d="M652 498 L684 496 L690 530 L654 532 Z" fill="#E8B84B" />
            <path d="M672 497 L684 496 L690 530 L678 531 Z" fill="#C89A34" />
            <path d="M684 504 L706 516 L702 524 L680 514 Z" fill="#E8B48A" />
            <circle cx="666" cy="482" r="14" fill="#E8B48A" />
            <path d="M652 478 a 14 14 0 0 1 28 0 a 14 8 0 0 0 -28 0 Z" fill="#5A4632" />
          </g>
          {/* seated figure right — facing back toward them */}
          <g>
            <path d="M718 534 L764 528 L766 542 L720 548 Z" fill="#C79468" />
            <path d="M732 504 L764 502 L768 536 L734 538 Z" fill="#E07A5F" />
            <path d="M732 504 L744 503 L748 537 L734 538 Z" fill="#C2604A" />
            <path d="M732 512 L710 522 L714 530 L736 522 Z" fill="#D9A276" />
            <circle cx="748" cy="488" r="14" fill="#D9A276" />
            <path d="M734 484 a 14 14 0 0 1 28 0 a 14 8 0 0 0 -28 0 Z" fill="#3A2E22" />
          </g>
          {/* speech bubbles, pulsing in turn */}
          <g className="ks-bubble ks-bubble--a">
            <ellipse cx="700" cy="446" rx="26" ry="17" fill="#FFFFFF" />
            <path d="M690 460 l-8 12 l16 -6 Z" fill="#FFFFFF" />
          </g>
          <g className="ks-bubble ks-bubble--b">
            <ellipse cx="782" cy="452" rx="22" ry="15" fill="#FFFFFF" />
            <path d="M792 464 l8 12 l-16 -6 Z" fill="#FFFFFF" />
          </g>
          {/* basket */}
          <rect x="812" y="522" width="34" height="24" rx="4" fill="#C79468" />
          <rect x="812" y="522" width="34" height="7" rx="3" fill="#8A5F3C" />
        </g>

        {/* ---------- second blanket, right ---------- */}
        <g>
          <path d="M888 534 L1074 522 L1094 566 L906 580 Z" fill="#E8B84B" />
          <path d="M888 534 L1074 522 L1082 542 L896 554 Z" fill="#F0CB74" opacity="0.75" />
          <g>
            <path d="M956 540 L1000 534 L1002 548 L958 554 Z" fill="#C79468" />
            <path d="M948 512 L980 510 L984 542 L950 544 Z" fill="#4A5BC8" />
            <path d="M968 511 L980 510 L984 542 L972 543 Z" fill="#2E3E9E" />
            <circle cx="962" cy="496" r="13" fill="#E8B48A" />
            <path d="M949 492 a 13 13 0 0 1 26 0 a 13 7 0 0 0 -26 0 Z" fill="#8A5F3C" />
          </g>
          <rect x="1012" y="530" width="30" height="22" rx="4" fill="#C79468" />
          <circle cx="1064" cy="540" r="9" fill="#7FB3B3" />
        </g>

        {/* ---------- child running with a kite line ---------- */}
        <g className="ks-runner">
          {/* trailing leg, planted; leading leg, lifted */}
          <path d="M848 486 L838 514" stroke="#2E3E9E" strokeWidth="8" strokeLinecap="round" />
          <path d="M866 486 L880 508" stroke="#1C2FB0" strokeWidth="8" strokeLinecap="round" />
          <path d="M844 452 L872 450 L876 490 L846 492 Z" fill="#4A5BC8" />
          <path d="M862 451 L872 450 L876 490 L866 491 Z" fill="#2E3E9E" />
          {/* arm reaching up the kite line */}
          <path d="M870 458 L886 436" stroke="#D9A276" strokeWidth="7" strokeLinecap="round" />
          <path d="M844 460 L830 476" stroke="#D9A276" strokeWidth="7" strokeLinecap="round" />
          <circle cx="858" cy="436" r="14" fill="#D9A276" />
          <path d="M844 432 a 14 14 0 0 1 28 0 a 14 8 0 0 0 -28 0 Z" fill="#5A4632" />
        </g>

        {/* ---------- dog, trotting ---------- */}
        <g className="ks-dog">
          <path d="M1152 552 L1150 566" stroke="#C79468" strokeWidth="5" strokeLinecap="round" />
          <path d="M1186 552 L1190 566" stroke="#C79468" strokeWidth="5" strokeLinecap="round" />
          <path d="M1162 552 L1158 566" stroke="#E8D6BE" strokeWidth="5" strokeLinecap="round" />
          <path d="M1178 552 L1182 566" stroke="#E8D6BE" strokeWidth="5" strokeLinecap="round" />
          <ellipse cx="1170" cy="538" rx="26" ry="14" fill="#F7F1E3" />
          <path d="M1150 530 q 16 -8 32 0 q -14 6 -32 0 Z" fill="#C79468" />
          <path d="M1146 534 q -12 -10 -18 -2 q 6 10 18 6 Z" fill="#C79468" />
          <circle cx="1196" cy="524" r="11" fill="#E8D6BE" />
          <path d="M1188 518 q 10 -6 16 2 q -8 4 -16 -2 Z" fill="#C79468" />
          <ellipse cx="1205" cy="528" rx="6" ry="4.5" fill="#8A5F3C" />
          <circle cx="1207" cy="526" r="1.8" fill="#3A2E22" />
          <path d="M1189 520 q -7 4 -3 14 q 8 -2 8 -12 Z" fill="#8A5F3C" />
        </g>

        {/* ---------- couple walking, right ---------- */}
        <g>
          <path d="M1260 512 L1258 534" stroke="#C2604A" strokeWidth="7" strokeLinecap="round" />
          <path d="M1276 512 L1280 534" stroke="#E07A5F" strokeWidth="7" strokeLinecap="round" />
          <path d="M1256 482 L1284 480 L1288 516 L1258 518 Z" fill="#E07A5F" />
          <path d="M1274 481 L1284 480 L1288 516 L1278 517 Z" fill="#C2604A" />
          <circle cx="1270" cy="466" r="14" fill="#E8B48A" />
          <path d="M1256 462 a 14 14 0 0 1 28 0 a 14 8 0 0 0 -28 0 Z" fill="#3A2E22" />
        </g>
        <g>
          <path d="M1300 518 L1298 538" stroke="#142180" strokeWidth="7" strokeLinecap="round" />
          <path d="M1314 518 L1318 538" stroke="#1C2FB0" strokeWidth="7" strokeLinecap="round" />
          <path d="M1296 490 L1322 488 L1326 522 L1298 524 Z" fill="#1C2FB0" />
          <path d="M1312 489 L1322 488 L1326 522 L1316 523 Z" fill="#142180" />
          <circle cx="1308" cy="474" r="13" fill="#D9A276" />
          <path d="M1295 470 a 13 13 0 0 1 26 0 a 13 7 0 0 0 -26 0 Z" fill="#8A5F3C" />
        </g>

        {/* ---------- foreground flowers and grass ---------- */}
        <g className="ks-grass">
          <path d="M60 576 q 6 -26 14 -34" stroke="#4E7A4B" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M84 580 q 4 -22 12 -28" stroke="#4E7A4B" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M1548 574 q 6 -24 14 -30" stroke="#4E7A4B" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M470 588 q 5 -20 12 -26" stroke="#4E7A4B" strokeWidth="5" fill="none" strokeLinecap="round" />
        </g>
        <g>
          <circle cx="196" cy="556" r="7" fill="#F7F1E3" />
          <circle cx="196" cy="556" r="3" fill="#E8B84B" />
          <circle cx="1420" cy="566" r="7" fill="#F7F1E3" />
          <circle cx="1420" cy="566" r="3" fill="#E8B84B" />
          <circle cx="860" cy="590" r="6" fill="#E07A5F" />
          <circle cx="360" cy="580" r="6" fill="#80AFFF" />
        </g>
      </svg>
    </div>
  );
}
