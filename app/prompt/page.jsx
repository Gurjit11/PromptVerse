"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { CommentList } from "@components/CommentList";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

const Prompt = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const promptId = searchParams.get("id");

  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [copied, setCopied] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [count, setCount] = useState(1);
  const [showOutput, setShowOutput] = useState(false);

  const commentsByParentId = useMemo(() => {
    const group = {};
    comments.forEach((comment) => {
      group[comment.parentId] ||= [];
      group[comment.parentId].push(comment);
    });
    // console.log(group)
    return group;
  }, [comments]);

  function getReplies(parentId) {
    return commentsByParentId[parentId];
  }

  let rootComments = commentsByParentId[null];

  const handleCopy = () => {
    setCopied(post.prompt);
    navigator.clipboard.writeText(post.prompt);
    setTimeout(() => setCopied(""), 3000);
  };

  useEffect(() => {
    const getPromptDetails = async () => {
      const response = await fetch(`/api/prompt/${promptId}`);
      const data = await response.json();
      //   console.log(data);
      setPost(data);
    };

    const getComments = async () => {
      const response = await fetch(`/api/comment/${promptId}`);
      const data = await response.json();
      // console.log(data);
      setComments(data);
    };

    if (promptId) getPromptDetails();
    if (promptId) getComments();
  }, [promptId, count]);

  const [message, setMessage] = useState("");

  const createComment = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/comment/new", {
        method: "POST",
        body: JSON.stringify({
          message: message,
          userId: session?.user.id,
          promptId: promptId,
          parentId: null,
        }),
      });

      if (response.ok) {
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
      setCount((prev) => prev + 1);
    }
  };

  return (
    <>
      <div className="w-full max-w-2xl  flex-1 break-inside-avoid rounded-lg border border-gray-300 bg-white/20 bg-clip-padding p-6 pb-4 backdrop-blur-lg backdrop-filter h-fit">
        <div className="flex justify-between items-start gap-5">
          <Link
            href={
              post.creator?._id == session?.user.id
                ? `/profile`
                : `/profile/user?id=${post.creator?._id}`
            }
          >
            <div className="flex-1 flex justify-start items-center gap-3 cursor-pointer">
              <Image
                src={post.creator?.image || "/assets/icons/tick.svg"}
                alt="user_image"
                width={30}
                height={30}
                className="rounded-full object-contain"
              />

              <div className="flex flex-col">
                <h3 className="font-satoshi font-semibold text-sm text-gray-900">
                  {post.creator?.username}
                </h3>
              </div>
            </div>
          </Link>

          <div className="copy_btn" onClick={handleCopy}>
            <Image
              src={
                copied === post.prompt
                  ? "/assets/icons/tick.svg"
                  : "/assets/icons/copy.svg"
              }
              alt="/"
              width={20}
              height={20}
            />
          </div>
        </div>
        <p className="my-4 font-satoshi text-xs text-gray-700">{post.prompt}</p>
        <p
          className="font-inter text-xs blue_gradient cursor-pointer"
          //   onClick={() => handleTagClick && handleTagClick(post.tag)}
        >
          {post.tag}
        </p>
        {post?.output ? (
          <>
            <button
              className="bg-blue-600 p-1 rounded-md text-xs mt-2 text-white font-semibold"
              onClick={() => setShowOutput((prev) => !prev)}
            >
              {!showOutput ? "Show Output" : "Hide Output"}
            </button>
            {showOutput ? (
              <>
                <h1>Chatgpt Output:</h1>
                <div
                  className=" text-sm "
                  dangerouslySetInnerHTML={{
                    __html: JSON.parse(post.output)?.pretext,
                  }}
                ></div>
                <div className=" text-sm rounded-md">
                  <SyntaxHighlighter language="javascript" style={docco}>
                    {JSON.parse(post.output)?.code}
                  </SyntaxHighlighter>
                </div>
                <div
                  className=" text-sm"
                  dangerouslySetInnerHTML={{
                    __html: JSON.parse(post.output)?.posttext,
                  }}
                ></div>
              </>
            ) : null}
          </>
        ) : null}
      </div>
      <form
        onSubmit={createComment}
        className="mt-2 w-full max-w-2xl flex flex-col gap-7 "
      >
        <div className="flex">
          <textarea
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-1 mr-3 border border-orange-400 rounded-md"
          />
          <button
            className="px-5 py-1.5 h-10 text-sm bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full text-white font-bold"
            type="submit"
          >
            {submitting ? "Post..." : "Post"}
          </button>
        </div>
      </form>
      <div className="flex items-start border-b-2 mt-1 border-gray-300 font-satoshi blue_gradient w-full max-w-2xl ">
        Comments ({comments?.length})
      </div>

      {rootComments != null && rootComments.length > 0 && (
        <div className="mt-2 w-full max-w-xl">
          <CommentList
            comments={rootComments}
            getReplies={getReplies}
            setCount={setCount}
          />
        </div>
      )}
    </>
  );
};

export default Prompt;
