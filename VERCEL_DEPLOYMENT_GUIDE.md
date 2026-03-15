# 茯忆长安宣传网页 - Vercel 部署指南

## 📋 部署方式选择

Vercel 提供两种部署方式，您可以根据需求选择：

### 方式一：通过 Vercel 官网部署（推荐，最简单）⭐
### 方式二：通过 Vercel CLI 部署（适合开发者）

---

## 🚀 方式一：Vercel 官网部署（推荐）

### 步骤 1：准备 GitHub 账号
1. 访问 [GitHub](https://github.com/) 并登录（如果没有账号，先注册一个）
2. 如果没有 GitHub 账号，访问 [GitHub 注册页面](https://github.com/signup)

### 步骤 2：创建 GitHub 仓库
1. 登录 GitHub 后，点击右上角的 **"+"** → **"New repository"**
2. 填写仓库信息：
   - Repository name: `fuyichangan-promo`（或其他您喜欢的名字）
   - 选择 **Public**（公开）或 **Private**（私有）
   - 点击 **"Create repository"**

### 步骤 3：上传项目文件
1. 在新创建的仓库页面，点击 **"uploading an existing file"**
2. 将以下文件拖拽到上传区域：
   - `new-promo.html`（主网页文件）
   - `logo.png`
   - `home.png`
   - `ai.jpg`
   - `智能化发花装置 2.0.jpg`
   - `vercel.json`（配置文件）
3. 点击 **"Commit changes"** 提交文件

### 步骤 4：连接 Vercel
1. 访问 [Vercel 官网](https://vercel.com/)
2. 点击 **"Sign Up"** 或 **"Login"**
3. 选择 **"Continue with GitHub"** 使用 GitHub 账号登录

### 步骤 5：导入项目
1. 登录后，点击 **"Add New..."** → **"Project"**
2. 在 **"Import Git Repository"** 页面，找到您刚创建的仓库 `fuyichangan-promo`
3. 点击 **"Import"**

### 步骤 6：部署配置
1. **Framework Preset**: 选择 `Other`
2. **Build Command**: 留空（不需要）
3. **Output Directory**: 留空（默认为根目录）
4. **Install Command**: 留空（不需要）

### 步骤 7：部署
1. 点击 **"Deploy"** 按钮
2. 等待部署完成（通常 1-2 分钟）
3. 部署成功后，您会看到一个预览链接

### 步骤 8：访问网站
1. 点击 **"Visit"** 按钮访问您的网站
2. 您会获得一个免费的 Vercel 域名，格式为：
   ```
   https://fuyichangan-promo.vercel.app
   ```

### 步骤 9：自定义域名（可选）
1. 在 Vercel 项目页面，点击 **"Settings"** → **"Domains"**
2. 添加您自己的域名（如果您有的话）
3. 按照提示配置 DNS 解析

---

## 💻 方式二：Vercel CLI 部署

### 前提条件
- 已安装 Node.js（版本 12 或更高）
- 已安装 Git

### 步骤 1：安装 Vercel CLI
打开命令提示符或 PowerShell，运行：
```bash
npm install -g vercel
```

### 步骤 2：登录 Vercel
```bash
vercel login
```
选择 `GitHub` 登录方式，按照提示完成登录。

### 步骤 3：初始化项目
在项目文件夹 (`c:\Users\Lenovo\Desktop\3.0`) 打开命令提示符，运行：
```bash
vercel
```

### 步骤 4：按照提示操作
1. **Set up and deploy?** 输入 `Y`
2. **Which scope?** 选择您的账号（按回车）
3. **Link to existing project?** 输入 `N`
4. **What's your project's name?** 输入 `fuyichangan-promo`
5. **In which directory is your code located?** 输入 `./`
6. **Want to override the settings?** 输入 `N`

### 步骤 5：部署
```bash
vercel --prod
```

### 步骤 6：获取部署链接
部署完成后，您会看到类似这样的输出：
```
🔍  Inspect: https://vercel.com/your-account/fuyichangan-promo/xxxxx
✅  Production: https://fuyichangan-promo.vercel.app
```

---

## 📁 项目文件清单

确保以下文件都已上传到 GitHub：

```
fuyichangan-promo/
├── new-promo.html          ← 主网页文件（必须）
├── logo.png                ← Logo 图片（必须）
├── home.png                ← 背景图片（必须）
├── ai.jpg                  ← AI 相关图片（可选）
├── 智能化发花装置 2.0.jpg    ← 产品图片（必须）
└── vercel.json             ← Vercel 配置文件（必须）
```

---

## ⚙️ Vercel 配置文件说明

已为您创建 `vercel.json` 配置文件，包含：
- 静态资源配置
- 默认首页设置为 `new-promo.html`
- 所有静态资源（图片、CSS、JS）的正确处理

---

## 🔧 常见问题

### Q1: 部署后页面显示 404？
**解决方案**：
- 确保 `new-promo.html` 文件存在
- 检查 `vercel.json` 配置是否正确
- 确认所有文件都在根目录

### Q2: 图片无法加载？
**解决方案**：
- 检查文件名是否正确（包括大小写）
- 确保图片文件已上传到 GitHub
- 清除浏览器缓存后重试

### Q3: 样式显示不正常？
**解决方案**：
- Font Awesome 图标库需要联网才能加载
- 检查网络连接是否正常
- 等待 Vercel CDN 完全同步（通常几分钟）

### Q4: 如何更新网站内容？
**解决方案**：
1. 在 GitHub 上修改文件并提交
2. 或使用 Git 推送更新：
   ```bash
   git add .
   git commit -m "更新内容"
   git push
   ```
3. Vercel 会自动检测并重新部署（约 1-2 分钟）

---

## 🎉 部署成功！

部署完成后，您将获得：
- ✅ 免费的 HTTPS 加密网站
- ✅ 全球 CDN 加速
- ✅ 自动部署（每次推送到 GitHub 自动更新）
- ✅ 免费域名：`https://your-project.vercel.app`
- ✅ 可绑定自定义域名

---

## 📞 技术支持

如遇到问题，可以：
1. 查看 [Vercel 官方文档](https://vercel.com/docs)
2. 访问 [Vercel 社区](https://github.com/vercel/vercel/discussions)
3. 检查 Vercel 状态：[status.vercel.com](https://status.vercel.com/)

---

**祝您部署成功！** 🎊
