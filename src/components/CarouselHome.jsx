import React, { useMemo, useState, useEffect } from "react";
import Slider from "react-slick";
import { Box, Typography, Fade, Container, Paper } from "@mui/material";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const API_URL = process.env.REACT_APP_API_URL;

const CarouselHome = () => {
  const [images, setImages] = useState([]);
  const [yearData, setYearData] = useState({ startYear: '', endYear: '', totalYears: 0 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    fetch(`${API_URL}/festival`)
      .then(res => res.json())
      .then(data => {
        let allImages = [];
        let years = data.map(y => y.year).sort();
        data.forEach(({ year, data }) => {
          (data.gallery || []).forEach(item => {
            if (item.type === "image") {
              allImages.push({ ...item, year });
            }
          });
        });
        // Shuffle
        for (let i = allImages.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allImages[i], allImages[j]] = [allImages[j], allImages[i]];
        }
        setImages(allImages.slice(0, 10));
        setYearData({
          startYear: years[0],
          endYear: years[years.length - 1],
          totalYears: years.length,
        });
      });
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    pauseOnHover: true,
    fade: false,
    cssEase: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    beforeChange: (current, next) => setCurrentSlide(next),
    appendDots: (dots) => (
      <Box
        sx={{
          "& ul": {
            display: "flex !important",
            justifyContent: "center",
            gap: 1,
            mt: 3,
            mx: "auto",
            width: "fit-content",
            padding: "0 !important",
            "& li": {
              width: "auto !important",
              height: "auto !important",
              margin: "0 !important",
              "& button": {
                width: "12px !important",
                height: "12px !important",
                borderRadius: "50% !important",
                background: "rgba(25, 118, 210, 0.3) !important",
                border: "2px solid var(--primary-orange) !important",
                transition: "all 0.3s ease !important",
                padding: "0 !important",
                margin: "0 !important",
                "&:before": { display: "none !important" },
                "&:hover": {
                  background: "rgba(25, 118, 210, 0.6) !important",
                },
              },
              "&.slick-active button": {
                background: "var(--primary-orange) !important",
                transform: "scale(1.3) !important",
                boxShadow: "0 0 15px rgba(255,152,0,0.6) !important",
              },
            },
          },
        }}
      >
        <ul>{dots}</ul>
      </Box>
    ),
  };

  const parallaxBg = {
    background: `
      radial-gradient(circle at 20% 20%, rgba(33, 150, 243, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(25, 118, 210, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 60%, rgba(100, 181, 246, 0.05) 0%, transparent 50%),
      linear-gradient(135deg, rgba(33, 150, 243, 0.02) 0%, rgba(25, 118, 210, 0.02) 100%)
    `,
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff9800' fill-opacity='0.03'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
      `,
      opacity: 0.4,
      zIndex: -1,
    },
  };

  return (
    <Box sx={parallaxBg}>
      <Container maxWidth="lg" sx={{ pt: 8, pb: 6 }}>
        {/* Hero Section */}
        <Fade in={isVisible} timeout={1500}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "2.5rem", md: "4rem", lg: "5rem" },
                color: "#333",
                letterSpacing: 3,
                mb: 2,
                position: "relative",
                animation: "heroGlow 3s ease-in-out infinite alternate",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                flexWrap: "wrap",
                gap: 2,
                "@keyframes heroGlow": {
                  "0%": {
                    filter: "drop-shadow(0 0 10px rgba(0,0,0,0.1))",
                    transform: "translateY(0px)",
                  },
                  "100%": {
                    filter: "drop-shadow(0 0 15px rgba(0,0,0,0.15))",
                    transform: "translateY(-5px)",
                  },
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -10,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 100,
                  height: 4,
                  background:
                    "linear-gradient(90deg, transparent, var(--primary-orange), transparent)",
                  borderRadius: 2,
                  animation: "underlineGlow 2s ease-in-out infinite alternate",
                },
                "@keyframes underlineGlow": {
                  "0%": { opacity: 0.5, width: 80 },
                  "100%": { opacity: 1, width: 120 },
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "nowrap",
                }}
              >
                <img
                  src="images/hindu.png"
                  alt="Om Symbol"
                  style={{
                    width: "1em",
                    height: "1em",
                    filter: "drop-shadow(0 0 10px rgba(255,152,0,0.5))",
                  }}
                />
                <span style={{ whiteSpace: "nowrap" }}>TPM</span>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "nowrap",
                }}
              >
                <span style={{ whiteSpace: "nowrap" }}>Ganesh</span>
                <img
                  src="images/hindu.png"
                  alt="Om Symbol"
                  style={{
                    width: "1em",
                    height: "1em",
                    filter: "drop-shadow(0 0 10px rgba(255,152,0,0.5))",
                  }}
                />
              </Box>
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: "var(--accent-maroon)",
                fontWeight: 600,
                mb: 3,
                fontSize: { xs: "1.2rem", md: "1.8rem" },
                animation: "fadeInUp 2s 0.5s both",
                "@keyframes fadeInUp": {
                  "0%": { opacity: 0, transform: "translateY(30px)" },
                  "100%": { opacity: 1, transform: "translateY(0)" },
                },
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Sacred Memories Through Time
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#666",
                fontWeight: 400,
                maxWidth: 600,
                mx: "auto",
                lineHeight: 1.6,
                animation: "fadeInUp 2s 1s both",
                fontSize: { xs: "1rem", md: "1.2rem" },
              }}
            >
              Journey through our cherished Ganesh Chaturthi celebrations from{" "}
              {yearData.startYear} to {yearData.endYear}.<br />
              <strong style={{ color: "var(--primary-orange)" }}>
                Witness devotion, joy, and community spirit come alive!
              </strong>
            </Typography>
          </Box>
        </Fade>

        {/* Main Carousel */}
        <Fade in={isVisible} timeout={2000}>
          <Paper
            elevation={24}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              position: "relative",
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,152,0,0.2)",
              boxShadow: `
                0 20px 40px rgba(0,0,0,0.1),
                0 0 0 1px rgba(255,152,0,0.1),
                inset 0 1px 0 rgba(255,255,255,0.8)
              `,
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background:
                  "linear-gradient(90deg, var(--primary-orange), #FFD700, var(--accent-maroon), var(--primary-orange))",
                backgroundSize: "200% 100%",
                animation: "borderFlow 3s linear infinite",
                zIndex: 10,
                "@keyframes borderFlow": {
                  "0%": { backgroundPosition: "200% 0" },
                  "100%": { backgroundPosition: "-200% 0" },
                },
              },
            }}
          >
            <Box sx={{ p: 3 }}>
              <Slider {...settings}>
                {images.map((img, idx) => (
                  <Box key={idx} sx={{ position: "relative" }}>
                    <Box
                      sx={{
                        position: "relative",
                        borderRadius: 3,
                        overflow: "hidden",
                        height: { xs: 300, md: 450 },
                        background:
                          "linear-gradient(45deg, rgba(33, 150, 243, 0.1), rgba(25, 118, 210, 0.1))",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background:
                            "linear-gradient(transparent 60%, rgba(0,0,0,0.7))",
                          zIndex: 1,
                        },
                      }}
                    >
                      <img
                        src={img.url}
                        alt={`Ganesh Festival ${img.year}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "top",
                          background: "#f5f5f5",
                          transition:
                            "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                          transform:
                            currentSlide === idx ? "scale(1.02)" : "scale(1)",
                          display: "block",
                          margin: "0 auto"
                        }}
                      />

                      {/* Year Badge */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 20,
                          right: 20,
                          zIndex: 2,
                          background: "#333",
                          color: "#fff",
                          px: 3,
                          py: 1,
                          borderRadius: 25,
                          fontWeight: 800,
                          fontSize: "1.1rem",
                          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                          animation: "pulse 2s infinite",
                          "@keyframes pulse": {
                            "0%": {
                              transform: "scale(1)",
                              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                            },
                            "50%": {
                              transform: "scale(1.05)",
                              boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
                            },
                            "100%": {
                              transform: "scale(1)",
                              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                            },
                          },
                        }}
                      >
                        {img.year}
                      </Box>

                      {/* Decorative Elements */}
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 20,
                          left: 20,
                          zIndex: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      ></Box>
                    </Box>
                  </Box>
                ))}
              </Slider>
            </Box>
          </Paper>
        </Fade>

        {/* Decorative Stats Section */}
        <Fade in={isVisible} timeout={2500}>
          <Box sx={{ mt: 6, textAlign: "center" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: { xs: 2, md: 4 },
                flexWrap: "wrap",
              }}
            >
              {[
                {
                  icon: <img src="images/temple.png" alt="Om Symbol" style={{ width: "1.5em", height: "1.5em" }} />,
                  number: yearData.totalYears,
                  label: "Years of Celebration",
                },
                {
                  icon: "📸",
                  number: images.length,
                  label: "Precious Memories",
                },
                { icon: "🎉", number: "∞", label: "Moments of Joy" },
                { icon: "🕉️", number: "1", label: "Divine Blessing" },
              ].map((stat, idx) => (
                <Paper
                  key={idx}
                  elevation={8}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    minWidth: 120,
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.8), rgba(255,255,255,0.6))",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,152,0,0.2)",
                    animation: `statFloat 3s ${
                      idx * 0.2
                    }s infinite ease-in-out`,
                    "@keyframes statFloat": {
                      "0%, 100%": { transform: "translateY(0px)" },
                      "50%": { transform: "translateY(-10px)" },
                    },
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 15px 30px rgba(255,152,0,0.3)",
                      transition: "all 0.3s ease",
                    },
                  }}
                >
                  <Typography variant="h4" sx={{ mb: 1 }}>
                    {stat.icon}
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 900,
                      color: "var(--primary-orange)",
                      mb: 1,
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "var(--accent-maroon)",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default CarouselHome;