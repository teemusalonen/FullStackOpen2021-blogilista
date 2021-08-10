const totalLikes = (blogs) => {
    return blogs.reduce(b.likes, 0)
}

export default totalLikes