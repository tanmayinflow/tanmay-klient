// Exact reviewed exercise ids only. No family/name/variant fallback.
export const EXERCISE_MOTION = Object.freeze({
  "drep": {
    "oneSide": false,
    "src": "/exercise-motion/drep-84a22400a1855cb6.mp4",
    "bytes": 113717,
    "sha256": "84a22400a1855cb611e64c0b4f7f430810ab3e9fab87d5a63411da52c1500203",
    "poster": "/exercise-motion/drep-poster-1b8ffdac3a8a8d86.webp"
  },
  "glutebridge": {
    "oneSide": false,
    "src": "/exercise-motion/glutebridge-67dc72e83ad1bd91.mp4",
    "bytes": 100007,
    "sha256": "67dc72e83ad1bd918229a31e90dafb684eee9b590dbaa87f5370c625812ae14c",
    "poster": "/exercise-motion/glutebridge-poster-5ed49f63b3907cdd.webp"
  },
  "birddog": {
    "oneSide": true,
    "src": "/exercise-motion/birddog-4ad02ae798e70e9d.mp4",
    "bytes": 72932,
    "sha256": "4ad02ae798e70e9d6069e21f403900e848444c6c0ccc2048332d0bc3d14bc143",
    "poster": "/exercise-motion/birddog-poster-c603b769dca473a5.webp"
  },
  "pushup": {
    "oneSide": false,
    "src": "/exercise-motion/pushup-2e6aa0d032b7efe9.mp4",
    "bytes": 86889,
    "sha256": "2e6aa0d032b7efe96443f1ce83af5d1886fdbecbe814f6c2978b0418346443d2",
    "poster": "/exercise-motion/pushup-poster-70575507f42d3d23.webp"
  },
  "kneepush": {
    "oneSide": false,
    "src": "/exercise-motion/kneepush-68c550feae5cd406.mp4",
    "bytes": 99174,
    "sha256": "68c550feae5cd406d5440306c5462d48fbecdbb9e02baf9835c961ff5ab2cc44",
    "poster": "/exercise-motion/kneepush-poster-21be822c6dfa74b3.webp"
  },
  "jg_bitilasana_marjari": {
    "oneSide": false,
    "src": "/exercise-motion/jg_bitilasana_marjari-345f832a826d5b6f.mp4",
    "bytes": 79840,
    "sha256": "345f832a826d5b6fbfd5781713c2da05d4edfa8cae68e9ae0103e9930b772ec1",
    "poster": "/exercise-motion/jg_bitilasana_marjari-poster-1f47c06982780f1d.webp"
  },
  "dbcurl": {
    "oneSide": false,
    "src": "/exercise-motion/dbcurl-9ec01ebba34a0faa.mp4",
    "bytes": 108014,
    "sha256": "9ec01ebba34a0faa27aa8455d16a34dfc8021c50216603add7b930fea8e5e032",
    "poster": "/exercise-motion/dbcurl-poster-0ae8842819acd5f3.webp"
  },
  "cat": {
    "oneSide": false,
    "src": "/exercise-motion/jg_bitilasana_marjari-345f832a826d5b6f.mp4",
    "bytes": 79840,
    "sha256": "345f832a826d5b6fbfd5781713c2da05d4edfa8cae68e9ae0103e9930b772ec1",
    "poster": "/exercise-motion/jg_bitilasana_marjari-poster-1f47c06982780f1d.webp"
  }
});

export function exerciseMotionFor(exercise) {
  const id = typeof exercise === 'string' ? exercise : exercise?.id;
  return Object.hasOwn(EXERCISE_MOTION, id) ? EXERCISE_MOTION[id] : null;
}

let activePlayer = null;
export function claimMotionPlayer(player) {
  if (activePlayer && activePlayer !== player) activePlayer.pause();
  activePlayer = player;
}
export function releaseMotionPlayer(player) {
  player.pause();
  if (activePlayer === player) activePlayer = null;
}
