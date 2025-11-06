const dummy = (blogs) => 1

const totalLikes = (blogs) =>
  blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((favorite, blog) =>
    blog.likes > favorite.likes ? blog : favorite
  )
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const blogCountByAuthor = blogs.reduce((acc, { author }) => {
    acc[author] = (acc[author] || 0) + 1
    return acc
  }, {})

  const topAuthor = Object.entries(blogCountByAuthor).reduce(
    (top, [author, count]) =>
      count > top.blogs ? { author, blogs: count } : top,
    { author: '', blogs: 0 }
  )

  return topAuthor
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const likesByAuthor = blogs.reduce((acc, { author, likes = 0 }) => {
    acc[author] = (acc[author] || 0) + likes
    return acc
  }, {})

  const topAuthor = Object.entries(likesByAuthor).reduce(
    (top, [author, totalLikes]) =>
      totalLikes > top.likes ? { author, likes: totalLikes } : top,
    { author: '', likes: 0 }
  )

  return topAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
