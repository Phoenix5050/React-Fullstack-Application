import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/posts").then((response) => {
      setListOfPosts(response.data);
    });
  }, []);

  return (
    <div>
      {listOfPosts.map((value) => {
        return (
          <div className="post" key={value.id}>
            <div className="title">{value.title} </div>
            <div className="body">{value.postText} </div>
            <div className="footer">{value.userName} </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
