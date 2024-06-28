import { GoogleGenerativeAI } from "/node_modules/@google/generative-ai/dist/index.mjs";
const genAI = new GoogleGenerativeAI("AIzaSyBVGNTYqXhyg2v-d15dJn9oYxqJAJRHHLI");

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function run(json, fhtml) {
  let rag = json;
  const prompt = `Create a short and precise narrative summary of the user behaviour on a website giving priority to the details of element clicked. The HTML content of the full webpage, to be used as reference for the elements in the tracking data, is given here: ${fhtml}. Here is the user activity tracking data: ${JSON.stringify(rag)}`
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text)
}
console.log("I am background js")
chrome.runtime.onMessage.addListener((message,sender,response)=>{
    run(message.total_elements, message.full_html);
})