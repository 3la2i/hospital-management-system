const db = require('../config/db'); 


const createPost = async (req, res) => {
    const { doctor_id, title, content, image_url } = req.body;

    // Validate request data
    if (!doctor_id || !title || !content) {
        return res.status(400).json({ error: 'doctor_id, title, and content are required' });
    }

    try {
        // Use raw SQL query to insert the new post
        const query = `
            INSERT INTO DoctorPosts (doctor_id, title, content, image_url)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        
        const values = [doctor_id, title, content, image_url || null];
        
        const result = await db.raw(query, values);
        
        // Send the newly created post back as a response
        res.status(201).json({ post: result.rows[0] });
    } catch (error) {
        console.error('Error inserting post:', error);
        res.status(500).json({ error: 'Failed to create the post' });
    }
};

module.exports = { createPost };
