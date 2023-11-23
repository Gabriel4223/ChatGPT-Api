const sectionMessages = document.querySelector("#messages");
const inputMessage = document.querySelector("#message");
const buttonMessage = document.querySelector("#send-message");

const model = "text-davinci-003";

document.querySelector("#model-text").innerText = model;

document
  .querySelector("form")
  .addEventListener("submit", (e) => e.preventDefault());

inputMessage.addEventListener("keyup", (event) => {
  const hasValue = inputMessage.value !== "";

  buttonMessage.classList.toggle("color-white", hasValue);
  buttonMessage.classList.toggle("color-gray", !hasValue);
  buttonMessage.disabled = !hasValue;

  if (hasValue && event.key === "Enter") {
    event.preventDefault();
    insertMessageInHTML();
  }
});

buttonMessage.addEventListener("click", insertMessageInHTML);

async function insertMessageInHTML() {
  const yourMessage = `<p> <span class="text-bold"> You: </span> ${inputMessage.value} </p>`;
  sectionMessages.innerHTML += yourMessage;

  inputMessage.value = "";
  resetButtonState();

  const responseGPT = await postMessageGPT(inputMessage.value);
  const chatGPTMessage = `<p> <span class="text-bold"> ChatGPT: </span> ${responseGPT} </p>`;
  sectionMessages.innerHTML += chatGPTMessage;
}

function resetButtonState() {
  buttonMessage.classList.remove("color-white");
  buttonMessage.classList.add("color-gray");
  buttonMessage.disabled = true;
}

async function postMessageGPT(message) {
  const data = {
    prompt: `${message}`,
    temperature: 0.2,
    max_tokens: 2000,
    top_p: 1,
    frequency_penalty: 0.5,
    presence_penalty: 0,
  };

  try {
    const response = await fetch(
      `https://api.openai.com/v1/engines/${model}/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer API KEY`,
        },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();

    return result.choices[0].text;
  } catch (error) {
    console.error("Erro na requisição:", error.message);
    return error.message;
  }
}