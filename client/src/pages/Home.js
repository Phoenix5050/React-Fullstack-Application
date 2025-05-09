import React from "react";//import React, {useContext} from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
// import { AuthContext } from "../helpers/AuthContext";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  // const { authState } = useContext(AuthContext);
  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      axios.get("http://localhost:3001/posts",  {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setListOfPosts(response.data.listOfPosts || []);
        setLikedPosts((response.data.likedPosts || []).map((like) => like.PostId));
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
    }
  }, [navigate]);

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
            <div className="username">
                <Link to={`/profile/${value.UserId}`}> {value.username} </Link>
            </div>
            <div className="buttons">
              <ThumbUpAltIcon
                onClick={() => {
                  likeAPost(value.id);
                }}
                className={
                  likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
                }
              />
              <label> {(value.Likes && value.Likes.length) || 0}</label>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
