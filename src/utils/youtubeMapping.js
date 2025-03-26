// YouTubeの動画をワークと関連付けるためのマッピング
export const youtubeVideos = {
  // key: workId, value: YouTube URL
  'fantasy-theater': 'https://www.youtube.com/embed/2BZWDB1Wybg', // 幻想シアター / Fantasy Theater (2023)
  'interactive-photo-booth': 'https://www.youtube.com/embed/79XoaM0g6GM', // 幻想シアター / Fantasy Theater - Interactive Photo Booth
  'vertex': 'https://www.youtube.com/embed/0BXC4zWWILQ', // VRバトロワFPS「VERTEX: VRCBattleRoyale」PV
  'void-sailing': 'https://www.youtube.com/embed/WpcsiyDJCCA', // void Sailing();
  'fantasy-diorama': 'https://www.youtube.com/embed/37b7BvevVHg', // 空想ジオラマ - Fantasy Diorama
  'invisible-sculpture': 'https://www.youtube.com/embed/kZ3skQQuiio', // 不可視彫像／Invisible Sculpture
  'dreaming-frame': 'https://www.youtube.com/embed/-1uGWBb18oI', // Dreaming Frame -ゆめみるがくぶち-
  'during-the-night': 'https://www.youtube.com/embed/jF-yFJL_OvI', // [CALAR.ink] During the Night -よるのあいまに-
  'achromatic-world': 'https://www.youtube.com/embed/b1KrNsZEFic', // [CALAR.ink] Achromatic World -いろのないせかい-
  'my-hachiko': 'https://www.youtube.com/embed/ckEPVmK6jlQ', // HoloLensアプリ「Myハチ公」: HoloLens App "My Hachiko"
  'delta-glass': 'https://www.youtube.com/embed/-iuGVRLfVMs', // パンツが見える夢のメガネ「Delta Glass」(Long ver.)
  'happy-pain': 'https://www.youtube.com/embed/5D7t_ZMKlqU', // 陣痛共有デバイス「Happy Pain」
  'tsukumogami': 'https://www.youtube.com/embed/a3aPQhmcHTE', // つくもがみ - Tsukumogami
  'miraino-piano': 'https://www.youtube.com/embed/a-3r3LKW_Sw', // ミライノピアノ - MIRAINO PIANO
  'nanairo-komichi': 'https://www.youtube.com/embed/bhh49HVHWOA', // 七色小道 - NANAIRO KOMICHI
  'interactive-funeral': 'https://www.youtube.com/embed/QYOD_zfRwCs', // インタラクティブお葬式 - Interactive Funeral
  'ishidatami-tourou': 'https://www.youtube.com/embed/uOKt8ioa614', // 「石畳燈籠」Interaction & Projection Mapping
  'shadow-touch': 'https://www.youtube.com/embed/3itekp9YaAs', // 感覚をだますメディアアート「Shadow touch!!」
  'exhibition-picture': 'https://www.youtube.com/embed/VgiKP-v1eAY', // 展覧会の絵 - Pictures at an Exhibition
  'showreel': 'https://www.youtube.com/embed/vJ0rJVf2iPk', // Teruaki Tsubokura Showreel
  'vertexceed': 'https://www.youtube.com/embed/8BNKmfBZFEY', // Vertexceed
  'affinbeat-vj': 'https://www.youtube.com/embed/3E8MPlrhrZU', // "Low Pitch" vol.33 × "80KIDZ" DJ TOUR 2013
};

// YouTube動画IDをワークIDから取得する関数
export const getYouTubeUrl = (workId) => {
  return youtubeVideos[workId] || null;
};

// YouTube動画URLがあるか確認する関数
export const hasYouTubeVideo = (workId) => {
  return !!youtubeVideos[workId];
};
