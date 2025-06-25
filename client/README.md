■ TODO の登録処理について
■ 使用技術スタック

- フロントエンド:

  - React
  - Vite
  - JavaScript
  - axios

- バックエンド:

  - ASP.NET Core（C#）
  - RESTful API 設計（POST / GET / PUT / DELETE）

- データベース:

  - PostgreSQL

- ユーザーがフォームに内容と予定日を入力し、登録ボタンを押すと、
  React から ASP.NET API へ POST リクエストが送信される。
- API は受け取ったデータを元に、データベースの`todos`テーブルに新規登録を行う。
  この際、ID は自動採番され、状態は初期値「未完了」、作成日時・更新日時はサーバー時刻が設定される。
- 登録されたデータは API レスポンスとしてフロントエンドに返却され、即時表示される。
