// import { useEffect, useState } from "react";
// import { QueryClient, QueryClientProvider } from "react-query";
import { Paper, Grid, Typography, Box, Zoom, Container, useMediaQuery } from "@material-ui/core";
// import { Skeleton } from "@material-ui/lab";
// import { useSelector } from "react-redux";
// import { trim, formatCurrency } from "../../helpers";

// import { useTheme } from "@material-ui/core/styles";
import "./Social.scss";

function Social() {
  // const [data, setData] = useState(null);
  // const [apy, setApy] = useState(null);
  // const [runway, setRunway] = useState(null);
  // // const [staked, setStaked] = useState(null);
  // const theme = useTheme();
  const smallerScreen = useMediaQuery("(max-width: 650px)");
  const verySmallScreen = useMediaQuery("(max-width: 379px)");

  // useEffect(() => {
  // }, []);
  return (
    // <div id="social-view" className={`${smallerScreen && "smaller"} ${verySmallScreen && "very-small"}`}>
    <div id="social-view">
      <Container
        style={{
          paddingLeft: smallerScreen || verySmallScreen ? "0" : "3.3rem",
          paddingRight: smallerScreen || verySmallScreen ? "0" : "3.3rem",
        }}
      >
        <Zoom in={true}>
          <Paper className="ohm-card" style={{ textAlign: "center", border: "1px solid #4c646e85", background: "#131339" }}>
            <Grid container spacing={2} direction="column">
              <Grid item >
                <div className="card-header">
                  <Typography variant="h3">Instagram </Typography>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <div className="twitter-container">
                  <iframe  style={{zIndex:"1"}} width={"100%"} height={"2000px"} allowfullscreen="true"
                  src="https://www.instagram.com/p/CbWO8DerY4i/embed/captioned/?cr=1&v=14&wp=540" />
                </div>
              </Grid>
            </Grid>
          </Paper>
        </Zoom>
        <Zoom in={true} style={{ marginTop: "20px" }}>
          <Paper className="ohm-card" style={{ textAlign: "center", border: "1px solid #4c646e85", background: "#131339" }}>
            <Grid container spacing={2} direction="column">
              <Grid item >
                <div className="card-header">
                  <Typography variant="h3">Twitter </Typography>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <div className="twitter-container">
                  <iframe width={"550px"} height={"817px"} allowfullscreen="true"
                    src="https://platform.twitter.com/embed/Tweet.html?dnt=false&embedId=twitter-widget-0&features=eyJ0ZndfZXhwZXJpbWVudHNfY29va2llX2V4cGlyYXRpb24iOnsiYnVja2V0IjoxMjA5NjAwLCJ2ZXJzaW9uIjpudWxsfX0%3D&frame=false&hideCard=false&hideThread=false&id=1499247884251844608&lang=en" />
                </div>
              </Grid>
            </Grid>
          </Paper>
        </Zoom>
        <Zoom in={true} style={{ marginTop: "20px" }}>
          <Paper className="ohm-card" style={{ textAlign: "center", border: "1px solid #4c646e85", background: "#131339" }}>
            <Grid container spacing={2} direction="column">
              <Grid item >
                <div className="card-header">
                  <Typography variant="h3">Facebook </Typography>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <div className="twitter-container">
                  <iframe width={"300px"} height={"200px"} allowfullscreen="true"
                    src="https://web.skype.com" />
                </div>
              </Grid>
            </Grid>
          </Paper>
        </Zoom>
      </Container>
    </div>
  );
}

export default () => (
  <Social />
);