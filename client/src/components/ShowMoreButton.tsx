import { Container } from "@mui/material";

interface ShowMoreButtonProps {
  handleShowMore: () => void;
  hasMore: boolean;
}

const ShowMoreButton: React.FC<ShowMoreButtonProps> = ({
  handleShowMore,
  hasMore,
}) =>
  hasMore ? (
    <Container maxWidth="md">
      <button onClick={handleShowMore} style={buttonStyle}>
        Show More
      </button>
    </Container>
  ) : null;

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  backgroundColor: "#28A745",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "20px",
};

export default ShowMoreButton;
