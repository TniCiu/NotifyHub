const register = async (req, res) => {
    
    return res.json({ message: "Register endpoint" });
}

const login = async (req, res) => {
    
    return res.json({ message: "Login endpoint" });
}

module.exports = {
    register,
    login
}
