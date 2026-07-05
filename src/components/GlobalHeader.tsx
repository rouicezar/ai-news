import { PenLine, Search, UserCircle } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import type { User } from "../types/content";

interface GlobalHeaderProps {
  currentUser: User | null;
  onLogout: () => void;
}

const navItems = [
  { label: "首页", to: "/" },
  { label: "全球 AI 新闻", to: "/news" },
  { label: "AI 工具技巧", to: "/tips" },
  { label: "写稿台", to: "/draft-news" },
  { label: "热榜", to: "/hot" },
  { label: "收藏", to: "/me/bookmarks" },
];

export function GlobalHeader({ currentUser, onLogout }: GlobalHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="global-header">
      <div className="container header-inner">
        <NavLink className="brand" to="/">
          <span className="brand-mark">AD</span>
          <span>AI Dispatch</span>
        </NavLink>
        <nav className="main-nav" aria-label="主导航">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? "nav-item nav-item--active" : "nav-item")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <button className="icon-action" type="button" aria-label="搜索">
            <Search aria-hidden="true" size={18} />
          </button>
          <button className="submit-action" type="button" onClick={() => navigate("/submit")}>
            <PenLine aria-hidden="true" size={16} />
            投稿
          </button>
          {currentUser ? (
            <div className="account-cluster">
              <button
                className="icon-action"
                type="button"
                aria-label="我的主页"
                onClick={() => navigate(`/u/${currentUser.username}`)}
              >
                <UserCircle aria-hidden="true" size={20} />
              </button>
              <button className="text-button" type="button" onClick={onLogout}>
                退出
              </button>
            </div>
          ) : (
            <button className="secondary-button" type="button" onClick={() => navigate("/login")}>
              登录
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
