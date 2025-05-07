const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Multer error handling
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      message: 'File too large. Maximum size is 5MB.'
    });
  }

  if (err.message === 'Only image files are allowed!') {
    return res.status(400).json({
      message: err.message
    });
  }

  res.status(500).json({
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

module.exports = errorHandler;