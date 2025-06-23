import React, { useState, useEffect } from "react";
import like from "../../assets/like.svg";
import "./PostCard.css";

export default function PostCard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsByPost, setCommentsByPost] = useState({});

  const getPosts = async () => {
    try {
      const response = await fetch("https://dummyjson.com/posts");
      const data = await response.json();
      setPosts(data.posts);
      setLoading(false);

      data.posts.forEach(async (post) => {
        try {
          const res = await fetch(
            `https://dummyjson.com/posts/${post.id}/comments`
          );
          const commentData = await res.json();

          setCommentsByPost((prev) => ({
            ...prev,
            [post.id]: {
              count: commentData.comments.length,
              data: [],
            },
          }));
        } catch (err) {
          console.error("Error fetching comment count:", err);
        }
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };

  const getComments = async (id) => {
    try {
      const response = await fetch(
        `https://dummyjson.com/posts/${id}/comments`
      );
      const data = await response.json();

      setCommentsByPost((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          data: data.comments,
        },
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="postCards">
      {posts.map((post) => (
        <div key={post.id} className="postCard">
          <div className="postCard__item">
            <h4>{post.title}</h4>
            <p>{post.body}</p>

            <div className="postCard_tags">
              {post.tags.map((tag, index) => (
                <span key={index} className="postCard-tag">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="postCard__reactions">
              <span className="postCard__likes">
                <img className="like-img" alt="like-img" src={like} />
                {post.reactions.likes || 0}
              </span>
              <span className="postCard__comments-share">
                <span className="postCard__comments">
                  {commentsByPost[post.id]?.count || 0}
                  <button
                    name="button"
                    type="button"
                    className="comment-btn"
                    onClick={() => getComments(post.id)}
                  >
                    <i
                      data-visualcompletion="css-img"
                      className="x1b0d499 x1d69dk1"
                    ></i>
                  </button>
                </span>

                <span className="postCard-share">
                  {post.views}
                  <i
                    data-visualcompletion="css-img"
                    className="postCard-shares"
                  ></i>
                </span>
              </span>
            </div>

            <div className="comment-cards">
              {commentsByPost[post.id]?.data?.map((comment) => (
                <div key={comment.id} className="comment-card">
                  <div className="comment-avatar">
                    <div className="avatar-placeholder">
                      {comment.user.username[0]}
                    </div>
                  </div>
                  <div className="comment-content">
                    <p className="comment-username">{comment.user.username}</p>
                    <p className="comment-body">{comment.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="card-bottom-section">
              <span className="bottom-section-s">
                <p>Like</p>
              </span>
              <span className="bottom-section-s">
                <p>Comment</p>
              </span>
              <span className="bottom-section-s">
                <p>Share</p>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
