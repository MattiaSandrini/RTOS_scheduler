import "./menu.css";

export default function navBar() {
  return (
    <>
      <nav className="topbar">
        <div className="topbar-inner">
          <span className="topbar-label">links</span>
          <ul className="topbar-links">
            <li>
              <a href="https://github.com" target="_blank">
                Issue page
              </a>
            </li>
            <li>
              <a href="https://github.com" target="_blank">
                Repo github with source code
              </a>
            </li>
            <li>
              <a href="https://github.com" target="_blank">
                other scheduler made with js
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
