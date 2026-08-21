# 朱兴福的个人空间

一个使用 Next.js 构建的个人博客与作品集网站。网站包含 3D 键盘交互、项目展示、文章发布、访客留言和私有后台；文章与留言存储在 SQLite 数据库中，可通过 Docker 部署到自己的服务器。

## 功能

- 3D 键盘主页与季节主题切换
- 中英文界面
- 项目展示与截图轮播
- 文章列表、文章详情与 Markdown 正文
- 访客留言
- 私有后台：发布、编辑、删除文章和管理留言
- SQLite 持久化存储
- Docker Compose 部署与自动重启

## 技术栈

| 用途 | 技术 |
| --- | --- |
| 框架 | Next.js 16、React 19、TypeScript |
| 3D | Three.js、React Three Fiber、drei |
| 样式 | Tailwind CSS 4 |
| 数据库 | SQLite、better-sqlite3 |
| 动画 | Lenis |
| 部署 | Docker、Docker Compose |

## 本地运行

需要 Node.js 22 或更高版本。

```bash
git clone https://github.com/zzdfl6661/3d-portfolio.git
cd 3d-portfolio
npm install
```

创建 `.env` 文件：

```env
ADMIN_PASSWORD=change-this-to-a-strong-password
ADMIN_SECRET=replace-with-a-long-random-secret
# 可选；默认使用 ./data/site.db
SQLITE_PATH=
```

启动开发服务器：

```bash
npm run dev
```

访问 `http://localhost:3000`。后台地址为 `http://localhost:3000/admin`。

## Docker 部署

项目包含生产环境 Dockerfile 和 Compose 配置。

```bash
git clone https://github.com/zzdfl6661/3d-portfolio.git
cd 3d-portfolio
```

在项目根目录创建 `.env`：

```env
ADMIN_PASSWORD=change-this-to-a-strong-password
ADMIN_SECRET=replace-with-a-long-random-secret
```

创建数据库目录并启动：

```bash
mkdir -p data
sudo chown -R 1001:1001 data

# Docker Compose v2
docker compose up -d --build

# 如果服务器安装的是旧版 Compose，使用：
# sudo docker-compose up -d --build
```

Compose 会将服务器的 `3000` 端口映射到容器，并把 `./data` 挂载为持久化目录。首次启动会自动创建 `data/site.db` 和初始文章。

## 更新网站

代码修改并推送到 GitHub 后，在服务器项目目录执行：

```bash
git pull
sudo docker-compose up -d --build
```

查看运行状态与日志：

```bash
sudo docker-compose ps
sudo docker-compose logs -f web
```

## 数据与备份

文章和访客留言都保存在 `data/site.db`。该目录已被 Git 忽略，不能提交到公开仓库。

备份数据库时，先停止网站以避免复制到正在写入的文件：

```bash
sudo docker-compose stop web
cp data/site.db data/site.db.backup
sudo docker-compose start web
```

请将备份保存到服务器之外的可靠位置。

## 项目结构

```text
app/                 页面与 API 路由
components/          UI、3D 场景和交互组件
lib/                 数据库、认证、国际化与站点数据
public/              公开静态资源与项目截图
data/                SQLite 数据库（不提交到 Git）
Dockerfile           生产镜像构建配置
docker-compose.yml   Docker Compose 部署配置
```

## 开源注意事项

- 不要提交 `.env`、`data/site.db`、备份文件或任何访问令牌。
- 部署前必须设置 `ADMIN_PASSWORD` 和 `ADMIN_SECRET`；未配置密码时后台会拒绝登录。
- 公开项目截图前，请确认不含客户数据、后台数据或未经授权的素材。

## License

本项目采用 [MIT License](LICENSE) 开源。
