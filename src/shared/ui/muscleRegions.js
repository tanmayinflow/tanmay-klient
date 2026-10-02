// Original paths registered to the 1024 × 1536 unified front/back drawing.
// These are teaching regions, not a dissection or a diagnostic muscle atlas.
// Only absolute M/L/C/Q/Z commands are used, so all numbers are x/y pairs.
const AXES = { front: 270, back: 752 };
const pair = (side, d) => {
  let coordinate = 0;
  const mirrored = d.replace(/-?\d+(?:\.\d+)?/g, (value) =>
    ++coordinate % 2 ? String(2 * AXES[side] - Number(value)) : value);
  return [{ side, d }, { side, d: mirrored }];
};

export const MUSCLE_REGION_META = {
  width: 1024,
  height: 1536,
  viewBox: "0 0 1024 1536",
  axes: AXES,
  // The drawing remains clothed. These regions intentionally cross the fabric.
  throughClothing: ["qua", "ham", "glu", "add", "hipflex"],
  // The entire group cannot be observed directly from the depicted surface.
  surfaceProjection: ["hipflex", "rcuff", "upb"],
  reference: "unified-muscle-figures-2026-10-02",
  anatomySources: [
    "https://openstax.org/books/anatomy-and-physiology-2e/pages/11-5-muscles-of-the-pectoral-girdle-and-upper-limbs",
    "https://openstax.org/books/anatomy-and-physiology-2e/pages/11-6-appendicular-muscles-of-the-pelvic-girdle-and-lower-limbs",
  ],
};

export const MUSCLE_REGIONS = {
  qua: pair("front", "M170 720 C159 750 142 804 141 847 C143 883 150 915 163 937 C174 941 180 946 187 950 C199 954 210 949 218 936 C228 917 231 892 228 864 L216 802 C216 768 213 740 191 724 Z"),
  ham: pair("back", "M642 784 C630 811 623 847 628 888 C632 917 639 942 639 965 C646 959 652 959 660 964 L681 980 C687 959 700 938 707 908 L730 805 C704 790 670 783 642 784 Z"),
  glu: pair("back", "M658 660 C685 650 724 654 744 676 L745 743 C741 762 718 774 690 772 C666 773 646 763 635 747 C640 713 646 682 658 660 Z"),
  cal: pair("back", "M643 987 C632 989 618 1011 612 1036 C601 1060 602 1102 616 1123 C624 1130 633 1140 640 1148 C645 1134 649 1122 650 1111 C654 1121 661 1128 667 1126 C680 1107 684 1078 679 1046 C674 1011 665 990 643 987 Z"),
  abs: pair("front", "M259 480 C243 477 225 482 220 500 C213 517 217 529 218 536 C213 552 215 573 220 588 C218 610 222 632 230 651 L263 654 L265 499 C265 490 263 484 259 480 Z"),
  obl: pair("front", "M171 499 C170 521 181 552 176 583 C172 602 172 616 179 625 L217 647 C211 622 206 597 209 569 C205 541 194 518 181 507 Z"),
  low: pair("back", "M735 460 C723 490 717 518 716 548 C716 579 722 604 727 636 L744 638 L746 470 Z"),
  // Legacy broad-back group: interscapular muscles plus lateral latissimus.
  // Keep the lateral region outside the separate lumbar erector columns.
  upb: [
    ...pair("back", "M740 333 L710 346 C706 376 709 406 722 430 L741 450 Z"),
    ...pair("back", "M626 426 C650 454 678 464 701 454 C708 481 712 509 711 540 C707 560 704 579 706 598 C687 604 671 617 654 628 C659 603 658 574 645 552 C629 526 620 479 626 426 Z"),
  ],
  // Upper, middle and lower trapezius form one tapering half on each side.
  tra: pair("back", "M746 248 C739 274 733 299 721 317 C699 322 668 330 648 335 C672 338 691 348 704 365 C725 410 734 468 748 523 L748 252 Z"),
  che: pair("front", "M248 346 C228 338 204 337 185 341 C168 354 156 378 146 410 C152 430 167 447 183 457 C201 467 225 466 244 457 C259 448 263 432 264 411 L263 374 C261 361 256 351 248 346 Z"),
  sho: [
    ...pair("front", "M156 337 C122 334 101 353 92 380 C84 404 85 421 94 435 C104 424 124 419 138 410 C149 386 163 358 180 344 C174 339 165 337 156 337 Z"),
    ...pair("back", "M641 334 C615 333 592 347 578 371 C566 390 563 410 567 428 C581 416 598 407 613 408 C632 391 649 371 650 348 Z"),
  ],
  bic: pair("front", "M137 426 C116 432 101 454 96 480 C91 503 89 530 96 546 C110 555 128 542 138 519 C149 491 152 452 137 426 Z"),
  tri: pair("back", "M613 417 C582 431 563 450 559 475 C555 495 564 515 561 533 C563 545 569 553 578 554 C594 542 606 519 617 491 C625 466 624 438 613 417 Z"),
  fore: [
    ...pair("front", "M87 561 C70 567 56 589 47 626 L42 694 C48 698 61 700 64 689 C73 658 85 619 94 599 C104 577 112 563 112 554 C101 560 94 563 87 561 Z"),
    ...pair("back", "M562 554 C550 568 540 596 538 626 L532 693 C541 700 549 699 555 685 C563 654 578 626 587 600 C595 578 592 563 585 554 C578 562 569 566 562 554 Z"),
  ],
  add: pair("front", "M224 727 C238 735 249 748 260 766 C260 788 252 818 244 846 C239 865 235 881 233 896 C232 861 226 830 217 805 C210 781 211 751 224 727 Z"),
  hipflex: pair("front", "M231 607 C217 626 208 650 212 672 C217 700 233 723 245 742 L252 724 C247 700 239 680 239 655 L245 612 Z"),
  rcuff: [
    // Small anterior shoulder projection of the deep subscapularis insertion;
    // this does not depict a visible superficial muscle or the whole scapula.
    ...pair("front", "M155 389 C151 398 148 408 147 415 C155 421 162 425 169 427 C172 414 168 401 161 391 Z"),
    ...pair("back", "M653 351 C668 349 684 352 695 361 C700 386 695 414 680 434 C666 446 649 448 634 433 C637 417 639 402 646 389 C650 376 652 362 653 351 Z"),
  ],
  serr: pair("front", "M156 447 C162 452 168 455 174 459 L163 465 L181 475 L169 483 L187 494 L176 502 L195 514 L193 525 C177 516 166 500 162 481 Z"),
  neck: [
    ...pair("front", "M230 258 C231 291 239 319 253 333 L249 311 C244 292 240 277 240 267 Z"),
    ...pair("back", "M720 251 C719 277 713 292 701 302 L724 313 C737 293 742 273 742 250 Z"),
  ],
  // Broad lateral back, distinct from the central interscapular region.
  lat: pair("back", "M626 426 C650 454 678 464 701 454 C714 486 724 520 733 548 L732 608 C709 609 681 619 654 633 C659 603 658 574 645 552 C629 526 620 479 626 426 Z"),
  // Anterior compartment, lateral to the tibial crest; not the calf belly.
  tib: pair("front", "M151 990 C142 1010 127 1045 125 1079 C125 1107 128 1139 137 1170 L143 1203 C147 1187 151 1164 153 1140 C154 1108 157 1085 161 1061 C163 1037 160 1012 151 990 Z"),
};
