import { Button, Container } from "@mui/material";

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
      <Button
        variant="contained"
        color="success"
        sx={{ fontSize: "16px" }}
        onClick={handleShowMore}
      >
        Show More
      </Button>
    </Container>
  ) : null;

export default ShowMoreButton;
