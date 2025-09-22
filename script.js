// Load tracking data from backend API
async function pgnmChecker() {
  try {
    const clickReq = await fetch("https://147.182.139.107/api/domains/test", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        domain: "benefithelptoday.com",
      }),
    });

    const response = await clickReq.json();
    const { domain, rtkcid, past } = response.data;

    // Store the test data for later use
    window.testData = { domain, rtkcid, past };

    console.log("Test data loaded:", { domain, rtkcid, past });

    // Update phone number based on past value
    syncPhoneNumber();
  } catch (error) {
    console.error("Failed to load test data:", error);
  }
}

// Load tracking data on page load
pgnmChecker();

// Load Ringba function - exactly as provided but as JavaScript function
const loadRingba = () => {
  var script = document.createElement("script");
  script.src = "//b-js.ringba.com/CAd4c016a37829477688c3482fb6fd01de";
  let timeoutId = setTimeout(addRingbaTags, 1000);
  script.onload = function () {
    clearTimeout(timeoutId);
    addRingbaTags();
  };
  document.head.appendChild(script);
};

// Function to add tags - with age parameter added
function addRingbaTags() {
  let qualifiedValue =
    new URL(window.location.href).searchParams.get("qualified") || "unknown";
  let ageValue =
    new URL(window.location.href).searchParams.get("age") || "unknown";

  const initialTag = {
    type: "RT",
    track_attempted: "yes",
    qualified: qualifiedValue,
    age: ageValue,
  };

  console.log("Sending initial tag to Ringba:", initialTag);
  (window._rgba_tags = window._rgba_tags || []).push(initialTag);

  var intervalId = setInterval(() => {
    if (window.testData && window.testData.rtkcid !== undefined) {
      const clickTag = {
        type: "RT",
        clickid: window.testData.rtkcid,
        qualified: qualifiedValue,
        age: ageValue,
      };

      console.log("Sending click tag to Ringba:", clickTag);
      (window._rgba_tags = window._rgba_tags || []).push(clickTag);
      clearInterval(intervalId);
    }
  }, 500);
}

let duration = 30; // 30 minutes
const timerDisplay = document.getElementById("countdown");
const firstQ = document.querySelector(".first-question");
const secondQ = document.querySelector(".second-question");
const thirdQ = document.querySelector(".third-question");
const btnFirstQuestions = document.querySelectorAll(".btnFirstQuestions");
const btnsecondQuestions = document.querySelectorAll(".btnsecondQuestions");

// Track Medicare answer for pixel firing
let medicareAnswer = null;

function startTimer(duration, display) {
  let timer = duration;
  const interval = setInterval(() => {
    const minutes = String(Math.floor(timer / 60)).padStart(2, "0");
    const seconds = String(timer % 60).padStart(2, "0");
    display.children[0].textContent = minutes;
    display.children[2].textContent = seconds;

    if (--timer < 0) {
      clearInterval(interval);
      display.children[0].textContent = "00";
      display.children[2].textContent = "00";
    }
  }, 1000);
}

var newUrl = new URL(window.location.href);

btnFirstQuestions.forEach((button) => {
  button.addEventListener("click", () => {
    console.log("hello");
    firstQ.classList.add("hidden");
    secondQ.classList.remove("hidden");

    const btnFirstQuestionValue = button.getAttribute("value");
    if (btnFirstQuestionValue === "below 65") {
      newUrl.searchParams.delete("age");
      newUrl.searchParams.set("age", "65");
    }
    if (btnFirstQuestionValue === "65 - 70") {
      newUrl.searchParams.delete("age");
      newUrl.searchParams.set("age", "70");
    }
    if (btnFirstQuestionValue === "71 - 75") {
      newUrl.searchParams.delete("age");
      newUrl.searchParams.set("age", "75");
    }
    if (btnFirstQuestionValue === "76 and older") {
      newUrl.searchParams.delete("age");
      newUrl.searchParams.set("age", "80");
    }
    window.history.pushState(
      {
        path: newUrl.href,
      },
      "",
      newUrl.href
    );
  });
});

btnsecondQuestions.forEach((button) => {
  button.addEventListener("click", () => {
    secondQ.classList.add("hidden");
    thirdQ.classList.remove("hidden");

    const btnSecondQuestionValue = button.getAttribute("value");
    // Track the Medicare answer for pixel firing
    medicareAnswer = btnSecondQuestionValue;

    if (btnSecondQuestionValue === "yes") {
      newUrl.searchParams.delete("qualified");
      newUrl.searchParams.set("qualified", "yes");
    }
    if (btnSecondQuestionValue === "no") {
      newUrl.searchParams.delete("qualified");
      newUrl.searchParams.set("qualified", "no");
    }
    window.history.pushState(
      {
        path: newUrl.href,
      },
      "",
      newUrl.href
    );

    // Load Ringba and call addRingbaTags after qualification
    setTimeout(() => {
      loadRingba();
    }, 100);
  });
});

function formatPhoneNumber(phoneNumber) {
  // Ensure the phone number is a string
  phoneNumber = phoneNumber.toString();
  // Format the phone number
  const formattedPhoneNumber = phoneNumber.replace(
    /(\d{1})(\d{3})(\d{3})(\d{4})/,
    "+$1 ($2) $3-$4"
  );
  return formattedPhoneNumber;
}

function syncPhoneNumber() {
  const phoneNumberElement = document.getElementById("phone-number");
  if (phoneNumberElement) {
    // Check if we have testData and past value
    if (window.testData && window.testData.past === true) {
      // If past is true, use the hardcoded number
      const hardcodedNumber = "18557842245";
      const formattedNumber = formatPhoneNumber(hardcodedNumber);
      phoneNumberElement.textContent = formattedNumber;
      phoneNumberElement.href = `tel:${hardcodedNumber}`;
    } else {
      // If past is false or not available, use current behavior
      const currentHref = phoneNumberElement.getAttribute("href");
      const rawPhoneNumber = currentHref.replace(/\D/g, ""); // Extract numeric part from href

      if (rawPhoneNumber.length === 11) {
        // Format the phone number
        const formattedPhoneNumber = formatPhoneNumber(rawPhoneNumber);
        // Update the text content if it's different
        if (phoneNumberElement.textContent.trim() !== formattedPhoneNumber) {
          phoneNumberElement.textContent = formattedPhoneNumber;
        }
        // Ensure href is correct
        phoneNumberElement.href = `tel:${rawPhoneNumber}`;
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", (event) => {
  syncPhoneNumber();
});

// Dynamic domain name script (moved from HTML)
document.addEventListener("DOMContentLoaded", function () {
  const domainElement = document.getElementById("domain-name");
  if (domainElement) {
    // Get the current domain and convert to uppercase
    const currentDomain = window.location.hostname.toUpperCase();
    domainElement.textContent = currentDomain;
  }

  // Set privacy and terms links based on current domain
  const currentDom = window.location.origin;
  const privacyLink = document.getElementById("privacyLink");
  const termsLink = document.getElementById("termsLink");

  if (privacyLink) {
    privacyLink.href = currentDom + "/privacy";
  }

  if (termsLink) {
    termsLink.href = currentDom + "/terms";
  }

  // Add phone button click handler with conditional pixel tracking
  const callButton = document.getElementById("phone-number");
  if (callButton) {
    callButton.addEventListener("click", function () {
      // Only fire pixel if user answered "yes" to Medicare question
      if (medicareAnswer === "yes") {
        // Fire the pixel/script when call button is clicked
        const pixelScript = document.createElement("script");
        pixelScript.async = true;
        pixelScript.src =
          "//pixel.mathtag.com/event/js?mt_id=1659002&mt_adid=431864&mt_exem=&mt_excl=&v1=&v2=&v3=&s1=&s2=&s3=";
        document.head.appendChild(pixelScript);
        console.log("pixel script fired - user answered YES to Medicare");
      } else {
        console.log(
          "pixel script NOT fired - user answered NO to Medicare or question not answered"
        );
      }
    });
  }
});
