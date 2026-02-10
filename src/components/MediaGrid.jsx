import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./MediaGrid.css";

const BATCH_SIZE = 20;

export default function MediaGrid({ files, folder }) {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setVisibleCount(prev =>
            Math.min(prev + BATCH_SIZE, files.length)
          );
        }
      },
      {
        root: null,
        rootMargin: "300px",
        threshold: 0
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [files.length]);

  return (
    <>
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

      {/* 👇 observer trigger */}
      {visibleCount < files.length && (
        <div ref={loadMoreRef} className="load-more-trigger" />
      )}
    </>
  );
}
