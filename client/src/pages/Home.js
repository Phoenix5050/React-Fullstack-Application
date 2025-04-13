import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/posts",  {
      headers: { accessToken: localStorage.getItem("accessToken") },
    })
    .then((response) => {
      // Safely extract listOfPosts and likedPosts from response.data
      setListOfPosts(response.data.listOfPosts || []);
      setLikedPosts((response.data.likedPosts || []).map((like) => like.PostId));
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
    });
  }, []);

  const likeAPost = (postId) => {
    axios.post(
      "http://localhost:3001/likes",
      { PostId: postId },
      { headers: { accessToken: localStorage.getItem("accessToken") } }
    )
    .then((response) => {
      setListOfPosts(
        listOfPosts.map((post) => {
          if (post.id === postId) {
            if (response.data.liked) {
              return { ...post, Likes: [...post.Likes, 0] };
            } else {
              const likesArray = post.Likes || [];
              likesArray.pop();
              return { ...post, Likes: likesArray };
            }
          } else {
            return post;
          }
        })
      );

      if (likedPosts.includes(postId)) {
        setLikedPosts(likedPosts.filter((id) => id !== postId));
      } else {
        setLikedPosts([...likedPosts, postId]);
      }
    })
    .catch((error) => {
      console.error("Error updating likes:", error);
    });
  };

  return (
    <div>
      {listOfPosts.map((value, key) => (
        <div key={key} className="post">
          <div className="title"> {value.title} </div>
          <div
            className="body"
            onClick={() => {
              navigate(`/post/${value.id}`);
            }}
          >
            {value.postText}
          </div>
          <div className="footer">
            {value.username}{" "}
            <ThumbUpAltIcon
              onClick={() => {
                likeAPost(value.id);
              }}
              className={likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"}
            />
            <label> {(value.Likes && value.Likes.length) || 0}</label>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
