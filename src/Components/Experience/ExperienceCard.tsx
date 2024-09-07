interface ExperienceCardProps {
  company?: string;
  img: string;
}

function ExperienceCard({ company, img }: ExperienceCardProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="image-wrapper"></div>
      <img src={img} style={{ objectFit: "contain", maxWidth: "70px" }}></img>
    </div>
  );
}

export default ExperienceCard;
