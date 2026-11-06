
import React from 'react';

const blogs = [
    {
        id: 1,
        title: 'The Future of Lithium Battery Recycling',
        excerpt: 'Exploring the advancements in lithium battery recycling technology...',
        date: 'October 10, 2023',
    },
    {
        id: 2,
        title: 'How to Recycle Lithium Batteries Safely',
        excerpt: 'A comprehensive guide on safely recycling lithium batteries...',
        date: 'September 25, 2023',
    },
    // Add more blog entries here
];

const Blogs = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                    <div key={blog.id} className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-2">{blog.title}</h2>
                        <p className="text-gray-600 mb-4">{blog.excerpt}</p>
                        <p className="text-gray-400 text-sm">{blog.date}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Blogs;