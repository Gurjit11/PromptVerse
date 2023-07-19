"use client";
import Comment from "./Comment";

export function CommentList({ comments, getReplies, handleCreate }) {
  return comments.map((comment) => (
    <div key={comment._id} className="w-full">
      <Comment {...comment} getReplies={getReplies} />
    </div>
  ));
}
