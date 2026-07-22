import { Card, CardActionArea, CardContent, Typography } from "@mui/material";

export default function DashboardCard({
  title,
  subtitle,
  onClick,
}) {
  return (
    <Card
      elevation={4}
      sx={{
        borderRadius: 3,
        height: 170,
      }}
    >
      <CardActionArea
        sx={{ height: "100%" }}
        onClick={onClick}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            align="center"
          >
            {title}
          </Typography>

          <Typography
            align="center"
            sx={{ mt: 2 }}
          >
            {subtitle}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}