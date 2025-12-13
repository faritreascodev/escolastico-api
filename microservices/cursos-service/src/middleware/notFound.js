const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        error: `Ruta no encontrada: ${req.originalUrl}`
    });
};

export default notFound;
