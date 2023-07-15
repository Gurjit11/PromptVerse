"use client";

import Feed from "@components/Feed";

const Home = () => {
  return (
    <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center">
        Discover & Share
        <br className="" />
        <span className="orange_gradient text-center">AI-Powered Prompts</span>
      </h1>
      <p className="desc text-center">
        PromptVerse is an open-source AI prompting tool for modern world to
        discover and share creative prompts
      </p>
      <Feed />
    </section>
  );
};

export default Home;
