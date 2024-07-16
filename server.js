const express = require("express");
const bodyParser = require("body-parser");
const { main } = require("./service");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/apply", async (req, res) => {
  const { profile, interest, proficiency } = req.body;
  let userData = {
    College: "University of Engineering and Management, Kolkata",
    Degree: "Bachelor of Technology (B.Tech)",
    Stream: "CSE AIML",
    Percentage: "91",
    Training: "Data Structures and Algorithms, Web Development",
    Organization: "Call For Referral",
    description:
      "Call For Referral is an early stage startup where I have done 3months of frontend internship in Nextjs and have learned a lot of things about web developement..",
    link: "https://github.com/PalashCoder",
    hiringReason:
      "Over the past few years, I have acquired relevant skills and experience, which I shall bring to your organization. I have also worked tirelessly on my communication abilities and teamwork skills, which I will put to use in my future career, which would be in your organization if I am selected for the position.",
    availability: "Yes, I will be available",
    rating: "4.1",
    Cyear: 2021,
  };
  res.send("Applications process started!");
  await main(userData, process.env.EMAIL, process.env.PASSWORD);
  console.log(process.env.EMAIL + "<next>" + process.env.PASSWORD);
  res.send("Applications submitted!");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
