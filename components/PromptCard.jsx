"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const PromptCard = ({ post, handleTagClick, handleEdit, handleDelete }) => {
  const { data: session } = useSession();
  const pathName = usePathname();

  const [copied, setCopied] = useState("");

  const handleCopy = () => {
    setCopied(post.prompt);
    navigator.clipboard.writeText(post.prompt);
    setTimeout(() => setCopied(""), 3000);
  };

  return (
    <div className="prompt_card">
      <div className="flex justify-between items-start gap-5">
        <Link
          href={
            post.creator._id == session?.user.id
              ? `/profile`
              : `/profile/user?id=${post.creator._id}`
          }
        >
          <div className="flex-1 flex justify-start items-center gap-3 cursor-pointer">
            <Image
              src={post.creator.image}
              alt="user_image"
              width={30}
              height={30}
              className="rounded-full object-contain"
            />

            <div className="flex flex-col">
              <h3 className="font-satoshi font-semibold text-sm text-gray-900">
                {post.creator.username}
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
        onClick={() => handleTagClick && handleTagClick(post.tag)}
      >
        {post.tag}
      </p>
      <div className="mt-5 flex-end gap-4 border-t border-gray-100 pt-3 text-sm  cursor-pointer">
        <Link
          className="bg-gradient-to-br from-red-500 to-purple-600 bg-clip-text text-transparent"
          href={`/prompt?id=${post._id}`}
        >
          Output
        </Link>
        <Link className="green_gradient" href={`/prompt?id=${post._id}`}>
          Comments
        </Link>
      </div>
      {session?.user.id === post.creator._id && pathName === "/profile" && (
        <div className="mt-5 flex-end gap-4 border-t border-gray-100 pt-3">
          <p
            className="font-inter text-sm green_gradient cursor-pointer"
            onClick={handleEdit}
          >
            Edit
          </p>
          <p
            className="font-inter text-sm orange_gradient cursor-pointer"
            onClick={handleDelete}
          >
            Delete
          </p>
        </div>
      )}
    </div>
  );
};

export default PromptCard;
