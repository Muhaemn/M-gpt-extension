let allElements = document.getElementsByTagName("*");
let isOn = true;

const { Configuration, OpenAIApi } = require("openai");
const openAi = new OpenAIApi(
  new Configuration({
    apiKey: "Your API KEY",
  })
);

async function getAnswer(input) {
  const response = await openAi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: input,
      },
    ],
  });
  return response.data.choices[0].message.content;
}

async function searchForQuestion() {
  for (let i = 0; i < allElements.length; i++) {
    let element = allElements[i];
    if (element.tagName === "INPUT" && isOn) {
      if (
        element.value.indexOf("/m-gpt") !== -1 &&
        element.value.indexOf("/m-gpt") < element.value.indexOf("??") &&
        element.value.endsWith("??")
      ) {
        const regex = /\/m-gpt(.*)\?\?/;
        const match = element.value.match(regex);
        const input = match[1];
        element.value += "  Loading...";
        element.value = await getAnswer(input);
      } else if (
        element.value.indexOf("/m-gpt") !== -1 &&
        element.value.indexOf("/m-gpt") < element.value.indexOf("/?") &&
        element.value.endsWith("/?")
      ) {
        const regex = /\/m-gpt(.*)\/\?/;
        const match = element.value.match(regex);
        const input = match[1];
        navigator.clipboard.writeText(await getAnswer(input));
      }
    } else if (
      element.childNodes.length === 1 &&
      element.childNodes[0].nodeType === 3 &&
      element.childNodes[0].textContent.includes("/m-gpt") &&
      element.childNodes[0].textContent.indexOf("/m-gpt") <
        element.textContent.indexOf("??") &&
      element.childNodes[0].textContent.endsWith("??") &&
      isOn
    ) {
      const regex = /\/m-gpt(.*)\?\?/;
      const match = element.childNodes[0].textContent.match(regex);
      const input = match[1];
      element.childNodes[0].textContent += "  Loading...";
      element.childNodes[0].textContent = await getAnswer(input);
    } else if (
      element.childNodes.length === 1 &&
      element.childNodes[0].nodeType === 3 &&
      element.childNodes[0].textContent.includes("/m-gpt") &&
      element.childNodes[0].textContent.indexOf("/m-gpt") <
        element.textContent.indexOf("/?") &&
      element.childNodes[0].textContent.endsWith("/?") &&
      isOn
    ) {
      const regex = /\/m-gpt(.*)\/\?/;
      const match = element.childNodes[0].textContent.match(regex);
      const input = match[1];
      navigator.clipboard.writeText(await getAnswer(input));
    }
  }
}

let observer = new MutationObserver(searchForQuestion);
let config = {
  childList: true,
  characterData: true,
  subtree: true,
  attributes: true,
  attributeFilter: ["value"],
};
observer.observe(document.body, config);

document.addEventListener("input", async (event) => {
  let element = event.target;
  if (element.tagName === "INPUT" && isOn) {
    if (
      element.value.indexOf("/m-gpt") !== -1 &&
      element.value.indexOf("/m-gpt") < element.value.indexOf("??") &&
      element.value.endsWith("??")
    ) {
      const regex = /\/m-gpt(.*)\?\?/;
      const match = element.value.match(regex);
      const input = match[1];
      element.value += "  Loading...";
      element.value = await getAnswer(input);
    } else if (
      element.value.indexOf("/m-gpt") !== -1 &&
      element.value.indexOf("/m-gpt") < element.value.indexOf("/?") &&
      element.value.endsWith("/?")
    ) {
      const regex = /\/m-gpt(.*)\/\?/;
      const match = element.value.match(regex);
      const input = match[1];
      navigator.clipboard.writeText(await getAnswer(input));
    }
  }
});

document.addEventListener("keydown", async (event) => {
  if (event.ctrlKey && event.key == ";") {
    isOn = !isOn;
    console.log(isOn);
  }
});
