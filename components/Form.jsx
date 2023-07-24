"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

const Form = ({ type, post, setPost, submitting, handleSubmit }) => {
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");

  const instruction = `you must give suitable output as a json object containing 
  keys as 'pretext': text before code if required,'code': code if required ,
  'posttext': text after code if required 
   you should and add <br></br> at the end of the line after fullstop in the the pretext and posttext 
   let the code be as it is dont add <br></br> at the end of the line
  
 the prompt is ::`;

  const getOutputChatgpt = async () => {
    const options = {
      method: "POST",
      url: "https://chatgpt-api8.p.rapidapi.com/",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_GPT_API_KEY,
        "X-RapidAPI-Host": "chatgpt-api8.p.rapidapi.com",
      },
      data: [
        {
          content: instruction + post.prompt,
          role: "user",
        },
      ],
    };

    try {
      setLoading(true);
      const response = await axios.request(options);
      console.log(response.data.text);
      setOutput(JSON.parse(response.data.text));
      setPost({ ...post, output: response.data.text });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError(error);
      setLoading(false);
    }
  };

  const getOutputDallE = async () => {
    const options = {
      method: "POST",
      url: "https://open-ai21.p.rapidapi.com/dalle",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_DALLE_API_KEY,
        "X-RapidAPI-Host": "open-ai21.p.rapidapi.com",
      },
      data: { text: post.prompt },
    };

    try {
      setLoading(true);
      const response = await axios.request(options);

      const responseCloud = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDNAME}/image/upload`,
        {
          file: response.data.url,
          upload_preset: process.env.NEXT_PUBLIC_UPLOAD_PRESET,
        }
      );

      // console.log(responseCloud.data.secure_url);

      // console.log(response.data);
      setImage(responseCloud.data.secure_url);
      setPost({
        ...post,
        output: `{ "url":"${responseCloud.data.secure_url}" }`,
      });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError(error);
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-full flex-start flex-col">
      <h1 className="head_text text-left">
        <span className="blue_gradient">{type} Post</span>
      </h1>
      <p className="desc text-left max-w-md">
        {type} and Share amazing prompts with the world, and let your
        imagination run wild with any AI-powered platform.
      </p>

      <form
        className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism"
        onSubmit={handleSubmit}
      >
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Your AI Prompt
          </span>
          <textarea
            value={post.prompt}
            onChange={(e) => setPost({ ...post, prompt: e.target.value })}
            placeholder="Write your Prompt here..."
            required
            className="form_textarea"
          />
        </label>
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Tag{`  `}
            <span className="text-sm font-extralight">
              ( #flutter, #webdevelopment, #idea)
            </span>
          </span>
          <input
            value={post.tag}
            onChange={(e) => setPost({ ...post, tag: e.target.value })}
            placeholder="#tag"
            required
            className="form_input"
          />
        </label>
        <div className="flex-between">
          <div
            type="btn"
            className="green_gradient font-bold cursor-pointer"
            onClick={getOutputChatgpt}
          >
            {loading ? "Run Chatgpt..." : "Run Chatgpt"}
          </div>
          <div
            type="btn"
            className="blue_gradient font-bold cursor-pointer"
            onClick={getOutputDallE}
          >
            {loading ? "Run Dall-e..." : "Run Dall-e"}
          </div>
        </div>
        {error ? (
          <div className="text-red-400 text-sm mt-3">{error.message}</div>
        ) : null}
        {output != "" ? (
          <>
            <h1 className="my-1">Chatgpt Output:</h1>
            <div
              className=" text-sm "
              dangerouslySetInnerHTML={{ __html: output?.pretext }}
            ></div>
            <div className=" text-sm rounded-md">
              <SyntaxHighlighter language="javascript" style={docco}>
                {output?.code}
              </SyntaxHighlighter>
            </div>
            <div
              className=" text-sm"
              dangerouslySetInnerHTML={{ __html: output?.posttext }}
            ></div>
          </>
        ) : null}
        {image != "" ? (
          <div className="flex-end">
            <h1 className="my-1">Dall-e Output:</h1>
            <br></br>
            <img className="sm:h-[400px] " src={image} />
          </div>
        ) : null}
        <div className="flex-end mx-3 mt-10 mb-5 gap-4">
          <Link href="/" className="text-red-400 text-sm">
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white font-bold"
          >
            {submitting ? `${type}...` : type}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Form;
