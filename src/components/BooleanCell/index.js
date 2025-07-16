import { Box, Chip } from "@mui/material";

export const BooleanCell = ({ value }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {value ? (
      <Chip label="Sim" color="success" size="small" />
    ) : (
      <Chip label="Não" color="default" size="small" />
    )}
  </Box>
);
