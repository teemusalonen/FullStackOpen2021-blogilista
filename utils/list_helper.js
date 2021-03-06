const _ = require('lodash');

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => {
        return sum + blog.likes
    }, 0)   
}

const favoriteBlog = (blogs) => {
    let biggest = 0
    blogs.forEach(b => {
        biggest = b.likes > biggest ? b.likes : biggest 
    })
    return blogs.find(b => b.likes === biggest)
} 

const mostBlogs = (blogs) => {
    let biggest = 0
    let author = ''
    blogs.forEach(b => {
        const temp = blogs.filter(blog => blog.author === b.author)
        if(biggest < temp.length){
            biggest = temp.length 
            author = b.author
        }
    })
    const most = {
        author: author,
        blogs: biggest
    }
    return most
}

const mostLikes = (blogs) => {
    let likes = 0
    let author = ''
    blogs.forEach(b => {
        let current = 0
        const temp = blogs.filter(blog => blog.author === b.author)
        temp.forEach(a => current += a.likes)
        if(likes < current){
            likes = current
            author = b.author
        }
    })
    const most = {
        author: author,
        likes: likes
    }
    return most
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}