const dateMiddleware = (req, res, next) => {
    const { entryDate } = req.body;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(entryDate)) {
        return res.status(400).json({ error: 'Invalid date format. Expected yyyy-mm-dd.' });
    }

    next();
};

export default dateMiddleware;