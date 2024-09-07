interface ProgrammingTileProps {
  img: string;
}

function ProgrammingTile({ img }: ProgrammingTileProps) {
  return (
    <div
      className="programming-tile"
      style={{
        display: "flex",
        alignItems: "center",
        paddingLeft: "2rem  ",
        paddingRight: "2rem  ",
      }}
    >
      <img
        src={img}
        alt="progamming language icon"
        style={{ objectFit: "contain" }}
        height={30}
      ></img>
    </div>
  );
}

export default ProgrammingTile;
