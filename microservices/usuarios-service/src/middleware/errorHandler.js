const errorHandler = (err, req, res, next) => {
    console.error(`[${process.env.SERVICE_NAME}] Error:`, err);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        success: false,
        error: err.message || 'Error interno del servidor',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

export default errorHandler;
