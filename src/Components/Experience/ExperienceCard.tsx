// interface for props of the experience card
interface ExperienceCardProps {
  company?: string; // optional company name
  img: string; // image url
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
      <img src={img} style={{ objectFit: "contain", maxWidth: "70px" }}></img>
    </div>
  );
}

export default ExperienceCard;
