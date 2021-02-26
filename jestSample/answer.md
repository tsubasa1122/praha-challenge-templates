## 課題３（質問）

### 上記の単体テストを書くためには、依存性の注入とモック化を行う必要がありました。そもそも、なぜ元の関数はカバレッジ 100%のテストを書けなかったのでしょうか？依存性の注入とは何でしょうか？どのような問題を解決するために使われるのでしょうか？依存性の注入を実施することで、モジュール同士の結合度の強さはどのように変化したでしょうか？

- なぜ元の関数はカバレッジ 100%のテストを書けなかったのでしょうか？
  関数の内部で外部のモジュールに依存してしまっていたため、その外部モジュール全体をモック化する必要があり、影響範囲が大きめのテストを書かざる追えなくなった。(クラス全体をモック化する方法はあるので、テストカバレッジ 100%のテストを書けないことはなさそう。[参考](https://jestjs.io/docs/ja/es6-class-mocks))

- 依存性の注入とは何でしょうか？
  デザインパターンの一つで、依存関係にあるクラスやモジュールを使用したい箇所に直接記述するのではなく、外部からオブジェクトを注入する(呼び出し元はインターファイスを提供するだけで良い)ことでモジュール間の結合度を小さくする手法のことです。

  参考：https://qiita.com/ritukiii/items/de30b2d944109521298f

- どのような問題を解決するために使われるのでしょうか？

  - 特定のクラスやモジュールに依存することがなくなる。(特定の振る舞いをするオブジェクトを受け取るインターフェイスを提供するだけになったため。)
  - 依存していたクラスやモジュールの実装がまだでも開発を行うことが出来るようになる。
  - 依存していたクラスやモジュールの差し替えが直接参照するパターンよりも圧倒的に簡単になる。
  - 単体テストを書き易くする。(特定の振る舞いをするオブジェクトをモック化して用意するだけでよくなったため。)

- 依存性の注入を実施することで、モジュール同士の結合度の強さはどのように変化したでしょうか？
  疎結合になった。クラスや関数は依存関係のあるオブジェクトを受け取るインターフェイスを提供するだけになったため、仮に受け取るオブジェクトが変更になった場合でも、内部実装の変更はなくなり、呼び出し元の変更のみでよくなった。

### 今回のような単体テストで外部サービスとの通信が発生すると、どのようなデメリットがあるでしょうか？

- 本来テストしたい内容に注力することが出来ない。外部サービスからのレスポンスを意識しながらテストを書かなければいけなくなるので、本来テストしたい側のメソッドが欲しいデータを用意することが困難になってしまう恐れがある。
- 外部サービスに対して、誤った影響を及ぼしてしまう可能性がある。(例えば、テストで Twitter API を利用していた時にテストの度にツイートをする API を叩いてしまい、メッセージが外部に公開されてしてしまう恐れがあります。)
- 外部サービスの仕様に依存してしまう。(短時間に何度も外部サービスを叩くとレートリミットエラーが起きる。外部サービス側の都合でサービスが止まっていると、それに影響してテストが通らなくなる。)
- 外部サービスとの通信が発生するのでテストが遅くなる。

### sumOfArray に空の配列を渡すと例外が発生します。これは好ましい挙動ではありません。「こうなるべきだ」とご自身が考える形に、コードを修正してみてください

自分は 2 つの実装パターンを思いつきました。実装のシンプルさから上のパターンが好みです。

- 初期値を設定することで、空の配列が入れられると 0 を返すようにします。参考:[MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)

```ts
export const sumOfArray = (numbers: number[]): number => {
  const initialValue = 0;
  return numbers.reduce((a: number, b: number): number => a + b, initialValue);
};
```

- 配列の要素数を確認して、空なら別の値を返すようにします。

```ts
export const sumOfArray = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  return numbers.reduce((a: number, b: number): number => a + b);
};
```

## 課題４（クイズ）

### 以下の 3 つの関数のテストコードを記述してください。

No.1

```ts
export const greet = (name: string) => {
  const hour = new Date().getHours();
  const greetMessage = hour >= 6 && hour < 12 ? 'Good morning' : 'Hello';
  return `${greetMessage} ${name}!`;
};
```

No.2(※実際には DI した方が良さそうだが、今回は外部モジュールをモック化するテストを行いたいので、このままテストを書いてください。)

```ts
import axios from 'axios';

export class Users {
  static all() {
    return axios.get('/users.json').then((resp) => resp.data);
  }
}
```

No.3

```ts
export class WordUpperCase {
  constructor(readonly helloWorld: HelloWorld) {}
  func() {
    return this.helloWorld.wordFunc().toUpperCase();
  }
}

export class HelloWorld {
  wordFunc() {
    return 'hello world.';
  }
}
```

### jest に関するクイズを作成してください

No.1
`mockFn.mockRestore()`はどんなことを行うメソッドでしょうか？

No.2
Promise を返す関数をモック化したい時、戻り値の設定には`mockReturnValue`と`mockResolvedValue`のどちらを使用するべきでしょうか？

No.3
以下のテストブロックの`console.log`の実行順序を教えてください。

```ts
describe('outer', () => {
  console.log('describe outer-a');

  describe('describe inner 1', () => {
    console.log('describe inner 1');
    test('test 1', () => {
      console.log('test for describe inner 1');
      expect(true).toEqual(true);
    });
  });

  console.log('describe outer-b');

  test('test 1', () => {
    console.log('test for describe outer');
    expect(true).toEqual(true);
  });

  describe('describe inner 2', () => {
    console.log('describe inner 2');
    test('test for describe inner 2', () => {
      console.log('test for describe inner 2');
      expect(false).toEqual(false);
    });
  });
});
```
