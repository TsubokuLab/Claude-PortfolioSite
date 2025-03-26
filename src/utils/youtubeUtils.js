// YouTube動画URLとIFrameを生成するユーティリティ

// タイトルとYouTubeのURLをマッピングするデータ
const youtubeVideos = {
  // YouTube動画タイトルと動画ID/URLのマッピング
  "展覧会の絵": "VgiKP-v1eAY",
  "幻想シアター": "2BZWDB1Wybg",
  "Fantasy Theater": "2BZWDB1Wybg",
  "インタラクティブフォトブース": "tN-4lfNd03s", 
  "Interactive Photo Booth": "79XoaM0g6GM",
  "VERTEX": "0BXC4zWWILQ",
  "VRバトロワFPS": "0BXC4zWWILQ",
  "void Sailing": "WpcsiyDJCCA",
  "空想ジオラマ": "37b7BvevVHg",
  "Fantasy Diorama": "37b7BvevVHg",
  "不可視彫像": "kZ3skQQuiio",
  "Invisible Sculpture": "kZ3skQQuiio",
  "Dreaming Frame": "-1uGWBb18oI",
  "ゆめみるがくぶち": "-1uGWBb18oI",
  "During the Night": "jF-yFJL_OvI",
  "よるのあいまに": "jF-yFJL_OvI",
  "Achromatic World": "b1KrNsZEFic",
  "いろのないせかい": "b1KrNsZEFic",
  "Myハチ公": "ckEPVmK6jlQ",
  "My Hachiko": "ckEPVmK6jlQ",
  "Delta Glass": "bxL1s7jAme8",
  "Happy Pain": "5D7t_ZMKlqU",
  "陣痛共有デバイス": "5D7t_ZMKlqU",
  "運命的アクシデント": "LRUIMVWHGjk",
  "Vertexceed": "8BNKmfBZFEY",
  "Air Floating NUI": "NPN8cQ8nJYA",
  "エア・フローティング・メディア": "NPN8cQ8nJYA",
  "つくもがみ": "a3aPQhmcHTE",
  "Tsukumogami": "a3aPQhmcHTE",
  "ミライノピアノ": "a-3r3LKW_Sw",
  "MIRAINO PIANO": "a-3r3LKW_Sw",
  "七色小道": "bhh49HVHWOA",
  "NANAIRO KOMICHI": "bhh49HVHWOA",
  "インタラクティブお葬式": "QYOD_zfRwCs",
  "Interactive Funeral": "QYOD_zfRwCs",
  "石畳燈籠": "uOKt8ioa614",
  "Shadow touch": "3itekp9YaAs"
};

// 作品タイトルからYouTube動画IDを取得する関数
export const getYouTubeIdByTitle = (title) => {
  if (!title) return null;
  
  // 完全一致チェック
  if (youtubeVideos[title]) {
    return youtubeVideos[title];
  }
  
  // 部分一致チェック (タイトルに特定のキーワードが含まれているか)
  for (const [key, id] of Object.entries(youtubeVideos)) {
    // キーワードがタイトルに含まれているかチェック
    if (title.toLowerCase().includes(key.toLowerCase())) {
      return id;
    }
  }
  
  return null;
};

// レスポンシブなYouTube埋め込みコンポーネント用のスタイル
export const youtubeEmbedStyles = {
  container: {
    position: 'relative',
    width: '100%',
    paddingBottom: '56.25%', // 16:9 アスペクト比
    height: 0,
    overflow: 'hidden',
    maxWidth: '100%',
  },
  iframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 0,
  }
};
