const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Course = require('../models/Course');

// Route to add a new course
router.post(
  '/add',
  [
    body('courseName').notEmpty().trim().withMessage('Course Name is required'),
    body('courseCode').notEmpty().trim().withMessage('Course Code is required'),
    body('authorEmail').isEmail().normalizeEmail().withMessage('Valid Author Email is required'),
    body('courseDescription').notEmpty().trim().withMessage('Course Description is required'),
    body('visibility').isIn(['public', 'private']).withMessage('Visibility must be public or private'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newCourse = new Course({
        courseName: req.body.courseName, // Use correct field name
        courseCode: req.body.courseCode, // Use correct field name
        authorEmail: req.body.authorEmail,
        courseDescription: req.body.courseDescription,
        visibility: req.body.visibility,
        createdAt: new Date(),
      });

      await newCourse.save();
      res.status(201).json({
        message: 'Course added successfully',
        course: newCourse,
      });
      console.log('Course added successfully:', newCourse); // Log only
    } catch (error) {
      console.error('Error adding course:', error);
      res.status(500).json({
        message: 'Server error',
        error: error.message,
      });
    }
  }
);

// Route to retrieve all courses
router.get('/all', async (req, res) => {
  try {
    const courses = await Course.find(); // Retrieve all courses from the database
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error retrieving courses:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

// Route to delete a course by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ message: 'Course deleted successfully', course: deletedCourse });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

module.exports = router;