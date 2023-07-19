"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CommentList } from "./CommentList";
import "@styles/styles.css";

const Comment = ({
  _id,
  userId: creator,
  promptId,
  message,
  parentId,
  createdAt,
  updatedAt,
  getReplies,
  setCount,
}) => {
  const { data: session } = useSession();
  const [copied, setCopied] = useState("");
  const [areChildrenHidden, setAreChildrenHidden] = useState(true);
  const [isReplying, setIsReplying] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const childComments = getReplies(_id);

  const [reply, setReply] = useState("");

  const createComment = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/comment/new", {
        method: "POST",
        body: JSON.stringify({
          message: reply,
          userId: session?.user.id,
          promptId: promptId,
          parentId: _id,
        }),
      });

      if (response.ok) {
        setReply("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
      setCount((prev) => prev + 1);
    }
  };

  const handleCopy = () => {
    setCopied(message);
    navigator.clipboard.writeText(message);
    setTimeout(() => setCopied(""), 3000);
  };

  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <>
      <div className="w-full max-w-2xl mt-2 flex-1 break-inside-avoid rounded-lg border items-center justify-center border-gray-300 bg-white/20 bg-clip-padding p-6 pb-4 backdrop-blur-lg backdrop-filter h-fit">
        <div className="flex justify-between items-start gap-5">
          <Link
            href={
              creator?._id == session?.user.id
                ? `/profile`
                : `/profile/user?id=${creator?._id}`
            }
          >
            <div className="flex-1 flex justify-start items-center gap-3 cursor-pointer">
              <Image
                src={creator?.image || "/assets/icons/tick.svg"}
                alt="user_image"
                width={20}
                height={20}
                className="rounded-full object-contain"
              />

              <div className="flex flex-col">
                <h3 className="font-satoshi  text-xs text-gray-900">
                  {creator?.username}
                </h3>
              </div>
            </div>
          </Link>
          <div className="text-xs">
            {dateFormatter.format(Date.parse(updatedAt))}
          </div>
          <div className="copy_btn" onClick={handleCopy}>
            <Image
              src={
                copied === message
                  ? "/assets/icons/tick.svg"
                  : "/assets/icons/copy.svg"
              }
              alt="/"
              width={20}
              height={20}
            />
          </div>
        </div>
        <p className="my-4 font-satoshi text-xs text-gray-700">{message}</p>
        <div className="mt-5 flex-end gap-4 border-t border-gray-100 pt-3 text-sm green_gradient cursor-pointer">
          {isReplying ? (
            <form
              onSubmit={createComment}
              className="mt-2 w-full max-w-2xl flex flex-col gap-7 "
            >
              <div className="flex">
                <textarea
                  onChange={(e) => setReply(e.target.value)}
                  className="w-full p-1 mr-3 border text-gray-600 border-orange-400 rounded-md"
                />
                <button
                  className="px-5 py-1.5 h-10 text-sm bg-primary-orange rounded-full text-white font-bold"
                  type="submit"
                >
                  {submitting ? "Post..." : "Post"}
                </button>
              </div>
            </form>
          ) : (
            <button onClick={() => setIsReplying((prev) => !prev)}>
              Reply
            </button>
          )}
        </div>
      </div>
      {childComments?.length > 0 && (
        <>
          <div
            className={`nested-comments-stack ${
              areChildrenHidden ? "hide" : ""
            }`}
          >
            <button
              className="collapse-line"
              aria-label="Hide Replies"
              onClick={() => setAreChildrenHidden(true)}
            />
            <div className="nested-comments">
              <CommentList
                comments={childComments}
                getReplies={getReplies}
                setCount={setCount}
              />
            </div>
          </div>
          <button
            className={`btn mt-1 ${!areChildrenHidden ? "hide" : ""}`}
            onClick={() => setAreChildrenHidden(false)}
          >
            Show Replies ({childComments.length})
          </button>
        </>
      )}
    </>
  );
};

export default Comment;
