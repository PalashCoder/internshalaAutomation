const puppeteer = require("puppeteer");

async function main(data, id, pass) {
  let browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    args: ["--start-maximized"],
  });

  let pages = await browser.pages();
  let tab = pages[0];
  await tab.goto("https://internshala.com/");
  await tab.click(".login-cta");
  await tab.type("#modal_email", id);
  await tab.type("#modal_password", pass);
  await tab.click("#modal_login_submit");

  await tab.waitForNavigation({ waitUntil: "networkidle2" });
  await tab.click(".nav-link.dropdown-toggle.profile_container");

  let profile_options = await tab.$$(".profile_options a");
  let app_urls = [];
  for (let i = 0; i < profile_options.length; i++) {
    let url = await tab.evaluate(function (ele) {
      return ele.getAttribute("href");
    }, profile_options[i]);
    app_urls.push(url);
  }
  await new Promise(function (resolve) {
    setTimeout(resolve, 2000);
  });
  await tab.goto("https://internshala.com" + app_urls[3]);

  await tab.click("#education");
  await tab.waitForSelector("#graduation-tab .ic-16-plus", { visible: true });
  await tab.click("#graduation-tab .ic-16-plus");
  // console.log(tab + "<>" + data);
  await graduation(data, tab);

  await new Promise(function (resolve) {
    setTimeout(resolve, 1000);
  });

  await tab.waitForSelector(".next-button", { visible: true });
  await tab.click(".next-button");

  await training(data, tab);

  await new Promise(function (resolve) {
    setTimeout(resolve, 1000);
  });

  await tab.waitForSelector(".next-button", { visible: true });
  await tab.click(".next-button");

  await tab.waitForSelector(".btn.btn-secondary.skip.skip-button", {
    visible: true,
  });
  await tab.click(".btn.btn-secondary.skip.skip-button");

  await workSample(data, tab);

  await new Promise(function (resolve) {
    setTimeout(resolve, 1000);
  });

  await tab.waitForSelector("#save_work_samples", { visible: true });
  await tab.click("#save_work_samples");

  await new Promise(function (resolve) {
    setTimeout(resolve, 1000);
  });
  await application(data, tab);

  await browser.close();
}

async function graduation(data, tab) {
  // await tab.waitForSelector("#degree_completion_status_pursuing", {
  //   visible: true,
  // });
  // await tab.click("#degree_completion_status_pursuing");

  await tab.waitForSelector("#college", { visible: true });
  await new Promise(function (resolve) {
    setTimeout(resolve, 1000);
  });
  await tab.type("#college", data.College);

  await tab.waitForSelector("#start_year_chosen", { visible: true });
  await tab.click("#start_year_chosen");
  await tab.waitForSelector(".active-result[data-option-array-index='5']", {
    visible: true,
  });
  await tab.click(".active-result[data-option-array-index='5']");

  await tab.waitForSelector("#end_year_chosen", { visible: true });
  await tab.click("#end_year_chosen");
  await tab.waitForSelector(
    "#end_year_chosen .active-result[data-option-array-index = '6']",
    { visible: true }
  );
  await tab.click(
    "#end_year_chosen .active-result[data-option-array-index = '6']"
  );

  await tab.waitForSelector("#degree", { visible: true });
  await tab.type("#degree", data.Degree);

  await new Promise(function (resolve) {
    setTimeout(resolve, 1000);
  });
  await tab.waitForSelector("#stream", { visible: true });
  await tab.type("#stream", data.Stream);

  await new Promise(function (resolve) {
    setTimeout(resolve, 1000);
  });
  await tab.waitForSelector("#performance-college", { visible: true });
  await tab.type("#performance-college", data.Percentage);

  await new Promise(function (resolve) {
    setTimeout(resolve, 1000);
  });

  await tab.click("#college-submit");
  console.log("College submited");
}

async function training(data, tab) {
  await tab.waitForSelector(
    ".experiences-tabs[data-target='#training-modal'] .ic-16-plus",
    { visible: true }
  );
  await tab.click(
    ".experiences-tabs[data-target='#training-modal'] .ic-16-plus"
  );

  await tab.waitForSelector("#other_experiences_course", { visible: true });
  await tab.type("#other_experiences_course", data.Training);

  await new Promise(function (resolve) {
    setTimeout(resolve, 1000);
  });

  await tab.waitForSelector("#other_experiences_organization", {
    visible: true,
  });
  await tab.type("#other_experiences_organization", data.Organization);

  await new Promise(function (resolve) {
    setTimeout(resolve, 1000);
  });

  await tab.click("#other_experiences_location_type_label");

  await tab.click("#other_experiences_start_date");

  await new Promise(function (resolve) {
    setTimeout(resolve, 1000);
  });

  await tab.waitForSelector(".ui-state-default[href='#']", { visible: true });
  let date = await tab.$$(".ui-state-default[href='#']");
  await date[0].click();
  await tab.click("#other_experiences_is_on_going");

  await tab.waitForSelector("#other_experiences_training_description", {
    visible: true,
  });
  await tab.type("#other_experiences_training_description", data.description);

  await new Promise(function (resolve) {
    setTimeout(resolve, 2000);
  });

  await tab.click("#training-submit");
}

async function workSample(data, tab) {
  await tab.waitForSelector("#other_portfolio_link", { visible: true });
  await tab.type("#other_portfolio_link", data.link);
}

async function application(data, tab) {
  await tab.goto("https://internshala.com/internships");
  // if(tab.waitForSelector(".content")){
  //   await tab.click("#close_popup")
  // } //Maybe can use in future to remove popups

  // await tab.waitForSelector(".btn.btn-primary.campaign-btn.view_internship", {
  //   visible: true,
  // });
  // await tab.click(".btn.btn-primary.campaign-btn.view_internship");

  await new Promise(function (resolve) {
    setTimeout(resolve, 2000);
  });
  await tab.waitForSelector(".individual_internship", { visible: true });
  let details = await tab.$$(".internship_list_container");
  console.log(details);
  let detailUrl = [];
  for (let i = 0; i < 3; i++) {
    let url = await tab.evaluate(function (ele) {
      return ele.getAttribute("href");
    }, details[i]);
    detailUrl.push(url);
  }

  for (let i of detailUrl) {
    await apply(i, data, tab);
    await new Promise(function (resolve) {
      setTimeout(resolve, 1000);
    });
  }
}

async function apply(url, data, tab) {
  await tab.goto("https://internshala.com" + url);

  await tab.waitForSelector(".btn.btn-large", { visible: true });
  await tab.click(".btn.btn-large");

  await tab.waitForSelector("#application_button", { visible: true });
  await tab.click("#application_button");

  await tab.waitForSelector(".textarea.form-control", { visible: true });
  let ans = await tab.$$(".textarea.form-control");

  for (let i = 0; i < ans.length; i++) {
    if (i == 0) {
      await ans[i].type(data.hiringReason);
      await new Promise(function (resolve) {
        setTimeout(resolve, 1000);
      });
    } else if (i == 1) {
      await ans[i].type(data.availability);
      await new Promise(function (resolve) {
        setTimeout(resolve, 1000);
      });
    } else {
      await ans[i].type(data.rating);
      await new Promise(function (resolve) {
        setTimeout(resolve, 1000);
      });
    }
  }

  await tab.click(".submit_button_container");
}

module.exports = { main };
