# TODO リスト課題 - 実行方法のご案内

このリポジトリは、React（フロントエンド）＋ ASP.NET Core C#（バックエンド）＋ PostgreSQL（データベース）で構成された TODO リスト課題です。

## プロジェクト構成

root/
├── client/ # React フロントエンド
├── server/ # ASP.NET Core バックエンド
└── README.md

## 使用技術

| 区分           | 技術                                  |
| -------------- | ------------------------------------- |
| フロントエンド | React (Vite), TypeScript, Axios       |
| バックエンド   | ASP.NET Core Web API (C#)             |
| データベース   | PostgreSQL                            |
| ホスティング   | Microsoft Azure（開発はローカル実行） |

## 実行手順

### 1. 事前準備

- Node.js ≥ 18.x
- .NET SDK ≥ 8.0
- PostgreSQL をインストール（例：port 5432 / DB 名: ToDo / ユーザー: postgres / パスワード: \*\*\*）
- Visual Studio または VSCode

### 2. データベース作成

```sql
-- PostgreSQLにて実行
CREATE DATABASE "ToDo";

-- テーブル作成例
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  content VARCHAR(100) NOT NULL,
  status VARCHAR(10) NOT NULL,
  due_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. バックエンドの起動

bash
cd server
dotnet restore
dotnet run

- デフォルトポート: http://localhost:5000
- API 例: GET /api/todo

### 4. フロントエンドの起動

bash
cd client
npm install
npm run dev

- ブラウザアクセス: http://localhost:5173

### 5. 環境変数ファイル設定（.env）

それぞれ client / server に .env を用意してください。

#### client/.env

VITE_API_BASE_URL=http://localhost:5000/api/todo

#### server/appsettings.json（または secrets）

json
{
"ConnectionStrings": {
"DefaultConnection": "Host=localhost;Port=5432;Database=ToDo;Username=postgres;Password=パスワード"
}
}

## 基本機能一覧

- TODO の登録（内容 + 予定日）
- 完了／未完了のステータス切り替え
- フィルター機能（全件／完了のみ／未完了のみ）
- 編集・削除機能
- すべてのデータはデータベースに永続化されます
- 論理削除は使用せず、物理削除で実装しています

## 備考

- API 通信には axios を使用しています
- 日付選択は DatePicker を利用
- 状態管理は React の useState / useEffect フックを使用
