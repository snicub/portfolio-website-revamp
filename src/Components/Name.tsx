const Name = (): JSX.Element => {
  return (
    <div
      className="name-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "2rem",
        textAlign: "center",
      }}
    >
      <div className="name">daniel han</div>
    </div>
  );
};

export default Name;
