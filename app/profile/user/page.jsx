"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

import Profile from "@components/Profile";

const OtherProfile = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({
    username: "",
    email: "",
    image: "",
  });

  useEffect(() => {
    // console.log(router.query?.id);
    // if (!router.isReady) return;
    // console.log(router.query.id);

    const fetchUser = async () => {
      const response = await fetch(`/api/users/${id}`);
      const data = await response.json();
      console.log(data);
      setUser({
        username: data.username,
        email: data.email,
        image: data.image,
      });
    };

    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${id}/posts`);
      const data = await response.json();
      //   console.log(data);
      setPosts(data);
    };

    if (id) fetchUser();
    if (id) fetchPosts();
  }, []);

  return (
    <>
      <Profile
        name={user.username}
        desc={`Welcome to ${user.username}'s personalised profile page. Explore ${user.username}'s exceptional prompts and be inspired by the power of Imagination.`}
        data={posts}
      />
    </>
  );
};

export default OtherProfile;
