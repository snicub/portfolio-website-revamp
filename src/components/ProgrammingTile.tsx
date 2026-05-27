"use client";

interface ProgrammingTileProps {
  img: string;
  alt?: string;
}

export default function ProgrammingTile({
  img,
  alt = "programming language icon",
}: ProgrammingTileProps) {
  return (
    <div
      className="programming-tile"
      style={{
        display: "flex",
        alignItems: "center",
        paddingLeft: "2rem",
        paddingRight: "2rem",
      }}
    >
      <img
        src={img}
        alt={alt}
        loading="lazy"
        decoding="async"
        height={30}
        style={{ objectFit: "contain", height: 30, width: "auto" }}
      />
    </div>
  );
}
