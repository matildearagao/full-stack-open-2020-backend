const dummy = (blogs) => {
  return 1;
};

const favoriteBlog = (blogs) => {
  let maxLikes = blogs.reduce((max, blog) =>
    max.likes > blog.likes ? max : blog
  );

  return maxLikes;
};

const authorMostBlogs = (blogs) => {
  let bloggers = {};
  blogs.forEach((blog) => {
    if (blog.author in bloggers) {
      bloggers[blog.author] += 1;
    } else {
      bloggers[blog.author] = 1;
    }
  });
  const mostBlogsAuthor = Object.keys(bloggers).reduce((a, b) =>
    bloggers[a] > bloggers[b] ? a : b
  );
  //   console.log({ author: bloggers[mostBlogsAuthor], blogs: mostBlogsAuthor });
  return { author: mostBlogsAuthor, blogs: bloggers[mostBlogsAuthor] };
};

const authorMostLikes = (blogs) => {
  let bloggers = {};
  blogs.forEach((blog) => {
    if (blog.author in bloggers) {
      bloggers[blog.author] += blog.likes;
    } else {
      bloggers[blog.author] = blog.likes;
    }
  });
  const mostLikesAuthor = Object.keys(bloggers).reduce((a, b) =>
    bloggers[a] > bloggers[b] ? a : b
  );
  //console.log({ author: mostLikesAuthor, likes:  bloggers[mostLikesAuthor] });
  return { author: mostLikesAuthor, likes: bloggers[mostLikesAuthor] };
};

module.exports = {
  dummy,
  favoriteBlog,
  authorMostBlogs,
  authorMostLikes,
};
