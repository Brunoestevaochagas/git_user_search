import ReactLoading from "react-loading";

export const Loading = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "100%",
        alignItems: "center",
      }}
    >
      <ReactLoading type="bubbles" color="green" height={48} width={48} />
    </div>
  );
};
