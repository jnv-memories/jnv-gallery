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
      { root: null, rootMargin: "300px", threshold: 0 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [files.length]);

  return (
    <>
      <div className="media-grid">
        {files.slice(0, visibleCount).map((file, idx) => {
          const isVideo = file.mimeType?.startsWith("video/");
          const isFeatured = idx === 0;

          return (
            <div
              key={file.id}
              className={[
                "media-item",
                isVideo ? "media-item--video" : "media-item--image",
                isFeatured ? "media-item--featured" : ""
              ].join(" ")}
              onClick={() => navigate(`/albums/${folder.route}/${file.id}`)}
            >
              <div className="thumbnail-wrapper">
                <img
                  src={file.thumbnailLink}
                  alt={file.name}
                  loading={idx < 4 ? "eager" : "lazy"}
                  onLoad={e => e.currentTarget.classList.add("loaded")}
                />
                {isVideo && (
                  <div className="video-badge">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="media-name" title={file.name}>
                {file.name}
              </div>
            </div>
          );
        })}
      </div>

      {visibleCount < files.length && (
        <div ref={loadMoreRef} className="load-more-trigger" />
      )}
    </>
  );
}
