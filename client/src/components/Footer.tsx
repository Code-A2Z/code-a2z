import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-copy">
          © {new Date().getFullYear()} Code A2Z
        </p>

        <ul className="footer-links">
          <li><a href="/about">About</a></li>
          <li><a href="/blog">Blog</a></li>
          <li>
            <a
              href="https://github.com/Code-A2Z"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </li>
          <li><a href="/contact">Contact</a></li>
        </ul>

        <div className="footer-socials">
          <a
            href="https://github.com/Code-A2Z"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            X
          </a>
        </div>

        <p className="footer-credit">
          Built with ❤️ by Code A2Z
        </p>
      </div>
    </footer>
  );
}
