const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${process.env.SERVICE_NAME}] ${timestamp} - ${req.method} ${req.originalUrl}`);
    next();
};

export default logger;
