import type { NextConfig } from "next";

// GitHub Pages 是專案子路徑（https://<user>.github.io/yijing168/），
// 只在 GitHub Actions 的建置流程中加上 basePath/assetPrefix，
// 本機開發與一般 `next build` 不受影響。
const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const repoName = "yijing168";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGithubActions ? `/${repoName}` : "",
  assetPrefix: isGithubActions ? `/${repoName}/` : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
