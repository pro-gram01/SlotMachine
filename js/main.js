'use strict';
{
  class Panel {
    // 要素の生成
    constructor() {
      // section要素作成(コンストラクタの中でしか使わないため定数で定義)
      const section = document.createElement('section');
      section.classList.add('panel');

      // img要素の作成
      this.img = document.createElement('img');
      // リロードするごとに画像がランダムに表示される
      this.img.src = this.getRandomImage();
      // 最初は値が決まっていないためundefinedとする
      this.timeoutId = undefined;

      // stop要素の作成
      this.stop = document.createElement('div');
      this.stop.textContent = 'STOP';
      // stopボタンが押せないよう、あらかじめinactiveクラスをつけておく
      this.stop.classList.add('stop', 'inactive');
      //stopボタンクリックイベント
      this.stop.addEventListener('click', () => {
        // stop要素にinactiveクラスがついていたら処理を止める
        if (this.stop.classList.contains('inactive')) {
          return;
        }
        this.stop.classList.add('inactive');
        // SetTimeoutを止めるためclearTimeoutメソッドを実行
        clearTimeout(this.timeoutId);

        //ストップボタンを押すたびにpanelsLeftをデクリメント
        panelsLeft--;
        // panelsLeftが0になったらcheckResultメソッドでパネル同士のチェック
        if (panelsLeft === 0) {
          // パネル同士の比較
          checkResult();
          //  動いているパネル枚数が0になったら、spinボタンを動かしたいので、
          //  panelsLeftが0になったらspin要素からinactiveを外す
          spin.classList.remove("inactive");
          panelsLeft = 3;
        }
      });

      // imgとstopをsectionの子要素として追加
      section.appendChild(this.img);
      section.appendChild(this.stop);

      // mainを取得(定数)
      const main = document.querySelector('main');
      //mainに対しsectionを追加
      main.appendChild(section);
    }

    getRandomImage() {
      // 選ぶ対象となる画像を配列で定義
      const images = ['img/seven.png', 'img/bell.png', 'img/cherry.png'];
      // images内のランダムな要素を返す
      return images[Math.floor(Math.random() * images.length)];
    }

    spin() {
      // ランダムでimg要素を取得する(50ミリ秒ごと)
      this.img.src = this.getRandomImage();
      // setTimeout()の返り値にtimeoutIdを設定
      this.timeoutId = setTimeout(() => {
        this.spin();
      }, 50);
    }

    // マッチしなかった2枚のパネルはp1とp2で受け取り比較する
    isUnmatched(p1, p2) {
      // if (this.img.src !== p1.img.src && this.img.src !== p2.img.src) {
      //   return true;
      // } else {
      //   return false;
      // }

      // imgのsrcプロパティが他のimgのsrcプロパティと異なっている場合にtrue、
      // そうでなかったらfalseを返す
      return this.img.src !== p1.img.src && this.img.src !== p2.img.src;
    }

    // imgに対してunmatchedクラスをつける(パネルを薄くする)
    unmatch() {
      this.img.classList.add('unmatched');
    }
    // imgからunmatched、inactiveクラスを外す(パネルが薄くならないようにする)
    activate() {
      this.img.classList.remove('unmatched');
      this.stop.classList.remove('inactive');
    }
  }

  // パネル同士の比較
  function checkResult() {
    if (panels[0].isUnmatched(panels[1], panels[2])) {
      //1枚目が一致しない場合
      panels[0].unmatch();
    }
    if (panels[1].isUnmatched(panels[0], panels[2])) {
      //2枚目が一致しない場合
      panels[1].unmatch();
    }
    if (panels[2].isUnmatched(panels[0], panels[1])) {
      //3枚目が一致しない場合
      panels[2].unmatch();
    }
  }

  // panels配列を作成し、3つのPanelインスタンスを作成(パネルが3枚のため)
  const panels = [new Panel(), new Panel(), new Panel()];

  // あといくつパネルが残っているかを変素で保持
  let panelsLeft = 3;

  // spinボタンクリックイベント
  //spin要素を取得する
  const spin = document.getElementById('spin');
  spin.addEventListener('click', () => {
    //spin要素にinactiveがついていたら処理を止める
    if (spin.classList.contains("inactive")) {
      return;
    }
    spin.classList.add("inactive");

    // spinボタンをクリックしたらパネル要素を一つ一つ受け取って次の処理をする
    panels.forEach((panel) => {
      // activateメソッド参照
      panel.activate();
      // spinメソッド参照
      panel.spin();
    });
  });
}
