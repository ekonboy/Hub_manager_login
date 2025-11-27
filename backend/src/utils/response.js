const response = {
    success: (res, data = {}, message = 'Éxito') => res.json({ status: 'success', message, data }),
    error: (res, message = 'Error', code = 500, data = {}) => res.status(code).json({ status: 'error', message, data })
};

module.exports = response;
