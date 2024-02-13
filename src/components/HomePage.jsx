import {
  Box,
  Button,
  Container,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState } from "react";

const HomePage = () => {
  const baseURL = "https://35d4-59-103-208-31.ngrok-free.app/";
  const [formValue, setFormValue] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [data, setData] = useState();

  const handleChange = (event) => {
    setFormValue(event.target.value);

    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageBase64(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      image: imageBase64,
      model: formValue.toString(),
    });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        // "https://35d4-59-103-208-31.ngrok-free.app/predict",
        `${baseURL}predict`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();

      setData(result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Container>
      <Box
        mt={5}
        width="100%"
        sx={{
          gap: 3,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant={"h4"} sx={{ fontWeight: 500 }}>
          Title
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Box mt={6}>
              <input
                id="fileInput"
                name="image"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleChange}
              />
              <label htmlFor="fileInput">
                <Button variant="contained" component="span">
                  Upload Image
                </Button>
              </label>
            </Box>
            <Box
              sx={{
                minWidth: 120,
                mt: 5,
              }}
            >
              <FormControl sx={{ width: "250px" }}>
                <InputLabel id="demo-simple-select-label">Select</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={formValue}
                  label="Select"
                  name="selectItem"
                  onChange={(e) => setFormValue(e.target.value)}
                >
                  <MenuItem value={1}>Vagg-16</MenuItem>
                  <MenuItem value={2}>Ren-S50</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {/* <Box>{data}</Box> */}
            <Box display="flex" sx={{ gap: 13 }}>
              <Box display="flex">
                {imageBase64 ? (
                  <img
                    src={imageBase64}
                    alt="img"
                    style={{
                      height: "200px",
                      width: "250px",
                      border: "1px dashed black",
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: "200px",
                      width: "250px",
                      border: "1px dashed black",
                    }}
                  />
                )}
              </Box>
              <Box>
                <Box display="flex" flexDirection="column" gap={3}>
                  <TextField
                    label="Confidence"
                    id="filled-size-normal"
                    value={data ? data.confidence : ""}
                    variant="filled"
                  />
                  <TextField
                    label="Prediction"
                    id="filled-size-normal"
                    value={data ? data.predicted_class : ""}
                    variant="filled"
                  />
                </Box>
              </Box>
            </Box>
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default HomePage;
