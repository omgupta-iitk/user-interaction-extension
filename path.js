// import { GoogleGenerativeAI } from "/web/chrome_extension/extension/node_modules/@google/generative-ai/dist/index.mjs";

// // Access your API key as an environment variable (see "Set up your API key" above)
// const genAI = new GoogleGenerativeAI("AIzaSyBVGNTYqXhyg2v-d15dJn9oYxqJAJRHHLI");

// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

// let json='what is capital of france ?'

// async function run(json) {
//     let rag = json;
//     const prompt = `Answer the given question in a funny way in the given answer format \n Question:${rag} \n Answer-Format: json`
  
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();
//     console.log(text);
//   }
  
//   run(json);
import { GoogleGenerativeAI } from "/web/chrome_extension/extension/node_modules/@google/generative-ai/dist/index.mjs";

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyBVGNTYqXhyg2v-d15dJn9oYxqJAJRHHLI");

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
let json= "What is the capital of russia ?"
async function run(json) {
    let rag = json;

    //const prompt = `can you create just a short and precise narative summary of the user behaviour on a website and here is the user activity tracking data: ${JSON.stringify(rag)}`
    const prompt= `Answer the given question in a funny way in the given answer format \n Question:${rag} \n Answer-Format: json`
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
  }
//   console.log(`can you create a narative summary of the user behaviour on a website and here is the clicks data: ${JSON.stringify(json.clicks)}`)
run(json);
// import { pkgPathJson } from "path-fixxer";
// pkgPathJson();
// const fullPath = await import.meta.resolve("@google/generative-ai");
// const path = fullPath?.match(/(\/node_modules.*)/)[0];
// console.log(path);