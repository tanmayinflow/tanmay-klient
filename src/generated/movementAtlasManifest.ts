// GENERATED FILE — DO NOT EDIT BY HAND.
// Produced by scripts/sync-movement-atlas.mjs from the Movement Atlas
// integration map (Work/movement-atlas/Integrations/web-application/APP-INTEGRATION-MAP.csv).
// To add a newly approved illustration: set its integration_status to
// ELIGIBLE in that map, then run `npm run atlas:sync`. No app source
// file needs to change.

export type AtlasView = {
  view: string;
  phase: string;
  primary: boolean;
  thumb: string;
  detail: string;
  dark: string | null;
  width: number;
  height: number;
  sourceWidth: number;
  sourceHeight: number;
  sourceSha256: string;
};

export type AtlasEntry = {
  appId: string;
  atlasId: string;
  primary: AtlasView;
  views: AtlasView[];
  sourceSha256: string;
};

export const MOVEMENT_ATLAS: Record<string, AtlasEntry> = {
  "abwheel": {
    "appId": "abwheel",
    "atlasId": "abwheel",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/abwheel-bok-f1-773d4d2a-thumb.webp",
      "detail": "/movement-atlas/abwheel-bok-f1-773d4d2a-detail.webp",
      "dark": null,
      "width": 1609,
      "height": 1609,
      "sourceWidth": 1609,
      "sourceHeight": 978,
      "sourceSha256": "773d4d2a0e7ca6935298dacf4233c612fd72596614c53f892e7e26a6f38374ca"
    },
    "views": [],
    "sourceSha256": "773d4d2a0e7ca6935298dacf4233c612fd72596614c53f892e7e26a6f38374ca"
  },
  "activehang": {
    "appId": "activehang",
    "atlasId": "activehang",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/activehang-bok-f1-17b4e690-thumb.webp",
      "detail": "/movement-atlas/activehang-bok-f1-17b4e690-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "17b4e69045dc85c74ff0ef6ef3eb6cd92220407a9a8d5eade971a7269637dc12"
    },
    "views": [],
    "sourceSha256": "17b4e69045dc85c74ff0ef6ef3eb6cd92220407a9a8d5eade971a7269637dc12"
  },
  "advtucklever": {
    "appId": "advtucklever",
    "atlasId": "advtucklever",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/advtucklever-bok-f1-339f5eba-thumb.webp",
      "detail": "/movement-atlas/advtucklever-bok-f1-339f5eba-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "339f5ebaa547c37b37f40da98fea751b5b14d1e2790f3f5c8670dd711b88dbd6"
    },
    "views": [],
    "sourceSha256": "339f5ebaa547c37b37f40da98fea751b5b14d1e2790f3f5c8670dd711b88dbd6"
  },
  "advtuckplanche": {
    "appId": "advtuckplanche",
    "atlasId": "advtuckplanche",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/advtuckplanche-bok-f1-91060a6c-thumb.webp",
      "detail": "/movement-atlas/advtuckplanche-bok-f1-91060a6c-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "91060a6c9bdf587704e4bf789869dcda6d256a0105564fbf4ebfdfa5a784158b"
    },
    "views": [],
    "sourceSha256": "91060a6c9bdf587704e4bf789869dcda6d256a0105564fbf4ebfdfa5a784158b"
  },
  "an_armswing": {
    "appId": "an_armswing",
    "atlasId": "an_armswing",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_armswing-bok-f1-fa3a0542-thumb.webp",
      "detail": "/movement-atlas/an_armswing-bok-f1-fa3a0542-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "fa3a05429a1f7d7a25980935ea19489e056592498c136692c48488d7a26faa4b"
    },
    "views": [],
    "sourceSha256": "fa3a05429a1f7d7a25980935ea19489e056592498c136692c48488d7a26faa4b"
  },
  "an_bbcurl": {
    "appId": "an_bbcurl",
    "atlasId": "an_bbcurl",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_bbcurl-bok-f1-3d26cfd6-thumb.webp",
      "detail": "/movement-atlas/an_bbcurl-bok-f1-3d26cfd6-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "3d26cfd6b949d7103a87b51ab5e4e27b52789e459bbb2f0e4f85db55b7c61baa"
    },
    "views": [],
    "sourceSha256": "3d26cfd6b949d7103a87b51ab5e4e27b52789e459bbb2f0e4f85db55b7c61baa"
  },
  "an_benchdbrow": {
    "appId": "an_benchdbrow",
    "atlasId": "an_benchdbrow",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_benchdbrow-bok-f1-cf3f420c-thumb.webp",
      "detail": "/movement-atlas/an_benchdbrow-bok-f1-cf3f420c-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "cf3f420c71348d19d5f5ffe54533bfe68583177f9b99e9585a28075827ae66d3"
    },
    "views": [],
    "sourceSha256": "cf3f420c71348d19d5f5ffe54533bfe68583177f9b99e9585a28075827ae66d3"
  },
  "an_bnpullup": {
    "appId": "an_bnpullup",
    "atlasId": "an_bnpullup",
    "primary": {
      "view": "zada",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_bnpullup-zada-f1-ed10224c-thumb.webp",
      "detail": "/movement-atlas/an_bnpullup-zada-f1-ed10224c-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "ed10224c1402fd0f62a662dea65a446fb37a1a30988b6fcecdb4db34f84fc71c"
    },
    "views": [],
    "sourceSha256": "ed10224c1402fd0f62a662dea65a446fb37a1a30988b6fcecdb4db34f84fc71c"
  },
  "an_boxdeadlift": {
    "appId": "an_boxdeadlift",
    "atlasId": "an_boxdeadlift",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_boxdeadlift-bok-f1-925915a8-thumb.webp",
      "detail": "/movement-atlas/an_boxdeadlift-bok-f1-925915a8-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "925915a80208fe2707d33354d3b99494a5efe9f46646459aad03566a0656d2e7"
    },
    "views": [],
    "sourceSha256": "925915a80208fe2707d33354d3b99494a5efe9f46646459aad03566a0656d2e7"
  },
  "an_cablecurl": {
    "appId": "an_cablecurl",
    "atlasId": "an_cablecurl",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_cablecurl-bok-f1-98f9be9d-thumb.webp",
      "detail": "/movement-atlas/an_cablecurl-bok-f1-98f9be9d-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "98f9be9d42cca07bac14200af4377999e77e0440865bac15231a565784c10ed0"
    },
    "views": [],
    "sourceSha256": "98f9be9d42cca07bac14200af4377999e77e0440865bac15231a565784c10ed0"
  },
  "an_cgbench": {
    "appId": "an_cgbench",
    "atlasId": "an_cgbench",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_cgbench-bok-f1-533c13c3-thumb.webp",
      "detail": "/movement-atlas/an_cgbench-bok-f1-533c13c3-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "533c13c3dee50bdc6815c66c6f6c6122ef491ca38945413748398eb0107eed40"
    },
    "views": [],
    "sourceSha256": "533c13c3dee50bdc6815c66c6f6c6122ef491ca38945413748398eb0107eed40"
  },
  "an_chainbench": {
    "appId": "an_chainbench",
    "atlasId": "an_chainbench",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_chainbench-bok-f1-bb00cc18-thumb.webp",
      "detail": "/movement-atlas/an_chainbench-bok-f1-bb00cc18-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "bb00cc18d8b7c06e6e563902b29d26851fad86a42dc3f241d0943cd32dab7a22"
    },
    "views": [],
    "sourceSha256": "bb00cc18d8b7c06e6e563902b29d26851fad86a42dc3f241d0943cd32dab7a22"
  },
  "an_dbbench": {
    "appId": "an_dbbench",
    "atlasId": "an_dbbench",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_dbbench-bok-f1-a97eef49-thumb.webp",
      "detail": "/movement-atlas/an_dbbench-bok-f1-a97eef49-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "a97eef49530721abdf632e3a7a2ead8aabf2ed686a7d1e26b93185eeb6fee0db"
    },
    "views": [],
    "sourceSha256": "a97eef49530721abdf632e3a7a2ead8aabf2ed686a7d1e26b93185eeb6fee0db"
  },
  "an_dbdeadlift": {
    "appId": "an_dbdeadlift",
    "atlasId": "an_dbdeadlift",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_dbdeadlift-bok-f1-d381e177-thumb.webp",
      "detail": "/movement-atlas/an_dbdeadlift-bok-f1-d381e177-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "d381e177ea5157da7f6e5f12b7cf07c8f8502ae69d9af1d7881f7351a0e5bb8a"
    },
    "views": [],
    "sourceSha256": "d381e177ea5157da7f6e5f12b7cf07c8f8502ae69d9af1d7881f7351a0e5bb8a"
  },
  "an_dbfrontsquat": {
    "appId": "an_dbfrontsquat",
    "atlasId": "an_dbfrontsquat",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_dbfrontsquat-bok-f1-3da0698a-thumb.webp",
      "detail": "/movement-atlas/an_dbfrontsquat-bok-f1-3da0698a-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "3da0698ae0e3205f0fcd117c9cd4795b19d81a1c000d2a5e3694c485fb148ce6"
    },
    "views": [],
    "sourceSha256": "3da0698ae0e3205f0fcd117c9cd4795b19d81a1c000d2a5e3694c485fb148ce6"
  },
  "an_dbpullover": {
    "appId": "an_dbpullover",
    "atlasId": "an_dbpullover",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_dbpullover-bok-f1-fe5603ea-thumb.webp",
      "detail": "/movement-atlas/an_dbpullover-bok-f1-fe5603ea-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1402,
      "sourceHeight": 1122,
      "sourceSha256": "fe5603ea9b6dd7e7d41076bf5b98556e001d256fe530a5915e069d633dca173a"
    },
    "views": [],
    "sourceSha256": "fe5603ea9b6dd7e7d41076bf5b98556e001d256fe530a5915e069d633dca173a"
  },
  "an_dbshrug": {
    "appId": "an_dbshrug",
    "atlasId": "an_dbshrug",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_dbshrug-bok-f1-b607c67d-thumb.webp",
      "detail": "/movement-atlas/an_dbshrug-bok-f1-b607c67d-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "b607c67d6aca24194598e97b178123f15d3db5633d9b047bd0de80a468e4f80e"
    },
    "views": [],
    "sourceSha256": "b607c67d6aca24194598e97b178123f15d3db5633d9b047bd0de80a468e4f80e"
  },
  "an_defdeadlift": {
    "appId": "an_defdeadlift",
    "atlasId": "an_defdeadlift",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_defdeadlift-bok-f1-0b9ac3c5-thumb.webp",
      "detail": "/movement-atlas/an_defdeadlift-bok-f1-0b9ac3c5-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "0b9ac3c55edc0c8a0ee0200ee9a5ca03d4e19ca75e11b3bf32d3e44398a0df42"
    },
    "views": [],
    "sourceSha256": "0b9ac3c55edc0c8a0ee0200ee9a5ca03d4e19ca75e11b3bf32d3e44398a0df42"
  },
  "an_floorpress": {
    "appId": "an_floorpress",
    "atlasId": "an_floorpress",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_floorpress-bok-f1-93ba43f2-thumb.webp",
      "detail": "/movement-atlas/an_floorpress-bok-f1-93ba43f2-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "93ba43f2c37c4a8f0ebdef08dba518c396544b9c8782c3b2537f91193c199ac2"
    },
    "views": [],
    "sourceSha256": "93ba43f2c37c4a8f0ebdef08dba518c396544b9c8782c3b2537f91193c199ac2"
  },
  "an_frenchpress": {
    "appId": "an_frenchpress",
    "atlasId": "an_frenchpress",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_frenchpress-bok-f1-d42b2596-thumb.webp",
      "detail": "/movement-atlas/an_frenchpress-bok-f1-d42b2596-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "d42b2596e92c9ef49cabeaacbe5c0920eec36f9b4d70a64c6d5153da81bc05d1"
    },
    "views": [],
    "sourceSha256": "d42b2596e92c9ef49cabeaacbe5c0920eec36f9b4d70a64c6d5153da81bc05d1"
  },
  "an_frontraise": {
    "appId": "an_frontraise",
    "atlasId": "an_frontraise",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_frontraise-bok-f1-49f6faf7-thumb.webp",
      "detail": "/movement-atlas/an_frontraise-bok-f1-49f6faf7-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "49f6faf781be3ba467f83c5cc8de35cb0fc0110ed23fa6acab68271f5596edeb"
    },
    "views": [],
    "sourceSha256": "49f6faf781be3ba467f83c5cc8de35cb0fc0110ed23fa6acab68271f5596edeb"
  },
  "an_hammer": {
    "appId": "an_hammer",
    "atlasId": "an_hammer",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_hammer-bok-f1-fe9993aa-thumb.webp",
      "detail": "/movement-atlas/an_hammer-bok-f1-fe9993aa-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "fe9993aaf0b107625d3dd73f183bc74486c90e03229c634e17bf44280adc7b33"
    },
    "views": [],
    "sourceSha256": "fe9993aaf0b107625d3dd73f183bc74486c90e03229c634e17bf44280adc7b33"
  },
  "an_heeltouch": {
    "appId": "an_heeltouch",
    "atlasId": "an_heeltouch",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_heeltouch-bok-f1-be2c06eb-thumb.webp",
      "detail": "/movement-atlas/an_heeltouch-bok-f1-be2c06eb-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "be2c06eb50e32f4b0fc3ca1b2db59b51ae2ebcf83217a86b93c5951ab20de982"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/an_heeltouch-bok-f2-78f604df-thumb.webp",
        "detail": "/movement-atlas/an_heeltouch-bok-f2-78f604df-detail.webp",
        "dark": null,
        "width": 1306,
        "height": 1306,
        "sourceWidth": 1306,
        "sourceHeight": 1204,
        "sourceSha256": "78f604df71332c6c58562479a4579b743a6f513bbaba8b6cdb6bfb39c56d1a1d"
      }
    ],
    "sourceSha256": "be2c06eb50e32f4b0fc3ca1b2db59b51ae2ebcf83217a86b93c5951ab20de982"
  },
  "an_highjump": {
    "appId": "an_highjump",
    "atlasId": "an_highjump",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_highjump-bok-f1-64682a71-thumb.webp",
      "detail": "/movement-atlas/an_highjump-bok-f1-64682a71-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1122,
      "sourceHeight": 1402,
      "sourceSha256": "64682a71bc0df102b0e837015a302852a3f8e1590d8bfb83d96290ac64097ddc"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/an_highjump-bok-f2-a02400e8-thumb.webp",
        "detail": "/movement-atlas/an_highjump-bok-f2-a02400e8-detail.webp",
        "dark": null,
        "width": 1402,
        "height": 1402,
        "sourceWidth": 1122,
        "sourceHeight": 1402,
        "sourceSha256": "a02400e8d93b2b9b57f9ccb210d945c13874d0d1ba13216cc51353cf99bed7c8"
      },
      {
        "view": "bok",
        "phase": "f3",
        "primary": false,
        "thumb": "/movement-atlas/an_highjump-bok-f3-9f056b05-thumb.webp",
        "detail": "/movement-atlas/an_highjump-bok-f3-9f056b05-detail.webp",
        "dark": null,
        "width": 1402,
        "height": 1402,
        "sourceWidth": 1122,
        "sourceHeight": 1402,
        "sourceSha256": "9f056b0519fc4b1b19991df31b68fab49c29ce09b83c6909a51e021e2b2a1def"
      }
    ],
    "sourceSha256": "64682a71bc0df102b0e837015a302852a3f8e1590d8bfb83d96290ac64097ddc"
  },
  "an_hyperext": {
    "appId": "an_hyperext",
    "atlasId": "an_hyperext",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_hyperext-bok-f1-a25004d5-thumb.webp",
      "detail": "/movement-atlas/an_hyperext-bok-f1-a25004d5-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "a25004d579c8faf4f91a62e84c570f1a4342a43ccde6135c5e4dc1b17183f364"
    },
    "views": [],
    "sourceSha256": "a25004d579c8faf4f91a62e84c570f1a4342a43ccde6135c5e4dc1b17183f364"
  },
  "an_inclbench": {
    "appId": "an_inclbench",
    "atlasId": "an_inclbench",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_inclbench-bok-f1-08fa69c8-thumb.webp",
      "detail": "/movement-atlas/an_inclbench-bok-f1-08fa69c8-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "08fa69c8d2929574403dabda39f7c5108502221c3b04dfae36f786bd281a5bd9"
    },
    "views": [],
    "sourceSha256": "08fa69c8d2929574403dabda39f7c5108502221c3b04dfae36f786bd281a5bd9"
  },
  "an_inclcurl": {
    "appId": "an_inclcurl",
    "atlasId": "an_inclcurl",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_inclcurl-bok-f1-8b453996-thumb.webp",
      "detail": "/movement-atlas/an_inclcurl-bok-f1-8b453996-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1402,
      "sourceHeight": 1122,
      "sourceSha256": "8b45399689c92574accc04af292dcac8b412a95b60828ae3df54aa9652b20a89"
    },
    "views": [],
    "sourceSha256": "8b45399689c92574accc04af292dcac8b412a95b60828ae3df54aa9652b20a89"
  },
  "an_incldbpress": {
    "appId": "an_incldbpress",
    "atlasId": "an_incldbpress",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_incldbpress-bok-f1-9b36ac82-thumb.webp",
      "detail": "/movement-atlas/an_incldbpress-bok-f1-9b36ac82-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "9b36ac824f061ceba3ac8dc2d0d8f54e32626bc4045e2fcdaa9ca913ea37ab48"
    },
    "views": [],
    "sourceSha256": "9b36ac824f061ceba3ac8dc2d0d8f54e32626bc4045e2fcdaa9ca913ea37ab48"
  },
  "an_inclfrench": {
    "appId": "an_inclfrench",
    "atlasId": "an_inclfrench",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_inclfrench-bok-f1-6f5f0483-thumb.webp",
      "detail": "/movement-atlas/an_inclfrench-bok-f1-6f5f0483-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "6f5f0483fcf93231fdb523af2ab69172bf33f6f53161ab2687fa2e31fef307ea"
    },
    "views": [],
    "sourceSha256": "6f5f0483fcf93231fdb523af2ab69172bf33f6f53161ab2687fa2e31fef307ea"
  },
  "an_narrowdbpress": {
    "appId": "an_narrowdbpress",
    "atlasId": "an_narrowdbpress",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_narrowdbpress-bok-f1-06875444-thumb.webp",
      "detail": "/movement-atlas/an_narrowdbpress-bok-f1-06875444-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "0687544453213d04466b3acc16f2032607d8dc1e5e29eebf81888e44995bbf62"
    },
    "views": [],
    "sourceSha256": "0687544453213d04466b3acc16f2032607d8dc1e5e29eebf81888e44995bbf62"
  },
  "an_oadbbench": {
    "appId": "an_oadbbench",
    "atlasId": "an_oadbbench",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_oadbbench-bok-f1-39180da2-thumb.webp",
      "detail": "/movement-atlas/an_oadbbench-bok-f1-39180da2-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "39180da2403804c69de1d05dd497a3b3ce04551c8d1e15b760338e9b0d8f3693"
    },
    "views": [],
    "sourceSha256": "39180da2403804c69de1d05dd497a3b3ce04551c8d1e15b760338e9b0d8f3693"
  },
  "an_ohcabletri": {
    "appId": "an_ohcabletri",
    "atlasId": "an_ohcabletri",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_ohcabletri-bok-f1-71af672b-thumb.webp",
      "detail": "/movement-atlas/an_ohcabletri-bok-f1-71af672b-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "71af672bebd6ffec519b284da4fae8dc8f652d1b3be428a721f20084fe1fa5b9"
    },
    "views": [],
    "sourceSha256": "71af672bebd6ffec519b284da4fae8dc8f652d1b3be428a721f20084fe1fa5b9"
  },
  "an_pausesquat": {
    "appId": "an_pausesquat",
    "atlasId": "an_pausesquat",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_pausesquat-bok-f1-cf6802ad-thumb.webp",
      "detail": "/movement-atlas/an_pausesquat-bok-f1-cf6802ad-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "cf6802ad77510739eb6277de5ca97e10970249c00c8422332fec4dbd07932037"
    },
    "views": [],
    "sourceSha256": "cf6802ad77510739eb6277de5ca97e10970249c00c8422332fec4dbd07932037"
  },
  "an_revcurl": {
    "appId": "an_revcurl",
    "atlasId": "an_revcurl",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_revcurl-bok-f1-e6fdc892-thumb.webp",
      "detail": "/movement-atlas/an_revcurl-bok-f1-e6fdc892-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "e6fdc892a2816c3682f4a895ce5b1eb2ab415844514ecfe06a6b09ff11b137e1"
    },
    "views": [],
    "sourceSha256": "e6fdc892a2816c3682f4a895ce5b1eb2ab415844514ecfe06a6b09ff11b137e1"
  },
  "an_revlunge": {
    "appId": "an_revlunge",
    "atlasId": "an_revlunge",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_revlunge-bok-f1-3b94872d-thumb.webp",
      "detail": "/movement-atlas/an_revlunge-bok-f1-3b94872d-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "3b94872d8852446804b4477fff7d2b8036e99b7ce770d0a988269664bddf99f2"
    },
    "views": [],
    "sourceSha256": "3b94872d8852446804b4477fff7d2b8036e99b7ce770d0a988269664bddf99f2"
  },
  "an_scaphang": {
    "appId": "an_scaphang",
    "atlasId": "an_scaphang",
    "primary": {
      "view": "zada",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_scaphang-zada-f1-63b0b2cb-thumb.webp",
      "detail": "/movement-atlas/an_scaphang-zada-f1-63b0b2cb-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1086,
      "sourceHeight": 1448,
      "sourceSha256": "63b0b2cb368de40aa65ffc14c84b94d4b3c781a2b2ff53c705e51c9b800946e3"
    },
    "views": [],
    "sourceSha256": "63b0b2cb368de40aa65ffc14c84b94d4b3c781a2b2ff53c705e51c9b800946e3"
  },
  "an_scissors": {
    "appId": "an_scissors",
    "atlasId": "an_scissors",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_scissors-bok-f1-0ea42f7b-thumb.webp",
      "detail": "/movement-atlas/an_scissors-bok-f1-0ea42f7b-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "0ea42f7b65364e2d31cf453154cedbed9b170365671c8e87533946119d2862e2"
    },
    "views": [],
    "sourceSha256": "0ea42f7b65364e2d31cf453154cedbed9b170365671c8e87533946119d2862e2"
  },
  "an_seateddbpress": {
    "appId": "an_seateddbpress",
    "atlasId": "an_seateddbpress",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_seateddbpress-bok-f1-ba9822c5-thumb.webp",
      "detail": "/movement-atlas/an_seateddbpress-bok-f1-ba9822c5-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1086,
      "sourceHeight": 1448,
      "sourceSha256": "ba9822c5a63974a010837906854b181ba4f56d3230c28fbb0146edde22c3cffd"
    },
    "views": [],
    "sourceSha256": "ba9822c5a63974a010837906854b181ba4f56d3230c28fbb0146edde22c3cffd"
  },
  "an_seatedshrug": {
    "appId": "an_seatedshrug",
    "atlasId": "an_seatedshrug",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_seatedshrug-bok-f1-d04d0b6e-thumb.webp",
      "detail": "/movement-atlas/an_seatedshrug-bok-f1-d04d0b6e-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "d04d0b6e9eee716ff9a9f6de1462e31a69c6a2a8c21c54db2791496923e06b18"
    },
    "views": [],
    "sourceSha256": "d04d0b6e9eee716ff9a9f6de1462e31a69c6a2a8c21c54db2791496923e06b18"
  },
  "an_splitsquat": {
    "appId": "an_splitsquat",
    "atlasId": "an_splitsquat",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_splitsquat-bok-f1-4828156b-thumb.webp",
      "detail": "/movement-atlas/an_splitsquat-bok-f1-4828156b-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "4828156bed4595f781a359f61208b081fbc8cd19ce1cc256583f0ba54fb2b142"
    },
    "views": [],
    "sourceSha256": "4828156bed4595f781a359f61208b081fbc8cd19ce1cc256583f0ba54fb2b142"
  },
  "an_sumodeadlift": {
    "appId": "an_sumodeadlift",
    "atlasId": "an_sumodeadlift",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_sumodeadlift-predek-f1-222b11ac-thumb.webp",
      "detail": "/movement-atlas/an_sumodeadlift-predek-f1-222b11ac-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "222b11acbcc19f519d8808de54cd0015511c979b8df9c20bf78ae34f8c34a219"
    },
    "views": [],
    "sourceSha256": "222b11acbcc19f519d8808de54cd0015511c979b8df9c20bf78ae34f8c34a219"
  },
  "an_svend": {
    "appId": "an_svend",
    "atlasId": "an_svend",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_svend-bok-f1-7a1a5599-thumb.webp",
      "detail": "/movement-atlas/an_svend-bok-f1-7a1a5599-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "7a1a5599fb40820422eeaf32031dce372b10e79644fde456e889ca3d0e803384"
    },
    "views": [],
    "sourceSha256": "7a1a5599fb40820422eeaf32031dce372b10e79644fde456e889ca3d0e803384"
  },
  "an_vertjump": {
    "appId": "an_vertjump",
    "atlasId": "an_vertjump",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_vertjump-bok-f1-64682a71-thumb.webp",
      "detail": "/movement-atlas/an_vertjump-bok-f1-64682a71-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1122,
      "sourceHeight": 1402,
      "sourceSha256": "64682a71bc0df102b0e837015a302852a3f8e1590d8bfb83d96290ac64097ddc"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/an_vertjump-bok-f2-a02400e8-thumb.webp",
        "detail": "/movement-atlas/an_vertjump-bok-f2-a02400e8-detail.webp",
        "dark": null,
        "width": 1402,
        "height": 1402,
        "sourceWidth": 1122,
        "sourceHeight": 1402,
        "sourceSha256": "a02400e8d93b2b9b57f9ccb210d945c13874d0d1ba13216cc51353cf99bed7c8"
      },
      {
        "view": "bok",
        "phase": "f3",
        "primary": false,
        "thumb": "/movement-atlas/an_vertjump-bok-f3-9f056b05-thumb.webp",
        "detail": "/movement-atlas/an_vertjump-bok-f3-9f056b05-detail.webp",
        "dark": null,
        "width": 1402,
        "height": 1402,
        "sourceWidth": 1122,
        "sourceHeight": 1402,
        "sourceSha256": "9f056b0519fc4b1b19991df31b68fab49c29ce09b83c6909a51e021e2b2a1def"
      }
    ],
    "sourceSha256": "64682a71bc0df102b0e837015a302852a3f8e1590d8bfb83d96290ac64097ddc"
  },
  "an_walklunge": {
    "appId": "an_walklunge",
    "atlasId": "an_walklunge",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_walklunge-bok-f1-d2f14a3b-thumb.webp",
      "detail": "/movement-atlas/an_walklunge-bok-f1-d2f14a3b-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "d2f14a3b93f281036aaf9de64fcb88a524982438ff0ae0cb959157db0c73e8ca"
    },
    "views": [],
    "sourceSha256": "d2f14a3b93f281036aaf9de64fcb88a524982438ff0ae0cb959157db0c73e8ca"
  },
  "an_wpushup": {
    "appId": "an_wpushup",
    "atlasId": "an_wpushup",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/an_wpushup-bok-f1-643766b3-thumb.webp",
      "detail": "/movement-atlas/an_wpushup-bok-f1-643766b3-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "643766b3023fc232401b119f728d3810c075e5baf7c6e202a11c5ff676d0e01b"
    },
    "views": [],
    "sourceSha256": "643766b3023fc232401b119f728d3810c075e5baf7c6e202a11c5ff676d0e01b"
  },
  "anklemob": {
    "appId": "anklemob",
    "atlasId": "anklemob",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/anklemob-bok-f1-9abd45e7-thumb.webp",
      "detail": "/movement-atlas/anklemob-bok-f1-9abd45e7-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1402,
      "sourceHeight": 1122,
      "sourceSha256": "9abd45e7e3275e8be40a148d7b23d6305a9625b54bee458f17433620fafb57c3"
    },
    "views": [],
    "sourceSha256": "9abd45e7e3275e8be40a148d7b23d6305a9625b54bee458f17433620fafb57c3"
  },
  "archersq": {
    "appId": "archersq",
    "atlasId": "archersq",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/archersq-predek-f1-44b83232-thumb.webp",
      "detail": "/movement-atlas/archersq-predek-f1-44b83232-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "44b83232bda3c4dc9252f879f3c0b58ecf74d3d2c6fc4a52c592acc5e89030c1"
    },
    "views": [],
    "sourceSha256": "44b83232bda3c4dc9252f879f3c0b58ecf74d3d2c6fc4a52c592acc5e89030c1"
  },
  "archhold": {
    "appId": "archhold",
    "atlasId": "archhold",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/archhold-bok-f1-5358f44d-thumb.webp",
      "detail": "/movement-atlas/archhold-bok-f1-5358f44d-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "5358f44dfd8846988371bc770c5ec4646eda34f44dfb937dfc033984118b3da5"
    },
    "views": [],
    "sourceSha256": "5358f44dfd8846988371bc770c5ec4646eda34f44dfb937dfc033984118b3da5"
  },
  "archpull": {
    "appId": "archpull",
    "atlasId": "archpull",
    "primary": {
      "view": "zada",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/archpull-zada-f1-6bb84454-thumb.webp",
      "detail": "/movement-atlas/archpull-zada-f1-6bb84454-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "6bb84454ea277836db35118806eb23e6a4873ec59bd2c51ba1bbfd79a428a284"
    },
    "views": [],
    "sourceSha256": "6bb84454ea277836db35118806eb23e6a4873ec59bd2c51ba1bbfd79a428a284"
  },
  "archpush": {
    "appId": "archpush",
    "atlasId": "archpush",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/archpush-predek-f1-1098dc7d-thumb.webp",
      "detail": "/movement-atlas/archpush-predek-f1-1098dc7d-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "1098dc7db662b74ec862f69b8cc8fdaf621ca62625e15b23f918cc2a1d6f2092"
    },
    "views": [],
    "sourceSha256": "1098dc7db662b74ec862f69b8cc8fdaf621ca62625e15b23f918cc2a1d6f2092"
  },
  "archrow": {
    "appId": "archrow",
    "atlasId": "archrow",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/archrow-predek-f1-6c776c81-thumb.webp",
      "detail": "/movement-atlas/archrow-predek-f1-6c776c81-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1402,
      "sourceHeight": 1122,
      "sourceSha256": "6c776c81bcaee9a00cda227e9b5d59caf85faefe646baf37e91cb1f1e18eaba0"
    },
    "views": [],
    "sourceSha256": "6c776c81bcaee9a00cda227e9b5d59caf85faefe646baf37e91cb1f1e18eaba0"
  },
  "atgsplit": {
    "appId": "atgsplit",
    "atlasId": "atgsplit",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/atgsplit-bok-f1-a9432d44-thumb.webp",
      "detail": "/movement-atlas/atgsplit-bok-f1-a9432d44-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "a9432d4437c3246640bed88228cb17062b812ab42ad8ca10aa94dc66ff672480"
    },
    "views": [],
    "sourceSha256": "a9432d4437c3246640bed88228cb17062b812ab42ad8ca10aa94dc66ff672480"
  },
  "backlever": {
    "appId": "backlever",
    "atlasId": "backlever",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/backlever-bok-f1-d1cbda8d-thumb.webp",
      "detail": "/movement-atlas/backlever-bok-f1-d1cbda8d-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1402,
      "sourceHeight": 1122,
      "sourceSha256": "d1cbda8d3786ffd6fab1678c1816438f086a779c0a793bdb60908f57bcc45895"
    },
    "views": [],
    "sourceSha256": "d1cbda8d3786ffd6fab1678c1816438f086a779c0a793bdb60908f57bcc45895"
  },
  "banddip": {
    "appId": "banddip",
    "atlasId": "banddip",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/banddip-bok-f1-c553f585-thumb.webp",
      "detail": "/movement-atlas/banddip-bok-f1-c553f585-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1086,
      "sourceHeight": 1448,
      "sourceSha256": "c553f585a45e318c7b606c1743d168094fdc2236e25d8c32dbb7e0caf04aaee5"
    },
    "views": [],
    "sourceSha256": "c553f585a45e318c7b606c1743d168094fdc2236e25d8c32dbb7e0caf04aaee5"
  },
  "bandpull": {
    "appId": "bandpull",
    "atlasId": "bandpull",
    "primary": {
      "view": "zada",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/bandpull-zada-f1-d99badaf-thumb.webp",
      "detail": "/movement-atlas/bandpull-zada-f1-d99badaf-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "d99badafa37c25ad1008554a0750ecc40116b9ab1d4355e37d8aa09df3787865"
    },
    "views": [],
    "sourceSha256": "d99badafa37c25ad1008554a0750ecc40116b9ab1d4355e37d8aa09df3787865"
  },
  "bbrow": {
    "appId": "bbrow",
    "atlasId": "bbrow",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/bbrow-bok-f1-22f6c0b4-thumb.webp",
      "detail": "/movement-atlas/bbrow-bok-f1-22f6c0b4-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1402,
      "sourceHeight": 1122,
      "sourceSha256": "22f6c0b4b860b8ff919db3b5b390d50f23d7fa2819255c29c6a97186685bb8d1"
    },
    "views": [],
    "sourceSha256": "22f6c0b4b860b8ff919db3b5b390d50f23d7fa2819255c29c6a97186685bb8d1"
  },
  "bbsquat": {
    "appId": "bbsquat",
    "atlasId": "bbsquat",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/bbsquat-bok-f1-76c15143-thumb.webp",
      "detail": "/movement-atlas/bbsquat-bok-f1-76c15143-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "76c15143d1ed560fd013a2d10caa2424bf4c01e245f9bf1e9c676074e0853446"
    },
    "views": [],
    "sourceSha256": "76c15143d1ed560fd013a2d10caa2424bf4c01e245f9bf1e9c676074e0853446"
  },
  "bearcrawl": {
    "appId": "bearcrawl",
    "atlasId": "bearcrawl",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/bearcrawl-bok-f1-cac41b63-thumb.webp",
      "detail": "/movement-atlas/bearcrawl-bok-f1-cac41b63-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "cac41b638ce5ce6f2ee8f0b1a2052a800ef65ec2255d12b8bc68ec733654ead7"
    },
    "views": [],
    "sourceSha256": "cac41b638ce5ce6f2ee8f0b1a2052a800ef65ec2255d12b8bc68ec733654ead7"
  },
  "bench": {
    "appId": "bench",
    "atlasId": "bench",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/bench-bok-f1-41d08328-thumb.webp",
      "detail": "/movement-atlas/bench-bok-f1-41d08328-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "41d08328f84433ddf93f92a837b6f82318b07d38e7b043db078e1d1dcece696f"
    },
    "views": [],
    "sourceSha256": "41d08328f84433ddf93f92a837b6f82318b07d38e7b043db078e1d1dcece696f"
  },
  "benchdips": {
    "appId": "benchdips",
    "atlasId": "benchdips",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/benchdips-bok-f1-bdb88304-thumb.webp",
      "detail": "/movement-atlas/benchdips-bok-f1-bdb88304-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "bdb8830440283fdc362a4eb7ee2d7bb8461ed841fe64e9f13c373eb71086b505"
    },
    "views": [],
    "sourceSha256": "bdb8830440283fdc362a4eb7ee2d7bb8461ed841fe64e9f13c373eb71086b505"
  },
  "bentarmhs": {
    "appId": "bentarmhs",
    "atlasId": "bentarmhs",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/bentarmhs-bok-f1-f75a612c-thumb.webp",
      "detail": "/movement-atlas/bentarmhs-bok-f1-f75a612c-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "f75a612cd8894cecb99cc9b51cb175df58770db5d40a5060d714a2ef487cd9da"
    },
    "views": [],
    "sourceSha256": "f75a612cd8894cecb99cc9b51cb175df58770db5d40a5060d714a2ef487cd9da"
  },
  "bicycle": {
    "appId": "bicycle",
    "atlasId": "bicycle",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/bicycle-bok-f1-720a9692-thumb.webp",
      "detail": "/movement-atlas/bicycle-bok-f1-720a9692-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "720a9692da27c97a270a98a5a4d43a447a0652fa8f2a4378dd01928212cd8600"
    },
    "views": [],
    "sourceSha256": "720a9692da27c97a270a98a5a4d43a447a0652fa8f2a4378dd01928212cd8600"
  },
  "birddog": {
    "appId": "birddog",
    "atlasId": "birddog",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/birddog-bok-f1-3b59ccad-thumb.webp",
      "detail": "/movement-atlas/birddog-bok-f1-3b59ccad-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "3b59ccad9d6f7ff2eb6b62f98d6a3c7d18f1171a23e22f5b6d3e06a29dbc6a39"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/birddog-bok-f2-db5cfb07-thumb.webp",
        "detail": "/movement-atlas/birddog-bok-f2-db5cfb07-detail.webp",
        "dark": null,
        "width": 1536,
        "height": 1536,
        "sourceWidth": 1536,
        "sourceHeight": 1024,
        "sourceSha256": "db5cfb0759a388c00ca03cda7d9d2f2f49a92f07a14cca9f6811be42295b9157"
      }
    ],
    "sourceSha256": "3b59ccad9d6f7ff2eb6b62f98d6a3c7d18f1171a23e22f5b6d3e06a29dbc6a39"
  },
  "bodyrow": {
    "appId": "bodyrow",
    "atlasId": "bodyrow",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/bodyrow-bok-f1-b6ad802e-thumb.webp",
      "detail": "/movement-atlas/bodyrow-bok-f1-b6ad802e-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "b6ad802ef7853668506bb1c8f6f1a189a53aaabf2128c6e9f5056b499d3b3b8e"
    },
    "views": [],
    "sourceSha256": "b6ad802ef7853668506bb1c8f6f1a189a53aaabf2128c6e9f5056b499d3b3b8e"
  },
  "bosuoahs": {
    "appId": "bosuoahs",
    "atlasId": "bosuoahs",
    "primary": {
      "view": "zada",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/bosuoahs-zada-f1-7b4808e3-thumb.webp",
      "detail": "/movement-atlas/bosuoahs-zada-f1-7b4808e3-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "7b4808e3eac17fe755ba17598e6896801a6368bcb14cc701efc773835f1c0eca"
    },
    "views": [],
    "sourceSha256": "7b4808e3eac17fe755ba17598e6896801a6368bcb14cc701efc773835f1c0eca"
  },
  "boxbreath": {
    "appId": "boxbreath",
    "atlasId": "boxbreath",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/boxbreath-bok-f1-7ee66515-thumb.webp",
      "detail": "/movement-atlas/boxbreath-bok-f1-7ee66515-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1122,
      "sourceHeight": 1402,
      "sourceSha256": "7ee665156e54d7c7b69d62d435f8e7d2803b3a807c4c25896ccd8afd1763f0bf"
    },
    "views": [],
    "sourceSha256": "7ee665156e54d7c7b69d62d435f8e7d2803b3a807c4c25896ccd8afd1763f0bf"
  },
  "boxjump": {
    "appId": "boxjump",
    "atlasId": "boxjump",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/boxjump-bok-f1-ccdf6da1-thumb.webp",
      "detail": "/movement-atlas/boxjump-bok-f1-ccdf6da1-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "ccdf6da15ff0c8a4544a54d6f9363879345e1dc5e4453b2b0fbb33c9087ceadf"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/boxjump-bok-f2-bd4c0998-thumb.webp",
        "detail": "/movement-atlas/boxjump-bok-f2-bd4c0998-detail.webp",
        "dark": null,
        "width": 1254,
        "height": 1254,
        "sourceWidth": 1254,
        "sourceHeight": 1254,
        "sourceSha256": "bd4c09984610ca9b31acae7c498236c3a113fd9bd1953515f64b07777d8ca756"
      },
      {
        "view": "bok",
        "phase": "f3",
        "primary": false,
        "thumb": "/movement-atlas/boxjump-bok-f3-665382e8-thumb.webp",
        "detail": "/movement-atlas/boxjump-bok-f3-665382e8-detail.webp",
        "dark": null,
        "width": 1254,
        "height": 1254,
        "sourceWidth": 1254,
        "sourceHeight": 1254,
        "sourceSha256": "665382e87a45257106da1bf79e636dc1025279737d95b5bdaff6c4e9607ec4a3"
      }
    ],
    "sourceSha256": "ccdf6da15ff0c8a4544a54d6f9363879345e1dc5e4453b2b0fbb33c9087ceadf"
  },
  "boxpistol": {
    "appId": "boxpistol",
    "atlasId": "boxpistol",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/boxpistol-bok-f1-ef6ca81d-thumb.webp",
      "detail": "/movement-atlas/boxpistol-bok-f1-ef6ca81d-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "ef6ca81d10279fc68db95ec66fef061a571407cb4f237056683d63199f0788f8"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/boxpistol-bok-f2-f58cc1e7-thumb.webp",
        "detail": "/movement-atlas/boxpistol-bok-f2-f58cc1e7-detail.webp",
        "dark": null,
        "width": 1254,
        "height": 1254,
        "sourceWidth": 1254,
        "sourceHeight": 1254,
        "sourceSha256": "f58cc1e798fa69ed4671b1f56fa1dff7cf3f1dd2182b1da0b1b7101139aa9331"
      }
    ],
    "sourceSha256": "ef6ca81d10279fc68db95ec66fef061a571407cb4f237056683d63199f0788f8"
  },
  "bridge": {
    "appId": "bridge",
    "atlasId": "bridge",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/bridge-bok-f1-48c0e254-thumb.webp",
      "detail": "/movement-atlas/bridge-bok-f1-48c0e254-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "48c0e2544b4274a86db5e84595d684981cfa1d922e5544f4e528cf56f76bb007"
    },
    "views": [],
    "sourceSha256": "48c0e2544b4274a86db5e84595d684981cfa1d922e5544f4e528cf56f76bb007"
  },
  "broadjump": {
    "appId": "broadjump",
    "atlasId": "broadjump",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/broadjump-bok-f1-52074ab9-thumb.webp",
      "detail": "/movement-atlas/broadjump-bok-f1-52074ab9-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1402,
      "sourceHeight": 1122,
      "sourceSha256": "52074ab9c34bd3d4147ea9a9bad04682036b68be6de4a389dadfdc7408b29626"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/broadjump-bok-f2-de4a8e1a-thumb.webp",
        "detail": "/movement-atlas/broadjump-bok-f2-de4a8e1a-detail.webp",
        "dark": null,
        "width": 1402,
        "height": 1402,
        "sourceWidth": 1402,
        "sourceHeight": 1122,
        "sourceSha256": "de4a8e1a3d1235a5830edc74deb8c914bd6104644fadbc5dfdd224d7e8e6692a"
      },
      {
        "view": "bok",
        "phase": "f3",
        "primary": false,
        "thumb": "/movement-atlas/broadjump-bok-f3-e4ba03ba-thumb.webp",
        "detail": "/movement-atlas/broadjump-bok-f3-e4ba03ba-detail.webp",
        "dark": null,
        "width": 1402,
        "height": 1402,
        "sourceWidth": 1402,
        "sourceHeight": 1122,
        "sourceSha256": "e4ba03ba857c286935fc67586cfffe72545a46e003b80d36aebcfa52319a4842"
      }
    ],
    "sourceSha256": "52074ab9c34bd3d4147ea9a9bad04682036b68be6de4a389dadfdc7408b29626"
  },
  "bulgariandip": {
    "appId": "bulgariandip",
    "atlasId": "bulgariandip",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/bulgariandip-predek-f1-5e78dcd1-thumb.webp",
      "detail": "/movement-atlas/bulgariandip-predek-f1-5e78dcd1-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "5e78dcd1de0bc216e62b6c4a57c25628ec20b898f3a8b072dd8f7af8384b272c"
    },
    "views": [],
    "sourceSha256": "5e78dcd1de0bc216e62b6c4a57c25628ec20b898f3a8b072dd8f7af8384b272c"
  },
  "bulgsplit": {
    "appId": "bulgsplit",
    "atlasId": "bulgsplit",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/bulgsplit-bok-f1-33a713cc-thumb.webp",
      "detail": "/movement-atlas/bulgsplit-bok-f1-33a713cc-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "33a713cc78df7a5f32170ffed67d52778aa253a5d16ee7c1c21c85d522ad8025"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/bulgsplit-bok-f2-d9bd63c5-thumb.webp",
        "detail": "/movement-atlas/bulgsplit-bok-f2-d9bd63c5-detail.webp",
        "dark": null,
        "width": 1254,
        "height": 1254,
        "sourceWidth": 1254,
        "sourceHeight": 1254,
        "sourceSha256": "d9bd63c51e2c8aac50cd761e8a24aae6628f8f8a938ce64cb5eb97c91e48e68f"
      }
    ],
    "sourceSha256": "33a713cc78df7a5f32170ffed67d52778aa253a5d16ee7c1c21c85d522ad8025"
  },
  "burpee": {
    "appId": "burpee",
    "atlasId": "burpee",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/burpee-bok-f1-ea30abdf-thumb.webp",
      "detail": "/movement-atlas/burpee-bok-f1-ea30abdf-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "ea30abdfd71325ff8a71317152e10bc005946451f8e72734765517d78080a761"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/burpee-bok-f2-18193372-thumb.webp",
        "detail": "/movement-atlas/burpee-bok-f2-18193372-detail.webp",
        "dark": null,
        "width": 1536,
        "height": 1536,
        "sourceWidth": 1536,
        "sourceHeight": 1024,
        "sourceSha256": "1819337247610568c713402d9cfd8ffd370f1466bd712a6969b1854531ce3158"
      },
      {
        "view": "bok",
        "phase": "f3",
        "primary": false,
        "thumb": "/movement-atlas/burpee-bok-f3-af9f5f73-thumb.webp",
        "detail": "/movement-atlas/burpee-bok-f3-af9f5f73-detail.webp",
        "dark": null,
        "width": 1536,
        "height": 1536,
        "sourceWidth": 1024,
        "sourceHeight": 1536,
        "sourceSha256": "af9f5f73738021fc902510e017247b5d6228b8e0e532ea8f88daa2716481c961"
      }
    ],
    "sourceSha256": "ea30abdfd71325ff8a71317152e10bc005946451f8e72734765517d78080a761"
  },
  "butterfly": {
    "appId": "butterfly",
    "atlasId": "butterfly",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/butterfly-predek-f1-d5944b1c-thumb.webp",
      "detail": "/movement-atlas/butterfly-predek-f1-d5944b1c-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1402,
      "sourceHeight": 1122,
      "sourceSha256": "d5944b1ce5bea6192710d1145cabbac6f73edf91dea0deb2ab07378536468481"
    },
    "views": [],
    "sourceSha256": "d5944b1ce5bea6192710d1145cabbac6f73edf91dea0deb2ab07378536468481"
  },
  "bwcurl": {
    "appId": "bwcurl",
    "atlasId": "bwcurl",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/bwcurl-bok-f1-364133f5-thumb.webp",
      "detail": "/movement-atlas/bwcurl-bok-f1-364133f5-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "364133f52afb8199d189f6ab6f9565db6e60153be9b31e44124d7ced616c6428"
    },
    "views": [],
    "sourceSha256": "364133f52afb8199d189f6ab6f9565db6e60153be9b31e44124d7ced616c6428"
  },
  "cablefly": {
    "appId": "cablefly",
    "atlasId": "cablefly",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/cablefly-predek-f1-7a6b52a9-thumb.webp",
      "detail": "/movement-atlas/cablefly-predek-f1-7a6b52a9-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1122,
      "sourceHeight": 1402,
      "sourceSha256": "7a6b52a996f44458dfd3be0b9997ba6827fb60a62274fc79f9098c118a34be30"
    },
    "views": [],
    "sourceSha256": "7a6b52a996f44458dfd3be0b9997ba6827fb60a62274fc79f9098c118a34be30"
  },
  "cablerow": {
    "appId": "cablerow",
    "atlasId": "cablerow",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/cablerow-bok-f1-0f15ce06-thumb.webp",
      "detail": "/movement-atlas/cablerow-bok-f1-0f15ce06-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "0f15ce06339dee623e845d19fe603705aeb2fe2a3a5da383294dd867b944f799"
    },
    "views": [],
    "sourceSha256": "0f15ce06339dee623e845d19fe603705aeb2fe2a3a5da383294dd867b944f799"
  },
  "calfraise": {
    "appId": "calfraise",
    "atlasId": "calfraise",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/calfraise-bok-f1-a55412d2-thumb.webp",
      "detail": "/movement-atlas/calfraise-bok-f1-a55412d2-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "a55412d22d93987c912a32b62b884fa8a1a46d731851648d0754362f950b3b75"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/calfraise-bok-f2-d65cd196-thumb.webp",
        "detail": "/movement-atlas/calfraise-bok-f2-d65cd196-detail.webp",
        "dark": null,
        "width": 1254,
        "height": 1254,
        "sourceWidth": 1254,
        "sourceHeight": 1254,
        "sourceSha256": "d65cd196f0812a5e8dbccc293e82cede1299dbf370284e6a787f08eba2e55f11"
      }
    ],
    "sourceSha256": "a55412d22d93987c912a32b62b884fa8a1a46d731851648d0754362f950b3b75"
  },
  "cat": {
    "appId": "cat",
    "atlasId": "cat",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/cat-bok-f1-269a75f0-thumb.webp",
      "detail": "/movement-atlas/cat-bok-f1-269a75f0-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "269a75f061275285631e40d4f64902e4e9239ef21f1f95e8fdcf8eb8a3685b56"
    },
    "views": [],
    "sourceSha256": "269a75f061275285631e40d4f64902e4e9239ef21f1f95e8fdcf8eb8a3685b56"
  },
  "childpose": {
    "appId": "childpose",
    "atlasId": "childpose",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/childpose-bok-f1-f1b5cea3-thumb.webp",
      "detail": "/movement-atlas/childpose-bok-f1-f1b5cea3-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "f1b5cea388d871712fbce9093c06f53ea35b10a91aa59fae178607360ad8a81c"
    },
    "views": [],
    "sourceSha256": "f1b5cea388d871712fbce9093c06f53ea35b10a91aa59fae178607360ad8a81c"
  },
  "chinup": {
    "appId": "chinup",
    "atlasId": "chinup",
    "primary": {
      "view": "zada",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/chinup-zada-f1-6be9e682-thumb.webp",
      "detail": "/movement-atlas/chinup-zada-f1-6be9e682-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "6be9e682877ca5b3fc2710ab910ba6082faac325173dff5d74bbf234771a1ef7"
    },
    "views": [],
    "sourceSha256": "6be9e682877ca5b3fc2710ab910ba6082faac325173dff5d74bbf234771a1ef7"
  },
  "clamshell": {
    "appId": "clamshell",
    "atlasId": "clamshell",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/clamshell-predek-f1-7d002325-thumb.webp",
      "detail": "/movement-atlas/clamshell-predek-f1-7d002325-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "7d002325d3b0aa6e1399291614ee30df388923145aaa6176ca338e04b4cf0ddc"
    },
    "views": [],
    "sourceSha256": "7d002325d3b0aa6e1399291614ee30df388923145aaa6176ca338e04b4cf0ddc"
  },
  "clappush": {
    "appId": "clappush",
    "atlasId": "clappush",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/clappush-bok-f1-8c1cf1ef-thumb.webp",
      "detail": "/movement-atlas/clappush-bok-f1-8c1cf1ef-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "8c1cf1efebda85bb3939532fd8d8ebaa6599ebc8772ba0f0e589dfe65211fc86"
    },
    "views": [],
    "sourceSha256": "8c1cf1efebda85bb3939532fd8d8ebaa6599ebc8772ba0f0e589dfe65211fc86"
  },
  "co2": {
    "appId": "co2",
    "atlasId": "co2",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/co2-bok-f1-7ee66515-thumb.webp",
      "detail": "/movement-atlas/co2-bok-f1-7ee66515-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1122,
      "sourceHeight": 1402,
      "sourceSha256": "7ee665156e54d7c7b69d62d435f8e7d2803b3a807c4c25896ccd8afd1763f0bf"
    },
    "views": [],
    "sourceSha256": "7ee665156e54d7c7b69d62d435f8e7d2803b3a807c4c25896ccd8afd1763f0bf"
  },
  "cobra": {
    "appId": "cobra",
    "atlasId": "cobra",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/cobra-bok-f1-a4b003a6-thumb.webp",
      "detail": "/movement-atlas/cobra-bok-f1-a4b003a6-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "a4b003a6c601a661db249c316da4057d3ece9ba3860060b4073fb4205e28d37d"
    },
    "views": [],
    "sourceSha256": "a4b003a6c601a661db249c316da4057d3ece9ba3860060b4073fb4205e28d37d"
  },
  "commando": {
    "appId": "commando",
    "atlasId": "commando",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/commando-bok-f1-fa07c83b-thumb.webp",
      "detail": "/movement-atlas/commando-bok-f1-fa07c83b-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "fa07c83bfa36c579e71d8120a447daec241ada4b5186344ae0a060690b6128a9"
    },
    "views": [
      {
        "view": "zada",
        "phase": "f1",
        "primary": true,
        "thumb": "/movement-atlas/commando-zada-f1-b89f6639-thumb.webp",
        "detail": "/movement-atlas/commando-zada-f1-b89f6639-detail.webp",
        "dark": null,
        "width": 1536,
        "height": 1536,
        "sourceWidth": 1024,
        "sourceHeight": 1536,
        "sourceSha256": "b89f66397cbf6cc3fecb935b5168072105eb939acdb666b6c3b9e7c22d961ae9"
      }
    ],
    "sourceSha256": "fa07c83bfa36c579e71d8120a447daec241ada4b5186344ae0a060690b6128a9"
  },
  "compression": {
    "appId": "compression",
    "atlasId": "compression",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/compression-bok-f1-70b4e2f9-thumb.webp",
      "detail": "/movement-atlas/compression-bok-f1-70b4e2f9-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "70b4e2f94e4ad6619e722568f0fe56201710c752b58c92c3646f82949b70c97b"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/compression-bok-f2-7f6359d7-thumb.webp",
        "detail": "/movement-atlas/compression-bok-f2-7f6359d7-detail.webp",
        "dark": null,
        "width": 1536,
        "height": 1536,
        "sourceWidth": 1536,
        "sourceHeight": 1024,
        "sourceSha256": "7f6359d7cd00bb6fda4b6daa4b9736072e9a90a6c9ba152ebdae89f0893016a0"
      }
    ],
    "sourceSha256": "70b4e2f94e4ad6619e722568f0fe56201710c752b58c92c3646f82949b70c97b"
  },
  "copenhagen": {
    "appId": "copenhagen",
    "atlasId": "copenhagen",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/copenhagen-bok-f1-c0eba328-thumb.webp",
      "detail": "/movement-atlas/copenhagen-bok-f1-c0eba328-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "c0eba32870407798e6868c22cb34bd7094712081d5e7e8a4d2736b820d29cab3"
    },
    "views": [],
    "sourceSha256": "c0eba32870407798e6868c22cb34bd7094712081d5e7e8a4d2736b820d29cab3"
  },
  "cossack": {
    "appId": "cossack",
    "atlasId": "cossack",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/cossack-predek-f1-6ff41178-thumb.webp",
      "detail": "/movement-atlas/cossack-predek-f1-6ff41178-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "6ff41178980eb7ff277b868be5a0902e3125c1e2498dd2aac9c116f19b29c679"
    },
    "views": [],
    "sourceSha256": "6ff41178980eb7ff277b868be5a0902e3125c1e2498dd2aac9c116f19b29c679"
  },
  "couch": {
    "appId": "couch",
    "atlasId": "couch",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/couch-bok-f1-cf7ceaf4-thumb.webp",
      "detail": "/movement-atlas/couch-bok-f1-cf7ceaf4-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1402,
      "sourceHeight": 1122,
      "sourceSha256": "cf7ceaf4a8ee25071d0272c11939b9b3c6c92b9beec26862e21791b2ec2777dd"
    },
    "views": [],
    "sourceSha256": "cf7ceaf4a8ee25071d0272c11939b9b3c6c92b9beec26862e21791b2ec2777dd"
  },
  "crow": {
    "appId": "crow",
    "atlasId": "crow",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/crow-bok-f1-ad71071e-thumb.webp",
      "detail": "/movement-atlas/crow-bok-f1-ad71071e-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "ad71071e8ebb08853dace8881a7856b0a54ade8830503ec137c0ec44c5853980"
    },
    "views": [],
    "sourceSha256": "ad71071e8ebb08853dace8881a7856b0a54ade8830503ec137c0ec44c5853980"
  },
  "crunch": {
    "appId": "crunch",
    "atlasId": "crunch",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/crunch-bok-f1-3a977975-thumb.webp",
      "detail": "/movement-atlas/crunch-bok-f1-3a977975-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "3a977975ea9ce8aca2030782df51bedec161674890def74a34d366249174ff2c"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/crunch-bok-f2-82c72467-thumb.webp",
        "detail": "/movement-atlas/crunch-bok-f2-82c72467-detail.webp",
        "dark": null,
        "width": 1536,
        "height": 1536,
        "sourceWidth": 1536,
        "sourceHeight": 1024,
        "sourceSha256": "82c7246755820366e102f1fed1fa452d1d98590df5c81eb82032505d2de93204"
      }
    ],
    "sourceSha256": "3a977975ea9ce8aca2030782df51bedec161674890def74a34d366249174ff2c"
  },
  "ctwhs": {
    "appId": "ctwhs",
    "atlasId": "ctwhs",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/ctwhs-bok-f1-e7a34cc5-thumb.webp",
      "detail": "/movement-atlas/ctwhs-bok-f1-e7a34cc5-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "e7a34cc5f71fc45a720ce5c789b78ded78d49019a8a6c490154c85c2f5287abc"
    },
    "views": [],
    "sourceSha256": "e7a34cc5f71fc45a720ce5c789b78ded78d49019a8a6c490154c85c2f5287abc"
  },
  "ctwhspu": {
    "appId": "ctwhspu",
    "atlasId": "ctwhspu",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/ctwhspu-bok-f1-ccfdde56-thumb.webp",
      "detail": "/movement-atlas/ctwhspu-bok-f1-ccfdde56-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "ccfdde5611e832e325b1bf3621470a591df7c5e893f5e14b98dcab7ef2877dff"
    },
    "views": [],
    "sourceSha256": "ccfdde5611e832e325b1bf3621470a591df7c5e893f5e14b98dcab7ef2877dff"
  },
  "dbcurl": {
    "appId": "dbcurl",
    "atlasId": "dbcurl",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/dbcurl-bok-f1-b6359ea4-thumb.webp",
      "detail": "/movement-atlas/dbcurl-bok-f1-b6359ea4-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "b6359ea49447d08b2f06448edeb40b936c31ef4199173fd761eb6a4c07928e35"
    },
    "views": [],
    "sourceSha256": "b6359ea49447d08b2f06448edeb40b936c31ef4199173fd761eb6a4c07928e35"
  },
  "dbfloor": {
    "appId": "dbfloor",
    "atlasId": "dbfloor",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/dbfloor-bok-f1-e47d63c2-thumb.webp",
      "detail": "/movement-atlas/dbfloor-bok-f1-e47d63c2-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "e47d63c24226826f2186365309fe3796fc648216850b675f44668465cff81561"
    },
    "views": [],
    "sourceSha256": "e47d63c24226826f2186365309fe3796fc648216850b675f44668465cff81561"
  },
  "dbpress": {
    "appId": "dbpress",
    "atlasId": "dbpress",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/dbpress-bok-f1-cb08a41c-thumb.webp",
      "detail": "/movement-atlas/dbpress-bok-f1-cb08a41c-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1086,
      "sourceHeight": 1448,
      "sourceSha256": "cb08a41c13905fb6473e59055a08fd1be2a353e89efa8fd83278c3af0e586023"
    },
    "views": [],
    "sourceSha256": "cb08a41c13905fb6473e59055a08fd1be2a353e89efa8fd83278c3af0e586023"
  },
  "dbrdl": {
    "appId": "dbrdl",
    "atlasId": "dbrdl",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/dbrdl-bok-f1-b0eb9063-thumb.webp",
      "detail": "/movement-atlas/dbrdl-bok-f1-b0eb9063-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "b0eb9063db58271fd33bba46d226267237d10dfffd505b05b009f8882c1b2ec8"
    },
    "views": [],
    "sourceSha256": "b0eb9063db58271fd33bba46d226267237d10dfffd505b05b009f8882c1b2ec8"
  },
  "dbrow": {
    "appId": "dbrow",
    "atlasId": "dbrow",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/dbrow-bok-f1-bbfd9b32-thumb.webp",
      "detail": "/movement-atlas/dbrow-bok-f1-bbfd9b32-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "bbfd9b32444c00037defdc818a0732dbfcbe0e77d3106131b1498400cc1d9515"
    },
    "views": [],
    "sourceSha256": "bbfd9b32444c00037defdc818a0732dbfcbe0e77d3106131b1498400cc1d9515"
  },
  "dbtriext": {
    "appId": "dbtriext",
    "atlasId": "dbtriext",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/dbtriext-bok-f1-3dc6bd7a-thumb.webp",
      "detail": "/movement-atlas/dbtriext-bok-f1-3dc6bd7a-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1086,
      "sourceHeight": 1448,
      "sourceSha256": "3dc6bd7adbfb404b8cd6c1b0277e5d7ba757b312f232f01e0642f7fbfbb188d6"
    },
    "views": [],
    "sourceSha256": "3dc6bd7adbfb404b8cd6c1b0277e5d7ba757b312f232f01e0642f7fbfbb188d6"
  },
  "deadbug": {
    "appId": "deadbug",
    "atlasId": "deadbug",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/deadbug-bok-f1-55902246-thumb.webp",
      "detail": "/movement-atlas/deadbug-bok-f1-55902246-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "55902246914c0dfdeea2c125b97a7666c5654366e56b9a6fc0fb91c383607c7f"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/deadbug-bok-f2-dba6f668-thumb.webp",
        "detail": "/movement-atlas/deadbug-bok-f2-dba6f668-detail.webp",
        "dark": null,
        "width": 1536,
        "height": 1536,
        "sourceWidth": 1536,
        "sourceHeight": 1024,
        "sourceSha256": "dba6f6680ceafe251f6f6b3bbf1c18896b68d50a3291db3674ed8ed45cbc9f5b"
      }
    ],
    "sourceSha256": "55902246914c0dfdeea2c125b97a7666c5654366e56b9a6fc0fb91c383607c7f"
  },
  "deadlift": {
    "appId": "deadlift",
    "atlasId": "deadlift",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/deadlift-bok-f1-7fe9ca46-thumb.webp",
      "detail": "/movement-atlas/deadlift-bok-f1-7fe9ca46-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "7fe9ca46c32d6b15abe5a16a865d2be22bc74850a7bc99a4d95cdef469fcba88"
    },
    "views": [],
    "sourceSha256": "7fe9ca46c32d6b15abe5a16a865d2be22bc74850a7bc99a4d95cdef469fcba88"
  },
  "deadpull": {
    "appId": "deadpull",
    "atlasId": "deadpull",
    "primary": {
      "view": "zada",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/deadpull-zada-f1-4eb191a3-thumb.webp",
      "detail": "/movement-atlas/deadpull-zada-f1-4eb191a3-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "4eb191a3978a964b191aba2874182a7d3c88c57c8c9f33e7a42d850f31bfbd46"
    },
    "views": [],
    "sourceSha256": "4eb191a3978a964b191aba2874182a7d3c88c57c8c9f33e7a42d850f31bfbd46"
  },
  "declpush": {
    "appId": "declpush",
    "atlasId": "declpush",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/declpush-bok-f1-e1bb94d3-thumb.webp",
      "detail": "/movement-atlas/declpush-bok-f1-e1bb94d3-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "e1bb94d3cdbce7ce420724b4d45da87b10b4fccab7762a720f2455f933785752"
    },
    "views": [],
    "sourceSha256": "e1bb94d3cdbce7ce420724b4d45da87b10b4fccab7762a720f2455f933785752"
  },
  "deepsquat": {
    "appId": "deepsquat",
    "atlasId": "deepsquat",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/deepsquat-bok-f1-40830b2a-thumb.webp",
      "detail": "/movement-atlas/deepsquat-bok-f1-40830b2a-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "40830b2a25bf4447dfbac673bbbe7ff69a2db7e9f0d748c520c3308c413c1c07"
    },
    "views": [],
    "sourceSha256": "40830b2a25bf4447dfbac673bbbe7ff69a2db7e9f0d748c520c3308c413c1c07"
  },
  "diamond": {
    "appId": "diamond",
    "atlasId": "diamond",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/diamond-bok-f1-1af9b5f5-thumb.webp",
      "detail": "/movement-atlas/diamond-bok-f1-1af9b5f5-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "1af9b5f5ae4805bf88694d8ff49795136995f586136fbfb20f60bcd73c8e1576"
    },
    "views": [],
    "sourceSha256": "1af9b5f5ae4805bf88694d8ff49795136995f586136fbfb20f60bcd73c8e1576"
  },
  "diaphragm": {
    "appId": "diaphragm",
    "atlasId": "diaphragm",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/diaphragm-bok-f1-22e8dc9c-thumb.webp",
      "detail": "/movement-atlas/diaphragm-bok-f1-22e8dc9c-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1402,
      "sourceHeight": 1122,
      "sourceSha256": "22e8dc9c6e405801941613a92c8962217c011b2c7517102bce131cc49231dd7d"
    },
    "views": [],
    "sourceSha256": "22e8dc9c6e405801941613a92c8962217c011b2c7517102bce131cc49231dd7d"
  },
  "dips": {
    "appId": "dips",
    "atlasId": "dips",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/dips-bok-f1-5c3770c3-thumb.webp",
      "detail": "/movement-atlas/dips-bok-f1-5c3770c3-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "5c3770c328a7c9ad3c71be728a059884c7e34df251c6df0a41b1c59d7ad112a5"
    },
    "views": [],
    "sourceSha256": "5c3770c328a7c9ad3c71be728a059884c7e34df251c6df0a41b1c59d7ad112a5"
  },
  "disloc": {
    "appId": "disloc",
    "atlasId": "disloc",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/disloc-predek-f1-28a88cc9-thumb.webp",
      "detail": "/movement-atlas/disloc-predek-f1-28a88cc9-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "28a88cc9146e10cc60e301f6cf4eee5137c891cded296fdc5a789fcf028134e0"
    },
    "views": [],
    "sourceSha256": "28a88cc9146e10cc60e301f6cf4eee5137c891cded296fdc5a789fcf028134e0"
  },
  "donkeykick": {
    "appId": "donkeykick",
    "atlasId": "donkeykick",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/donkeykick-bok-f1-05ea5a06-thumb.webp",
      "detail": "/movement-atlas/donkeykick-bok-f1-05ea5a06-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "05ea5a06a3b95216bd4b7979268bcc524c8b8c442eab4345540f312ad22444c1"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/donkeykick-bok-f2-a3fc92f3-thumb.webp",
        "detail": "/movement-atlas/donkeykick-bok-f2-a3fc92f3-detail.webp",
        "dark": null,
        "width": 1536,
        "height": 1536,
        "sourceWidth": 1536,
        "sourceHeight": 1024,
        "sourceSha256": "a3fc92f30add1aa076a894cfd40470160d39cde0cbd69016dcdceca741072ca1"
      }
    ],
    "sourceSha256": "05ea5a06a3b95216bd4b7979268bcc524c8b8c442eab4345540f312ad22444c1"
  },
  "downdog": {
    "appId": "downdog",
    "atlasId": "downdog",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/downdog-bok-f1-693a8329-thumb.webp",
      "detail": "/movement-atlas/downdog-bok-f1-693a8329-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1402,
      "sourceHeight": 1122,
      "sourceSha256": "693a8329fcc35061e60729727fc95a60c8f09f0b3c30d0345e85b2f23f3e213d"
    },
    "views": [],
    "sourceSha256": "693a8329fcc35061e60729727fc95a60c8f09f0b3c30d0345e85b2f23f3e213d"
  },
  "dragonflag": {
    "appId": "dragonflag",
    "atlasId": "dragonflag",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/dragonflag-bok-f1-d16e113d-thumb.webp",
      "detail": "/movement-atlas/dragonflag-bok-f1-d16e113d-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "d16e113d91de21ce9780b892455108951ccfeefda98504ef9e07a8a30341e1c8"
    },
    "views": [],
    "sourceSha256": "d16e113d91de21ce9780b892455108951ccfeefda98504ef9e07a8a30341e1c8"
  },
  "dragonsquat": {
    "appId": "dragonsquat",
    "atlasId": "dragonsquat",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/dragonsquat-bok-f1-743e2745-thumb.webp",
      "detail": "/movement-atlas/dragonsquat-bok-f1-743e2745-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "743e27455c32c3612a61e78c5d4e334529d696e9d8492eaa9c724c5f3e2b9806"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/dragonsquat-bok-f2-902a518b-thumb.webp",
        "detail": "/movement-atlas/dragonsquat-bok-f2-902a518b-detail.webp",
        "dark": null,
        "width": 1254,
        "height": 1254,
        "sourceWidth": 1254,
        "sourceHeight": 1254,
        "sourceSha256": "902a518b6de951a18581fccb1cdc2a4662d1e922f1d3454734cd4b530d96948e"
      }
    ],
    "sourceSha256": "743e27455c32c3612a61e78c5d4e334529d696e9d8492eaa9c724c5f3e2b9806"
  },
  "drep": {
    "appId": "drep",
    "atlasId": "drep",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/drep-bok-f1-bff20e0f-thumb.webp",
      "detail": "/movement-atlas/drep-bok-f1-bff20e0f-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "bff20e0ff48805884c7910e72015accdc8bad4d5824ae5a2f5b38182f269ad2e"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/drep-bok-f2-b7606dd9-thumb.webp",
        "detail": "/movement-atlas/drep-bok-f2-b7606dd9-detail.webp",
        "dark": null,
        "width": 1254,
        "height": 1254,
        "sourceWidth": 1254,
        "sourceHeight": 1254,
        "sourceSha256": "b7606dd9ceac793e6913d5ad4c2ad81e4809e07e96bdb51cffd92bed8806566c"
      }
    ],
    "sourceSha256": "bff20e0ff48805884c7910e72015accdc8bad4d5824ae5a2f5b38182f269ad2e"
  },
  "ecccalf": {
    "appId": "ecccalf",
    "atlasId": "ecccalf",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/ecccalf-bok-f1-b4f41b9e-thumb.webp",
      "detail": "/movement-atlas/ecccalf-bok-f1-b4f41b9e-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1122,
      "sourceHeight": 1402,
      "sourceSha256": "b4f41b9e994f09702df19f38112cfb4f2b4063ac328d6ffc395c7818f5d243f0"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/ecccalf-bok-f2-ad944b21-thumb.webp",
        "detail": "/movement-atlas/ecccalf-bok-f2-ad944b21-detail.webp",
        "dark": null,
        "width": 1402,
        "height": 1402,
        "sourceWidth": 1122,
        "sourceHeight": 1402,
        "sourceSha256": "ad944b21245a056e4edee11adec50b5ca6032ce25e8c430c53fcc7bdedc77594"
      }
    ],
    "sourceSha256": "b4f41b9e994f09702df19f38112cfb4f2b4063ac328d6ffc395c7818f5d243f0"
  },
  "eccham": {
    "appId": "eccham",
    "atlasId": "eccham",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/eccham-bok-f1-326e16a0-thumb.webp",
      "detail": "/movement-atlas/eccham-bok-f1-326e16a0-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "326e16a055df1dfa16542be160e07227cb583f8add9ede52bbfa177f3ee26ba7"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/eccham-bok-f2-f470f60d-thumb.webp",
        "detail": "/movement-atlas/eccham-bok-f2-f470f60d-detail.webp",
        "dark": null,
        "width": 1536,
        "height": 1536,
        "sourceWidth": 1536,
        "sourceHeight": 1024,
        "sourceSha256": "f470f60d8946ccc507d4a3e6ebc77f12a545206a640a97f6ad302b91c237f802"
      }
    ],
    "sourceSha256": "326e16a055df1dfa16542be160e07227cb583f8add9ede52bbfa177f3ee26ba7"
  },
  "elbowcars": {
    "appId": "elbowcars",
    "atlasId": "elbowcars",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/elbowcars-bok-f1-08eed3d7-thumb.webp",
      "detail": "/movement-atlas/elbowcars-bok-f1-08eed3d7-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "08eed3d712a52a6b14acea517211a6538e5d9aeaa39dfecf838fb1a29812640d"
    },
    "views": [],
    "sourceSha256": "08eed3d712a52a6b14acea517211a6538e5d9aeaa39dfecf838fb1a29812640d"
  },
  "elbowlever": {
    "appId": "elbowlever",
    "atlasId": "elbowlever",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/elbowlever-bok-f1-ed9355de-thumb.webp",
      "detail": "/movement-atlas/elbowlever-bok-f1-ed9355de-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "ed9355de8b9e4de6bb9b4bef6f427a33853d2ca494036d186fdaf5c473dc759c"
    },
    "views": [],
    "sourceSha256": "ed9355de8b9e4de6bb9b4bef6f427a33853d2ca494036d186fdaf5c473dc759c"
  },
  "elephantwalk": {
    "appId": "elephantwalk",
    "atlasId": "elephantwalk",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/elephantwalk-bok-f1-cad2fb6a-thumb.webp",
      "detail": "/movement-atlas/elephantwalk-bok-f1-cad2fb6a-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "cad2fb6af589c2d883c74952857c16d6a1357deb2b5f4983fbce4f3cec11ece4"
    },
    "views": [],
    "sourceSha256": "cad2fb6af589c2d883c74952857c16d6a1357deb2b5f4983fbce4f3cec11ece4"
  },
  "exppull": {
    "appId": "exppull",
    "atlasId": "exppull",
    "primary": {
      "view": "zada",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/exppull-zada-f1-4587883c-thumb.webp",
      "detail": "/movement-atlas/exppull-zada-f1-4587883c-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "4587883ce246a125ced8e8efec0322fbacbfcb753a3dbc3e08e7bb2b2409b1b9"
    },
    "views": [],
    "sourceSha256": "4587883ce246a125ced8e8efec0322fbacbfcb753a3dbc3e08e7bb2b2409b1b9"
  },
  "extrot": {
    "appId": "extrot",
    "atlasId": "extrot",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/extrot-predek-f1-b9efad16-thumb.webp",
      "detail": "/movement-atlas/extrot-predek-f1-b9efad16-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1122,
      "sourceHeight": 1402,
      "sourceSha256": "b9efad161c9e3297de8bb5a8afa7f33acf58ea47164150e779f5719c911072d9"
    },
    "views": [],
    "sourceSha256": "b9efad161c9e3297de8bb5a8afa7f33acf58ea47164150e779f5719c911072d9"
  },
  "facepull": {
    "appId": "facepull",
    "atlasId": "facepull",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/facepull-bok-f1-42daabfb-thumb.webp",
      "detail": "/movement-atlas/facepull-bok-f1-42daabfb-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "42daabfbbdb8fdeca1aed524d33a699da949a558dd987fba53ce900c4809f0d3"
    },
    "views": [],
    "sourceSha256": "42daabfbbdb8fdeca1aed524d33a699da949a558dd987fba53ce900c4809f0d3"
  },
  "farmer": {
    "appId": "farmer",
    "atlasId": "farmer",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/farmer-bok-f1-d96f78f8-thumb.webp",
      "detail": "/movement-atlas/farmer-bok-f1-d96f78f8-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "d96f78f8f184ad189ce1baa0611a55cbf74a8b1624deb21bdd12780bba5d4ffe"
    },
    "views": [],
    "sourceSha256": "d96f78f8f184ad189ce1baa0611a55cbf74a8b1624deb21bdd12780bba5d4ffe"
  },
  "fingerhs": {
    "appId": "fingerhs",
    "atlasId": "fingerhs",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/fingerhs-bok-f1-663db37f-thumb.webp",
      "detail": "/movement-atlas/fingerhs-bok-f1-663db37f-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "663db37f10c41f8ca4cf505e4b7144eadf6c11c31d90cc41d787e78b90a858ae"
    },
    "views": [],
    "sourceSha256": "663db37f10c41f8ca4cf505e4b7144eadf6c11c31d90cc41d787e78b90a858ae"
  },
  "flneg": {
    "appId": "flneg",
    "atlasId": "flneg",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/flneg-bok-f1-f99c34bf-thumb.webp",
      "detail": "/movement-atlas/flneg-bok-f1-f99c34bf-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "f99c34bf693d8104e331a0052282ac4bc8cc3935759cfb6b685dbce487532605"
    },
    "views": [],
    "sourceSha256": "f99c34bf693d8104e331a0052282ac4bc8cc3935759cfb6b685dbce487532605"
  },
  "flpullup": {
    "appId": "flpullup",
    "atlasId": "flpullup",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/flpullup-bok-f1-0d656607-thumb.webp",
      "detail": "/movement-atlas/flpullup-bok-f1-0d656607-detail.webp",
      "dark": null,
      "width": 1393,
      "height": 1393,
      "sourceWidth": 1393,
      "sourceHeight": 1129,
      "sourceSha256": "0d656607e5e66b4ccf16ad43f901837f0f9a2c04b5b68c3f8441cb03a748a512"
    },
    "views": [],
    "sourceSha256": "0d656607e5e66b4ccf16ad43f901837f0f9a2c04b5b68c3f8441cb03a748a512"
  },
  "flraise": {
    "appId": "flraise",
    "atlasId": "flraise",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/flraise-bok-f1-a9dce7a8-thumb.webp",
      "detail": "/movement-atlas/flraise-bok-f1-a9dce7a8-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "a9dce7a8df66748c7e2c8181a3334ad3ae35d44eed880b7c3b50121acf896343"
    },
    "views": [],
    "sourceSha256": "a9dce7a8df66748c7e2c8181a3334ad3ae35d44eed880b7c3b50121acf896343"
  },
  "flrow": {
    "appId": "flrow",
    "atlasId": "flrow",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/flrow-bok-f1-6b96854d-thumb.webp",
      "detail": "/movement-atlas/flrow-bok-f1-6b96854d-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "6b96854dee54485ee187afe2f0c1d10920cdb592597df685ae3074f7cf781c69"
    },
    "views": [],
    "sourceSha256": "6b96854dee54485ee187afe2f0c1d10920cdb592597df685ae3074f7cf781c69"
  },
  "fltouch": {
    "appId": "fltouch",
    "atlasId": "fltouch",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/fltouch-bok-f1-e3ca0667-thumb.webp",
      "detail": "/movement-atlas/fltouch-bok-f1-e3ca0667-detail.webp",
      "dark": null,
      "width": 1396,
      "height": 1396,
      "sourceWidth": 1396,
      "sourceHeight": 1127,
      "sourceSha256": "e3ca0667285bdb0c0d848772da33c30ed1724e9fd3d131d647a432354395c69c"
    },
    "views": [],
    "sourceSha256": "e3ca0667285bdb0c0d848772da33c30ed1724e9fd3d131d647a432354395c69c"
  },
  "flutter": {
    "appId": "flutter",
    "atlasId": "flutter",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/flutter-bok-f1-2be4bf20-thumb.webp",
      "detail": "/movement-atlas/flutter-bok-f1-2be4bf20-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "2be4bf20625c0a33ca2db3704eb97ecb88acd162c52ccbb3edee5276e3a532c4"
    },
    "views": [],
    "sourceSha256": "2be4bf20625c0a33ca2db3704eb97ecb88acd162c52ccbb3edee5276e3a532c4"
  },
  "freehspu": {
    "appId": "freehspu",
    "atlasId": "freehspu",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/freehspu-bok-f1-e6e94d40-thumb.webp",
      "detail": "/movement-atlas/freehspu-bok-f1-e6e94d40-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "e6e94d40464cbd12e95282ad9a960de817827b761586482602b63965c34216a0"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/freehspu-bok-f2-40d3d858-thumb.webp",
        "detail": "/movement-atlas/freehspu-bok-f2-40d3d858-detail.webp",
        "dark": null,
        "width": 1536,
        "height": 1536,
        "sourceWidth": 1024,
        "sourceHeight": 1536,
        "sourceSha256": "40d3d85818ec6d997975d5eb74f463121d7e06030d5ec66f0e433d53b18e0783"
      }
    ],
    "sourceSha256": "e6e94d40464cbd12e95282ad9a960de817827b761586482602b63965c34216a0"
  },
  "frontlever": {
    "appId": "frontlever",
    "atlasId": "frontlever",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/frontlever-bok-f1-5b85da49-thumb.webp",
      "detail": "/movement-atlas/frontlever-bok-f1-5b85da49-detail.webp",
      "dark": null,
      "width": 1395,
      "height": 1395,
      "sourceWidth": 1395,
      "sourceHeight": 1127,
      "sourceSha256": "5b85da497c89cf3c477eb578bab8f1a97df48478a656851995d47a25b218b3a4"
    },
    "views": [],
    "sourceSha256": "5b85da497c89cf3c477eb578bab8f1a97df48478a656851995d47a25b218b3a4"
  },
  "frontsplit": {
    "appId": "frontsplit",
    "atlasId": "frontsplit",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/frontsplit-bok-f1-21162f40-thumb.webp",
      "detail": "/movement-atlas/frontsplit-bok-f1-21162f40-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "21162f405180c1a78e79f85a6ae814ed031abbd27e2f3cdd5d1e8f3eac510ce3"
    },
    "views": [],
    "sourceSha256": "21162f405180c1a78e79f85a6ae814ed031abbd27e2f3cdd5d1e8f3eac510ce3"
  },
  "frontsquat": {
    "appId": "frontsquat",
    "atlasId": "frontsquat",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/frontsquat-bok-f1-3d3d56c3-thumb.webp",
      "detail": "/movement-atlas/frontsquat-bok-f1-3d3d56c3-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "3d3d56c394df8e0c17cf6258cef64d02724867a1661725f95bfa8f31286e42ab"
    },
    "views": [],
    "sourceSha256": "3d3d56c394df8e0c17cf6258cef64d02724867a1661725f95bfa8f31286e42ab"
  },
  "glutebridge": {
    "appId": "glutebridge",
    "atlasId": "glutebridge",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/glutebridge-bok-f1-3dd92d8d-thumb.webp",
      "detail": "/movement-atlas/glutebridge-bok-f1-3dd92d8d-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "3dd92d8da785b2d4b7fb8ce847478fd736eea856510574d416eae0566fc2936c"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/glutebridge-bok-f2-fd6c946d-thumb.webp",
        "detail": "/movement-atlas/glutebridge-bok-f2-fd6c946d-detail.webp",
        "dark": null,
        "width": 1536,
        "height": 1536,
        "sourceWidth": 1536,
        "sourceHeight": 1024,
        "sourceSha256": "fd6c946dbe8ddbab53a620a2bc3c58b1c5715a63fb2e8681fc457237e216a72b"
      }
    ],
    "sourceSha256": "3dd92d8da785b2d4b7fb8ce847478fd736eea856510574d416eae0566fc2936c"
  },
  "goblet": {
    "appId": "goblet",
    "atlasId": "goblet",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/goblet-bok-f1-20d0b036-thumb.webp",
      "detail": "/movement-atlas/goblet-bok-f1-20d0b036-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "20d0b036b30ea6006ff924222c070c5decca7fcaa47dbc67218ac8aff821e4ec"
    },
    "views": [],
    "sourceSha256": "20d0b036b30ea6006ff924222c070c5decca7fcaa47dbc67218ac8aff821e4ec"
  },
  "goodmorning": {
    "appId": "goodmorning",
    "atlasId": "goodmorning",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/goodmorning-bok-f1-239b8921-thumb.webp",
      "detail": "/movement-atlas/goodmorning-bok-f1-239b8921-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "239b892137c78ac2f54eba02c538323d0d5e9b7d584326da7c782fa99d8ce2b2"
    },
    "views": [],
    "sourceSha256": "239b892137c78ac2f54eba02c538323d0d5e9b7d584326da7c782fa99d8ce2b2"
  },
  "halflayfl": {
    "appId": "halflayfl",
    "atlasId": "halflayfl",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/halflayfl-bok-f1-18ee941e-thumb.webp",
      "detail": "/movement-atlas/halflayfl-bok-f1-18ee941e-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "18ee941e7413ba6e2f00813305080875eb4593bca85fd85d2b444bc30429ebf7"
    },
    "views": [],
    "sourceSha256": "18ee941e7413ba6e2f00813305080875eb4593bca85fd85d2b444bc30429ebf7"
  },
  "handstand": {
    "appId": "handstand",
    "atlasId": "handstand",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/handstand-bok-f1-b1f53a2c-thumb.webp",
      "detail": "/movement-atlas/handstand-bok-f1-b1f53a2c-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "b1f53a2c1f98c75d94e4ced2bb7b381b15ab6d84f7739515ac3e55a98231284d"
    },
    "views": [],
    "sourceSha256": "b1f53a2c1f98c75d94e4ced2bb7b381b15ab6d84f7739515ac3e55a98231284d"
  },
  "handstandwalk": {
    "appId": "handstandwalk",
    "atlasId": "handstandwalk",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/handstandwalk-bok-f1-7a08abb8-thumb.webp",
      "detail": "/movement-atlas/handstandwalk-bok-f1-7a08abb8-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "7a08abb84032d47f22c33f7a1287bff20dcdc3368b6602d7515188d1e4bcc651"
    },
    "views": [],
    "sourceSha256": "7a08abb84032d47f22c33f7a1287bff20dcdc3368b6602d7515188d1e4bcc651"
  },
  "hang": {
    "appId": "hang",
    "atlasId": "hang",
    "primary": {
      "view": "zada",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/hang-zada-f1-0b0b17bb-thumb.webp",
      "detail": "/movement-atlas/hang-zada-f1-0b0b17bb-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "0b0b17bba10f5b380cc9c1ec2a365af27b6f8a8c92873baadf53fce464b66bd6"
    },
    "views": [],
    "sourceSha256": "0b0b17bba10f5b380cc9c1ec2a365af27b6f8a8c92873baadf53fce464b66bd6"
  },
  "headstand": {
    "appId": "headstand",
    "atlasId": "headstand",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/headstand-bok-f1-1d2e38a0-thumb.webp",
      "detail": "/movement-atlas/headstand-bok-f1-1d2e38a0-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "1d2e38a076492a8faa9f494f462bd71a640ba7536234a670b179ac933c8e1f37"
    },
    "views": [],
    "sourceSha256": "1d2e38a076492a8faa9f494f462bd71a640ba7536234a670b179ac933c8e1f37"
  },
  "highknees": {
    "appId": "highknees",
    "atlasId": "highknees",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/highknees-bok-f1-d5ace946-thumb.webp",
      "detail": "/movement-atlas/highknees-bok-f1-d5ace946-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "d5ace946770d32e78b93cda4c6f289aa317ba66dcda3499dbd0bdc02e346cb19"
    },
    "views": [],
    "sourceSha256": "d5ace946770d32e78b93cda4c6f289aa317ba66dcda3499dbd0bdc02e346cb19"
  },
  "hinge": {
    "appId": "hinge",
    "atlasId": "hinge",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/hinge-bok-f1-258505cf-thumb.webp",
      "detail": "/movement-atlas/hinge-bok-f1-258505cf-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "258505cf31165cc0b222c38486578dc13f97ca332aea83e336b6aef0db48d7ab"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/hinge-bok-f2-b93be69b-thumb.webp",
        "detail": "/movement-atlas/hinge-bok-f2-b93be69b-detail.webp",
        "dark": null,
        "width": 1536,
        "height": 1536,
        "sourceWidth": 1536,
        "sourceHeight": 1024,
        "sourceSha256": "b93be69b1fab92b4f790c1fa1c792cd73b36be24bdc0cc06115db8df65f6aeb9"
      }
    ],
    "sourceSha256": "258505cf31165cc0b222c38486578dc13f97ca332aea83e336b6aef0db48d7ab"
  },
  "hip9090": {
    "appId": "hip9090",
    "atlasId": "hip9090",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/hip9090-predek-f1-7238090b-thumb.webp",
      "detail": "/movement-atlas/hip9090-predek-f1-7238090b-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "7238090b73113ed66e055360dc50f38f6a44a2baf9a9db5cb60f6f152468a04e"
    },
    "views": [],
    "sourceSha256": "7238090b73113ed66e055360dc50f38f6a44a2baf9a9db5cb60f6f152468a04e"
  },
  "hipcars": {
    "appId": "hipcars",
    "atlasId": "hipcars",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/hipcars-predek-f1-11286c98-thumb.webp",
      "detail": "/movement-atlas/hipcars-predek-f1-11286c98-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "11286c98f2b4b34e62d10deca2f33d23ece2321d9d74b59d3cdfe28f3f9b1789"
    },
    "views": [],
    "sourceSha256": "11286c98f2b4b34e62d10deca2f33d23ece2321d9d74b59d3cdfe28f3f9b1789"
  },
  "hipthrust": {
    "appId": "hipthrust",
    "atlasId": "hipthrust",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/hipthrust-bok-f1-130e5a05-thumb.webp",
      "detail": "/movement-atlas/hipthrust-bok-f1-130e5a05-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "130e5a0579907c306db7d3b073079b03fcb702413e2d50e279d34ce33211a696"
    },
    "views": [],
    "sourceSha256": "130e5a0579907c306db7d3b073079b03fcb702413e2d50e279d34ce33211a696"
  },
  "hlr": {
    "appId": "hlr",
    "atlasId": "hlr",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/hlr-bok-f1-988281c2-thumb.webp",
      "detail": "/movement-atlas/hlr-bok-f1-988281c2-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1086,
      "sourceHeight": 1448,
      "sourceSha256": "988281c21ca66e456f4ac7d6bc663f153d4338ca20d094fdc59051eb6c37ffed"
    },
    "views": [],
    "sourceSha256": "988281c21ca66e456f4ac7d6bc663f153d4338ca20d094fdc59051eb6c37ffed"
  },
  "hold90": {
    "appId": "hold90",
    "atlasId": "hold90",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/hold90-bok-f1-7e9b87ca-thumb.webp",
      "detail": "/movement-atlas/hold90-bok-f1-7e9b87ca-detail.webp",
      "dark": null,
      "width": 1774,
      "height": 1774,
      "sourceWidth": 1774,
      "sourceHeight": 887,
      "sourceSha256": "7e9b87ca7489e5180343c9199c9d5c9000d8fed5bcb61d3d4fa24347eb09cc0a"
    },
    "views": [],
    "sourceSha256": "7e9b87ca7489e5180343c9199c9d5c9000d8fed5bcb61d3d4fa24347eb09cc0a"
  },
  "hollow": {
    "appId": "hollow",
    "atlasId": "hollow",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/hollow-bok-f1-bf302491-thumb.webp",
      "detail": "/movement-atlas/hollow-bok-f1-bf302491-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "bf302491335910b5d738ce8c722201cb388809d7737993bb0c2c604cb77488f3"
    },
    "views": [],
    "sourceSha256": "bf302491335910b5d738ce8c722201cb388809d7737993bb0c2c604cb77488f3"
  },
  "hspu90": {
    "appId": "hspu90",
    "atlasId": "hspu90",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/hspu90-bok-f1-fed1b5cc-thumb.webp",
      "detail": "/movement-atlas/hspu90-bok-f1-fed1b5cc-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "fed1b5cccbb8f3e8debbc88f28c05e7beaddc4533e5af5f837574d4044ca9e39"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/hspu90-bok-f2-48d8fd04-thumb.webp",
        "detail": "/movement-atlas/hspu90-bok-f2-48d8fd04-detail.webp",
        "dark": null,
        "width": 1536,
        "height": 1536,
        "sourceWidth": 1024,
        "sourceHeight": 1536,
        "sourceSha256": "48d8fd042190b143f1cacbea33b942f5ec02fb0b46722162031e6c54edad8fb6"
      }
    ],
    "sourceSha256": "fed1b5cccbb8f3e8debbc88f28c05e7beaddc4533e5af5f837574d4044ca9e39"
  },
  "hspu90neg": {
    "appId": "hspu90neg",
    "atlasId": "hspu90neg",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/hspu90neg-bok-f1-25aa29de-thumb.webp",
      "detail": "/movement-atlas/hspu90neg-bok-f1-25aa29de-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "25aa29de01a42ffac048d1aaf3e6e6c6eb27142a016a528eb0d9e08b40ac0ad9"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/hspu90neg-bok-f2-5d9cadbc-thumb.webp",
        "detail": "/movement-atlas/hspu90neg-bok-f2-5d9cadbc-detail.webp",
        "dark": null,
        "width": 1536,
        "height": 1536,
        "sourceWidth": 1536,
        "sourceHeight": 1024,
        "sourceSha256": "5d9cadbce7cf40de7aa863bf3c50ef226331437b0e4d3af5b8d0b684d5bc8b17"
      }
    ],
    "sourceSha256": "25aa29de01a42ffac048d1aaf3e6e6c6eb27142a016a528eb0d9e08b40ac0ad9"
  },
  "hspuhold": {
    "appId": "hspuhold",
    "atlasId": "hspuhold",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/hspuhold-bok-f1-8b03b100-thumb.webp",
      "detail": "/movement-atlas/hspuhold-bok-f1-8b03b100-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "8b03b1009cd22269aadb51ac5cbf7acf358bfba8352ba54fab8dcec4082870d1"
    },
    "views": [],
    "sourceSha256": "8b03b1009cd22269aadb51ac5cbf7acf358bfba8352ba54fab8dcec4082870d1"
  },
  "hspuneg": {
    "appId": "hspuneg",
    "atlasId": "hspuneg",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/hspuneg-bok-f1-c66649a9-thumb.webp",
      "detail": "/movement-atlas/hspuneg-bok-f1-c66649a9-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "c66649a903250ad09a1bd80eb9cea79bd8be835a3e346a075f08442b613e404e"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/hspuneg-bok-f2-c8ccc1ec-thumb.webp",
        "detail": "/movement-atlas/hspuneg-bok-f2-c8ccc1ec-detail.webp",
        "dark": null,
        "width": 1536,
        "height": 1536,
        "sourceWidth": 1024,
        "sourceHeight": 1536,
        "sourceSha256": "c8ccc1eccd2fb70186160dd2814717a8b56c9f254603ba24339ed17fb60452d6"
      }
    ],
    "sourceSha256": "c66649a903250ad09a1bd80eb9cea79bd8be835a3e346a075f08442b613e404e"
  },
  "hsshift": {
    "appId": "hsshift",
    "atlasId": "hsshift",
    "primary": {
      "view": "zada",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/hsshift-zada-f1-4dc9a0fd-thumb.webp",
      "detail": "/movement-atlas/hsshift-zada-f1-4dc9a0fd-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "4dc9a0fd495625395f1e6d1206e579ec5c23bdeb6171a5155662ea3ad3db43aa"
    },
    "views": [],
    "sourceSha256": "4dc9a0fd495625395f1e6d1206e579ec5c23bdeb6171a5155662ea3ad3db43aa"
  },
  "humanflag": {
    "appId": "humanflag",
    "atlasId": "humanflag",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/humanflag-predek-f1-a93a3461-thumb.webp",
      "detail": "/movement-atlas/humanflag-predek-f1-a93a3461-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1402,
      "sourceHeight": 1122,
      "sourceSha256": "a93a3461c7a0b734c81ae0ca99ae96c42abaf924ee0ddd3ea0d6565a0599fcc8"
    },
    "views": [],
    "sourceSha256": "a93a3461c7a0b734c81ae0ca99ae96c42abaf924ee0ddd3ea0d6565a0599fcc8"
  },
  "icecream": {
    "appId": "icecream",
    "atlasId": "icecream",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/icecream-bok-f1-71940376-thumb.webp",
      "detail": "/movement-atlas/icecream-bok-f1-71940376-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "719403761313d7706f6894f47666f800d171e23d71ad5d2c53cb4bfbe42fb33a"
    },
    "views": [],
    "sourceSha256": "719403761313d7706f6894f47666f800d171e23d71ad5d2c53cb4bfbe42fb33a"
  },
  "inclpush": {
    "appId": "inclpush",
    "atlasId": "inclpush",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/inclpush-bok-f1-38e72337-thumb.webp",
      "detail": "/movement-atlas/inclpush-bok-f1-38e72337-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "38e723375846fcc0c44a13e8374dcd100551905a2bad04459490772eb4398964"
    },
    "views": [],
    "sourceSha256": "38e723375846fcc0c44a13e8374dcd100551905a2bad04459490772eb4398964"
  },
  "inclrow": {
    "appId": "inclrow",
    "atlasId": "inclrow",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/inclrow-bok-f1-c8a4e756-thumb.webp",
      "detail": "/movement-atlas/inclrow-bok-f1-c8a4e756-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "c8a4e7569aa215f360492ea05193801f6596519359d3eac3ed9162eaae258489"
    },
    "views": [],
    "sourceSha256": "c8a4e7569aa215f360492ea05193801f6596519359d3eac3ed9162eaae258489"
  },
  "ironcross": {
    "appId": "ironcross",
    "atlasId": "ironcross",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/ironcross-predek-f1-a6f56a4c-thumb.webp",
      "detail": "/movement-atlas/ironcross-predek-f1-a6f56a4c-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1122,
      "sourceHeight": 1402,
      "sourceSha256": "a6f56a4c1f0a4cfbc8118fb97036ab5c449309b00bc14e160f120b90d430bff1"
    },
    "views": [],
    "sourceSha256": "a6f56a4c1f0a4cfbc8118fb97036ab5c449309b00bc14e160f120b90d430bff1"
  },
  "jacks": {
    "appId": "jacks",
    "atlasId": "jacks",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jacks-predek-f1-b3d10a3e-thumb.webp",
      "detail": "/movement-atlas/jacks-predek-f1-b3d10a3e-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1122,
      "sourceHeight": 1402,
      "sourceSha256": "b3d10a3e1161dc32b0f470959476acda0732ab99dfd39fbb9885f4af89a878e8"
    },
    "views": [],
    "sourceSha256": "b3d10a3e1161dc32b0f470959476acda0732ab99dfd39fbb9885f4af89a878e8"
  },
  "jefferson": {
    "appId": "jefferson",
    "atlasId": "jefferson",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jefferson-bok-f1-463dcf18-thumb.webp",
      "detail": "/movement-atlas/jefferson-bok-f1-463dcf18-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "463dcf18fd6577565171246c2fc614bcd3e43d3e7f5a634888da5df4c0e75fd2"
    },
    "views": [],
    "sourceSha256": "463dcf18fd6577565171246c2fc614bcd3e43d3e7f5a634888da5df4c0e75fd2"
  },
  "jg_adho_mukha_svanasana": {
    "appId": "jg_adho_mukha_svanasana",
    "atlasId": "jg_adho_mukha_svanasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_adho_mukha_svanasana-bok-f1-693a8329-thumb.webp",
      "detail": "/movement-atlas/jg_adho_mukha_svanasana-bok-f1-693a8329-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1402,
      "sourceHeight": 1122,
      "sourceSha256": "693a8329fcc35061e60729727fc95a60c8f09f0b3c30d0345e85b2f23f3e213d"
    },
    "views": [],
    "sourceSha256": "693a8329fcc35061e60729727fc95a60c8f09f0b3c30d0345e85b2f23f3e213d"
  },
  "jg_adho_mukha_vrksasana": {
    "appId": "jg_adho_mukha_vrksasana",
    "atlasId": "jg_adho_mukha_vrksasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_adho_mukha_vrksasana-bok-f1-b1f53a2c-thumb.webp",
      "detail": "/movement-atlas/jg_adho_mukha_vrksasana-bok-f1-b1f53a2c-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "b1f53a2c1f98c75d94e4ced2bb7b381b15ab6d84f7739515ac3e55a98231284d"
    },
    "views": [],
    "sourceSha256": "b1f53a2c1f98c75d94e4ced2bb7b381b15ab6d84f7739515ac3e55a98231284d"
  },
  "jg_advasana": {
    "appId": "jg_advasana",
    "atlasId": "jg_advasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_advasana-bok-f1-85d62884-thumb.webp",
      "detail": "/movement-atlas/jg_advasana-bok-f1-85d62884-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "85d6288430dbb18fbd7ccbf3f490c56f7a6c08fa6a2a92cde9752a3a32cfdf72"
    },
    "views": [],
    "sourceSha256": "85d6288430dbb18fbd7ccbf3f490c56f7a6c08fa6a2a92cde9752a3a32cfdf72"
  },
  "jg_agnistambhasana": {
    "appId": "jg_agnistambhasana",
    "atlasId": "jg_agnistambhasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_agnistambhasana-bok-f1-7a01d5c8-thumb.webp",
      "detail": "/movement-atlas/jg_agnistambhasana-bok-f1-7a01d5c8-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1122,
      "sourceHeight": 1402,
      "sourceSha256": "7a01d5c8836bd8e4c9f4501f639f9a1e868c5d2ceef927fc25b489772a3ea741"
    },
    "views": [],
    "sourceSha256": "7a01d5c8836bd8e4c9f4501f639f9a1e868c5d2ceef927fc25b489772a3ea741"
  },
  "jg_anahatasana": {
    "appId": "jg_anahatasana",
    "atlasId": "jg_anahatasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_anahatasana-bok-f1-39fc3f80-thumb.webp",
      "detail": "/movement-atlas/jg_anahatasana-bok-f1-39fc3f80-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "39fc3f803366bcacfa160b3d42603257daa5f5a9ac6ece30e780830cab77e7ff"
    },
    "views": [],
    "sourceSha256": "39fc3f803366bcacfa160b3d42603257daa5f5a9ac6ece30e780830cab77e7ff"
  },
  "jg_ananda_balasana": {
    "appId": "jg_ananda_balasana",
    "atlasId": "jg_ananda_balasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_ananda_balasana-bok-f1-a1858f10-thumb.webp",
      "detail": "/movement-atlas/jg_ananda_balasana-bok-f1-a1858f10-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "a1858f10067ed291a4b9b448afe506ff7c2f4bcac291b38c18408fa190368f9a"
    },
    "views": [],
    "sourceSha256": "a1858f10067ed291a4b9b448afe506ff7c2f4bcac291b38c18408fa190368f9a"
  },
  "jg_anantasana": {
    "appId": "jg_anantasana",
    "atlasId": "jg_anantasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_anantasana-bok-f1-085edc6e-thumb.webp",
      "detail": "/movement-atlas/jg_anantasana-bok-f1-085edc6e-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "085edc6e1062f937575f45ca16decd3440988042a4dd8610afdecf430f4c11d0"
    },
    "views": [],
    "sourceSha256": "085edc6e1062f937575f45ca16decd3440988042a4dd8610afdecf430f4c11d0"
  },
  "jg_anjaneyasana": {
    "appId": "jg_anjaneyasana",
    "atlasId": "jg_anjaneyasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_anjaneyasana-bok-f1-7e6e2f1f-thumb.webp",
      "detail": "/movement-atlas/jg_anjaneyasana-bok-f1-7e6e2f1f-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "7e6e2f1fce852b6eaa954afbdde478da4895c46b6101d36c1fe73ea8f1f75146"
    },
    "views": [],
    "sourceSha256": "7e6e2f1fce852b6eaa954afbdde478da4895c46b6101d36c1fe73ea8f1f75146"
  },
  "jg_ardha_baddha_padmottanasana": {
    "appId": "jg_ardha_baddha_padmottanasana",
    "atlasId": "jg_ardha_baddha_padmottanasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_ardha_baddha_padmottanasana-bok-f1-229b8bbd-thumb.webp",
      "detail": "/movement-atlas/jg_ardha_baddha_padmottanasana-bok-f1-229b8bbd-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "229b8bbd89f2162d2248c64a273d5ea36f4f85f918942334bb177418b67bdee4"
    },
    "views": [],
    "sourceSha256": "229b8bbd89f2162d2248c64a273d5ea36f4f85f918942334bb177418b67bdee4"
  },
  "jg_ardha_candrasana": {
    "appId": "jg_ardha_candrasana",
    "atlasId": "jg_ardha_candrasana",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_ardha_candrasana-predek-f1-db8c22fc-thumb.webp",
      "detail": "/movement-atlas/jg_ardha_candrasana-predek-f1-db8c22fc-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "db8c22fc2ebb32c9068f002d058636ec073aa1040fd5d16994061b10ab4c1862"
    },
    "views": [],
    "sourceSha256": "db8c22fc2ebb32c9068f002d058636ec073aa1040fd5d16994061b10ab4c1862"
  },
  "jg_ardha_kurmasana": {
    "appId": "jg_ardha_kurmasana",
    "atlasId": "jg_ardha_kurmasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_ardha_kurmasana-bok-f1-cd498f4b-thumb.webp",
      "detail": "/movement-atlas/jg_ardha_kurmasana-bok-f1-cd498f4b-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "cd498f4b7bb561ce97790b9d6a90187ac1345763cca2ec18f00181be88e5d09b"
    },
    "views": [],
    "sourceSha256": "cd498f4b7bb561ce97790b9d6a90187ac1345763cca2ec18f00181be88e5d09b"
  },
  "jg_ardha_matsyendrasana": {
    "appId": "jg_ardha_matsyendrasana",
    "atlasId": "jg_ardha_matsyendrasana",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_ardha_matsyendrasana-predek-f1-e5784b39-thumb.webp",
      "detail": "/movement-atlas/jg_ardha_matsyendrasana-predek-f1-e5784b39-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "e5784b39e383f95613895cf16b8b81827db4458d79e48ac7dd860c63c1b90cef"
    },
    "views": [],
    "sourceSha256": "e5784b39e383f95613895cf16b8b81827db4458d79e48ac7dd860c63c1b90cef"
  },
  "jg_ardha_navasana": {
    "appId": "jg_ardha_navasana",
    "atlasId": "jg_ardha_navasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_ardha_navasana-bok-f1-e5b43cec-thumb.webp",
      "detail": "/movement-atlas/jg_ardha_navasana-bok-f1-e5b43cec-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "e5b43cec9791e91ce0bb73a0346df4822568b80b9a6a0b2253f26c6aca0bf814"
    },
    "views": [],
    "sourceSha256": "e5b43cec9791e91ce0bb73a0346df4822568b80b9a6a0b2253f26c6aca0bf814"
  },
  "jg_ardha_pincha_mayurasana": {
    "appId": "jg_ardha_pincha_mayurasana",
    "atlasId": "jg_ardha_pincha_mayurasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_ardha_pincha_mayurasana-bok-f1-8a5625d0-thumb.webp",
      "detail": "/movement-atlas/jg_ardha_pincha_mayurasana-bok-f1-8a5625d0-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "8a5625d06f64eb7cee7f78f34e3155662f3501de1b92460d05641f1c0abd6e5e"
    },
    "views": [],
    "sourceSha256": "8a5625d06f64eb7cee7f78f34e3155662f3501de1b92460d05641f1c0abd6e5e"
  },
  "jg_ardha_uttanasana": {
    "appId": "jg_ardha_uttanasana",
    "atlasId": "jg_ardha_uttanasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_ardha_uttanasana-bok-f1-be27b97c-thumb.webp",
      "detail": "/movement-atlas/jg_ardha_uttanasana-bok-f1-be27b97c-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "be27b97ce2e3f177a6d505182c4a2eb38351c9ec4ef7c7583292913163d69ef3"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f1",
        "primary": true,
        "thumb": "/movement-atlas/jg_ardha_uttanasana-bok-f1-be27b97c-thumb.webp",
        "detail": "/movement-atlas/jg_ardha_uttanasana-bok-f1-be27b97c-detail.webp",
        "dark": null,
        "width": 1254,
        "height": 1254,
        "sourceWidth": 1254,
        "sourceHeight": 1254,
        "sourceSha256": "be27b97ce2e3f177a6d505182c4a2eb38351c9ec4ef7c7583292913163d69ef3"
      }
    ],
    "sourceSha256": "be27b97ce2e3f177a6d505182c4a2eb38351c9ec4ef7c7583292913163d69ef3"
  },
  "jg_astanga_namaskara": {
    "appId": "jg_astanga_namaskara",
    "atlasId": "jg_astanga_namaskara",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_astanga_namaskara-bok-f1-23ba3226-thumb.webp",
      "detail": "/movement-atlas/jg_astanga_namaskara-bok-f1-23ba3226-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "23ba3226bbb886cd498dfac43873fcdba359b1d6ef1820984007e40a69fd5dd3"
    },
    "views": [],
    "sourceSha256": "23ba3226bbb886cd498dfac43873fcdba359b1d6ef1820984007e40a69fd5dd3"
  },
  "jg_astavakrasana": {
    "appId": "jg_astavakrasana",
    "atlasId": "jg_astavakrasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_astavakrasana-bok-f1-31199ef0-thumb.webp",
      "detail": "/movement-atlas/jg_astavakrasana-bok-f1-31199ef0-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "31199ef0140018b76cfea9cee8472cc2426efbc290c6b5520338a227b28fad4a"
    },
    "views": [],
    "sourceSha256": "31199ef0140018b76cfea9cee8472cc2426efbc290c6b5520338a227b28fad4a"
  },
  "jg_asva_sancalanasana": {
    "appId": "jg_asva_sancalanasana",
    "atlasId": "jg_asva_sancalanasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_asva_sancalanasana-bok-f1-41798cc5-thumb.webp",
      "detail": "/movement-atlas/jg_asva_sancalanasana-bok-f1-41798cc5-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "41798cc52dee04d220891d78e54ca6d2b834da2a7bf759ad33ec5168ded7d265"
    },
    "views": [],
    "sourceSha256": "41798cc52dee04d220891d78e54ca6d2b834da2a7bf759ad33ec5168ded7d265"
  },
  "jg_baddha_konasana": {
    "appId": "jg_baddha_konasana",
    "atlasId": "jg_baddha_konasana",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_baddha_konasana-predek-f1-d5944b1c-thumb.webp",
      "detail": "/movement-atlas/jg_baddha_konasana-predek-f1-d5944b1c-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1402,
      "sourceHeight": 1122,
      "sourceSha256": "d5944b1ce5bea6192710d1145cabbac6f73edf91dea0deb2ab07378536468481"
    },
    "views": [],
    "sourceSha256": "d5944b1ce5bea6192710d1145cabbac6f73edf91dea0deb2ab07378536468481"
  },
  "jg_baddha_trikonasana": {
    "appId": "jg_baddha_trikonasana",
    "atlasId": "jg_baddha_trikonasana",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_baddha_trikonasana-predek-f1-1a2a22dd-thumb.webp",
      "detail": "/movement-atlas/jg_baddha_trikonasana-predek-f1-1a2a22dd-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "1a2a22ddb9dde2ecc6bdb8e2c2fb8a6638325db808c243b5fd844356be452f1f"
    },
    "views": [],
    "sourceSha256": "1a2a22ddb9dde2ecc6bdb8e2c2fb8a6638325db808c243b5fd844356be452f1f"
  },
  "jg_bakasana": {
    "appId": "jg_bakasana",
    "atlasId": "jg_bakasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_bakasana-bok-f1-5e951620-thumb.webp",
      "detail": "/movement-atlas/jg_bakasana-bok-f1-5e951620-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "5e9516202f6d1577113ce086a2d03b0b1ac07932cabf6221bb39fc72370fc282"
    },
    "views": [],
    "sourceSha256": "5e9516202f6d1577113ce086a2d03b0b1ac07932cabf6221bb39fc72370fc282"
  },
  "jg_balasana": {
    "appId": "jg_balasana",
    "atlasId": "jg_balasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_balasana-bok-f1-f1b5cea3-thumb.webp",
      "detail": "/movement-atlas/jg_balasana-bok-f1-f1b5cea3-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "f1b5cea388d871712fbce9093c06f53ea35b10a91aa59fae178607360ad8a81c"
    },
    "views": [],
    "sourceSha256": "f1b5cea388d871712fbce9093c06f53ea35b10a91aa59fae178607360ad8a81c"
  },
  "jg_bhadrasana": {
    "appId": "jg_bhadrasana",
    "atlasId": "jg_bhadrasana",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_bhadrasana-predek-f1-ce10239e-thumb.webp",
      "detail": "/movement-atlas/jg_bhadrasana-predek-f1-ce10239e-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "ce10239e42703e46bc8dfdeca3eec7a1208a3f72408390e2078d5c5daaac8948"
    },
    "views": [],
    "sourceSha256": "ce10239e42703e46bc8dfdeca3eec7a1208a3f72408390e2078d5c5daaac8948"
  },
  "jg_bharadvajasana": {
    "appId": "jg_bharadvajasana",
    "atlasId": "jg_bharadvajasana",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_bharadvajasana-predek-f1-810efa3d-thumb.webp",
      "detail": "/movement-atlas/jg_bharadvajasana-predek-f1-810efa3d-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "810efa3d6505b8060b2e6384a9849af9c0cb93993e8dbcd761b3cf5a1081378d"
    },
    "views": [],
    "sourceSha256": "810efa3d6505b8060b2e6384a9849af9c0cb93993e8dbcd761b3cf5a1081378d"
  },
  "jg_bhekasana": {
    "appId": "jg_bhekasana",
    "atlasId": "jg_bhekasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_bhekasana-bok-f1-05dfe89b-thumb.webp",
      "detail": "/movement-atlas/jg_bhekasana-bok-f1-05dfe89b-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "05dfe89b08448dcacea9e94b9db213b4181c3f0d7a913ddbe1bace9a6d281466"
    },
    "views": [],
    "sourceSha256": "05dfe89b08448dcacea9e94b9db213b4181c3f0d7a913ddbe1bace9a6d281466"
  },
  "jg_bhujangasana": {
    "appId": "jg_bhujangasana",
    "atlasId": "jg_bhujangasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_bhujangasana-bok-f1-a4b003a6-thumb.webp",
      "detail": "/movement-atlas/jg_bhujangasana-bok-f1-a4b003a6-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "a4b003a6c601a661db249c316da4057d3ece9ba3860060b4073fb4205e28d37d"
    },
    "views": [],
    "sourceSha256": "a4b003a6c601a661db249c316da4057d3ece9ba3860060b4073fb4205e28d37d"
  },
  "jg_bhujapidasana": {
    "appId": "jg_bhujapidasana",
    "atlasId": "jg_bhujapidasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_bhujapidasana-bok-f1-a35ec96b-thumb.webp",
      "detail": "/movement-atlas/jg_bhujapidasana-bok-f1-a35ec96b-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "a35ec96bd4ff3432df3d5686105de03e070b5fdd8e27202c9d29988361ae2419"
    },
    "views": [],
    "sourceSha256": "a35ec96bd4ff3432df3d5686105de03e070b5fdd8e27202c9d29988361ae2419"
  },
  "jg_bitilasana_marjari": {
    "appId": "jg_bitilasana_marjari",
    "atlasId": "jg_bitilasana_marjari",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_bitilasana_marjari-bok-f1-42c2f491-thumb.webp",
      "detail": "/movement-atlas/jg_bitilasana_marjari-bok-f1-42c2f491-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "42c2f4912419672c82a0c006325ba71dc23e8bbda5d3631f9c93467324af6d09"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/jg_bitilasana_marjari-bok-f2-a2c5b7d1-thumb.webp",
        "detail": "/movement-atlas/jg_bitilasana_marjari-bok-f2-a2c5b7d1-detail.webp",
        "dark": null,
        "width": 1448,
        "height": 1448,
        "sourceWidth": 1448,
        "sourceHeight": 1086,
        "sourceSha256": "a2c5b7d10af5427ffeaf95d7cae90e2e7a18a91c9fccf3cd400b82f8ee1293b8"
      }
    ],
    "sourceSha256": "42c2f4912419672c82a0c006325ba71dc23e8bbda5d3631f9c93467324af6d09"
  },
  "jg_camatkarasana": {
    "appId": "jg_camatkarasana",
    "atlasId": "jg_camatkarasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_camatkarasana-bok-f1-d0b4f303-thumb.webp",
      "detail": "/movement-atlas/jg_camatkarasana-bok-f1-d0b4f303-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "d0b4f30359f6146acb6b4a46afdd72ddfa2b2b9ee5ebe521b0f61f46e3a939e5"
    },
    "views": [],
    "sourceSha256": "d0b4f30359f6146acb6b4a46afdd72ddfa2b2b9ee5ebe521b0f61f46e3a939e5"
  },
  "jg_caturanga_dandasana": {
    "appId": "jg_caturanga_dandasana",
    "atlasId": "jg_caturanga_dandasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_caturanga_dandasana-bok-f1-129920a7-thumb.webp",
      "detail": "/movement-atlas/jg_caturanga_dandasana-bok-f1-129920a7-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "129920a7615a42d9b315d342157ea3ca85b488ac3378ab76cf0ff4ec967a4eca"
    },
    "views": [],
    "sourceSha256": "129920a7615a42d9b315d342157ea3ca85b488ac3378ab76cf0ff4ec967a4eca"
  },
  "jg_dandasana": {
    "appId": "jg_dandasana",
    "atlasId": "jg_dandasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_dandasana-bok-f1-3e5e2491-thumb.webp",
      "detail": "/movement-atlas/jg_dandasana-bok-f1-3e5e2491-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "3e5e24912a398f233224602b4c3a8ad28431ed8db9df86d5cff4a90cef80372d"
    },
    "views": [],
    "sourceSha256": "3e5e24912a398f233224602b4c3a8ad28431ed8db9df86d5cff4a90cef80372d"
  },
  "jg_dandayamana_bibhaktapada_pascimottanasana": {
    "appId": "jg_dandayamana_bibhaktapada_pascimottanasana",
    "atlasId": "jg_dandayamana_bibhaktapada_pascimottanasana",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_dandayamana_bibhaktapada_pascimottanasana-predek-f1-7062ac01-thumb.webp",
      "detail": "/movement-atlas/jg_dandayamana_bibhaktapada_pascimottanasana-predek-f1-7062ac01-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "7062ac01638cbf36b9eb93bd9e186bdc8e98dc1810033203af3498e64861a627"
    },
    "views": [],
    "sourceSha256": "7062ac01638cbf36b9eb93bd9e186bdc8e98dc1810033203af3498e64861a627"
  },
  "jg_dandayamana_dhanurasana": {
    "appId": "jg_dandayamana_dhanurasana",
    "atlasId": "jg_dandayamana_dhanurasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_dandayamana_dhanurasana-bok-f1-7979beff-thumb.webp",
      "detail": "/movement-atlas/jg_dandayamana_dhanurasana-bok-f1-7979beff-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "7979beff75c998dbf94a66507ab96af98fe207d05599571b88c001faa127bb81"
    },
    "views": [],
    "sourceSha256": "7979beff75c998dbf94a66507ab96af98fe207d05599571b88c001faa127bb81"
  },
  "jg_dandayamana_janusirasana": {
    "appId": "jg_dandayamana_janusirasana",
    "atlasId": "jg_dandayamana_janusirasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_dandayamana_janusirasana-bok-f1-0287b4b3-thumb.webp",
      "detail": "/movement-atlas/jg_dandayamana_janusirasana-bok-f1-0287b4b3-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "0287b4b34fa841ecf1543751de119fc442a19f827891636f8445994075cea552"
    },
    "views": [],
    "sourceSha256": "0287b4b34fa841ecf1543751de119fc442a19f827891636f8445994075cea552"
  },
  "jg_dhanurasana": {
    "appId": "jg_dhanurasana",
    "atlasId": "jg_dhanurasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_dhanurasana-bok-f1-875cac0b-thumb.webp",
      "detail": "/movement-atlas/jg_dhanurasana-bok-f1-875cac0b-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "875cac0b24b145978d9fc9da2110d5220bd91fdce10bc22e7442c4ee15928991"
    },
    "views": [],
    "sourceSha256": "875cac0b24b145978d9fc9da2110d5220bd91fdce10bc22e7442c4ee15928991"
  },
  "jg_dragon": {
    "appId": "jg_dragon",
    "atlasId": "jg_dragon",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_dragon-bok-f1-1a297e67-thumb.webp",
      "detail": "/movement-atlas/jg_dragon-bok-f1-1a297e67-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "1a297e67082fb1673aff31a31e88ff05f09896ba4fbecc17897744f52fae7673"
    },
    "views": [],
    "sourceSha256": "1a297e67082fb1673aff31a31e88ff05f09896ba4fbecc17897744f52fae7673"
  },
  "jg_dvi_pada_viparita_dandasana": {
    "appId": "jg_dvi_pada_viparita_dandasana",
    "atlasId": "jg_dvi_pada_viparita_dandasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_dvi_pada_viparita_dandasana-bok-f1-e8106806-thumb.webp",
      "detail": "/movement-atlas/jg_dvi_pada_viparita_dandasana-bok-f1-e8106806-detail.webp",
      "dark": null,
      "width": 1774,
      "height": 1774,
      "sourceWidth": 1774,
      "sourceHeight": 887,
      "sourceSha256": "e810680690db52e24ce2f38e59baee51359772f4b67d15921b93f0d1cb2bc7cd"
    },
    "views": [],
    "sourceSha256": "e810680690db52e24ce2f38e59baee51359772f4b67d15921b93f0d1cb2bc7cd"
  },
  "jg_eka_pada_koundinyasana": {
    "appId": "jg_eka_pada_koundinyasana",
    "atlasId": "jg_eka_pada_koundinyasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_eka_pada_koundinyasana-bok-f1-5f534448-thumb.webp",
      "detail": "/movement-atlas/jg_eka_pada_koundinyasana-bok-f1-5f534448-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "5f53444867c6e75ed3f359650080c7a80d59c831ae03fda584ffc83c56296e89"
    },
    "views": [],
    "sourceSha256": "5f53444867c6e75ed3f359650080c7a80d59c831ae03fda584ffc83c56296e89"
  },
  "jg_eka_pada_rajakapotasana": {
    "appId": "jg_eka_pada_rajakapotasana",
    "atlasId": "jg_eka_pada_rajakapotasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_eka_pada_rajakapotasana-bok-f1-6a4420ba-thumb.webp",
      "detail": "/movement-atlas/jg_eka_pada_rajakapotasana-bok-f1-6a4420ba-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "6a4420ba46cbf9f81e7dee621aa438d3a02a527c7c8eb1e9ed519435ae74018b"
    },
    "views": [],
    "sourceSha256": "6a4420ba46cbf9f81e7dee621aa438d3a02a527c7c8eb1e9ed519435ae74018b"
  },
  "jg_eka_pada_sirsasana": {
    "appId": "jg_eka_pada_sirsasana",
    "atlasId": "jg_eka_pada_sirsasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_eka_pada_sirsasana-bok-f1-1432b70d-thumb.webp",
      "detail": "/movement-atlas/jg_eka_pada_sirsasana-bok-f1-1432b70d-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "1432b70d977756e9865110eff203237f58f375a1a317f48fc537d169fd032aa5"
    },
    "views": [],
    "sourceSha256": "1432b70d977756e9865110eff203237f58f375a1a317f48fc537d169fd032aa5"
  },
  "jg_galavasana": {
    "appId": "jg_galavasana",
    "atlasId": "jg_galavasana",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_galavasana-predek-f1-906f52bf-thumb.webp",
      "detail": "/movement-atlas/jg_galavasana-predek-f1-906f52bf-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "906f52bf06fc432ae5b1dcdb10b23dd76da7879253f9f2914a498a4592a4956a"
    },
    "views": [],
    "sourceSha256": "906f52bf06fc432ae5b1dcdb10b23dd76da7879253f9f2914a498a4592a4956a"
  },
  "jg_garbha_pindasana": {
    "appId": "jg_garbha_pindasana",
    "atlasId": "jg_garbha_pindasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_garbha_pindasana-bok-f1-fae74349-thumb.webp",
      "detail": "/movement-atlas/jg_garbha_pindasana-bok-f1-fae74349-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "fae743495c28a4675a810508aad4aed11ce3aa44b03701fd11bdcf7c4654bc27"
    },
    "views": [],
    "sourceSha256": "fae743495c28a4675a810508aad4aed11ce3aa44b03701fd11bdcf7c4654bc27"
  },
  "jg_garudasana": {
    "appId": "jg_garudasana",
    "atlasId": "jg_garudasana",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_garudasana-predek-f1-a600d5ca-thumb.webp",
      "detail": "/movement-atlas/jg_garudasana-predek-f1-a600d5ca-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "a600d5ca3543ec3e93e5b990af996a24a85fa227407b9fbada5ccfbc58559632"
    },
    "views": [],
    "sourceSha256": "a600d5ca3543ec3e93e5b990af996a24a85fa227407b9fbada5ccfbc58559632"
  },
  "jg_gomukhasana": {
    "appId": "jg_gomukhasana",
    "atlasId": "jg_gomukhasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_gomukhasana-bok-f1-7108ab6f-thumb.webp",
      "detail": "/movement-atlas/jg_gomukhasana-bok-f1-7108ab6f-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1122,
      "sourceHeight": 1402,
      "sourceSha256": "7108ab6fee069ba479bad6ec4738de2ed06840de9527b392056d653c70fe8036"
    },
    "views": [],
    "sourceSha256": "7108ab6fee069ba479bad6ec4738de2ed06840de9527b392056d653c70fe8036"
  },
  "jg_gorakshasana": {
    "appId": "jg_gorakshasana",
    "atlasId": "jg_gorakshasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_gorakshasana-bok-f1-76448107-thumb.webp",
      "detail": "/movement-atlas/jg_gorakshasana-bok-f1-76448107-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1122,
      "sourceHeight": 1402,
      "sourceSha256": "764481078f6d79fc2e274eee604e7729e8122f0d5372e7feeef05a4bb4e4c756"
    },
    "views": [],
    "sourceSha256": "764481078f6d79fc2e274eee604e7729e8122f0d5372e7feeef05a4bb4e4c756"
  },
  "jg_halasana": {
    "appId": "jg_halasana",
    "atlasId": "jg_halasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_halasana-bok-f1-32e285f1-thumb.webp",
      "detail": "/movement-atlas/jg_halasana-bok-f1-32e285f1-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "32e285f1cd4429c94f6ff5d50393b34637536eebf9671f868bbf627098a5d2c0"
    },
    "views": [],
    "sourceSha256": "32e285f1cd4429c94f6ff5d50393b34637536eebf9671f868bbf627098a5d2c0"
  },
  "jg_hamsasana": {
    "appId": "jg_hamsasana",
    "atlasId": "jg_hamsasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_hamsasana-bok-f1-7c6d1b9f-thumb.webp",
      "detail": "/movement-atlas/jg_hamsasana-bok-f1-7c6d1b9f-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1402,
      "sourceHeight": 1122,
      "sourceSha256": "7c6d1b9f209b1e640b595c38507d3c1500605842de595ed16440ad766add75af"
    },
    "views": [],
    "sourceSha256": "7c6d1b9f209b1e640b595c38507d3c1500605842de595ed16440ad766add75af"
  },
  "jg_hanumanasana": {
    "appId": "jg_hanumanasana",
    "atlasId": "jg_hanumanasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_hanumanasana-bok-f1-8f22e11a-thumb.webp",
      "detail": "/movement-atlas/jg_hanumanasana-bok-f1-8f22e11a-detail.webp",
      "dark": null,
      "width": 1774,
      "height": 1774,
      "sourceWidth": 1774,
      "sourceHeight": 887,
      "sourceSha256": "8f22e11a5ab1c6c1befe2aaee00147d4751209e5531da04640919b2693e86208"
    },
    "views": [],
    "sourceSha256": "8f22e11a5ab1c6c1befe2aaee00147d4751209e5531da04640919b2693e86208"
  },
  "jg_hasta_uttanasana": {
    "appId": "jg_hasta_uttanasana",
    "atlasId": "jg_hasta_uttanasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_hasta_uttanasana-bok-f1-8a7a8ad1-thumb.webp",
      "detail": "/movement-atlas/jg_hasta_uttanasana-bok-f1-8a7a8ad1-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1122,
      "sourceHeight": 1402,
      "sourceSha256": "8a7a8ad103328f5672262de8406db9a299648e7f177cb869bbcd594581de35df"
    },
    "views": [],
    "sourceSha256": "8a7a8ad103328f5672262de8406db9a299648e7f177cb869bbcd594581de35df"
  },
  "jg_janu_sirsasana": {
    "appId": "jg_janu_sirsasana",
    "atlasId": "jg_janu_sirsasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_janu_sirsasana-bok-f1-595f3b8c-thumb.webp",
      "detail": "/movement-atlas/jg_janu_sirsasana-bok-f1-595f3b8c-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "595f3b8c8641780e1bfe5966c9f703004838a544496cd8ae88e9b489304b7fbd"
    },
    "views": [],
    "sourceSha256": "595f3b8c8641780e1bfe5966c9f703004838a544496cd8ae88e9b489304b7fbd"
  },
  "jg_jathara_parivartanasana": {
    "appId": "jg_jathara_parivartanasana",
    "atlasId": "jg_jathara_parivartanasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_jathara_parivartanasana-bok-f1-a8658f01-thumb.webp",
      "detail": "/movement-atlas/jg_jathara_parivartanasana-bok-f1-a8658f01-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "a8658f01962b70f80f2e3cc798b120d1be81249e8cfbcbde51e7c5d5039078c7"
    },
    "views": [],
    "sourceSha256": "a8658f01962b70f80f2e3cc798b120d1be81249e8cfbcbde51e7c5d5039078c7"
  },
  "jg_kakasana": {
    "appId": "jg_kakasana",
    "atlasId": "jg_kakasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_kakasana-bok-f1-ad71071e-thumb.webp",
      "detail": "/movement-atlas/jg_kakasana-bok-f1-ad71071e-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "ad71071e8ebb08853dace8881a7856b0a54ade8830503ec137c0ec44c5853980"
    },
    "views": [],
    "sourceSha256": "ad71071e8ebb08853dace8881a7856b0a54ade8830503ec137c0ec44c5853980"
  },
  "jg_kandharasana": {
    "appId": "jg_kandharasana",
    "atlasId": "jg_kandharasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_kandharasana-bok-f1-9a75accf-thumb.webp",
      "detail": "/movement-atlas/jg_kandharasana-bok-f1-9a75accf-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "9a75accf83ee1fa8074aa73cf2e397afaf6413ca2df4e7ed0ad651dc8b095819"
    },
    "views": [],
    "sourceSha256": "9a75accf83ee1fa8074aa73cf2e397afaf6413ca2df4e7ed0ad651dc8b095819"
  },
  "jg_kapotasana": {
    "appId": "jg_kapotasana",
    "atlasId": "jg_kapotasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_kapotasana-bok-f1-97732510-thumb.webp",
      "detail": "/movement-atlas/jg_kapotasana-bok-f1-97732510-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "97732510d8a8efaa486f0740e45f79f629978e2d54ded240a12445c8a24bf01f"
    },
    "views": [],
    "sourceSha256": "97732510d8a8efaa486f0740e45f79f629978e2d54ded240a12445c8a24bf01f"
  },
  "jg_karnapidasana": {
    "appId": "jg_karnapidasana",
    "atlasId": "jg_karnapidasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_karnapidasana-bok-f1-91836d09-thumb.webp",
      "detail": "/movement-atlas/jg_karnapidasana-bok-f1-91836d09-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "91836d09d00e0f522cb5c832b4c5bc564fc75f37a1f157bf5320f9340cbcf2c3"
    },
    "views": [],
    "sourceSha256": "91836d09d00e0f522cb5c832b4c5bc564fc75f37a1f157bf5320f9340cbcf2c3"
  },
  "jg_kati_cakrasana": {
    "appId": "jg_kati_cakrasana",
    "atlasId": "jg_kati_cakrasana",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_kati_cakrasana-predek-f1-5e1f1246-thumb.webp",
      "detail": "/movement-atlas/jg_kati_cakrasana-predek-f1-5e1f1246-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "5e1f1246436db4c0f2de90b0fb26753b70a83ddab8d7a4c226303bf9789d0490"
    },
    "views": [],
    "sourceSha256": "5e1f1246436db4c0f2de90b0fb26753b70a83ddab8d7a4c226303bf9789d0490"
  },
  "jg_krounchasana": {
    "appId": "jg_krounchasana",
    "atlasId": "jg_krounchasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_krounchasana-bok-f1-c77cea84-thumb.webp",
      "detail": "/movement-atlas/jg_krounchasana-bok-f1-c77cea84-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "c77cea848a0cc00f6d46addab5fe100f541bc2b5e7493fe3bfa9eec6a4721bbe"
    },
    "views": [],
    "sourceSha256": "c77cea848a0cc00f6d46addab5fe100f541bc2b5e7493fe3bfa9eec6a4721bbe"
  },
  "jg_kukkutasana": {
    "appId": "jg_kukkutasana",
    "atlasId": "jg_kukkutasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_kukkutasana-bok-f1-9feaf594-thumb.webp",
      "detail": "/movement-atlas/jg_kukkutasana-bok-f1-9feaf594-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "9feaf594aecbddd41f97660555dc67c2c589738b2c7c999b600efa126b355c48"
    },
    "views": [],
    "sourceSha256": "9feaf594aecbddd41f97660555dc67c2c589738b2c7c999b600efa126b355c48"
  },
  "jg_kurmasana": {
    "appId": "jg_kurmasana",
    "atlasId": "jg_kurmasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_kurmasana-bok-f1-cae7f1a7-thumb.webp",
      "detail": "/movement-atlas/jg_kurmasana-bok-f1-cae7f1a7-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "cae7f1a77f3fab11e7892d265917363772e55070ff2faed27d8211a46b05c539"
    },
    "views": [],
    "sourceSha256": "cae7f1a77f3fab11e7892d265917363772e55070ff2faed27d8211a46b05c539"
  },
  "jg_laghuvajrasana": {
    "appId": "jg_laghuvajrasana",
    "atlasId": "jg_laghuvajrasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_laghuvajrasana-bok-f1-4a7d8392-thumb.webp",
      "detail": "/movement-atlas/jg_laghuvajrasana-bok-f1-4a7d8392-detail.webp",
      "dark": null,
      "width": 1774,
      "height": 1774,
      "sourceWidth": 1774,
      "sourceHeight": 887,
      "sourceSha256": "4a7d8392d638f28ece19af6feeb2883e3aff387402c112e63049e0d5e79266a0"
    },
    "views": [],
    "sourceSha256": "4a7d8392d638f28ece19af6feeb2883e3aff387402c112e63049e0d5e79266a0"
  },
  "jg_lolasana": {
    "appId": "jg_lolasana",
    "atlasId": "jg_lolasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_lolasana-bok-f1-b4b33faa-thumb.webp",
      "detail": "/movement-atlas/jg_lolasana-bok-f1-b4b33faa-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "b4b33faabdacfdb19cda3e7d0679a81012f69cdd7cdfbc181f78ddfc8b6fac35"
    },
    "views": [],
    "sourceSha256": "b4b33faabdacfdb19cda3e7d0679a81012f69cdd7cdfbc181f78ddfc8b6fac35"
  },
  "jg_mahamudra": {
    "appId": "jg_mahamudra",
    "atlasId": "jg_mahamudra",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_mahamudra-bok-f1-713fbe12-thumb.webp",
      "detail": "/movement-atlas/jg_mahamudra-bok-f1-713fbe12-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "713fbe12cd04ccb8b1c9230b2a6f22fb15f4af3842eea190b2c0539208a639b4"
    },
    "views": [],
    "sourceSha256": "713fbe12cd04ccb8b1c9230b2a6f22fb15f4af3842eea190b2c0539208a639b4"
  },
  "jg_makarasana": {
    "appId": "jg_makarasana",
    "atlasId": "jg_makarasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_makarasana-bok-f1-59026489-thumb.webp",
      "detail": "/movement-atlas/jg_makarasana-bok-f1-59026489-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "590264893a7c157f44d811f0d60307ae465a99cb4d53851b103932d8e1bd49f7"
    },
    "views": [],
    "sourceSha256": "590264893a7c157f44d811f0d60307ae465a99cb4d53851b103932d8e1bd49f7"
  },
  "jg_malasana": {
    "appId": "jg_malasana",
    "atlasId": "jg_malasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_malasana-bok-f1-40830b2a-thumb.webp",
      "detail": "/movement-atlas/jg_malasana-bok-f1-40830b2a-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "40830b2a25bf4447dfbac673bbbe7ff69a2db7e9f0d748c520c3308c413c1c07"
    },
    "views": [],
    "sourceSha256": "40830b2a25bf4447dfbac673bbbe7ff69a2db7e9f0d748c520c3308c413c1c07"
  },
  "jg_mandukasana": {
    "appId": "jg_mandukasana",
    "atlasId": "jg_mandukasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_mandukasana-bok-f1-2eaccb78-thumb.webp",
      "detail": "/movement-atlas/jg_mandukasana-bok-f1-2eaccb78-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1402,
      "sourceHeight": 1122,
      "sourceSha256": "2eaccb78b992646d310f4f6bce587f097a30c0e7f3f31cacad7eb15c90f1336a"
    },
    "views": [],
    "sourceSha256": "2eaccb78b992646d310f4f6bce587f097a30c0e7f3f31cacad7eb15c90f1336a"
  },
  "jg_marichyasana_a": {
    "appId": "jg_marichyasana_a",
    "atlasId": "jg_marichyasana_a",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_marichyasana_a-bok-f1-d6248897-thumb.webp",
      "detail": "/movement-atlas/jg_marichyasana_a-bok-f1-d6248897-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "d6248897b2eea8205c5e2a78221a0b29ddf5d2baedf7805b4c89505b24e200cc"
    },
    "views": [],
    "sourceSha256": "d6248897b2eea8205c5e2a78221a0b29ddf5d2baedf7805b4c89505b24e200cc"
  },
  "jg_marichyasana_c": {
    "appId": "jg_marichyasana_c",
    "atlasId": "jg_marichyasana_c",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_marichyasana_c-predek-f1-4f9bea9d-thumb.webp",
      "detail": "/movement-atlas/jg_marichyasana_c-predek-f1-4f9bea9d-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "4f9bea9d2057748528820077bb05628ded6dd99349c18a9b4514fe212393511f"
    },
    "views": [],
    "sourceSha256": "4f9bea9d2057748528820077bb05628ded6dd99349c18a9b4514fe212393511f"
  },
  "jg_marichyasana_d": {
    "appId": "jg_marichyasana_d",
    "atlasId": "jg_marichyasana_d",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_marichyasana_d-predek-f1-d27408cd-thumb.webp",
      "detail": "/movement-atlas/jg_marichyasana_d-predek-f1-d27408cd-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "d27408cdffdd9baccaa8cbea0e66a2b515e711ee1b2094564a4f71721414bb3b"
    },
    "views": [],
    "sourceSha256": "d27408cdffdd9baccaa8cbea0e66a2b515e711ee1b2094564a4f71721414bb3b"
  },
  "jg_matsya_kridasana": {
    "appId": "jg_matsya_kridasana",
    "atlasId": "jg_matsya_kridasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_matsya_kridasana-bok-f1-0f26e22f-thumb.webp",
      "detail": "/movement-atlas/jg_matsya_kridasana-bok-f1-0f26e22f-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "0f26e22fc1fd3013a3134fa5766759cc6bd25b2bd405a7c2eec60a8ca91158b0"
    },
    "views": [],
    "sourceSha256": "0f26e22fc1fd3013a3134fa5766759cc6bd25b2bd405a7c2eec60a8ca91158b0"
  },
  "jg_matsyasana": {
    "appId": "jg_matsyasana",
    "atlasId": "jg_matsyasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_matsyasana-bok-f1-e8e2b81c-thumb.webp",
      "detail": "/movement-atlas/jg_matsyasana-bok-f1-e8e2b81c-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "e8e2b81c7e8c663c7323c50881e724ed4e7f26f56429653a71c3d0b7fedda384"
    },
    "views": [],
    "sourceSha256": "e8e2b81c7e8c663c7323c50881e724ed4e7f26f56429653a71c3d0b7fedda384"
  },
  "jg_matsyendrasana": {
    "appId": "jg_matsyendrasana",
    "atlasId": "jg_matsyendrasana",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_matsyendrasana-predek-f1-a66aba67-thumb.webp",
      "detail": "/movement-atlas/jg_matsyendrasana-predek-f1-a66aba67-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "a66aba67eccddac859748aa470b76f0d8c69a3bdd71cc7072d6d4e19b49a4a8c"
    },
    "views": [],
    "sourceSha256": "a66aba67eccddac859748aa470b76f0d8c69a3bdd71cc7072d6d4e19b49a4a8c"
  },
  "jg_mayurasana": {
    "appId": "jg_mayurasana",
    "atlasId": "jg_mayurasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_mayurasana-bok-f1-fe439ff7-thumb.webp",
      "detail": "/movement-atlas/jg_mayurasana-bok-f1-fe439ff7-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "fe439ff71a16887ae2f3d5e50cd0c478cd4ec7dbb83360b460e979fd612aa2eb"
    },
    "views": [],
    "sourceSha256": "fe439ff71a16887ae2f3d5e50cd0c478cd4ec7dbb83360b460e979fd612aa2eb"
  },
  "jg_muktasana": {
    "appId": "jg_muktasana",
    "atlasId": "jg_muktasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_muktasana-bok-f1-f3ea4167-thumb.webp",
      "detail": "/movement-atlas/jg_muktasana-bok-f1-f3ea4167-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1122,
      "sourceHeight": 1402,
      "sourceSha256": "f3ea4167c34ca29b2ecd981b1c0e4de3df2cc0eb330e263e3cf6e2b9fdf2c1cb"
    },
    "views": [],
    "sourceSha256": "f3ea4167c34ca29b2ecd981b1c0e4de3df2cc0eb330e263e3cf6e2b9fdf2c1cb"
  },
  "jg_mulabandhasana": {
    "appId": "jg_mulabandhasana",
    "atlasId": "jg_mulabandhasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_mulabandhasana-bok-f1-2cfe55ba-thumb.webp",
      "detail": "/movement-atlas/jg_mulabandhasana-bok-f1-2cfe55ba-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "2cfe55ba26baafa3703b0b5b115dc7310b7bda6231dfd61a28cf5dd3f0790bb7"
    },
    "views": [],
    "sourceSha256": "2cfe55ba26baafa3703b0b5b115dc7310b7bda6231dfd61a28cf5dd3f0790bb7"
  },
  "jg_nakrasana": {
    "appId": "jg_nakrasana",
    "atlasId": "jg_nakrasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_nakrasana-bok-f1-d03caa67-thumb.webp",
      "detail": "/movement-atlas/jg_nakrasana-bok-f1-d03caa67-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "d03caa670f7ea29b3a860321604dc321025cebbe26cffeec7a7e4f9b97b3b6bb"
    },
    "views": [],
    "sourceSha256": "d03caa670f7ea29b3a860321604dc321025cebbe26cffeec7a7e4f9b97b3b6bb"
  },
  "jg_natarajasana": {
    "appId": "jg_natarajasana",
    "atlasId": "jg_natarajasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_natarajasana-bok-f1-f607ad3a-thumb.webp",
      "detail": "/movement-atlas/jg_natarajasana-bok-f1-f607ad3a-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "f607ad3a7274ab4105d18ac60514a55a9c0cda8b2894b785690a528d08d08957"
    },
    "views": [],
    "sourceSha256": "f607ad3a7274ab4105d18ac60514a55a9c0cda8b2894b785690a528d08d08957"
  },
  "jg_naukasana": {
    "appId": "jg_naukasana",
    "atlasId": "jg_naukasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_naukasana-bok-f1-bb4ec0f7-thumb.webp",
      "detail": "/movement-atlas/jg_naukasana-bok-f1-bb4ec0f7-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "bb4ec0f73d9475d74c439e3cac7a3cdf923b792e07578f4710d7b9784cc9a847"
    },
    "views": [],
    "sourceSha256": "bb4ec0f73d9475d74c439e3cac7a3cdf923b792e07578f4710d7b9784cc9a847"
  },
  "jg_nirlamba_sarvangasana": {
    "appId": "jg_nirlamba_sarvangasana",
    "atlasId": "jg_nirlamba_sarvangasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_nirlamba_sarvangasana-bok-f1-564056f0-thumb.webp",
      "detail": "/movement-atlas/jg_nirlamba_sarvangasana-bok-f1-564056f0-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "564056f064e53448ae8a6556bba066a3c5fb97d1b618e8942eee6178501ad4ed"
    },
    "views": [],
    "sourceSha256": "564056f064e53448ae8a6556bba066a3c5fb97d1b618e8942eee6178501ad4ed"
  },
  "jg_padangusthasana": {
    "appId": "jg_padangusthasana",
    "atlasId": "jg_padangusthasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_padangusthasana-bok-f1-7d70f5d0-thumb.webp",
      "detail": "/movement-atlas/jg_padangusthasana-bok-f1-7d70f5d0-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1122,
      "sourceHeight": 1402,
      "sourceSha256": "7d70f5d030f75436f30a8e2c317abf639c20e5fa99e1e4895bf6c537ba35a409"
    },
    "views": [],
    "sourceSha256": "7d70f5d030f75436f30a8e2c317abf639c20e5fa99e1e4895bf6c537ba35a409"
  },
  "jg_padangusthasana_toe": {
    "appId": "jg_padangusthasana_toe",
    "atlasId": "jg_padangusthasana_toe",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_padangusthasana_toe-predek-f1-738004e7-thumb.webp",
      "detail": "/movement-atlas/jg_padangusthasana_toe-predek-f1-738004e7-detail.webp",
      "dark": null,
      "width": 1369,
      "height": 1369,
      "sourceWidth": 1149,
      "sourceHeight": 1369,
      "sourceSha256": "738004e7c5bb7f5e0951ff83e42945e52f6d0a64b1bdaf8d3bb5b553021d718d"
    },
    "views": [],
    "sourceSha256": "738004e7c5bb7f5e0951ff83e42945e52f6d0a64b1bdaf8d3bb5b553021d718d"
  },
  "jg_padmasana": {
    "appId": "jg_padmasana",
    "atlasId": "jg_padmasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_padmasana-bok-f1-1a6dd56b-thumb.webp",
      "detail": "/movement-atlas/jg_padmasana-bok-f1-1a6dd56b-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1122,
      "sourceHeight": 1402,
      "sourceSha256": "1a6dd56b1e55707513669a750d99d3a0e762348cc2035209770266a65ebdbbe0"
    },
    "views": [],
    "sourceSha256": "1a6dd56b1e55707513669a750d99d3a0e762348cc2035209770266a65ebdbbe0"
  },
  "jg_parighasana": {
    "appId": "jg_parighasana",
    "atlasId": "jg_parighasana",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_parighasana-predek-f1-e0a7bf61-thumb.webp",
      "detail": "/movement-atlas/jg_parighasana-predek-f1-e0a7bf61-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "e0a7bf61d112173757a08cb1fb46fe6c912bf515e86b8e9992309545b00b689d"
    },
    "views": [],
    "sourceSha256": "e0a7bf61d112173757a08cb1fb46fe6c912bf515e86b8e9992309545b00b689d"
  },
  "jg_paripurna_navasana": {
    "appId": "jg_paripurna_navasana",
    "atlasId": "jg_paripurna_navasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_paripurna_navasana-bok-f1-914fc64b-thumb.webp",
      "detail": "/movement-atlas/jg_paripurna_navasana-bok-f1-914fc64b-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "914fc64bfc9056c55514a3c6e394fb427892d3e612ada7f92523735ff134932d"
    },
    "views": [],
    "sourceSha256": "914fc64bfc9056c55514a3c6e394fb427892d3e612ada7f92523735ff134932d"
  },
  "jg_parivrtta_ardha_candrasana": {
    "appId": "jg_parivrtta_ardha_candrasana",
    "atlasId": "jg_parivrtta_ardha_candrasana",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_parivrtta_ardha_candrasana-predek-f1-c93e7292-thumb.webp",
      "detail": "/movement-atlas/jg_parivrtta_ardha_candrasana-predek-f1-c93e7292-detail.webp",
      "dark": null,
      "width": 1327,
      "height": 1327,
      "sourceWidth": 1327,
      "sourceHeight": 1185,
      "sourceSha256": "c93e72923edc078b6d27801ea2ef03905d0d9fd0f10de3bca995937eb9f43133"
    },
    "views": [],
    "sourceSha256": "c93e72923edc078b6d27801ea2ef03905d0d9fd0f10de3bca995937eb9f43133"
  },
  "jg_parivrtta_janu_sirsasana": {
    "appId": "jg_parivrtta_janu_sirsasana",
    "atlasId": "jg_parivrtta_janu_sirsasana",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_parivrtta_janu_sirsasana-predek-f1-b2d693d4-thumb.webp",
      "detail": "/movement-atlas/jg_parivrtta_janu_sirsasana-predek-f1-b2d693d4-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "b2d693d4950b14a8e232878b93375a7ff26b9894281fc503f9c3922542597692"
    },
    "views": [],
    "sourceSha256": "b2d693d4950b14a8e232878b93375a7ff26b9894281fc503f9c3922542597692"
  },
  "jg_parivrtta_parsvakonasana": {
    "appId": "jg_parivrtta_parsvakonasana",
    "atlasId": "jg_parivrtta_parsvakonasana",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_parivrtta_parsvakonasana-predek-f1-b0781a5c-thumb.webp",
      "detail": "/movement-atlas/jg_parivrtta_parsvakonasana-predek-f1-b0781a5c-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "b0781a5c7c456907ca3b597c226f4f2031f08c32924bae7b6ba2fe7be95f3beb"
    },
    "views": [],
    "sourceSha256": "b0781a5c7c456907ca3b597c226f4f2031f08c32924bae7b6ba2fe7be95f3beb"
  },
  "jg_parivrtta_trikonasana": {
    "appId": "jg_parivrtta_trikonasana",
    "atlasId": "jg_parivrtta_trikonasana",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_parivrtta_trikonasana-predek-f1-39c56c39-thumb.webp",
      "detail": "/movement-atlas/jg_parivrtta_trikonasana-predek-f1-39c56c39-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "39c56c39a40b594c3c9fe384f46066829984eda5f3835089bdfa3aafe46179d7"
    },
    "views": [],
    "sourceSha256": "39c56c39a40b594c3c9fe384f46066829984eda5f3835089bdfa3aafe46179d7"
  },
  "jg_parsva_bakasana": {
    "appId": "jg_parsva_bakasana",
    "atlasId": "jg_parsva_bakasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_parsva_bakasana-bok-f1-f60f5cf1-thumb.webp",
      "detail": "/movement-atlas/jg_parsva_bakasana-bok-f1-f60f5cf1-detail.webp",
      "dark": null,
      "width": 1306,
      "height": 1306,
      "sourceWidth": 1306,
      "sourceHeight": 1204,
      "sourceSha256": "f60f5cf1a120cf5342b3444fdead83222eeb76899f95f63d691a161ddf07cd0a"
    },
    "views": [],
    "sourceSha256": "f60f5cf1a120cf5342b3444fdead83222eeb76899f95f63d691a161ddf07cd0a"
  },
  "jg_parsva_halasana": {
    "appId": "jg_parsva_halasana",
    "atlasId": "jg_parsva_halasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_parsva_halasana-bok-f1-8f6c62a3-thumb.webp",
      "detail": "/movement-atlas/jg_parsva_halasana-bok-f1-8f6c62a3-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "8f6c62a33e31257b7b740a79888f89e30bf85b614416338db098ce0d554941bb"
    },
    "views": [],
    "sourceSha256": "8f6c62a33e31257b7b740a79888f89e30bf85b614416338db098ce0d554941bb"
  },
  "jg_parsvottanasana": {
    "appId": "jg_parsvottanasana",
    "atlasId": "jg_parsvottanasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_parsvottanasana-bok-f1-449371b2-thumb.webp",
      "detail": "/movement-atlas/jg_parsvottanasana-bok-f1-449371b2-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "449371b217fb7d20938e16b788af1c5af57a2c7a9f7ed936b4245518912b0766"
    },
    "views": [],
    "sourceSha256": "449371b217fb7d20938e16b788af1c5af57a2c7a9f7ed936b4245518912b0766"
  },
  "jg_parvatasana": {
    "appId": "jg_parvatasana",
    "atlasId": "jg_parvatasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_parvatasana-bok-f1-84fbad05-thumb.webp",
      "detail": "/movement-atlas/jg_parvatasana-bok-f1-84fbad05-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "84fbad0536cf3695c81d93347e26199856152ce78a583da3efb00845864ec9cd"
    },
    "views": [],
    "sourceSha256": "84fbad0536cf3695c81d93347e26199856152ce78a583da3efb00845864ec9cd"
  },
  "jg_paryankasana": {
    "appId": "jg_paryankasana",
    "atlasId": "jg_paryankasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_paryankasana-bok-f1-8b348796-thumb.webp",
      "detail": "/movement-atlas/jg_paryankasana-bok-f1-8b348796-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "8b348796677ddabad42c4f8a36cfb2f495c106ba4ecce6d1b196f86629bc00a0"
    },
    "views": [],
    "sourceSha256": "8b348796677ddabad42c4f8a36cfb2f495c106ba4ecce6d1b196f86629bc00a0"
  },
  "jg_pasasana": {
    "appId": "jg_pasasana",
    "atlasId": "jg_pasasana",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_pasasana-predek-f1-74eb7c82-thumb.webp",
      "detail": "/movement-atlas/jg_pasasana-predek-f1-74eb7c82-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "74eb7c8295a5bc08a2c0aab4a4bda8f30ab58c746f2fe1600e5f878b28e44e6b"
    },
    "views": [],
    "sourceSha256": "74eb7c8295a5bc08a2c0aab4a4bda8f30ab58c746f2fe1600e5f878b28e44e6b"
  },
  "jg_pascima_namaskarasana": {
    "appId": "jg_pascima_namaskarasana",
    "atlasId": "jg_pascima_namaskarasana",
    "primary": {
      "view": "zada",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_pascima_namaskarasana-zada-f1-38067fb1-thumb.webp",
      "detail": "/movement-atlas/jg_pascima_namaskarasana-zada-f1-38067fb1-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "38067fb1178ba86592e39e2d64aa1e229824087574f87e6d911689dfc70c9d6d"
    },
    "views": [],
    "sourceSha256": "38067fb1178ba86592e39e2d64aa1e229824087574f87e6d911689dfc70c9d6d"
  },
  "jg_pascimottanasana": {
    "appId": "jg_pascimottanasana",
    "atlasId": "jg_pascimottanasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_pascimottanasana-bok-f1-d2d6c0a8-thumb.webp",
      "detail": "/movement-atlas/jg_pascimottanasana-bok-f1-d2d6c0a8-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "d2d6c0a8f6d3bc2cae068868182122384f47910b83d3ec84dc4ed609682c06cd"
    },
    "views": [],
    "sourceSha256": "d2d6c0a8f6d3bc2cae068868182122384f47910b83d3ec84dc4ed609682c06cd"
  },
  "jg_pawanmuktasana": {
    "appId": "jg_pawanmuktasana",
    "atlasId": "jg_pawanmuktasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_pawanmuktasana-bok-f1-2ff35ddd-thumb.webp",
      "detail": "/movement-atlas/jg_pawanmuktasana-bok-f1-2ff35ddd-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1402,
      "sourceHeight": 1122,
      "sourceSha256": "2ff35ddddd248101f4bbe617161234a7adcec6ae0b8729eb5676d0280a9eeb4a"
    },
    "views": [],
    "sourceSha256": "2ff35ddddd248101f4bbe617161234a7adcec6ae0b8729eb5676d0280a9eeb4a"
  },
  "jg_phalakasana": {
    "appId": "jg_phalakasana",
    "atlasId": "jg_phalakasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_phalakasana-bok-f1-880e1464-thumb.webp",
      "detail": "/movement-atlas/jg_phalakasana-bok-f1-880e1464-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "880e1464357bf968fe2117649c53eb81ffd353a5febf0fbf124105b050718d19"
    },
    "views": [],
    "sourceSha256": "880e1464357bf968fe2117649c53eb81ffd353a5febf0fbf124105b050718d19"
  },
  "jg_pincha_mayurasana": {
    "appId": "jg_pincha_mayurasana",
    "atlasId": "jg_pincha_mayurasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_pincha_mayurasana-bok-f1-f47c8508-thumb.webp",
      "detail": "/movement-atlas/jg_pincha_mayurasana-bok-f1-f47c8508-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "f47c850870bf7b8103caeffb17c4a1da3abdc7a82207a916a8c32c6caddc20ac"
    },
    "views": [],
    "sourceSha256": "f47c850870bf7b8103caeffb17c4a1da3abdc7a82207a916a8c32c6caddc20ac"
  },
  "jg_pindasana": {
    "appId": "jg_pindasana",
    "atlasId": "jg_pindasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_pindasana-bok-f1-54f31b91-thumb.webp",
      "detail": "/movement-atlas/jg_pindasana-bok-f1-54f31b91-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "54f31b91bba235d95dc97c718bd4bfea199ce28b70bae6f724fbb42f9faee8ec"
    },
    "views": [],
    "sourceSha256": "54f31b91bba235d95dc97c718bd4bfea199ce28b70bae6f724fbb42f9faee8ec"
  },
  "jg_pranamasana": {
    "appId": "jg_pranamasana",
    "atlasId": "jg_pranamasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_pranamasana-bok-f1-d929ae23-thumb.webp",
      "detail": "/movement-atlas/jg_pranamasana-bok-f1-d929ae23-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "d929ae2377464570d9115658559e82e4e2e01f7da169c78f23ec41f11cbf99fb"
    },
    "views": [],
    "sourceSha256": "d929ae2377464570d9115658559e82e4e2e01f7da169c78f23ec41f11cbf99fb"
  },
  "jg_prasarita_padottanasana": {
    "appId": "jg_prasarita_padottanasana",
    "atlasId": "jg_prasarita_padottanasana",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_prasarita_padottanasana-predek-f1-986eeb81-thumb.webp",
      "detail": "/movement-atlas/jg_prasarita_padottanasana-predek-f1-986eeb81-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "986eeb81ac5394a8a901233ab977b3e050337e2aeae7616abe281f225af5eced"
    },
    "views": [],
    "sourceSha256": "986eeb81ac5394a8a901233ab977b3e050337e2aeae7616abe281f225af5eced"
  },
  "jg_purna_salabhasana": {
    "appId": "jg_purna_salabhasana",
    "atlasId": "jg_purna_salabhasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_purna_salabhasana-bok-f1-b2447a51-thumb.webp",
      "detail": "/movement-atlas/jg_purna_salabhasana-bok-f1-b2447a51-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1122,
      "sourceHeight": 1402,
      "sourceSha256": "b2447a512195cf215635486055e83e85fe594769200249354bd70ae16cb4cceb"
    },
    "views": [],
    "sourceSha256": "b2447a512195cf215635486055e83e85fe594769200249354bd70ae16cb4cceb"
  },
  "jg_purvottanasana": {
    "appId": "jg_purvottanasana",
    "atlasId": "jg_purvottanasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_purvottanasana-bok-f1-5fa05dea-thumb.webp",
      "detail": "/movement-atlas/jg_purvottanasana-bok-f1-5fa05dea-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "5fa05deac35d90fd06bd54b0a68756d14767041366d9255a45b5af03149114ed"
    },
    "views": [],
    "sourceSha256": "5fa05deac35d90fd06bd54b0a68756d14767041366d9255a45b5af03149114ed"
  },
  "jg_saddle": {
    "appId": "jg_saddle",
    "atlasId": "jg_saddle",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_saddle-bok-f1-5d5917ee-thumb.webp",
      "detail": "/movement-atlas/jg_saddle-bok-f1-5d5917ee-detail.webp",
      "dark": null,
      "width": 1774,
      "height": 1774,
      "sourceWidth": 1774,
      "sourceHeight": 887,
      "sourceSha256": "5d5917eeb167142508469c624f82a37c3a04fa450a09f1a9022a8474ca369ef0"
    },
    "views": [],
    "sourceSha256": "5d5917eeb167142508469c624f82a37c3a04fa450a09f1a9022a8474ca369ef0"
  },
  "jg_salabhasana": {
    "appId": "jg_salabhasana",
    "atlasId": "jg_salabhasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_salabhasana-bok-f1-dbb03740-thumb.webp",
      "detail": "/movement-atlas/jg_salabhasana-bok-f1-dbb03740-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "dbb037409ff012329447d331ea589a311ed072237567da1777dc9f4de84f8ba0"
    },
    "views": [],
    "sourceSha256": "dbb037409ff012329447d331ea589a311ed072237567da1777dc9f4de84f8ba0"
  },
  "jg_salamba_sarvangasana": {
    "appId": "jg_salamba_sarvangasana",
    "atlasId": "jg_salamba_sarvangasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_salamba_sarvangasana-bok-f1-c4cce3b2-thumb.webp",
      "detail": "/movement-atlas/jg_salamba_sarvangasana-bok-f1-c4cce3b2-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "c4cce3b2ed4b8ae8d1cc86ae29e24d8c1f2b15c2a14ac02cb5e4a3ac06fc2ee0"
    },
    "views": [],
    "sourceSha256": "c4cce3b2ed4b8ae8d1cc86ae29e24d8c1f2b15c2a14ac02cb5e4a3ac06fc2ee0"
  },
  "jg_samakonasana": {
    "appId": "jg_samakonasana",
    "atlasId": "jg_samakonasana",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_samakonasana-predek-f1-b7eed931-thumb.webp",
      "detail": "/movement-atlas/jg_samakonasana-predek-f1-b7eed931-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "b7eed93104abe4cb15af3d11dcf6a0c00869738a038c16502d662531f9aa5e3c"
    },
    "views": [],
    "sourceSha256": "b7eed93104abe4cb15af3d11dcf6a0c00869738a038c16502d662531f9aa5e3c"
  },
  "jg_samasthiti": {
    "appId": "jg_samasthiti",
    "atlasId": "jg_samasthiti",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_samasthiti-bok-f1-5a8d526c-thumb.webp",
      "detail": "/movement-atlas/jg_samasthiti-bok-f1-5a8d526c-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "5a8d526c9672ffdda1419c08fe376d138431aaaa64558f25971e3e36265b6708"
    },
    "views": [],
    "sourceSha256": "5a8d526c9672ffdda1419c08fe376d138431aaaa64558f25971e3e36265b6708"
  },
  "jg_sasangasana": {
    "appId": "jg_sasangasana",
    "atlasId": "jg_sasangasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_sasangasana-bok-f1-9cd7b83d-thumb.webp",
      "detail": "/movement-atlas/jg_sasangasana-bok-f1-9cd7b83d-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "9cd7b83d3cc3cd662c24ea931db3a73aa952cb29d4002b196fa0c8a1ef9bb8c8"
    },
    "views": [],
    "sourceSha256": "9cd7b83d3cc3cd662c24ea931db3a73aa952cb29d4002b196fa0c8a1ef9bb8c8"
  },
  "jg_sasankasana": {
    "appId": "jg_sasankasana",
    "atlasId": "jg_sasankasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_sasankasana-bok-f1-a6b45a20-thumb.webp",
      "detail": "/movement-atlas/jg_sasankasana-bok-f1-a6b45a20-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "a6b45a20143a7ebb123204df21b6e9c06be9620c8179c56e9d246ff35a6a3bdc"
    },
    "views": [],
    "sourceSha256": "a6b45a20143a7ebb123204df21b6e9c06be9620c8179c56e9d246ff35a6a3bdc"
  },
  "jg_savasana": {
    "appId": "jg_savasana",
    "atlasId": "jg_savasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_savasana-bok-f1-38f883c4-thumb.webp",
      "detail": "/movement-atlas/jg_savasana-bok-f1-38f883c4-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "38f883c4bd4c56a25396eeb2354a162aef5edc11afbe2e2c1cf77b33f503bd28"
    },
    "views": [],
    "sourceSha256": "38f883c4bd4c56a25396eeb2354a162aef5edc11afbe2e2c1cf77b33f503bd28"
  },
  "jg_setu_bandha_sarvangasana": {
    "appId": "jg_setu_bandha_sarvangasana",
    "atlasId": "jg_setu_bandha_sarvangasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_setu_bandha_sarvangasana-bok-f1-3dd92d8d-thumb.webp",
      "detail": "/movement-atlas/jg_setu_bandha_sarvangasana-bok-f1-3dd92d8d-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "3dd92d8da785b2d4b7fb8ce847478fd736eea856510574d416eae0566fc2936c"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/jg_setu_bandha_sarvangasana-bok-f2-fd6c946d-thumb.webp",
        "detail": "/movement-atlas/jg_setu_bandha_sarvangasana-bok-f2-fd6c946d-detail.webp",
        "dark": null,
        "width": 1536,
        "height": 1536,
        "sourceWidth": 1536,
        "sourceHeight": 1024,
        "sourceSha256": "fd6c946dbe8ddbab53a620a2bc3c58b1c5715a63fb2e8681fc457237e216a72b"
      }
    ],
    "sourceSha256": "3dd92d8da785b2d4b7fb8ce847478fd736eea856510574d416eae0566fc2936c"
  },
  "jg_setu_bandhasana": {
    "appId": "jg_setu_bandhasana",
    "atlasId": "jg_setu_bandhasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_setu_bandhasana-bok-f1-99fa3977-thumb.webp",
      "detail": "/movement-atlas/jg_setu_bandhasana-bok-f1-99fa3977-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "99fa39777174d9f665ce22812302abe755fc2d414be89a5c4f849841b21330a0"
    },
    "views": [],
    "sourceSha256": "99fa39777174d9f665ce22812302abe755fc2d414be89a5c4f849841b21330a0"
  },
  "jg_shanmukhi_mudra": {
    "appId": "jg_shanmukhi_mudra",
    "atlasId": "jg_shanmukhi_mudra",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_shanmukhi_mudra-bok-f1-38ddc349-thumb.webp",
      "detail": "/movement-atlas/jg_shanmukhi_mudra-bok-f1-38ddc349-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "38ddc349d8612f3a02d2263fdb62b8284204d3cee1d7654be194ea421a840a7d"
    },
    "views": [],
    "sourceSha256": "38ddc349d8612f3a02d2263fdb62b8284204d3cee1d7654be194ea421a840a7d"
  },
  "jg_shoelace": {
    "appId": "jg_shoelace",
    "atlasId": "jg_shoelace",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_shoelace-bok-f1-02e4b77b-thumb.webp",
      "detail": "/movement-atlas/jg_shoelace-bok-f1-02e4b77b-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1122,
      "sourceHeight": 1402,
      "sourceSha256": "02e4b77bd8246a2641a864ea4b83313a20ef5e047b4cc820393a82974ba31ad2"
    },
    "views": [],
    "sourceSha256": "02e4b77bd8246a2641a864ea4b83313a20ef5e047b4cc820393a82974ba31ad2"
  },
  "jg_siddhasana": {
    "appId": "jg_siddhasana",
    "atlasId": "jg_siddhasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_siddhasana-bok-f1-aba4b1bd-thumb.webp",
      "detail": "/movement-atlas/jg_siddhasana-bok-f1-aba4b1bd-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1122,
      "sourceHeight": 1402,
      "sourceSha256": "aba4b1bd38a5b36b9773df833e06a9b0851cbedf8605dbddf53affc6450bf7ce"
    },
    "views": [],
    "sourceSha256": "aba4b1bd38a5b36b9773df833e06a9b0851cbedf8605dbddf53affc6450bf7ce"
  },
  "jg_simhasana": {
    "appId": "jg_simhasana",
    "atlasId": "jg_simhasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_simhasana-bok-f1-6f8802f0-thumb.webp",
      "detail": "/movement-atlas/jg_simhasana-bok-f1-6f8802f0-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1402,
      "sourceHeight": 1122,
      "sourceSha256": "6f8802f0d5bfb8e9cf83b19084122ad48afcbab78a850f00f2c74b246727cadc"
    },
    "views": [],
    "sourceSha256": "6f8802f0d5bfb8e9cf83b19084122ad48afcbab78a850f00f2c74b246727cadc"
  },
  "jg_sirsasana": {
    "appId": "jg_sirsasana",
    "atlasId": "jg_sirsasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_sirsasana-bok-f1-1d2e38a0-thumb.webp",
      "detail": "/movement-atlas/jg_sirsasana-bok-f1-1d2e38a0-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "1d2e38a076492a8faa9f494f462bd71a640ba7536234a670b179ac933c8e1f37"
    },
    "views": [],
    "sourceSha256": "1d2e38a076492a8faa9f494f462bd71a640ba7536234a670b179ac933c8e1f37"
  },
  "jg_skandasana": {
    "appId": "jg_skandasana",
    "atlasId": "jg_skandasana",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_skandasana-predek-f1-85a6dd94-thumb.webp",
      "detail": "/movement-atlas/jg_skandasana-predek-f1-85a6dd94-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "85a6dd946c9c5be9a4dd434250d980ccfc2a4dda34e216214b13d8c8c1cd5ed9"
    },
    "views": [],
    "sourceSha256": "85a6dd946c9c5be9a4dd434250d980ccfc2a4dda34e216214b13d8c8c1cd5ed9"
  },
  "jg_sphinx": {
    "appId": "jg_sphinx",
    "atlasId": "jg_sphinx",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_sphinx-bok-f1-73d2327f-thumb.webp",
      "detail": "/movement-atlas/jg_sphinx-bok-f1-73d2327f-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "73d2327ff178a727a694bf1a7dad8c39fbf0fb1eea2b33e9eb6a191bd5db4650"
    },
    "views": [],
    "sourceSha256": "73d2327ff178a727a694bf1a7dad8c39fbf0fb1eea2b33e9eb6a191bd5db4650"
  },
  "jg_sukhasana": {
    "appId": "jg_sukhasana",
    "atlasId": "jg_sukhasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_sukhasana-bok-f1-edc1d000-thumb.webp",
      "detail": "/movement-atlas/jg_sukhasana-bok-f1-edc1d000-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1086,
      "sourceHeight": 1448,
      "sourceSha256": "edc1d0009a3115e25cdb0d9a55308821f25326640f34aa9410fc2e0e886e64f7"
    },
    "views": [],
    "sourceSha256": "edc1d0009a3115e25cdb0d9a55308821f25326640f34aa9410fc2e0e886e64f7"
  },
  "jg_supta_baddha_konasana": {
    "appId": "jg_supta_baddha_konasana",
    "atlasId": "jg_supta_baddha_konasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_supta_baddha_konasana-bok-f1-8d2fbb58-thumb.webp",
      "detail": "/movement-atlas/jg_supta_baddha_konasana-bok-f1-8d2fbb58-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1402,
      "sourceHeight": 1122,
      "sourceSha256": "8d2fbb589584ebac1073223540174b6ce5d4baf39aa7eb7ce1cb984824c04297"
    },
    "views": [],
    "sourceSha256": "8d2fbb589584ebac1073223540174b6ce5d4baf39aa7eb7ce1cb984824c04297"
  },
  "jg_supta_konasana": {
    "appId": "jg_supta_konasana",
    "atlasId": "jg_supta_konasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_supta_konasana-bok-f1-c068cc39-thumb.webp",
      "detail": "/movement-atlas/jg_supta_konasana-bok-f1-c068cc39-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "c068cc39d5e41051dcd56ff3caf70b05e42026b975ac7654b3ef1332d3403a2b"
    },
    "views": [],
    "sourceSha256": "c068cc39d5e41051dcd56ff3caf70b05e42026b975ac7654b3ef1332d3403a2b"
  },
  "jg_supta_matsyendrasana": {
    "appId": "jg_supta_matsyendrasana",
    "atlasId": "jg_supta_matsyendrasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_supta_matsyendrasana-bok-f1-35cbf173-thumb.webp",
      "detail": "/movement-atlas/jg_supta_matsyendrasana-bok-f1-35cbf173-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "35cbf173d1a77bfe580fc417fc077b7265924b8ddad2083964fbc9551f04f4fc"
    },
    "views": [],
    "sourceSha256": "35cbf173d1a77bfe580fc417fc077b7265924b8ddad2083964fbc9551f04f4fc"
  },
  "jg_supta_padangusthasana": {
    "appId": "jg_supta_padangusthasana",
    "atlasId": "jg_supta_padangusthasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_supta_padangusthasana-bok-f1-ece5a425-thumb.webp",
      "detail": "/movement-atlas/jg_supta_padangusthasana-bok-f1-ece5a425-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "ece5a425b4cc82e74fe605145baebb140dbc88ebb588f715995dae5b8b65d3ff"
    },
    "views": [],
    "sourceSha256": "ece5a425b4cc82e74fe605145baebb140dbc88ebb588f715995dae5b8b65d3ff"
  },
  "jg_supta_vajrasana": {
    "appId": "jg_supta_vajrasana",
    "atlasId": "jg_supta_vajrasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_supta_vajrasana-bok-f1-e5b502cb-thumb.webp",
      "detail": "/movement-atlas/jg_supta_vajrasana-bok-f1-e5b502cb-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "e5b502cbb54736d223896442e512198fbe9806155e0ffb95dba0b06bcc78f575"
    },
    "views": [],
    "sourceSha256": "e5b502cbb54736d223896442e512198fbe9806155e0ffb95dba0b06bcc78f575"
  },
  "jg_supta_virasana": {
    "appId": "jg_supta_virasana",
    "atlasId": "jg_supta_virasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_supta_virasana-bok-f1-cb84ace1-thumb.webp",
      "detail": "/movement-atlas/jg_supta_virasana-bok-f1-cb84ace1-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "cb84ace1f09d6eb46cb3193b27297771a01a2ebe34f8efaee7e1850b249e4020"
    },
    "views": [],
    "sourceSha256": "cb84ace1f09d6eb46cb3193b27297771a01a2ebe34f8efaee7e1850b249e4020"
  },
  "jg_svastikasana": {
    "appId": "jg_svastikasana",
    "atlasId": "jg_svastikasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_svastikasana-bok-f1-ce2607d9-thumb.webp",
      "detail": "/movement-atlas/jg_svastikasana-bok-f1-ce2607d9-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "ce2607d931b7caa70bb9b593d96df09bf769bcd1edd1619308f0af88aec68daf"
    },
    "views": [],
    "sourceSha256": "ce2607d931b7caa70bb9b593d96df09bf769bcd1edd1619308f0af88aec68daf"
  },
  "jg_tadasana": {
    "appId": "jg_tadasana",
    "atlasId": "jg_tadasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_tadasana-bok-f1-5a8d526c-thumb.webp",
      "detail": "/movement-atlas/jg_tadasana-bok-f1-5a8d526c-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "5a8d526c9672ffdda1419c08fe376d138431aaaa64558f25971e3e36265b6708"
    },
    "views": [],
    "sourceSha256": "5a8d526c9672ffdda1419c08fe376d138431aaaa64558f25971e3e36265b6708"
  },
  "jg_tiryaka_tadasana": {
    "appId": "jg_tiryaka_tadasana",
    "atlasId": "jg_tiryaka_tadasana",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_tiryaka_tadasana-predek-f1-1f560b96-thumb.webp",
      "detail": "/movement-atlas/jg_tiryaka_tadasana-predek-f1-1f560b96-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "1f560b96da7e6bb53cdc0f7a6dcfda2ba00ac77e846bc739e34f4e5ed951fbc6"
    },
    "views": [],
    "sourceSha256": "1f560b96da7e6bb53cdc0f7a6dcfda2ba00ac77e846bc739e34f4e5ed951fbc6"
  },
  "jg_tittibhasana": {
    "appId": "jg_tittibhasana",
    "atlasId": "jg_tittibhasana",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_tittibhasana-predek-f1-f51d5db0-thumb.webp",
      "detail": "/movement-atlas/jg_tittibhasana-predek-f1-f51d5db0-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "f51d5db0684778cface4b50f57d5633a35b97d268119fd1a3755702faac3c405"
    },
    "views": [],
    "sourceSha256": "f51d5db0684778cface4b50f57d5633a35b97d268119fd1a3755702faac3c405"
  },
  "jg_tolasana": {
    "appId": "jg_tolasana",
    "atlasId": "jg_tolasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_tolasana-bok-f1-baf5142f-thumb.webp",
      "detail": "/movement-atlas/jg_tolasana-bok-f1-baf5142f-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "baf5142f213abda1effc7a0a4122730083971ef6e4894693c935e02fdecd971b"
    },
    "views": [],
    "sourceSha256": "baf5142f213abda1effc7a0a4122730083971ef6e4894693c935e02fdecd971b"
  },
  "jg_triang_mukhaikapada": {
    "appId": "jg_triang_mukhaikapada",
    "atlasId": "jg_triang_mukhaikapada",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_triang_mukhaikapada-bok-f1-edae109f-thumb.webp",
      "detail": "/movement-atlas/jg_triang_mukhaikapada-bok-f1-edae109f-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "edae109fa7df28f8e17fcd88532d81678751932ae129901accee7d4762249387"
    },
    "views": [],
    "sourceSha256": "edae109fa7df28f8e17fcd88532d81678751932ae129901accee7d4762249387"
  },
  "jg_tuladandasana": {
    "appId": "jg_tuladandasana",
    "atlasId": "jg_tuladandasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_tuladandasana-bok-f1-8fe57b9e-thumb.webp",
      "detail": "/movement-atlas/jg_tuladandasana-bok-f1-8fe57b9e-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "8fe57b9e6c4a812be8b85a1230cd4507b27de931376ce5e75365966e86f302e4"
    },
    "views": [],
    "sourceSha256": "8fe57b9e6c4a812be8b85a1230cd4507b27de931376ce5e75365966e86f302e4"
  },
  "jg_ubhaya_padangusthasana": {
    "appId": "jg_ubhaya_padangusthasana",
    "atlasId": "jg_ubhaya_padangusthasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_ubhaya_padangusthasana-bok-f1-5f2a89de-thumb.webp",
      "detail": "/movement-atlas/jg_ubhaya_padangusthasana-bok-f1-5f2a89de-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "5f2a89de80b2ea6fac46529704f6028b1b3d354585ed798fe31f8030c2b03abe"
    },
    "views": [],
    "sourceSha256": "5f2a89de80b2ea6fac46529704f6028b1b3d354585ed798fe31f8030c2b03abe"
  },
  "jg_upavistha_konasana": {
    "appId": "jg_upavistha_konasana",
    "atlasId": "jg_upavistha_konasana",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_upavistha_konasana-predek-f1-384b098c-thumb.webp",
      "detail": "/movement-atlas/jg_upavistha_konasana-predek-f1-384b098c-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "384b098c6dca20dedebb74ff1bb7385612b37f45ef55a1f10db22968158b856b"
    },
    "views": [],
    "sourceSha256": "384b098c6dca20dedebb74ff1bb7385612b37f45ef55a1f10db22968158b856b"
  },
  "jg_urdhva_dandasana": {
    "appId": "jg_urdhva_dandasana",
    "atlasId": "jg_urdhva_dandasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_urdhva_dandasana-bok-f1-0cd4f80d-thumb.webp",
      "detail": "/movement-atlas/jg_urdhva_dandasana-bok-f1-0cd4f80d-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "0cd4f80d5238ec83a23c8f88606d4cfd59986b4d6e07e08b02278acd0a287367"
    },
    "views": [],
    "sourceSha256": "0cd4f80d5238ec83a23c8f88606d4cfd59986b4d6e07e08b02278acd0a287367"
  },
  "jg_urdhva_dhanurasana": {
    "appId": "jg_urdhva_dhanurasana",
    "atlasId": "jg_urdhva_dhanurasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_urdhva_dhanurasana-bok-f1-042e0ccd-thumb.webp",
      "detail": "/movement-atlas/jg_urdhva_dhanurasana-bok-f1-042e0ccd-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "042e0ccd871dac0d0ce8b7e67119652ebe00b8bb8665cfe148ee90d56dd51d7f"
    },
    "views": [],
    "sourceSha256": "042e0ccd871dac0d0ce8b7e67119652ebe00b8bb8665cfe148ee90d56dd51d7f"
  },
  "jg_urdhva_hastasana": {
    "appId": "jg_urdhva_hastasana",
    "atlasId": "jg_urdhva_hastasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_urdhva_hastasana-bok-f1-6cb834da-thumb.webp",
      "detail": "/movement-atlas/jg_urdhva_hastasana-bok-f1-6cb834da-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "6cb834dae03888b213c4006f8d6414eff3f312aab502771efb2381397a0e31f6"
    },
    "views": [],
    "sourceSha256": "6cb834dae03888b213c4006f8d6414eff3f312aab502771efb2381397a0e31f6"
  },
  "jg_urdhva_mukha_pascimottanasana": {
    "appId": "jg_urdhva_mukha_pascimottanasana",
    "atlasId": "jg_urdhva_mukha_pascimottanasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_urdhva_mukha_pascimottanasana-bok-f1-eed4656f-thumb.webp",
      "detail": "/movement-atlas/jg_urdhva_mukha_pascimottanasana-bok-f1-eed4656f-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "eed4656feec78f23cdcdbad6def7bfd3421cc4e8983462114b77c2056d896fff"
    },
    "views": [],
    "sourceSha256": "eed4656feec78f23cdcdbad6def7bfd3421cc4e8983462114b77c2056d896fff"
  },
  "jg_urdhva_mukha_svanasana": {
    "appId": "jg_urdhva_mukha_svanasana",
    "atlasId": "jg_urdhva_mukha_svanasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_urdhva_mukha_svanasana-bok-f1-ed491381-thumb.webp",
      "detail": "/movement-atlas/jg_urdhva_mukha_svanasana-bok-f1-ed491381-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "ed491381369218d3978ed8dc736988d988607469e9b96453edbb2ce90b5cacd8"
    },
    "views": [],
    "sourceSha256": "ed491381369218d3978ed8dc736988d988607469e9b96453edbb2ce90b5cacd8"
  },
  "jg_urdhva_prasarita_ekapadasana": {
    "appId": "jg_urdhva_prasarita_ekapadasana",
    "atlasId": "jg_urdhva_prasarita_ekapadasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_urdhva_prasarita_ekapadasana-bok-f1-f3ef6d1a-thumb.webp",
      "detail": "/movement-atlas/jg_urdhva_prasarita_ekapadasana-bok-f1-f3ef6d1a-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1086,
      "sourceHeight": 1448,
      "sourceSha256": "f3ef6d1a977fdcc283f1b9f5d8c3404deedaa79949d2e8c0d425ef1325f321bd"
    },
    "views": [],
    "sourceSha256": "f3ef6d1a977fdcc283f1b9f5d8c3404deedaa79949d2e8c0d425ef1325f321bd"
  },
  "jg_ustrasana": {
    "appId": "jg_ustrasana",
    "atlasId": "jg_ustrasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_ustrasana-bok-f1-a5c4fdfb-thumb.webp",
      "detail": "/movement-atlas/jg_ustrasana-bok-f1-a5c4fdfb-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1402,
      "sourceHeight": 1122,
      "sourceSha256": "a5c4fdfb10f3c40d11377c9131c216519a0407cbf9d2b8f2fb61c4062cf05d67"
    },
    "views": [],
    "sourceSha256": "a5c4fdfb10f3c40d11377c9131c216519a0407cbf9d2b8f2fb61c4062cf05d67"
  },
  "jg_utkata_konasana": {
    "appId": "jg_utkata_konasana",
    "atlasId": "jg_utkata_konasana",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_utkata_konasana-predek-f1-6fdaf8c8-thumb.webp",
      "detail": "/movement-atlas/jg_utkata_konasana-predek-f1-6fdaf8c8-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "6fdaf8c8b07ca977606766d40c01be1651b916e68adb37357f2139c4abfe9ec0"
    },
    "views": [],
    "sourceSha256": "6fdaf8c8b07ca977606766d40c01be1651b916e68adb37357f2139c4abfe9ec0"
  },
  "jg_utkatasana": {
    "appId": "jg_utkatasana",
    "atlasId": "jg_utkatasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_utkatasana-bok-f1-10a908c7-thumb.webp",
      "detail": "/movement-atlas/jg_utkatasana-bok-f1-10a908c7-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "10a908c756ac350de1f7454e3d843d5d9069644375b3ce3e4eabc7b38a88acc4"
    },
    "views": [],
    "sourceSha256": "10a908c756ac350de1f7454e3d843d5d9069644375b3ce3e4eabc7b38a88acc4"
  },
  "jg_uttana_padasana": {
    "appId": "jg_uttana_padasana",
    "atlasId": "jg_uttana_padasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_uttana_padasana-bok-f1-15f16bc4-thumb.webp",
      "detail": "/movement-atlas/jg_uttana_padasana-bok-f1-15f16bc4-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1402,
      "sourceHeight": 1122,
      "sourceSha256": "15f16bc4fddb9f619c61906a7e03f837c482a457c2449aeeb85ab8301f635079"
    },
    "views": [],
    "sourceSha256": "15f16bc4fddb9f619c61906a7e03f837c482a457c2449aeeb85ab8301f635079"
  },
  "jg_uttanasana": {
    "appId": "jg_uttanasana",
    "atlasId": "jg_uttanasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_uttanasana-bok-f1-72466f00-thumb.webp",
      "detail": "/movement-atlas/jg_uttanasana-bok-f1-72466f00-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "72466f007fcad7f4c94f357fa9e67c57bc5e2109aa34c00175b88e687c43b9c6"
    },
    "views": [],
    "sourceSha256": "72466f007fcad7f4c94f357fa9e67c57bc5e2109aa34c00175b88e687c43b9c6"
  },
  "jg_utthita_hasta_padangusthasana": {
    "appId": "jg_utthita_hasta_padangusthasana",
    "atlasId": "jg_utthita_hasta_padangusthasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_utthita_hasta_padangusthasana-bok-f1-73e97f2d-thumb.webp",
      "detail": "/movement-atlas/jg_utthita_hasta_padangusthasana-bok-f1-73e97f2d-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1086,
      "sourceHeight": 1448,
      "sourceSha256": "73e97f2d95706b7710343390ad3801115cb3d45fb61649b81be0e5ca81fb13df"
    },
    "views": [],
    "sourceSha256": "73e97f2d95706b7710343390ad3801115cb3d45fb61649b81be0e5ca81fb13df"
  },
  "jg_utthita_parsvakonasana": {
    "appId": "jg_utthita_parsvakonasana",
    "atlasId": "jg_utthita_parsvakonasana",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_utthita_parsvakonasana-predek-f1-05b689b7-thumb.webp",
      "detail": "/movement-atlas/jg_utthita_parsvakonasana-predek-f1-05b689b7-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "05b689b752f05a1d34426e7fd12e22b3f5d80d0eca49dd2932235946d4ccc67a"
    },
    "views": [],
    "sourceSha256": "05b689b752f05a1d34426e7fd12e22b3f5d80d0eca49dd2932235946d4ccc67a"
  },
  "jg_utthita_trikonasana": {
    "appId": "jg_utthita_trikonasana",
    "atlasId": "jg_utthita_trikonasana",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_utthita_trikonasana-predek-f1-4d922ebd-thumb.webp",
      "detail": "/movement-atlas/jg_utthita_trikonasana-predek-f1-4d922ebd-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "4d922ebdfa7c9bd5438af95a02f1b8ab84b3824279fd2c57f76ff62e4dd064ea"
    },
    "views": [],
    "sourceSha256": "4d922ebdfa7c9bd5438af95a02f1b8ab84b3824279fd2c57f76ff62e4dd064ea"
  },
  "jg_vajrasana": {
    "appId": "jg_vajrasana",
    "atlasId": "jg_vajrasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_vajrasana-bok-f1-c06a5d79-thumb.webp",
      "detail": "/movement-atlas/jg_vajrasana-bok-f1-c06a5d79-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "c06a5d7915db6c33a68564b4e4fe893ba16e03cd6e256d246d6dfa0637236056"
    },
    "views": [],
    "sourceSha256": "c06a5d7915db6c33a68564b4e4fe893ba16e03cd6e256d246d6dfa0637236056"
  },
  "jg_vasisthasana": {
    "appId": "jg_vasisthasana",
    "atlasId": "jg_vasisthasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_vasisthasana-bok-f1-c1acc4bc-thumb.webp",
      "detail": "/movement-atlas/jg_vasisthasana-bok-f1-c1acc4bc-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "c1acc4bc58ae621ddb6bf900910cc1fdb1b9c985e9e0f5266c21aaa40dcf961a"
    },
    "views": [],
    "sourceSha256": "c1acc4bc58ae621ddb6bf900910cc1fdb1b9c985e9e0f5266c21aaa40dcf961a"
  },
  "jg_vatayanasana": {
    "appId": "jg_vatayanasana",
    "atlasId": "jg_vatayanasana",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_vatayanasana-predek-f1-b9f7fd42-thumb.webp",
      "detail": "/movement-atlas/jg_vatayanasana-predek-f1-b9f7fd42-detail.webp",
      "dark": null,
      "width": 1369,
      "height": 1369,
      "sourceWidth": 1149,
      "sourceHeight": 1369,
      "sourceSha256": "b9f7fd42bdcf34a58386b040afda2959fc38fcee92074a57889eee10063326b5"
    },
    "views": [],
    "sourceSha256": "b9f7fd42bdcf34a58386b040afda2959fc38fcee92074a57889eee10063326b5"
  },
  "jg_viparita_karani": {
    "appId": "jg_viparita_karani",
    "atlasId": "jg_viparita_karani",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_viparita_karani-bok-f1-d335fd1a-thumb.webp",
      "detail": "/movement-atlas/jg_viparita_karani-bok-f1-d335fd1a-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "d335fd1a02b6f10d1d90f61af86ad6565905b8465b3fcfa404f3b4d434de335d"
    },
    "views": [],
    "sourceSha256": "d335fd1a02b6f10d1d90f61af86ad6565905b8465b3fcfa404f3b4d434de335d"
  },
  "jg_viparita_virabhadrasana": {
    "appId": "jg_viparita_virabhadrasana",
    "atlasId": "jg_viparita_virabhadrasana",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_viparita_virabhadrasana-predek-f1-a24de495-thumb.webp",
      "detail": "/movement-atlas/jg_viparita_virabhadrasana-predek-f1-a24de495-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "a24de49511d5a24c8b669dd3e1c3c033ea6b506509141d3a79ce33d64c583eb0"
    },
    "views": [],
    "sourceSha256": "a24de49511d5a24c8b669dd3e1c3c033ea6b506509141d3a79ce33d64c583eb0"
  },
  "jg_virabhadrasana1": {
    "appId": "jg_virabhadrasana1",
    "atlasId": "jg_virabhadrasana1",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_virabhadrasana1-bok-f1-aa6b5b6a-thumb.webp",
      "detail": "/movement-atlas/jg_virabhadrasana1-bok-f1-aa6b5b6a-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "aa6b5b6a01c9ef37192557c2bff6012f73206aba8119a14cc3cfccf3598f819a"
    },
    "views": [],
    "sourceSha256": "aa6b5b6a01c9ef37192557c2bff6012f73206aba8119a14cc3cfccf3598f819a"
  },
  "jg_virabhadrasana2": {
    "appId": "jg_virabhadrasana2",
    "atlasId": "jg_virabhadrasana2",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_virabhadrasana2-predek-f1-620b19f1-thumb.webp",
      "detail": "/movement-atlas/jg_virabhadrasana2-predek-f1-620b19f1-detail.webp",
      "dark": null,
      "width": 1339,
      "height": 1339,
      "sourceWidth": 1339,
      "sourceHeight": 1174,
      "sourceSha256": "620b19f1e94fc3a26b26eb1af5981e289932c2df6665b0d38627ef028df9fa3c"
    },
    "views": [],
    "sourceSha256": "620b19f1e94fc3a26b26eb1af5981e289932c2df6665b0d38627ef028df9fa3c"
  },
  "jg_virabhadrasana3": {
    "appId": "jg_virabhadrasana3",
    "atlasId": "jg_virabhadrasana3",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_virabhadrasana3-bok-f1-079f2f3f-thumb.webp",
      "detail": "/movement-atlas/jg_virabhadrasana3-bok-f1-079f2f3f-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "079f2f3f66a1b8e8de1c5a12f15b0ce979d40563543e095ed7813ba330189da8"
    },
    "views": [],
    "sourceSha256": "079f2f3f66a1b8e8de1c5a12f15b0ce979d40563543e095ed7813ba330189da8"
  },
  "jg_virasana": {
    "appId": "jg_virasana",
    "atlasId": "jg_virasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_virasana-bok-f1-94cfe01f-thumb.webp",
      "detail": "/movement-atlas/jg_virasana-bok-f1-94cfe01f-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1122,
      "sourceHeight": 1402,
      "sourceSha256": "94cfe01fb2bbe9c9aa59add4eed39fab106b966cbb36bd90ab112726dbff2caf"
    },
    "views": [],
    "sourceSha256": "94cfe01fb2bbe9c9aa59add4eed39fab106b966cbb36bd90ab112726dbff2caf"
  },
  "jg_visvamitrasana": {
    "appId": "jg_visvamitrasana",
    "atlasId": "jg_visvamitrasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_visvamitrasana-bok-f1-d86331fb-thumb.webp",
      "detail": "/movement-atlas/jg_visvamitrasana-bok-f1-d86331fb-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "d86331fbbf08df844b31fd141545dd5530b74edd521e923109ee776a399e5566"
    },
    "views": [],
    "sourceSha256": "d86331fbbf08df844b31fd141545dd5530b74edd521e923109ee776a399e5566"
  },
  "jg_vrksasana": {
    "appId": "jg_vrksasana",
    "atlasId": "jg_vrksasana",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_vrksasana-predek-f1-465a65cc-thumb.webp",
      "detail": "/movement-atlas/jg_vrksasana-predek-f1-465a65cc-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "465a65cc35e9989956e219ec7a5c4355aa3e88a2d498e8b84d0dad40da2cd27b"
    },
    "views": [],
    "sourceSha256": "465a65cc35e9989956e219ec7a5c4355aa3e88a2d498e8b84d0dad40da2cd27b"
  },
  "jg_vrschikasana": {
    "appId": "jg_vrschikasana",
    "atlasId": "jg_vrschikasana",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_vrschikasana-bok-f1-4e321654-thumb.webp",
      "detail": "/movement-atlas/jg_vrschikasana-bok-f1-4e321654-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "4e321654c68c4bce7d2c9604ad78ecb4e5c69d1599163413d567a142b2fa2585"
    },
    "views": [],
    "sourceSha256": "4e321654c68c4bce7d2c9604ad78ecb4e5c69d1599163413d567a142b2fa2585"
  },
  "jg_yoga_mudra": {
    "appId": "jg_yoga_mudra",
    "atlasId": "jg_yoga_mudra",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jg_yoga_mudra-bok-f1-cc63194e-thumb.webp",
      "detail": "/movement-atlas/jg_yoga_mudra-bok-f1-cc63194e-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "cc63194e753b6b14d17a511270106e7304c1c558f61dfd71dd161ea0c3fc5c28"
    },
    "views": [],
    "sourceSha256": "cc63194e753b6b14d17a511270106e7304c1c558f61dfd71dd161ea0c3fc5c28"
  },
  "jumplunge": {
    "appId": "jumplunge",
    "atlasId": "jumplunge",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jumplunge-bok-f1-794d51c8-thumb.webp",
      "detail": "/movement-atlas/jumplunge-bok-f1-794d51c8-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "794d51c8a46ac173b977bdc8e3328d0191f4472706bb63dd9772e31bfe840af0"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/jumplunge-bok-f2-f1618601-thumb.webp",
        "detail": "/movement-atlas/jumplunge-bok-f2-f1618601-detail.webp",
        "dark": null,
        "width": 1254,
        "height": 1254,
        "sourceWidth": 1254,
        "sourceHeight": 1254,
        "sourceSha256": "f161860131e72aec3b496ad733f6f9ad4f387fc19b8e13c35ed064499ff72abe"
      }
    ],
    "sourceSha256": "794d51c8a46ac173b977bdc8e3328d0191f4472706bb63dd9772e31bfe840af0"
  },
  "jumprope": {
    "appId": "jumprope",
    "atlasId": "jumprope",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jumprope-bok-f1-24b4d5de-thumb.webp",
      "detail": "/movement-atlas/jumprope-bok-f1-24b4d5de-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "24b4d5de4e4f0dddf4abfd9b2851f9da96a418a8dfb0fd0ed1b5347459380bd6"
    },
    "views": [],
    "sourceSha256": "24b4d5de4e4f0dddf4abfd9b2851f9da96a418a8dfb0fd0ed1b5347459380bd6"
  },
  "jumpsquat": {
    "appId": "jumpsquat",
    "atlasId": "jumpsquat",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/jumpsquat-bok-f1-ff425101-thumb.webp",
      "detail": "/movement-atlas/jumpsquat-bok-f1-ff425101-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "ff425101a3817a0c2dc22c078918f585011382c1b95e057339183e4b1c6dcff6"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/jumpsquat-bok-f2-d8ab3c76-thumb.webp",
        "detail": "/movement-atlas/jumpsquat-bok-f2-d8ab3c76-detail.webp",
        "dark": null,
        "width": 1254,
        "height": 1254,
        "sourceWidth": 1254,
        "sourceHeight": 1254,
        "sourceSha256": "d8ab3c7619a10a4ab16172550bfbfe7f5db32a5351c76c4726788d2c6d154b19"
      },
      {
        "view": "bok",
        "phase": "f3",
        "primary": false,
        "thumb": "/movement-atlas/jumpsquat-bok-f3-009d7b0f-thumb.webp",
        "detail": "/movement-atlas/jumpsquat-bok-f3-009d7b0f-detail.webp",
        "dark": null,
        "width": 1254,
        "height": 1254,
        "sourceWidth": 1254,
        "sourceHeight": 1254,
        "sourceSha256": "009d7b0f1635f4d11ea0cad3358704e3ff2c4ff775b74c415abc8b757c9ceae5"
      }
    ],
    "sourceSha256": "ff425101a3817a0c2dc22c078918f585011382c1b95e057339183e4b1c6dcff6"
  },
  "kneecars": {
    "appId": "kneecars",
    "atlasId": "kneecars",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/kneecars-bok-f1-87be3722-thumb.webp",
      "detail": "/movement-atlas/kneecars-bok-f1-87be3722-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "87be37221d792268cc5a8a9fb1ec781992535ebcf36f7d67f08e33d2d0f4b954"
    },
    "views": [],
    "sourceSha256": "87be37221d792268cc5a8a9fb1ec781992535ebcf36f7d67f08e33d2d0f4b954"
  },
  "kneepush": {
    "appId": "kneepush",
    "atlasId": "kneepush",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/kneepush-bok-f1-d61a934c-thumb.webp",
      "detail": "/movement-atlas/kneepush-bok-f1-d61a934c-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "d61a934c4237f08fa62d25d4853e4903867193bcda0a842f26d2887e2a3a98d2"
    },
    "views": [],
    "sourceSha256": "d61a934c4237f08fa62d25d4853e4903867193bcda0a842f26d2887e2a3a98d2"
  },
  "kneeraise": {
    "appId": "kneeraise",
    "atlasId": "kneeraise",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/kneeraise-bok-f1-c6a1f0b0-thumb.webp",
      "detail": "/movement-atlas/kneeraise-bok-f1-c6a1f0b0-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1086,
      "sourceHeight": 1448,
      "sourceSha256": "c6a1f0b038d9dac6125dc79b20943dda05c15cc71af4e072e46ce3be511d6989"
    },
    "views": [],
    "sourceSha256": "c6a1f0b038d9dac6125dc79b20943dda05c15cc71af4e072e46ce3be511d6989"
  },
  "kneewall": {
    "appId": "kneewall",
    "atlasId": "kneewall",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/kneewall-bok-f1-220ac2a9-thumb.webp",
      "detail": "/movement-atlas/kneewall-bok-f1-220ac2a9-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1086,
      "sourceHeight": 1448,
      "sourceSha256": "220ac2a9fe9915bca9f21fce84382f51bc2053cd197457f44d70be82b4e7d4cf"
    },
    "views": [],
    "sourceSha256": "220ac2a9fe9915bca9f21fce84382f51bc2053cd197457f44d70be82b4e7d4cf"
  },
  "lateralraise": {
    "appId": "lateralraise",
    "atlasId": "lateralraise",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/lateralraise-bok-f1-c8af120e-thumb.webp",
      "detail": "/movement-atlas/lateralraise-bok-f1-c8af120e-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "c8af120ec828b56f88f09c1a0c35760d84b4d7af9447751ada8d90a141c7eca8"
    },
    "views": [],
    "sourceSha256": "c8af120ec828b56f88f09c1a0c35760d84b4d7af9447751ada8d90a141c7eca8"
  },
  "latiso": {
    "appId": "latiso",
    "atlasId": "latiso",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/latiso-bok-f1-5683e89e-thumb.webp",
      "detail": "/movement-atlas/latiso-bok-f1-5683e89e-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1122,
      "sourceHeight": 1402,
      "sourceSha256": "5683e89e3856cd130418cd6b6bb3f6110d0777998a9283963384f193bf088c4a"
    },
    "views": [],
    "sourceSha256": "5683e89e3856cd130418cd6b6bb3f6110d0777998a9283963384f193bf088c4a"
  },
  "latlunge": {
    "appId": "latlunge",
    "atlasId": "latlunge",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/latlunge-predek-f1-116ba390-thumb.webp",
      "detail": "/movement-atlas/latlunge-predek-f1-116ba390-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "116ba390fffe6b77830c1ec22d73e3c545aa0f735f464eb08e6699ff92478cf8"
    },
    "views": [],
    "sourceSha256": "116ba390fffe6b77830c1ec22d73e3c545aa0f735f464eb08e6699ff92478cf8"
  },
  "latpull": {
    "appId": "latpull",
    "atlasId": "latpull",
    "primary": {
      "view": "zada",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/latpull-zada-f1-e34a69a1-thumb.webp",
      "detail": "/movement-atlas/latpull-zada-f1-e34a69a1-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1122,
      "sourceHeight": 1402,
      "sourceSha256": "e34a69a1e8bf5fb3c46f82d9c06efd9c79b55b333959f37cdcf50f01a0ab6dda"
    },
    "views": [],
    "sourceSha256": "e34a69a1e8bf5fb3c46f82d9c06efd9c79b55b333959f37cdcf50f01a0ab6dda"
  },
  "legcurl": {
    "appId": "legcurl",
    "atlasId": "legcurl",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/legcurl-bok-f1-154acc16-thumb.webp",
      "detail": "/movement-atlas/legcurl-bok-f1-154acc16-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "154acc16193765bf4da57d47e6347917daa9613a1e05f4271a4699a170221d7e"
    },
    "views": [],
    "sourceSha256": "154acc16193765bf4da57d47e6347917daa9613a1e05f4271a4699a170221d7e"
  },
  "legpress": {
    "appId": "legpress",
    "atlasId": "legpress",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/legpress-bok-f1-c3ed416c-thumb.webp",
      "detail": "/movement-atlas/legpress-bok-f1-c3ed416c-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "c3ed416c23c476eb787c9fa88b2cc7985854436c26d33fb26b289ca70310a5ea"
    },
    "views": [],
    "sourceSha256": "c3ed416c23c476eb787c9fa88b2cc7985854436c26d33fb26b289ca70310a5ea"
  },
  "legraise": {
    "appId": "legraise",
    "atlasId": "legraise",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/legraise-bok-f1-2a31a7ff-thumb.webp",
      "detail": "/movement-atlas/legraise-bok-f1-2a31a7ff-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "2a31a7ff4a5daa8fab45e35949d444c9a8a8154bcf0a82d1b0cb47155bea5d75"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/legraise-bok-f2-da6d7b9c-thumb.webp",
        "detail": "/movement-atlas/legraise-bok-f2-da6d7b9c-detail.webp",
        "dark": null,
        "width": 1536,
        "height": 1536,
        "sourceWidth": 1536,
        "sourceHeight": 1024,
        "sourceSha256": "da6d7b9cd978f9cc259e8a9066e2268d8c8a48e0f8adb16a8be5a60eb4bee68d"
      }
    ],
    "sourceSha256": "2a31a7ff4a5daa8fab45e35949d444c9a8a8154bcf0a82d1b0cb47155bea5d75"
  },
  "lizard": {
    "appId": "lizard",
    "atlasId": "lizard",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/lizard-bok-f1-58b3fa3d-thumb.webp",
      "detail": "/movement-atlas/lizard-bok-f1-58b3fa3d-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "58b3fa3d7acf7d61eb5adcaf606ecc405c7083e7330feb8ddc98d6438f821acd"
    },
    "views": [],
    "sourceSha256": "58b3fa3d7acf7d61eb5adcaf606ecc405c7083e7330feb8ddc98d6438f821acd"
  },
  "lsit": {
    "appId": "lsit",
    "atlasId": "lsit",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/lsit-bok-f1-3ac782cf-thumb.webp",
      "detail": "/movement-atlas/lsit-bok-f1-3ac782cf-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "3ac782cfb8ac1f6f3f0e8d7790b7af69b14dda55d2798d1fa3f48bc1d6cc359a"
    },
    "views": [],
    "sourceSha256": "3ac782cfb8ac1f6f3f0e8d7790b7af69b14dda55d2798d1fa3f48bc1d6cc359a"
  },
  "lsitpullup": {
    "appId": "lsitpullup",
    "atlasId": "lsitpullup",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/lsitpullup-bok-f1-906ca9a1-thumb.webp",
      "detail": "/movement-atlas/lsitpullup-bok-f1-906ca9a1-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1122,
      "sourceHeight": 1402,
      "sourceSha256": "906ca9a13a09a53a68fbb7d28c92d84541d24772029be1504f4dcd3a66fe89c0"
    },
    "views": [],
    "sourceSha256": "906ca9a13a09a53a68fbb7d28c92d84541d24772029be1504f4dcd3a66fe89c0"
  },
  "lunge": {
    "appId": "lunge",
    "atlasId": "lunge",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/lunge-bok-f1-f875abaf-thumb.webp",
      "detail": "/movement-atlas/lunge-bok-f1-f875abaf-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1402,
      "sourceHeight": 1122,
      "sourceSha256": "f875abaf4614fdd0fc1d771c7df99d358eeafb3982bdc5b02f2fe770124ca3d7"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/lunge-bok-f2-f9f2ded4-thumb.webp",
        "detail": "/movement-atlas/lunge-bok-f2-f9f2ded4-detail.webp",
        "dark": null,
        "width": 1402,
        "height": 1402,
        "sourceWidth": 1402,
        "sourceHeight": 1122,
        "sourceSha256": "f9f2ded4bcde6b76ed4459078017eae0f6aa3aa07c7cc1d74b87bb97ca119a8f"
      }
    ],
    "sourceSha256": "f875abaf4614fdd0fc1d771c7df99d358eeafb3982bdc5b02f2fe770124ca3d7"
  },
  "maltese": {
    "appId": "maltese",
    "atlasId": "maltese",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/maltese-bok-f1-038c6f2f-thumb.webp",
      "detail": "/movement-atlas/maltese-bok-f1-038c6f2f-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "038c6f2f407366c092055f772ba2aab373c53edb9a3883775b4cecfb3b08c699"
    },
    "views": [],
    "sourceSha256": "038c6f2f407366c092055f772ba2aab373c53edb9a3883775b4cecfb3b08c699"
  },
  "maltlean": {
    "appId": "maltlean",
    "atlasId": "maltlean",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/maltlean-bok-f1-1fd0864e-thumb.webp",
      "detail": "/movement-atlas/maltlean-bok-f1-1fd0864e-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "1fd0864ef02822503cfee2824a670b23781230b99be7084de18ee9bb9920cb6c"
    },
    "views": [],
    "sourceSha256": "1fd0864ef02822503cfee2824a670b23781230b99be7084de18ee9bb9920cb6c"
  },
  "maltpress": {
    "appId": "maltpress",
    "atlasId": "maltpress",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/maltpress-bok-f1-e5ac0fd3-thumb.webp",
      "detail": "/movement-atlas/maltpress-bok-f1-e5ac0fd3-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "e5ac0fd37e187506a0191a378088f927554b24e2cdc6a147bf1d8bfcba6880a0"
    },
    "views": [],
    "sourceSha256": "e5ac0fd37e187506a0191a378088f927554b24e2cdc6a147bf1d8bfcba6880a0"
  },
  "middlesplit": {
    "appId": "middlesplit",
    "atlasId": "middlesplit",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/middlesplit-predek-f1-99f1c315-thumb.webp",
      "detail": "/movement-atlas/middlesplit-predek-f1-99f1c315-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "99f1c3152f42936e8b9b2f671c99470f444a72bad89685e585867cc50c789c8a"
    },
    "views": [],
    "sourceSha256": "99f1c3152f42936e8b9b2f671c99470f444a72bad89685e585867cc50c789c8a"
  },
  "mtclimb": {
    "appId": "mtclimb",
    "atlasId": "mtclimb",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/mtclimb-bok-f1-b6a3405b-thumb.webp",
      "detail": "/movement-atlas/mtclimb-bok-f1-b6a3405b-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "b6a3405bb105ec28ef41940d8d37a4ea81b3b21dee9686d14cae4773a0e452f1"
    },
    "views": [],
    "sourceSha256": "b6a3405bb105ec28ef41940d8d37a4ea81b3b21dee9686d14cae4773a0e452f1"
  },
  "muscleup": {
    "appId": "muscleup",
    "atlasId": "muscleup",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/muscleup-bok-f1-9f95ff51-thumb.webp",
      "detail": "/movement-atlas/muscleup-bok-f1-9f95ff51-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "9f95ff519d5949c733ec360f1fd41db4c65005068d5e2250bccf5d090ea6f256"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/muscleup-bok-f2-8ba9aa1d-thumb.webp",
        "detail": "/movement-atlas/muscleup-bok-f2-8ba9aa1d-detail.webp",
        "dark": null,
        "width": 1448,
        "height": 1448,
        "sourceWidth": 1448,
        "sourceHeight": 1086,
        "sourceSha256": "8ba9aa1d63e88dcebeee862dd54f292efd8e47c6c5bef1efb75ca5e99f00356d"
      }
    ],
    "sourceSha256": "9f95ff519d5949c733ec360f1fd41db4c65005068d5e2250bccf5d090ea6f256"
  },
  "neckcars": {
    "appId": "neckcars",
    "atlasId": "neckcars",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/neckcars-bok-f1-41a609ad-thumb.webp",
      "detail": "/movement-atlas/neckcars-bok-f1-41a609ad-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1122,
      "sourceHeight": 1402,
      "sourceSha256": "41a609ade2367f5fe120a031d0c1ea0948e683e569aaf7350e2e81f2fac4424c"
    },
    "views": [],
    "sourceSha256": "41a609ade2367f5fe120a031d0c1ea0948e683e569aaf7350e2e81f2fac4424c"
  },
  "neckiso": {
    "appId": "neckiso",
    "atlasId": "neckiso",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/neckiso-bok-f1-4c534b5c-thumb.webp",
      "detail": "/movement-atlas/neckiso-bok-f1-4c534b5c-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1122,
      "sourceHeight": 1402,
      "sourceSha256": "4c534b5c5be1613589a08f2428871da609c7d9d65f4b1ea8bc222143ec5eef2d"
    },
    "views": [],
    "sourceSha256": "4c534b5c5be1613589a08f2428871da609c7d9d65f4b1ea8bc222143ec5eef2d"
  },
  "negpull": {
    "appId": "negpull",
    "atlasId": "negpull",
    "primary": {
      "view": "zada",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/negpull-zada-f1-69645274-thumb.webp",
      "detail": "/movement-atlas/negpull-zada-f1-69645274-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "696452741b191850bd01a0cc43611580c8b98f314f1721202e6b5902639760f6"
    },
    "views": [],
    "sourceSha256": "696452741b191850bd01a0cc43611580c8b98f314f1721202e6b5902639760f6"
  },
  "nordic": {
    "appId": "nordic",
    "atlasId": "nordic",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/nordic-bok-f1-8d8cda57-thumb.webp",
      "detail": "/movement-atlas/nordic-bok-f1-8d8cda57-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "8d8cda576ec964891ba8a110bf35c587b03016816d6116803ecc2ff1606aeeac"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/nordic-bok-f2-5294a120-thumb.webp",
        "detail": "/movement-atlas/nordic-bok-f2-5294a120-detail.webp",
        "dark": null,
        "width": 1536,
        "height": 1536,
        "sourceWidth": 1536,
        "sourceHeight": 1024,
        "sourceSha256": "5294a120d9cb77d6226155ae7e08558228ced01cd597217667fd9ea0136e2573"
      }
    ],
    "sourceSha256": "8d8cda576ec964891ba8a110bf35c587b03016816d6116803ecc2ff1606aeeac"
  },
  "oafl": {
    "appId": "oafl",
    "atlasId": "oafl",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/oafl-bok-f1-fc2392c7-thumb.webp",
      "detail": "/movement-atlas/oafl-bok-f1-fc2392c7-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "fc2392c7b2eb0735ca3a34e5fc94f7e0ea71956957f5214ca0d7c30f4017a3b8"
    },
    "views": [],
    "sourceSha256": "fc2392c7b2eb0735ca3a34e5fc94f7e0ea71956957f5214ca0d7c30f4017a3b8"
  },
  "oap": {
    "appId": "oap",
    "atlasId": "oap",
    "primary": {
      "view": "zada",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/oap-zada-f1-b87c1fef-thumb.webp",
      "detail": "/movement-atlas/oap-zada-f1-b87c1fef-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "b87c1fefc36e50bfbb6fdd9ec9221be347e2c342066947fbf93969f2d5f0861c"
    },
    "views": [],
    "sourceSha256": "b87c1fefc36e50bfbb6fdd9ec9221be347e2c342066947fbf93969f2d5f0861c"
  },
  "oapush": {
    "appId": "oapush",
    "atlasId": "oapush",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/oapush-bok-f1-44fd110e-thumb.webp",
      "detail": "/movement-atlas/oapush-bok-f1-44fd110e-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "44fd110e3917ee6d7b8c7c4ba169b431b1e4c687d749152e76cee60d2e627afd"
    },
    "views": [],
    "sourceSha256": "44fd110e3917ee6d7b8c7c4ba169b431b1e4c687d749152e76cee60d2e627afd"
  },
  "ohp": {
    "appId": "ohp",
    "atlasId": "ohp",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/ohp-bok-f1-57d7b132-thumb.webp",
      "detail": "/movement-atlas/ohp-bok-f1-57d7b132-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1086,
      "sourceHeight": 1448,
      "sourceSha256": "57d7b132b475eb899c5f2e33de8da91b343df365d9b05447935963d9a79814cf"
    },
    "views": [],
    "sourceSha256": "57d7b132b475eb899c5f2e33de8da91b343df365d9b05447935963d9a79814cf"
  },
  "onearmhs": {
    "appId": "onearmhs",
    "atlasId": "onearmhs",
    "primary": {
      "view": "zada",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/onearmhs-zada-f1-1fe31b9f-thumb.webp",
      "detail": "/movement-atlas/onearmhs-zada-f1-1fe31b9f-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "1fe31b9f1bd41c6694ebc47e7e1d10e469077234b4de5cc6e3af189cc9e5a0a9"
    },
    "views": [],
    "sourceSha256": "1fe31b9f1bd41c6694ebc47e7e1d10e469077234b4de5cc6e3af189cc9e5a0a9"
  },
  "onelegfl": {
    "appId": "onelegfl",
    "atlasId": "onelegfl",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/onelegfl-bok-f1-c03437bc-thumb.webp",
      "detail": "/movement-atlas/onelegfl-bok-f1-c03437bc-detail.webp",
      "dark": null,
      "width": 1391,
      "height": 1391,
      "sourceWidth": 1391,
      "sourceHeight": 1131,
      "sourceSha256": "c03437bc9702d0b10aef43cfc5d16d407dcfae87565d92828d65b4a887e01276"
    },
    "views": [],
    "sourceSha256": "c03437bc9702d0b10aef43cfc5d16d407dcfae87565d92828d65b4a887e01276"
  },
  "openbook": {
    "appId": "openbook",
    "atlasId": "openbook",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/openbook-bok-f1-75c1c8ec-thumb.webp",
      "detail": "/movement-atlas/openbook-bok-f1-75c1c8ec-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "75c1c8ec1e3e92dfe0f76829e39836eaa6464deb8a857b6f92b021d2bc20fa09"
    },
    "views": [],
    "sourceSha256": "75c1c8ec1e3e92dfe0f76829e39836eaa6464deb8a857b6f92b021d2bc20fa09"
  },
  "pancake": {
    "appId": "pancake",
    "atlasId": "pancake",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/pancake-predek-f1-009b82d8-thumb.webp",
      "detail": "/movement-atlas/pancake-predek-f1-009b82d8-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "009b82d8ebdb950683727420e079ee56a9190e4c577531f972f00c635cdb9f01"
    },
    "views": [],
    "sourceSha256": "009b82d8ebdb950683727420e079ee56a9190e4c577531f972f00c635cdb9f01"
  },
  "pelican": {
    "appId": "pelican",
    "atlasId": "pelican",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/pelican-bok-f1-f73dd632-thumb.webp",
      "detail": "/movement-atlas/pelican-bok-f1-f73dd632-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "f73dd632dd4406ecdb4144a4013f7c0e9882b5396aec12c4c0310aff1fe24567"
    },
    "views": [],
    "sourceSha256": "f73dd632dd4406ecdb4144a4013f7c0e9882b5396aec12c4c0310aff1fe24567"
  },
  "pigeon": {
    "appId": "pigeon",
    "atlasId": "pigeon",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/pigeon-bok-f1-97732510-thumb.webp",
      "detail": "/movement-atlas/pigeon-bok-f1-97732510-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "97732510d8a8efaa486f0740e45f79f629978e2d54ded240a12445c8a24bf01f"
    },
    "views": [],
    "sourceSha256": "97732510d8a8efaa486f0740e45f79f629978e2d54ded240a12445c8a24bf01f"
  },
  "pike": {
    "appId": "pike",
    "atlasId": "pike",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/pike-bok-f1-c9a172ae-thumb.webp",
      "detail": "/movement-atlas/pike-bok-f1-c9a172ae-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "c9a172aefbd4a3ad2164549422a810a41495410f5565d254ec0b6f82723fc352"
    },
    "views": [],
    "sourceSha256": "c9a172aefbd4a3ad2164549422a810a41495410f5565d254ec0b6f82723fc352"
  },
  "pikefold": {
    "appId": "pikefold",
    "atlasId": "pikefold",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/pikefold-bok-f1-d2d6c0a8-thumb.webp",
      "detail": "/movement-atlas/pikefold-bok-f1-d2d6c0a8-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "d2d6c0a8f6d3bc2cae068868182122384f47910b83d3ec84dc4ed609682c06cd"
    },
    "views": [],
    "sourceSha256": "d2d6c0a8f6d3bc2cae068868182122384f47910b83d3ec84dc4ed609682c06cd"
  },
  "pikeliftoff": {
    "appId": "pikeliftoff",
    "atlasId": "pikeliftoff",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/pikeliftoff-bok-f1-31c5246d-thumb.webp",
      "detail": "/movement-atlas/pikeliftoff-bok-f1-31c5246d-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "31c5246d928a16ce31b6171af0c2d804a3140b060ab39549569a6e32c27cb458"
    },
    "views": [],
    "sourceSha256": "31c5246d928a16ce31b6171af0c2d804a3140b060ab39549569a6e32c27cb458"
  },
  "pikestand": {
    "appId": "pikestand",
    "atlasId": "pikestand",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/pikestand-bok-f1-955de4b4-thumb.webp",
      "detail": "/movement-atlas/pikestand-bok-f1-955de4b4-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "955de4b4852fe0b8efc4f7d4096ae95c21ccad44d70abf9219688b106c92d680"
    },
    "views": [],
    "sourceSha256": "955de4b4852fe0b8efc4f7d4096ae95c21ccad44d70abf9219688b106c92d680"
  },
  "pistol": {
    "appId": "pistol",
    "atlasId": "pistol",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/pistol-bok-f1-31c6055f-thumb.webp",
      "detail": "/movement-atlas/pistol-bok-f1-31c6055f-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "31c6055fe13e852f78fa629f7cdc98bb1fbd1ef770f198b4278ab956f3ccdc3b"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/pistol-bok-f2-b06cea04-thumb.webp",
        "detail": "/movement-atlas/pistol-bok-f2-b06cea04-detail.webp",
        "dark": null,
        "width": 1254,
        "height": 1254,
        "sourceWidth": 1254,
        "sourceHeight": 1254,
        "sourceSha256": "b06cea040a9962ef525f2d770493000e6c44a4447fdd34d2c9e259d048aa795b"
      }
    ],
    "sourceSha256": "31c6055fe13e852f78fa629f7cdc98bb1fbd1ef770f198b4278ab956f3ccdc3b"
  },
  "planche": {
    "appId": "planche",
    "atlasId": "planche",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/planche-bok-f1-847cc811-thumb.webp",
      "detail": "/movement-atlas/planche-bok-f1-847cc811-detail.webp",
      "dark": null,
      "width": 1774,
      "height": 1774,
      "sourceWidth": 1774,
      "sourceHeight": 887,
      "sourceSha256": "847cc81185076b6701238189c107172451963e4a3d4aa17b743f283bd1fc6cf2"
    },
    "views": [],
    "sourceSha256": "847cc81185076b6701238189c107172451963e4a3d4aa17b743f283bd1fc6cf2"
  },
  "planchelean": {
    "appId": "planchelean",
    "atlasId": "planchelean",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/planchelean-bok-f1-38872bd1-thumb.webp",
      "detail": "/movement-atlas/planchelean-bok-f1-38872bd1-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "38872bd148ba91765e8a10d0e46e2456471f3960cc6d832a9f6b57c48fcc6b5b"
    },
    "views": [],
    "sourceSha256": "38872bd148ba91765e8a10d0e46e2456471f3960cc6d832a9f6b57c48fcc6b5b"
  },
  "planchenneg": {
    "appId": "planchenneg",
    "atlasId": "planchenneg",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/planchenneg-bok-f1-7113f613-thumb.webp",
      "detail": "/movement-atlas/planchenneg-bok-f1-7113f613-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "7113f613809e95bca417e948f909b2e202c7f4fc1b294598254da36943adeebf"
    },
    "views": [],
    "sourceSha256": "7113f613809e95bca417e948f909b2e202c7f4fc1b294598254da36943adeebf"
  },
  "planchepress": {
    "appId": "planchepress",
    "atlasId": "planchepress",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/planchepress-bok-f1-c9444310-thumb.webp",
      "detail": "/movement-atlas/planchepress-bok-f1-c9444310-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "c9444310407dc13b701105225e33b0ea5e4a32c375747a0560ceeff99626b8b3"
    },
    "views": [],
    "sourceSha256": "c9444310407dc13b701105225e33b0ea5e4a32c375747a0560ceeff99626b8b3"
  },
  "planchepush": {
    "appId": "planchepush",
    "atlasId": "planchepush",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/planchepush-bok-f1-97e89484-thumb.webp",
      "detail": "/movement-atlas/planchepush-bok-f1-97e89484-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "97e894844651cb0a9d50b8b5af3517326a7667f20c092ada20d7b38e19fd73fe"
    },
    "views": [],
    "sourceSha256": "97e894844651cb0a9d50b8b5af3517326a7667f20c092ada20d7b38e19fd73fe"
  },
  "plank": {
    "appId": "plank",
    "atlasId": "plank",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/plank-bok-f1-880e1464-thumb.webp",
      "detail": "/movement-atlas/plank-bok-f1-880e1464-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "880e1464357bf968fe2117649c53eb81ffd353a5febf0fbf124105b050718d19"
    },
    "views": [],
    "sourceSha256": "880e1464357bf968fe2117649c53eb81ffd353a5febf0fbf124105b050718d19"
  },
  "presshs": {
    "appId": "presshs",
    "atlasId": "presshs",
    "primary": {
      "view": "zada",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/presshs-zada-f1-73a44b3e-thumb.webp",
      "detail": "/movement-atlas/presshs-zada-f1-73a44b3e-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "73a44b3e24cda33b06f2ec9f0d5d132d8f00f2fe1ebe89c833b7df05bcc3be02"
    },
    "views": [
      {
        "view": "zada",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/presshs-zada-f2-4f1f115d-thumb.webp",
        "detail": "/movement-atlas/presshs-zada-f2-4f1f115d-detail.webp",
        "dark": null,
        "width": 1536,
        "height": 1536,
        "sourceWidth": 1536,
        "sourceHeight": 1024,
        "sourceSha256": "4f1f115d3aac5c7afb26f27212301b3227d07124e93d22114564c3d01331b254"
      }
    ],
    "sourceSha256": "73a44b3e24cda33b06f2ec9f0d5d132d8f00f2fe1ebe89c833b7df05bcc3be02"
  },
  "pseudo": {
    "appId": "pseudo",
    "atlasId": "pseudo",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/pseudo-bok-f1-b1f03a62-thumb.webp",
      "detail": "/movement-atlas/pseudo-bok-f1-b1f03a62-detail.webp",
      "dark": null,
      "width": 1672,
      "height": 1672,
      "sourceWidth": 1672,
      "sourceHeight": 941,
      "sourceSha256": "b1f03a6282b51c5537793670c0e7102c38c519a6712d1d7fd0cb44a04f531427"
    },
    "views": [],
    "sourceSha256": "b1f03a6282b51c5537793670c0e7102c38c519a6712d1d7fd0cb44a04f531427"
  },
  "pullapart": {
    "appId": "pullapart",
    "atlasId": "pullapart",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/pullapart-predek-f1-ce163520-thumb.webp",
      "detail": "/movement-atlas/pullapart-predek-f1-ce163520-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "ce1635205245ea9b81d96c383036a04d0e4c97d158979eef2f16a2f76f0eb4e1"
    },
    "views": [],
    "sourceSha256": "ce1635205245ea9b81d96c383036a04d0e4c97d158979eef2f16a2f76f0eb4e1"
  },
  "pullthrough": {
    "appId": "pullthrough",
    "atlasId": "pullthrough",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/pullthrough-bok-f1-6602c3a2-thumb.webp",
      "detail": "/movement-atlas/pullthrough-bok-f1-6602c3a2-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "6602c3a2387214cb04975ceec11122c77cd2ca9aafdd7a9c3fd9e5a3ddab70e6"
    },
    "views": [],
    "sourceSha256": "6602c3a2387214cb04975ceec11122c77cd2ca9aafdd7a9c3fd9e5a3ddab70e6"
  },
  "pullup": {
    "appId": "pullup",
    "atlasId": "pullup",
    "primary": {
      "view": "zada",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/pullup-zada-f1-63c2e523-thumb.webp",
      "detail": "/movement-atlas/pullup-zada-f1-63c2e523-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "63c2e5237692f04fff5aac4ae25755308ec37d5a30105abbdc83315b51255d3d"
    },
    "views": [
      {
        "view": "zada",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/pullup-zada-f2-55482a61-thumb.webp",
        "detail": "/movement-atlas/pullup-zada-f2-55482a61-detail.webp",
        "dark": null,
        "width": 1536,
        "height": 1536,
        "sourceWidth": 1024,
        "sourceHeight": 1536,
        "sourceSha256": "55482a617baf6e18a1941762462a00d954fdd2c268ccad79b9663c433a7d92a5"
      }
    ],
    "sourceSha256": "63c2e5237692f04fff5aac4ae25755308ec37d5a30105abbdc83315b51255d3d"
  },
  "pushdown": {
    "appId": "pushdown",
    "atlasId": "pushdown",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/pushdown-bok-f1-ac01950b-thumb.webp",
      "detail": "/movement-atlas/pushdown-bok-f1-ac01950b-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1122,
      "sourceHeight": 1402,
      "sourceSha256": "ac01950ba942ad0a6d395146e6b43424bee22868c5ff6d1ae38bab9a2734c7bc"
    },
    "views": [],
    "sourceSha256": "ac01950ba942ad0a6d395146e6b43424bee22868c5ff6d1ae38bab9a2734c7bc"
  },
  "pushup": {
    "appId": "pushup",
    "atlasId": "pushup",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/pushup-bok-f1-d299f0f7-thumb.webp",
      "detail": "/movement-atlas/pushup-bok-f1-d299f0f7-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "d299f0f762eed5717f8cf3a851ec562786077ea99ff20e9f75258154036670d5"
    },
    "views": [],
    "sourceSha256": "d299f0f762eed5717f8cf3a851ec562786077ea99ff20e9f75258154036670d5"
  },
  "renegade": {
    "appId": "renegade",
    "atlasId": "renegade",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/renegade-bok-f1-770a164a-thumb.webp",
      "detail": "/movement-atlas/renegade-bok-f1-770a164a-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "770a164a3cb2209f4286b2de0128d1a5e79d256a2a6d3fadb59ad68a3c35d4f8"
    },
    "views": [],
    "sourceSha256": "770a164a3cb2209f4286b2de0128d1a5e79d256a2a6d3fadb59ad68a3c35d4f8"
  },
  "revfly": {
    "appId": "revfly",
    "atlasId": "revfly",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/revfly-bok-f1-8dd2db4b-thumb.webp",
      "detail": "/movement-atlas/revfly-bok-f1-8dd2db4b-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "8dd2db4b4b0607fa0b50f48b0fbe677bf6772b1833f9e5da61a5a475c9eb3666"
    },
    "views": [],
    "sourceSha256": "8dd2db4b4b0607fa0b50f48b0fbe677bf6772b1833f9e5da61a5a475c9eb3666"
  },
  "revhyper": {
    "appId": "revhyper",
    "atlasId": "revhyper",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/revhyper-bok-f1-f2670329-thumb.webp",
      "detail": "/movement-atlas/revhyper-bok-f1-f2670329-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "f2670329e812860fdffacf6e1c459789a025aea6b6885426603fcfe17095b172"
    },
    "views": [],
    "sourceSha256": "f2670329e812860fdffacf6e1c459789a025aea6b6885426603fcfe17095b172"
  },
  "revnordic": {
    "appId": "revnordic",
    "atlasId": "revnordic",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/revnordic-bok-f1-7b6c7080-thumb.webp",
      "detail": "/movement-atlas/revnordic-bok-f1-7b6c7080-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1086,
      "sourceHeight": 1448,
      "sourceSha256": "7b6c708078f83c4a0c94411cba3f454712f64c5f4680c29815da3ed566a873f7"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/revnordic-bok-f2-449d5bb0-thumb.webp",
        "detail": "/movement-atlas/revnordic-bok-f2-449d5bb0-detail.webp",
        "dark": null,
        "width": 1448,
        "height": 1448,
        "sourceWidth": 1086,
        "sourceHeight": 1448,
        "sourceSha256": "449d5bb04b32468adb405fc410e17a237d631831f85ced69453cd9915efbe6aa"
      }
    ],
    "sourceSha256": "7b6c708078f83c4a0c94411cba3f454712f64c5f4680c29815da3ed566a873f7"
  },
  "revplank": {
    "appId": "revplank",
    "atlasId": "revplank",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/revplank-bok-f1-7e57513a-thumb.webp",
      "detail": "/movement-atlas/revplank-bok-f1-7e57513a-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "7e57513ab1c51a1662b793fd479949f3e26927c177a7c6f0fe480f9d1596434c"
    },
    "views": [],
    "sourceSha256": "7e57513ab1c51a1662b793fd479949f3e26927c177a7c6f0fe480f9d1596434c"
  },
  "ringdips": {
    "appId": "ringdips",
    "atlasId": "ringdips",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/ringdips-bok-f1-024aacd2-thumb.webp",
      "detail": "/movement-atlas/ringdips-bok-f1-024aacd2-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "024aacd2ac37837d4f64a94b6b591cb6b8461d1d1ded9ad89062e2ee54f4bc10"
    },
    "views": [],
    "sourceSha256": "024aacd2ac37837d4f64a94b6b591cb6b8461d1d1ded9ad89062e2ee54f4bc10"
  },
  "ringpush": {
    "appId": "ringpush",
    "atlasId": "ringpush",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/ringpush-bok-f1-bd56f67e-thumb.webp",
      "detail": "/movement-atlas/ringpush-bok-f1-bd56f67e-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "bd56f67eaf7ddbf30c2f125306504837058d1a3ee52d0fc2f0c97131fb1aa958"
    },
    "views": [],
    "sourceSha256": "bd56f67eaf7ddbf30c2f125306504837058d1a3ee52d0fc2f0c97131fb1aa958"
  },
  "ringrow": {
    "appId": "ringrow",
    "atlasId": "ringrow",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/ringrow-bok-f1-9d4a673b-thumb.webp",
      "detail": "/movement-atlas/ringrow-bok-f1-9d4a673b-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "9d4a673bae71005abf0d21da213ff7be1287f82048ae2d0bd577cce299326f51"
    },
    "views": [],
    "sourceSha256": "9d4a673bae71005abf0d21da213ff7be1287f82048ae2d0bd577cce299326f51"
  },
  "ringsupport": {
    "appId": "ringsupport",
    "atlasId": "ringsupport",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/ringsupport-bok-f1-723b5d4e-thumb.webp",
      "detail": "/movement-atlas/ringsupport-bok-f1-723b5d4e-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1086,
      "sourceHeight": 1448,
      "sourceSha256": "723b5d4e5ebad40204fb57b890ee84a8390f175d2c0870f318ad7079d6b9a647"
    },
    "views": [],
    "sourceSha256": "723b5d4e5ebad40204fb57b890ee84a8390f175d2c0870f318ad7079d6b9a647"
  },
  "ropeclimb": {
    "appId": "ropeclimb",
    "atlasId": "ropeclimb",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/ropeclimb-bok-f1-06f62885-thumb.webp",
      "detail": "/movement-atlas/ropeclimb-bok-f1-06f62885-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "06f62885a79c6199752d96473d34b80adfd1212d7758d9d43554e3d784646a4f"
    },
    "views": [],
    "sourceSha256": "06f62885a79c6199752d96473d34b80adfd1212d7758d9d43554e3d784646a4f"
  },
  "russiandip": {
    "appId": "russiandip",
    "atlasId": "russiandip",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/russiandip-bok-f1-ad10b472-thumb.webp",
      "detail": "/movement-atlas/russiandip-bok-f1-ad10b472-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1122,
      "sourceHeight": 1402,
      "sourceSha256": "ad10b4727744c4c8696e72c0ac24b254811485bbcfdf962564c5c8def7a20c30"
    },
    "views": [],
    "sourceSha256": "ad10b4727744c4c8696e72c0ac24b254811485bbcfdf962564c5c8def7a20c30"
  },
  "russtwist": {
    "appId": "russtwist",
    "atlasId": "russtwist",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/russtwist-bok-f1-28ce879f-thumb.webp",
      "detail": "/movement-atlas/russtwist-bok-f1-28ce879f-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "28ce879f92311ceeb28b0cac865a8a8e013a13fb2342b73b24c0ac82e33741b7"
    },
    "views": [],
    "sourceSha256": "28ce879f92311ceeb28b0cac865a8a8e013a13fb2342b73b24c0ac82e33741b7"
  },
  "scap": {
    "appId": "scap",
    "atlasId": "scap",
    "primary": {
      "view": "zada",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/scap-zada-f1-acf24a67-thumb.webp",
      "detail": "/movement-atlas/scap-zada-f1-acf24a67-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "acf24a6738ca2e0c321ba461058d2a01eed092dbe9c0518b8315b13a57c0d845"
    },
    "views": [],
    "sourceSha256": "acf24a6738ca2e0c321ba461058d2a01eed092dbe9c0518b8315b13a57c0d845"
  },
  "scapdip": {
    "appId": "scapdip",
    "atlasId": "scapdip",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/scapdip-bok-f1-ef1ab596-thumb.webp",
      "detail": "/movement-atlas/scapdip-bok-f1-ef1ab596-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1086,
      "sourceHeight": 1448,
      "sourceSha256": "ef1ab596e93c5a23b5781c20504ef24717092581ff9fac3da0112445304ef7e2"
    },
    "views": [],
    "sourceSha256": "ef1ab596e93c5a23b5781c20504ef24717092581ff9fac3da0112445304ef7e2"
  },
  "scapush": {
    "appId": "scapush",
    "atlasId": "scapush",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/scapush-bok-f1-ac3fe4c0-thumb.webp",
      "detail": "/movement-atlas/scapush-bok-f1-ac3fe4c0-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "ac3fe4c0f1539a6544fc5a6a177894a85b5d0095451bd55f59d5a7cb0accee3d"
    },
    "views": [],
    "sourceSha256": "ac3fe4c0f1539a6544fc5a6a177894a85b5d0095451bd55f59d5a7cb0accee3d"
  },
  "scorpion": {
    "appId": "scorpion",
    "atlasId": "scorpion",
    "primary": {
      "view": "zada",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/scorpion-zada-f1-0ddd2362-thumb.webp",
      "detail": "/movement-atlas/scorpion-zada-f1-0ddd2362-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "0ddd236218ea69d877d653236c055254ac58075f8170b32279b24664a59b58d2"
    },
    "views": [],
    "sourceSha256": "0ddd236218ea69d877d653236c055254ac58075f8170b32279b24664a59b58d2"
  },
  "shinbox": {
    "appId": "shinbox",
    "atlasId": "shinbox",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/shinbox-bok-f1-c11a15eb-thumb.webp",
      "detail": "/movement-atlas/shinbox-bok-f1-c11a15eb-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "c11a15eb0a12bcafe8946786e7226c35e267234288e2423f6e8f9cd9d192ee96"
    },
    "views": [],
    "sourceSha256": "c11a15eb0a12bcafe8946786e7226c35e267234288e2423f6e8f9cd9d192ee96"
  },
  "shouldercars": {
    "appId": "shouldercars",
    "atlasId": "shouldercars",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/shouldercars-bok-f1-658c1c65-thumb.webp",
      "detail": "/movement-atlas/shouldercars-bok-f1-658c1c65-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "658c1c65323e087e687f93bf89cc6acd2ebeee377285370b4f56210880360d2c"
    },
    "views": [],
    "sourceSha256": "658c1c65323e087e687f93bf89cc6acd2ebeee377285370b4f56210880360d2c"
  },
  "shrimp": {
    "appId": "shrimp",
    "atlasId": "shrimp",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/shrimp-bok-f1-e4aff80d-thumb.webp",
      "detail": "/movement-atlas/shrimp-bok-f1-e4aff80d-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "e4aff80d05090e9ce5e117ad0667e9a7f60a4d315b9a39b47249b9d527a5a5f9"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/shrimp-bok-f2-4d8542bc-thumb.webp",
        "detail": "/movement-atlas/shrimp-bok-f2-4d8542bc-detail.webp",
        "dark": null,
        "width": 1536,
        "height": 1536,
        "sourceWidth": 1024,
        "sourceHeight": 1536,
        "sourceSha256": "4d8542bc985880a119795d880d24ca05034e2e11d1eb54cf1b933f679e8eb368"
      }
    ],
    "sourceSha256": "e4aff80d05090e9ce5e117ad0667e9a7f60a4d315b9a39b47249b9d527a5a5f9"
  },
  "sidebend": {
    "appId": "sidebend",
    "atlasId": "sidebend",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/sidebend-predek-f1-561f7ab4-thumb.webp",
      "detail": "/movement-atlas/sidebend-predek-f1-561f7ab4-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "561f7ab49e54e1967b662da09b24c1299b9c666a95b10286652ea773c62af023"
    },
    "views": [],
    "sourceSha256": "561f7ab49e54e1967b662da09b24c1299b9c666a95b10286652ea773c62af023"
  },
  "sideleg": {
    "appId": "sideleg",
    "atlasId": "sideleg",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/sideleg-bok-f1-b7348f57-thumb.webp",
      "detail": "/movement-atlas/sideleg-bok-f1-b7348f57-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "b7348f57c0889701af87d7e2547d112a8278757cee57ff2b36e9481ee5f7e14f"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/sideleg-bok-f2-3c66ac44-thumb.webp",
        "detail": "/movement-atlas/sideleg-bok-f2-3c66ac44-detail.webp",
        "dark": null,
        "width": 1536,
        "height": 1536,
        "sourceWidth": 1536,
        "sourceHeight": 1024,
        "sourceSha256": "3c66ac4414033a72a959accce95e66e0f890a2c73cb22c95f0075496570a47f3"
      }
    ],
    "sourceSha256": "b7348f57c0889701af87d7e2547d112a8278757cee57ff2b36e9481ee5f7e14f"
  },
  "sideplank": {
    "appId": "sideplank",
    "atlasId": "sideplank",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/sideplank-bok-f1-c1acc4bc-thumb.webp",
      "detail": "/movement-atlas/sideplank-bok-f1-c1acc4bc-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "c1acc4bc58ae621ddb6bf900910cc1fdb1b9c985e9e0f5266c21aaa40dcf961a"
    },
    "views": [],
    "sourceSha256": "c1acc4bc58ae621ddb6bf900910cc1fdb1b9c985e9e0f5266c21aaa40dcf961a"
  },
  "sissy": {
    "appId": "sissy",
    "atlasId": "sissy",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/sissy-bok-f1-18ffd0c7-thumb.webp",
      "detail": "/movement-atlas/sissy-bok-f1-18ffd0c7-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "18ffd0c7df571eadb963f92b2f02cd7fd375d31f4b8257fda38729173099429c"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/sissy-bok-f2-2fefec0d-thumb.webp",
        "detail": "/movement-atlas/sissy-bok-f2-2fefec0d-detail.webp",
        "dark": null,
        "width": 1254,
        "height": 1254,
        "sourceWidth": 1254,
        "sourceHeight": 1254,
        "sourceSha256": "2fefec0d9b4dd62e14c57e44673e25d2b65d41dc87a0745dd7a04c7892d1e1e7"
      }
    ],
    "sourceSha256": "18ffd0c7df571eadb963f92b2f02cd7fd375d31f4b8257fda38729173099429c"
  },
  "sissysquat": {
    "appId": "sissysquat",
    "atlasId": "sissysquat",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/sissysquat-bok-f1-18ffd0c7-thumb.webp",
      "detail": "/movement-atlas/sissysquat-bok-f1-18ffd0c7-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "18ffd0c7df571eadb963f92b2f02cd7fd375d31f4b8257fda38729173099429c"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/sissysquat-bok-f2-2fefec0d-thumb.webp",
        "detail": "/movement-atlas/sissysquat-bok-f2-2fefec0d-detail.webp",
        "dark": null,
        "width": 1254,
        "height": 1254,
        "sourceWidth": 1254,
        "sourceHeight": 1254,
        "sourceSha256": "2fefec0d9b4dd62e14c57e44673e25d2b65d41dc87a0745dd7a04c7892d1e1e7"
      }
    ],
    "sourceSha256": "18ffd0c7df571eadb963f92b2f02cd7fd375d31f4b8257fda38729173099429c"
  },
  "situp": {
    "appId": "situp",
    "atlasId": "situp",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/situp-bok-f1-087e91c8-thumb.webp",
      "detail": "/movement-atlas/situp-bok-f1-087e91c8-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "087e91c85894eebc4de4e503768ae84b6d2a03c33f79c85266dfe2cc7d674429"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/situp-bok-f2-64a1375c-thumb.webp",
        "detail": "/movement-atlas/situp-bok-f2-64a1375c-detail.webp",
        "dark": null,
        "width": 1536,
        "height": 1536,
        "sourceWidth": 1536,
        "sourceHeight": 1024,
        "sourceSha256": "64a1375cc64fc61190304ba8efe83082039d66183975b7f409b213d91a489867"
      }
    ],
    "sourceSha256": "087e91c85894eebc4de4e503768ae84b6d2a03c33f79c85266dfe2cc7d674429"
  },
  "skater": {
    "appId": "skater",
    "atlasId": "skater",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/skater-predek-f1-afcfe480-thumb.webp",
      "detail": "/movement-atlas/skater-predek-f1-afcfe480-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "afcfe48089eeb8d8576b0170846de3c95858fd7d2a90960de6eb7669f5b8e169"
    },
    "views": [
      {
        "view": "predek",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/skater-predek-f2-7564aff5-thumb.webp",
        "detail": "/movement-atlas/skater-predek-f2-7564aff5-detail.webp",
        "dark": null,
        "width": 1536,
        "height": 1536,
        "sourceWidth": 1536,
        "sourceHeight": 1024,
        "sourceSha256": "7564aff5829982ff95446f5b9db754a791d130c392df0c1e8a38f40fbd17946c"
      },
      {
        "view": "predek",
        "phase": "f3",
        "primary": false,
        "thumb": "/movement-atlas/skater-predek-f3-8d381f7a-thumb.webp",
        "detail": "/movement-atlas/skater-predek-f3-8d381f7a-detail.webp",
        "dark": null,
        "width": 1536,
        "height": 1536,
        "sourceWidth": 1536,
        "sourceHeight": 1024,
        "sourceSha256": "8d381f7a4dd7c61274c3aada312ae89115041b38dc51dae0d7a955b83a3493b8"
      }
    ],
    "sourceSha256": "afcfe48089eeb8d8576b0170846de3c95858fd7d2a90960de6eb7669f5b8e169"
  },
  "skinthecat": {
    "appId": "skinthecat",
    "atlasId": "skinthecat",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/skinthecat-bok-f1-1a7bd3ab-thumb.webp",
      "detail": "/movement-atlas/skinthecat-bok-f1-1a7bd3ab-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1402,
      "sourceHeight": 1122,
      "sourceSha256": "1a7bd3ab5f6997dc7e5e10f3439c80dcd1e335ad845c1a719d4ac795e6d32594"
    },
    "views": [],
    "sourceSha256": "1a7bd3ab5f6997dc7e5e10f3439c80dcd1e335ad845c1a719d4ac795e6d32594"
  },
  "slbalance": {
    "appId": "slbalance",
    "atlasId": "slbalance",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/slbalance-bok-f1-b2ead5fb-thumb.webp",
      "detail": "/movement-atlas/slbalance-bok-f1-b2ead5fb-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1122,
      "sourceHeight": 1402,
      "sourceSha256": "b2ead5fbb4fbd618e5e53e8445b99e29059b83a80efd81a7931d12b941de5ae0"
    },
    "views": [],
    "sourceSha256": "b2ead5fbb4fbd618e5e53e8445b99e29059b83a80efd81a7931d12b941de5ae0"
  },
  "slbridge": {
    "appId": "slbridge",
    "atlasId": "slbridge",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/slbridge-bok-f1-f49e2923-thumb.webp",
      "detail": "/movement-atlas/slbridge-bok-f1-f49e2923-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "f49e2923c03c05dae51b58d2b7e9d7b5b2d63d82a76c8a19d895360527690c00"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/slbridge-bok-f2-7466365f-thumb.webp",
        "detail": "/movement-atlas/slbridge-bok-f2-7466365f-detail.webp",
        "dark": null,
        "width": 1536,
        "height": 1536,
        "sourceWidth": 1536,
        "sourceHeight": 1024,
        "sourceSha256": "7466365f53b9e189009fffcb52bc858c9f1e82c65a421de6bc4a813bd686b56b"
      }
    ],
    "sourceSha256": "f49e2923c03c05dae51b58d2b7e9d7b5b2d63d82a76c8a19d895360527690c00"
  },
  "sled": {
    "appId": "sled",
    "atlasId": "sled",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/sled-bok-f1-799c2cd4-thumb.webp",
      "detail": "/movement-atlas/sled-bok-f1-799c2cd4-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "799c2cd48fd269ca22c47b224ef0f25c88384dfadb475b9623db987f3ea39ef0"
    },
    "views": [],
    "sourceSha256": "799c2cd48fd269ca22c47b224ef0f25c88384dfadb475b9623db987f3ea39ef0"
  },
  "slrdl": {
    "appId": "slrdl",
    "atlasId": "slrdl",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/slrdl-bok-f1-b3444af6-thumb.webp",
      "detail": "/movement-atlas/slrdl-bok-f1-b3444af6-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "b3444af6d37d401f518fdc13a88e16ee78b3565c0d21977eda414babc9e9f8b7"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/slrdl-bok-f2-48d142a1-thumb.webp",
        "detail": "/movement-atlas/slrdl-bok-f2-48d142a1-detail.webp",
        "dark": null,
        "width": 1536,
        "height": 1536,
        "sourceWidth": 1536,
        "sourceHeight": 1024,
        "sourceSha256": "48d142a18335a709569f6156f65ceff0385b9afb0dc117a71449e4fbfc117227"
      }
    ],
    "sourceSha256": "b3444af6d37d401f518fdc13a88e16ee78b3565c0d21977eda414babc9e9f8b7"
  },
  "sphinx": {
    "appId": "sphinx",
    "atlasId": "sphinx",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/sphinx-bok-f1-1dc2a46e-thumb.webp",
      "detail": "/movement-atlas/sphinx-bok-f1-1dc2a46e-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "1dc2a46eefc861fb6daa27213060c982607c58347ff2cae17e8b256ad8e6faa3"
    },
    "views": [],
    "sourceSha256": "1dc2a46eefc861fb6daa27213060c982607c58347ff2cae17e8b256ad8e6faa3"
  },
  "sprint": {
    "appId": "sprint",
    "atlasId": "sprint",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/sprint-bok-f1-26d5fceb-thumb.webp",
      "detail": "/movement-atlas/sprint-bok-f1-26d5fceb-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "26d5fcebd7f54ade47ae13cb861a4365321234ffaeff6d4a01c8a8fa5fd3cdaf"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/sprint-bok-f2-f083707e-thumb.webp",
        "detail": "/movement-atlas/sprint-bok-f2-f083707e-detail.webp",
        "dark": null,
        "width": 1536,
        "height": 1536,
        "sourceWidth": 1536,
        "sourceHeight": 1024,
        "sourceSha256": "f083707e9e7dafddf2fc3a357d177ad3e6edb39b7c809fc95b12b9aa47fc3f48"
      }
    ],
    "sourceSha256": "26d5fcebd7f54ade47ae13cb861a4365321234ffaeff6d4a01c8a8fa5fd3cdaf"
  },
  "squatpry": {
    "appId": "squatpry",
    "atlasId": "squatpry",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/squatpry-bok-f1-40830b2a-thumb.webp",
      "detail": "/movement-atlas/squatpry-bok-f1-40830b2a-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "40830b2a25bf4447dfbac673bbbe7ff69a2db7e9f0d748c520c3308c413c1c07"
    },
    "views": [],
    "sourceSha256": "40830b2a25bf4447dfbac673bbbe7ff69a2db7e9f0d748c520c3308c413c1c07"
  },
  "stepup": {
    "appId": "stepup",
    "atlasId": "stepup",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/stepup-bok-f1-5804f6db-thumb.webp",
      "detail": "/movement-atlas/stepup-bok-f1-5804f6db-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1402,
      "sourceHeight": 1122,
      "sourceSha256": "5804f6db412e72238dcea1c56a5007d3c8be39040d63be71efc6b64939c22461"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/stepup-bok-f2-d43453be-thumb.webp",
        "detail": "/movement-atlas/stepup-bok-f2-d43453be-detail.webp",
        "dark": null,
        "width": 1374,
        "height": 1374,
        "sourceWidth": 1145,
        "sourceHeight": 1374,
        "sourceSha256": "d43453be4ca4719a6048f24aea2877ae1fc069fbcb4820fb20b2985cc50cda40"
      }
    ],
    "sourceSha256": "5804f6db412e72238dcea1c56a5007d3c8be39040d63be71efc6b64939c22461"
  },
  "straddlefl": {
    "appId": "straddlefl",
    "atlasId": "straddlefl",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/straddlefl-predek-f1-671d8248-thumb.webp",
      "detail": "/movement-atlas/straddlefl-predek-f1-671d8248-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1402,
      "sourceHeight": 1122,
      "sourceSha256": "671d82483a8ff9c412eea951a3530ab9337efa22f63200e1c5182a7b83437c00"
    },
    "views": [],
    "sourceSha256": "671d82483a8ff9c412eea951a3530ab9337efa22f63200e1c5182a7b83437c00"
  },
  "straddleplanche": {
    "appId": "straddleplanche",
    "atlasId": "straddleplanche",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/straddleplanche-predek-f1-4142f9d7-thumb.webp",
      "detail": "/movement-atlas/straddleplanche-predek-f1-4142f9d7-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "4142f9d73cd6984203d5f1331f72483a5113d8e80b524e09104f4a21df32e00e"
    },
    "views": [],
    "sourceSha256": "4142f9d73cd6984203d5f1331f72483a5113d8e80b524e09104f4a21df32e00e"
  },
  "straddlesit": {
    "appId": "straddlesit",
    "atlasId": "straddlesit",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/straddlesit-predek-f1-8456145c-thumb.webp",
      "detail": "/movement-atlas/straddlesit-predek-f1-8456145c-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "8456145cb143d50dfa658060700c7e664d473fd1ed28af09befe1771df92f656"
    },
    "views": [],
    "sourceSha256": "8456145cb143d50dfa658060700c7e664d473fd1ed28af09befe1771df92f656"
  },
  "suitcase": {
    "appId": "suitcase",
    "atlasId": "suitcase",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/suitcase-predek-f1-32bf7606-thumb.webp",
      "detail": "/movement-atlas/suitcase-predek-f1-32bf7606-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "32bf76065a2d576efda94175687e9124ba010d1557e05044a0d50a7a08f32189"
    },
    "views": [],
    "sourceSha256": "32bf76065a2d576efda94175687e9124ba010d1557e05044a0d50a7a08f32189"
  },
  "sumo": {
    "appId": "sumo",
    "atlasId": "sumo",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/sumo-predek-f1-6b0148e0-thumb.webp",
      "detail": "/movement-atlas/sumo-predek-f1-6b0148e0-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "6b0148e01fd8b0c0c7e6c3c57adecb717db3335c04c673361b039bdf691f224c"
    },
    "views": [],
    "sourceSha256": "6b0148e01fd8b0c0c7e6c3c57adecb717db3335c04c673361b039bdf691f224c"
  },
  "superman": {
    "appId": "superman",
    "atlasId": "superman",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/superman-bok-f1-732fb4cd-thumb.webp",
      "detail": "/movement-atlas/superman-bok-f1-732fb4cd-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "732fb4cd2e8c65737ac8f149e39567a992d83349da54b9ee0234041b532753ae"
    },
    "views": [],
    "sourceSha256": "732fb4cd2e8c65737ac8f149e39567a992d83349da54b9ee0234041b532753ae"
  },
  "support": {
    "appId": "support",
    "atlasId": "support",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/support-bok-f1-1fb23745-thumb.webp",
      "detail": "/movement-atlas/support-bok-f1-1fb23745-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "1fb237455c0bfa9f24cb2b08dad49fa3f3ab7a27d33ecebc1cc91daeb1256577"
    },
    "views": [],
    "sourceSha256": "1fb237455c0bfa9f24cb2b08dad49fa3f3ab7a27d33ecebc1cc91daeb1256577"
  },
  "swing": {
    "appId": "swing",
    "atlasId": "swing",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/swing-bok-f1-2ee90705-thumb.webp",
      "detail": "/movement-atlas/swing-bok-f1-2ee90705-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "2ee90705383f05e61436ca57cc8590191a77b53d207189854bd654b33e0573a0"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/swing-bok-f2-56a4885d-thumb.webp",
        "detail": "/movement-atlas/swing-bok-f2-56a4885d-detail.webp",
        "dark": null,
        "width": 1536,
        "height": 1536,
        "sourceWidth": 1024,
        "sourceHeight": 1536,
        "sourceSha256": "56a4885d0bf30c6746e8ca5fb5aeb1c8deb06cc55a2552a656a3870760394d86"
      }
    ],
    "sourceSha256": "2ee90705383f05e61436ca57cc8590191a77b53d207189854bd654b33e0573a0"
  },
  "t2b": {
    "appId": "t2b",
    "atlasId": "t2b",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/t2b-bok-f1-e62963b4-thumb.webp",
      "detail": "/movement-atlas/t2b-bok-f1-e62963b4-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1086,
      "sourceHeight": 1448,
      "sourceSha256": "e62963b4b50438c1572d95c8c49cdc971ed76ba3a6f4ed7294214b5b148f09d4"
    },
    "views": [],
    "sourceSha256": "e62963b4b50438c1572d95c8c49cdc971ed76ba3a6f4ed7294214b5b148f09d4"
  },
  "tbridge": {
    "appId": "tbridge",
    "atlasId": "tbridge",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/tbridge-bok-f1-a21356ac-thumb.webp",
      "detail": "/movement-atlas/tbridge-bok-f1-a21356ac-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "a21356ac822c5903a3822ab24786241244316c5bc4e7f2f36046f12513f76e70"
    },
    "views": [],
    "sourceSha256": "a21356ac822c5903a3822ab24786241244316c5bc4e7f2f36046f12513f76e70"
  },
  "thoracicext": {
    "appId": "thoracicext",
    "atlasId": "thoracicext",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/thoracicext-bok-f1-8e3ec4fc-thumb.webp",
      "detail": "/movement-atlas/thoracicext-bok-f1-8e3ec4fc-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "8e3ec4fcc2e4740dd167a604752c94945db33030e555249d21341696962747cd"
    },
    "views": [],
    "sourceSha256": "8e3ec4fcc2e4740dd167a604752c94945db33030e555249d21341696962747cd"
  },
  "threadneedle": {
    "appId": "threadneedle",
    "atlasId": "threadneedle",
    "primary": {
      "view": "zada",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/threadneedle-zada-f1-eca27b9b-thumb.webp",
      "detail": "/movement-atlas/threadneedle-zada-f1-eca27b9b-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "eca27b9bc4ef127f0773b9d925f751865d81d4cee23d6361f05db42b6ce2648c"
    },
    "views": [],
    "sourceSha256": "eca27b9bc4ef127f0773b9d925f751865d81d4cee23d6361f05db42b6ce2648c"
  },
  "tibraise": {
    "appId": "tibraise",
    "atlasId": "tibraise",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/tibraise-bok-f1-794a969c-thumb.webp",
      "detail": "/movement-atlas/tibraise-bok-f1-794a969c-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1122,
      "sourceHeight": 1402,
      "sourceSha256": "794a969c49132ae6cf4815b6ec8ea446798d8e3e10e8467cd5d4398dcf143a85"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/tibraise-bok-f2-d738f9a2-thumb.webp",
        "detail": "/movement-atlas/tibraise-bok-f2-d738f9a2-detail.webp",
        "dark": null,
        "width": 1402,
        "height": 1402,
        "sourceWidth": 1122,
        "sourceHeight": 1402,
        "sourceSha256": "d738f9a2d6fd90f3084bb9b67ddf9e933146ac6dfc9d79c5dfa2b46a522589c6"
      }
    ],
    "sourceSha256": "794a969c49132ae6cf4815b6ec8ea446798d8e3e10e8467cd5d4398dcf143a85"
  },
  "toetouch": {
    "appId": "toetouch",
    "atlasId": "toetouch",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/toetouch-bok-f1-72466f00-thumb.webp",
      "detail": "/movement-atlas/toetouch-bok-f1-72466f00-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "72466f007fcad7f4c94f357fa9e67c57bc5e2109aa34c00175b88e687c43b9c6"
    },
    "views": [],
    "sourceSha256": "72466f007fcad7f4c94f357fa9e67c57bc5e2109aa34c00175b88e687c43b9c6"
  },
  "towelhang": {
    "appId": "towelhang",
    "atlasId": "towelhang",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/towelhang-predek-f1-ba32c85a-thumb.webp",
      "detail": "/movement-atlas/towelhang-predek-f1-ba32c85a-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "ba32c85a8d84b53eeca49e6b92bd684dbd3a25d8e12fd71452f27db3fdba8533"
    },
    "views": [],
    "sourceSha256": "ba32c85a8d84b53eeca49e6b92bd684dbd3a25d8e12fd71452f27db3fdba8533"
  },
  "tuckback": {
    "appId": "tuckback",
    "atlasId": "tuckback",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/tuckback-bok-f1-95eace4c-thumb.webp",
      "detail": "/movement-atlas/tuckback-bok-f1-95eace4c-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "95eace4c4a165795d1afbe33d0889620139b913e51e5ccbfcfc207972ecab2d0"
    },
    "views": [],
    "sourceSha256": "95eace4c4a165795d1afbe33d0889620139b913e51e5ccbfcfc207972ecab2d0"
  },
  "tuckjump": {
    "appId": "tuckjump",
    "atlasId": "tuckjump",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/tuckjump-bok-f1-008d99c2-thumb.webp",
      "detail": "/movement-atlas/tuckjump-bok-f1-008d99c2-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "008d99c29a1f81da5c59b004055d879efe58610e06149b1460c3391a67a506c4"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/tuckjump-bok-f2-6ddde85a-thumb.webp",
        "detail": "/movement-atlas/tuckjump-bok-f2-6ddde85a-detail.webp",
        "dark": null,
        "width": 1254,
        "height": 1254,
        "sourceWidth": 1254,
        "sourceHeight": 1254,
        "sourceSha256": "6ddde85a7f334e7dd777ab796db589f3ebd472700712c4d2a220d22c6c6d59bb"
      },
      {
        "view": "bok",
        "phase": "f3",
        "primary": false,
        "thumb": "/movement-atlas/tuckjump-bok-f3-5a229236-thumb.webp",
        "detail": "/movement-atlas/tuckjump-bok-f3-5a229236-detail.webp",
        "dark": null,
        "width": 1254,
        "height": 1254,
        "sourceWidth": 1254,
        "sourceHeight": 1254,
        "sourceSha256": "5a229236adb544363cc03c3c8c4daaf2f3db35f617070265f5744c7754540bda"
      }
    ],
    "sourceSha256": "008d99c29a1f81da5c59b004055d879efe58610e06149b1460c3391a67a506c4"
  },
  "tuckl": {
    "appId": "tuckl",
    "atlasId": "tuckl",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/tuckl-bok-f1-dae12f0f-thumb.webp",
      "detail": "/movement-atlas/tuckl-bok-f1-dae12f0f-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "dae12f0f7c5c46a95294fbe2d188154ce1f3c0d2a36d582dd520a180accc4f6d"
    },
    "views": [],
    "sourceSha256": "dae12f0f7c5c46a95294fbe2d188154ce1f3c0d2a36d582dd520a180accc4f6d"
  },
  "tucklever": {
    "appId": "tucklever",
    "atlasId": "tucklever",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/tucklever-bok-f1-4b633f00-thumb.webp",
      "detail": "/movement-atlas/tucklever-bok-f1-4b633f00-detail.webp",
      "dark": null,
      "width": 1391,
      "height": 1391,
      "sourceWidth": 1391,
      "sourceHeight": 1131,
      "sourceSha256": "4b633f00635d5436fe0a54d5d3581222f0c626c410b575c2439c3e77e3075e16"
    },
    "views": [],
    "sourceSha256": "4b633f00635d5436fe0a54d5d3581222f0c626c410b575c2439c3e77e3075e16"
  },
  "tuckplanche": {
    "appId": "tuckplanche",
    "atlasId": "tuckplanche",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/tuckplanche-bok-f1-b9ce29b0-thumb.webp",
      "detail": "/movement-atlas/tuckplanche-bok-f1-b9ce29b0-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "b9ce29b044332b11c941deb6040f1824848f4e3b371ef28d1b8d5b903d42c5f9"
    },
    "views": [],
    "sourceSha256": "b9ce29b044332b11c941deb6040f1824848f4e3b371ef28d1b8d5b903d42c5f9"
  },
  "typewriter": {
    "appId": "typewriter",
    "atlasId": "typewriter",
    "primary": {
      "view": "zada",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/typewriter-zada-f1-3b9bf5a5-thumb.webp",
      "detail": "/movement-atlas/typewriter-zada-f1-3b9bf5a5-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "3b9bf5a5fd7b46fa4f558e197d55b8b0e5ab2ba4ae0b71d99d7bb7ec42175978"
    },
    "views": [],
    "sourceSha256": "3b9bf5a5fd7b46fa4f558e197d55b8b0e5ab2ba4ae0b71d99d7bb7ec42175978"
  },
  "vi_biceps": {
    "appId": "vi_biceps",
    "atlasId": "vi_biceps",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/vi_biceps-bok-f1-b6359ea4-thumb.webp",
      "detail": "/movement-atlas/vi_biceps-bok-f1-b6359ea4-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "b6359ea49447d08b2f06448edeb40b936c31ef4199173fd761eb6a4c07928e35"
    },
    "views": [],
    "sourceSha256": "b6359ea49447d08b2f06448edeb40b936c31ef4199173fd761eb6a4c07928e35"
  },
  "vi_calf": {
    "appId": "vi_calf",
    "atlasId": "vi_calf",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/vi_calf-bok-f1-a55412d2-thumb.webp",
      "detail": "/movement-atlas/vi_calf-bok-f1-a55412d2-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "a55412d22d93987c912a32b62b884fa8a1a46d731851648d0754362f950b3b75"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/vi_calf-bok-f2-d65cd196-thumb.webp",
        "detail": "/movement-atlas/vi_calf-bok-f2-d65cd196-detail.webp",
        "dark": null,
        "width": 1254,
        "height": 1254,
        "sourceWidth": 1254,
        "sourceHeight": 1254,
        "sourceSha256": "d65cd196f0812a5e8dbccc293e82cede1299dbf370284e6a787f08eba2e55f11"
      }
    ],
    "sourceSha256": "a55412d22d93987c912a32b62b884fa8a1a46d731851648d0754362f950b3b75"
  },
  "vi_hinge": {
    "appId": "vi_hinge",
    "atlasId": "vi_hinge",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/vi_hinge-bok-f1-7fe9ca46-thumb.webp",
      "detail": "/movement-atlas/vi_hinge-bok-f1-7fe9ca46-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "7fe9ca46c32d6b15abe5a16a865d2be22bc74850a7bc99a4d95cdef469fcba88"
    },
    "views": [],
    "sourceSha256": "7fe9ca46c32d6b15abe5a16a865d2be22bc74850a7bc99a4d95cdef469fcba88"
  },
  "vi_hipthrust": {
    "appId": "vi_hipthrust",
    "atlasId": "vi_hipthrust",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/vi_hipthrust-bok-f1-130e5a05-thumb.webp",
      "detail": "/movement-atlas/vi_hipthrust-bok-f1-130e5a05-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "130e5a0579907c306db7d3b073079b03fcb702413e2d50e279d34ce33211a696"
    },
    "views": [],
    "sourceSha256": "130e5a0579907c306db7d3b073079b03fcb702413e2d50e279d34ce33211a696"
  },
  "vi_hss3m": {
    "appId": "vi_hss3m",
    "atlasId": "vi_hss3m",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/vi_hss3m-bok-f1-285e8130-thumb.webp",
      "detail": "/movement-atlas/vi_hss3m-bok-f1-285e8130-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "285e81305c103c1ce2df6906eedc7f8dca5f833c0a11746f9b3120dbf9309bda"
    },
    "views": [],
    "sourceSha256": "285e81305c103c1ce2df6906eedc7f8dca5f833c0a11746f9b3120dbf9309bda"
  },
  "vi_hss6m": {
    "appId": "vi_hss6m",
    "atlasId": "vi_hss6m",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/vi_hss6m-bok-f1-82e62220-thumb.webp",
      "detail": "/movement-atlas/vi_hss6m-bok-f1-82e62220-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "82e62220222a0a7651703d29b2ea116f1f30a0d02e5893e123a6e12927e9e199"
    },
    "views": [],
    "sourceSha256": "82e62220222a0a7651703d29b2ea116f1f30a0d02e5893e123a6e12927e9e199"
  },
  "vi_lunge": {
    "appId": "vi_lunge",
    "atlasId": "vi_lunge",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/vi_lunge-bok-f1-33a713cc-thumb.webp",
      "detail": "/movement-atlas/vi_lunge-bok-f1-33a713cc-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "33a713cc78df7a5f32170ffed67d52778aa253a5d16ee7c1c21c85d522ad8025"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/vi_lunge-bok-f2-d9bd63c5-thumb.webp",
        "detail": "/movement-atlas/vi_lunge-bok-f2-d9bd63c5-detail.webp",
        "dark": null,
        "width": 1254,
        "height": 1254,
        "sourceWidth": 1254,
        "sourceHeight": 1254,
        "sourceSha256": "d9bd63c51e2c8aac50cd761e8a24aae6628f8f8a938ce64cb5eb97c91e48e68f"
      }
    ],
    "sourceSha256": "33a713cc78df7a5f32170ffed67d52778aa253a5d16ee7c1c21c85d522ad8025"
  },
  "vi_ohp": {
    "appId": "vi_ohp",
    "atlasId": "vi_ohp",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/vi_ohp-bok-f1-57d7b132-thumb.webp",
      "detail": "/movement-atlas/vi_ohp-bok-f1-57d7b132-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1086,
      "sourceHeight": 1448,
      "sourceSha256": "57d7b132b475eb899c5f2e33de8da91b343df365d9b05447935963d9a79814cf"
    },
    "views": [],
    "sourceSha256": "57d7b132b475eb899c5f2e33de8da91b343df365d9b05447935963d9a79814cf"
  },
  "vi_press": {
    "appId": "vi_press",
    "atlasId": "vi_press",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/vi_press-bok-f1-41d08328-thumb.webp",
      "detail": "/movement-atlas/vi_press-bok-f1-41d08328-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "41d08328f84433ddf93f92a837b6f82318b07d38e7b043db078e1d1dcece696f"
    },
    "views": [],
    "sourceSha256": "41d08328f84433ddf93f92a837b6f82318b07d38e7b043db078e1d1dcece696f"
  },
  "vi_row": {
    "appId": "vi_row",
    "atlasId": "vi_row",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/vi_row-bok-f1-22f6c0b4-thumb.webp",
      "detail": "/movement-atlas/vi_row-bok-f1-22f6c0b4-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1402,
      "sourceHeight": 1122,
      "sourceSha256": "22f6c0b4b860b8ff919db3b5b390d50f23d7fa2819255c29c6a97186685bb8d1"
    },
    "views": [],
    "sourceSha256": "22f6c0b4b860b8ff919db3b5b390d50f23d7fa2819255c29c6a97186685bb8d1"
  },
  "vi_scap": {
    "appId": "vi_scap",
    "atlasId": "vi_scap",
    "primary": {
      "view": "zada",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/vi_scap-zada-f1-acf24a67-thumb.webp",
      "detail": "/movement-atlas/vi_scap-zada-f1-acf24a67-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "acf24a6738ca2e0c321ba461058d2a01eed092dbe9c0518b8315b13a57c0d845"
    },
    "views": [],
    "sourceSha256": "acf24a6738ca2e0c321ba461058d2a01eed092dbe9c0518b8315b13a57c0d845"
  },
  "vi_squat": {
    "appId": "vi_squat",
    "atlasId": "vi_squat",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/vi_squat-bok-f1-20d0b036-thumb.webp",
      "detail": "/movement-atlas/vi_squat-bok-f1-20d0b036-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "20d0b036b30ea6006ff924222c070c5decca7fcaa47dbc67218ac8aff821e4ec"
    },
    "views": [],
    "sourceSha256": "20d0b036b30ea6006ff924222c070c5decca7fcaa47dbc67218ac8aff821e4ec"
  },
  "vi_triceps": {
    "appId": "vi_triceps",
    "atlasId": "vi_triceps",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/vi_triceps-bok-f1-ac01950b-thumb.webp",
      "detail": "/movement-atlas/vi_triceps-bok-f1-ac01950b-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1122,
      "sourceHeight": 1402,
      "sourceSha256": "ac01950ba942ad0a6d395146e6b43424bee22868c5ff6d1ae38bab9a2734c7bc"
    },
    "views": [],
    "sourceSha256": "ac01950ba942ad0a6d395146e6b43424bee22868c5ff6d1ae38bab9a2734c7bc"
  },
  "vsit": {
    "appId": "vsit",
    "atlasId": "vsit",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/vsit-bok-f1-5c82c51e-thumb.webp",
      "detail": "/movement-atlas/vsit-bok-f1-5c82c51e-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "5c82c51eb27a4b2ece85edcef4d816909e809c822ae10547d170fd5593a86cfb"
    },
    "views": [],
    "sourceSha256": "5c82c51eb27a4b2ece85edcef4d816909e809c822ae10547d170fd5593a86cfb"
  },
  "vup": {
    "appId": "vup",
    "atlasId": "vup",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/vup-bok-f1-ebc1c9d1-thumb.webp",
      "detail": "/movement-atlas/vup-bok-f1-ebc1c9d1-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "ebc1c9d1ded881a0f8ed63f79ab46b3ad01fd1a287fd92394906c659b67de2dc"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/vup-bok-f2-67d1ef22-thumb.webp",
        "detail": "/movement-atlas/vup-bok-f2-67d1ef22-detail.webp",
        "dark": null,
        "width": 1536,
        "height": 1536,
        "sourceWidth": 1536,
        "sourceHeight": 1024,
        "sourceSha256": "67d1ef229cc0dd650fd0e74a2c4f68915c22492474afe6447a30661e1c6517fc"
      }
    ],
    "sourceSha256": "ebc1c9d1ded881a0f8ed63f79ab46b3ad01fd1a287fd92394906c659b67de2dc"
  },
  "wallext": {
    "appId": "wallext",
    "atlasId": "wallext",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/wallext-predek-f1-545952f8-thumb.webp",
      "detail": "/movement-atlas/wallext-predek-f1-545952f8-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "545952f8b8fbce2810abb17a27180b0846950c57ab018cc6c14b2444f43f5235"
    },
    "views": [],
    "sourceSha256": "545952f8b8fbce2810abb17a27180b0846950c57ab018cc6c14b2444f43f5235"
  },
  "wallhs": {
    "appId": "wallhs",
    "atlasId": "wallhs",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/wallhs-bok-f1-f07271e4-thumb.webp",
      "detail": "/movement-atlas/wallhs-bok-f1-f07271e4-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "f07271e4c4a816bcb2201108e7236efef91b6b6bb9697fb0057084ecd2b3bfec"
    },
    "views": [],
    "sourceSha256": "f07271e4c4a816bcb2201108e7236efef91b6b6bb9697fb0057084ecd2b3bfec"
  },
  "wallhspu": {
    "appId": "wallhspu",
    "atlasId": "wallhspu",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/wallhspu-bok-f1-8b980b66-thumb.webp",
      "detail": "/movement-atlas/wallhspu-bok-f1-8b980b66-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "8b980b6616c875d1f4091921f8118da2b11d11440ce449e2925613d301ff6b57"
    },
    "views": [],
    "sourceSha256": "8b980b6616c875d1f4091921f8118da2b11d11440ce449e2925613d301ff6b57"
  },
  "wallpike": {
    "appId": "wallpike",
    "atlasId": "wallpike",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/wallpike-bok-f1-55b0659c-thumb.webp",
      "detail": "/movement-atlas/wallpike-bok-f1-55b0659c-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "55b0659c1b14fd0cf85375ca043b1250e07f6d1791774f0e7275bc815d8fc422"
    },
    "views": [],
    "sourceSha256": "55b0659c1b14fd0cf85375ca043b1250e07f6d1791774f0e7275bc815d8fc422"
  },
  "wallpush": {
    "appId": "wallpush",
    "atlasId": "wallpush",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/wallpush-bok-f1-21727de2-thumb.webp",
      "detail": "/movement-atlas/wallpush-bok-f1-21727de2-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "21727de2077b7535a3be3c86d3034f58d6979b9954614c6caa6881c80946fc33"
    },
    "views": [],
    "sourceSha256": "21727de2077b7535a3be3c86d3034f58d6979b9954614c6caa6881c80946fc33"
  },
  "wallsit": {
    "appId": "wallsit",
    "atlasId": "wallsit",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/wallsit-bok-f1-d0068699-thumb.webp",
      "detail": "/movement-atlas/wallsit-bok-f1-d0068699-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "d00686993bf11202896d2da68e25e5e5e31039fa4a35c9b4907041da6a8de62c"
    },
    "views": [],
    "sourceSha256": "d00686993bf11202896d2da68e25e5e5e31039fa4a35c9b4907041da6a8de62c"
  },
  "wallwalk": {
    "appId": "wallwalk",
    "atlasId": "wallwalk",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/wallwalk-bok-f1-580a3c10-thumb.webp",
      "detail": "/movement-atlas/wallwalk-bok-f1-580a3c10-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "580a3c1063b79333092c796a4c4bde813d0d9093e8b024d445fcd71d7010ba6d"
    },
    "views": [
      {
        "view": "bok",
        "phase": "f2",
        "primary": false,
        "thumb": "/movement-atlas/wallwalk-bok-f2-3108c6bb-thumb.webp",
        "detail": "/movement-atlas/wallwalk-bok-f2-3108c6bb-detail.webp",
        "dark": null,
        "width": 1536,
        "height": 1536,
        "sourceWidth": 1024,
        "sourceHeight": 1536,
        "sourceSha256": "3108c6bbe4bf364bad7dd07ec861839e253bfafe8c01751037ec1c166a0c13f4"
      }
    ],
    "sourceSha256": "580a3c1063b79333092c796a4c4bde813d0d9093e8b024d445fcd71d7010ba6d"
  },
  "wgs": {
    "appId": "wgs",
    "atlasId": "wgs",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/wgs-bok-f1-5fa372a6-thumb.webp",
      "detail": "/movement-atlas/wgs-bok-f1-5fa372a6-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "5fa372a6457f2a5e02fb632202f131b06b0bfc8b19c97ec276957d8c3acf8a0c"
    },
    "views": [],
    "sourceSha256": "5fa372a6457f2a5e02fb632202f131b06b0bfc8b19c97ec276957d8c3acf8a0c"
  },
  "wipers": {
    "appId": "wipers",
    "atlasId": "wipers",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/wipers-predek-f1-8d1b704a-thumb.webp",
      "detail": "/movement-atlas/wipers-predek-f1-8d1b704a-detail.webp",
      "dark": null,
      "width": 1254,
      "height": 1254,
      "sourceWidth": 1254,
      "sourceHeight": 1254,
      "sourceSha256": "8d1b704ac9deb428df201f7c71d7000979ad2d2685c501fe2447f754f84a8073"
    },
    "views": [],
    "sourceSha256": "8d1b704ac9deb428df201f7c71d7000979ad2d2685c501fe2447f754f84a8073"
  },
  "woodchop": {
    "appId": "woodchop",
    "atlasId": "woodchop",
    "primary": {
      "view": "predek",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/woodchop-predek-f1-fbe16999-thumb.webp",
      "detail": "/movement-atlas/woodchop-predek-f1-fbe16999-detail.webp",
      "dark": null,
      "width": 1402,
      "height": 1402,
      "sourceWidth": 1122,
      "sourceHeight": 1402,
      "sourceSha256": "fbe169990c9c3e9fffbba26a4b09939b19fc68d2c26c170a38232d5a69c9c01b"
    },
    "views": [],
    "sourceSha256": "fbe169990c9c3e9fffbba26a4b09939b19fc68d2c26c170a38232d5a69c9c01b"
  },
  "wpullup": {
    "appId": "wpullup",
    "atlasId": "wpullup",
    "primary": {
      "view": "zada",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/wpullup-zada-f1-2e9b6bbb-thumb.webp",
      "detail": "/movement-atlas/wpullup-zada-f1-2e9b6bbb-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "2e9b6bbbbcbfa51da920cdc22af8bf34e0b4ff3862fa5700c3430a996b1697aa"
    },
    "views": [],
    "sourceSha256": "2e9b6bbbbcbfa51da920cdc22af8bf34e0b4ff3862fa5700c3430a996b1697aa"
  },
  "wristcars": {
    "appId": "wristcars",
    "atlasId": "wristcars",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/wristcars-bok-f1-0e5bee96-thumb.webp",
      "detail": "/movement-atlas/wristcars-bok-f1-0e5bee96-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1024,
      "sourceHeight": 1536,
      "sourceSha256": "0e5bee966b0737281143eaa63b1d146af3e93cf4b6e44c3353ad93878f88f6be"
    },
    "views": [],
    "sourceSha256": "0e5bee966b0737281143eaa63b1d146af3e93cf4b6e44c3353ad93878f88f6be"
  },
  "wristcurl": {
    "appId": "wristcurl",
    "atlasId": "wristcurl",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/wristcurl-bok-f1-9c93a286-thumb.webp",
      "detail": "/movement-atlas/wristcurl-bok-f1-9c93a286-detail.webp",
      "dark": null,
      "width": 1448,
      "height": 1448,
      "sourceWidth": 1448,
      "sourceHeight": 1086,
      "sourceSha256": "9c93a2869060af7e9e4128c3ea534db781fd17d36e491c5d2c0eb81a6ed82276"
    },
    "views": [],
    "sourceSha256": "9c93a2869060af7e9e4128c3ea534db781fd17d36e491c5d2c0eb81a6ed82276"
  },
  "wrists": {
    "appId": "wrists",
    "atlasId": "wrists",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/wrists-bok-f1-252b84da-thumb.webp",
      "detail": "/movement-atlas/wrists-bok-f1-252b84da-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "252b84da2bd9dba32d6704a7947902f2de02ed25a6d7a0d28e485333af6f2d4e"
    },
    "views": [],
    "sourceSha256": "252b84da2bd9dba32d6704a7947902f2de02ed25a6d7a0d28e485333af6f2d4e"
  },
  "ytw": {
    "appId": "ytw",
    "atlasId": "ytw",
    "primary": {
      "view": "zada",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/ytw-zada-f1-709826ba-thumb.webp",
      "detail": "/movement-atlas/ytw-zada-f1-709826ba-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "709826ba3aeb50130c33c30af85ba5791dd5e2a7749e21e4a4419850ee84452c"
    },
    "views": [],
    "sourceSha256": "709826ba3aeb50130c33c30af85ba5791dd5e2a7749e21e4a4419850ee84452c"
  },
  "zenetti": {
    "appId": "zenetti",
    "atlasId": "zenetti",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/zenetti-bok-f1-c51e1e8d-thumb.webp",
      "detail": "/movement-atlas/zenetti-bok-f1-c51e1e8d-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "c51e1e8d58ad5bda75c86ec24d4029a943b39185ab3760115290a9635640ba22"
    },
    "views": [],
    "sourceSha256": "c51e1e8d58ad5bda75c86ec24d4029a943b39185ab3760115290a9635640ba22"
  },
  "zone2": {
    "appId": "zone2",
    "atlasId": "zone2",
    "primary": {
      "view": "bok",
      "phase": "f1",
      "primary": true,
      "thumb": "/movement-atlas/zone2-bok-f1-018a42ef-thumb.webp",
      "detail": "/movement-atlas/zone2-bok-f1-018a42ef-detail.webp",
      "dark": null,
      "width": 1536,
      "height": 1536,
      "sourceWidth": 1536,
      "sourceHeight": 1024,
      "sourceSha256": "018a42ef11b3deb206056da7e787d73671e8c39086d87241426227dc08e08157"
    },
    "views": [],
    "sourceSha256": "018a42ef11b3deb206056da7e787d73671e8c39086d87241426227dc08e08157"
  }
};

export const MOVEMENT_ATLAS_COUNT = 469;
