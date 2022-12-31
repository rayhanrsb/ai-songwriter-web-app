import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import React, { useState } from "react";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const onUserChangedText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(event.target.value);
  };

  const [apiOutput, setApiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAI...");
    const response = await fetch("/api/generateIdeas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.text);

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
    document
      .getElementById("output-content-div")
      ?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="root">
      <Head>
        <title>AI Songwriter Assistant</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Write song lyrics with AI</h1>
          </div>
          <div className="header-subtitle">
            <h2>
              Write a scenario - AI will generate 5 suggestions for song verses
            </h2>
          </div>
        </div>
        <div className="prompt-container">
          <textarea
            className="prompt-box"
            placeholder="Type here... e.g. I am watching the sunset on the beach"
            value={userInput}
            onChange={onUserChangedText}
          />
          <div className="prompt-buttons">
            <a
              className={
                isGenerating ? "generate-button loading" : "generate-button"
              }
              onClick={callGenerateEndpoint}
            >
              <div className="generate">
                {isGenerating ? (
                  <span className="loader"></span>
                ) : (
                  <p>Generate</p>
                )}
              </div>
            </a>
          </div>
          {apiOutput && (
            <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3>Output</h3>
                </div>
              </div>
              <div className="output-content" id="output-content-div">
                <p>{apiOutput}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="badge-container grow">
        <a href="https://rsbtech.org" target="_blank" rel="noreferrer">
          <div className="badge">
            <p>Built by Rayhan Beebeejaun</p>
          </div>
        </a>
      </div>
    </div>
  );
}
