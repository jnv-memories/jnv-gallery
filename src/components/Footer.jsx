import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-contact">
        <h3>Connect with Us</h3>

        <div className="social-icons">
          <a
            href="mailto:jnv.memories.part02@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Email"
          >
            <img
              loading="lazy"
              src="https://img.icons8.com/fluency/48/000000/new-post.png"
              alt="Email"
            />
          </a>

          <a
            href="https://www.instagram.com/pmshri_jnvnainital.2018/"
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram"
          >
            <img
              loading="lazy"
              src="https://img.icons8.com/fluency/48/000000/instagram-new.png"
              alt="Instagram"
            />
          </a>

          <a
            href="https://github.com/jnv-memories/jnv-gallery"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
          >
            <img
              loading="lazy"
              src="https://img.icons8.com/fluency/48/000000/github.png"
              alt="GitHub"
            />
          </a>

          <a
            href="https://www.youtube.com/@PM.Shri_UdayagiriNTL"
            target="_blank"
            rel="noopener noreferrer"
            title="YouTube"
          >
            <img
              loading="lazy"
              src="https://img.icons8.com/fluency/48/000000/youtube-play.png"
              alt="YouTube"
            />
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} JNV Memories. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
