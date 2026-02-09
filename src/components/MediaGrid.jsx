import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./MediaGrid.css";

const BATCH_SIZE = 20;

export default function MediaGrid({ files, folder }) {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300;

      if (nearBottom) {
        setVisibleCount(prev =>
          Math.min(prev + BATCH_SIZE, files.length)
        );
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [files.length]);

  return (
    <div className="media-grid">
      {files.slice(0, visibleCount).map(file => (
        <div
          key={file.id}
          className="media-item"
          onClick={() =>
            navigate(`/${folder.route}/${file.id}`)
          }
        >
          <div className="thumbnail-wrapper">
            <img
              src={file.thumbnailLink}
              alt={file.name}
              loading="lazy"
              onLoad={e =>
                e.currentTarget.classList.add("loaded")
              }
            />
          </div>

          <div className="media-name" title={file.name}>
            {file.name}
          </div>
        </div>
      ))}
    </div>
  );
}
