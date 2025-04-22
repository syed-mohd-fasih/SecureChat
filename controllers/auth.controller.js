export const signup = async (req, res) => {
    try {
        const { fullname, username, password, confirmPassword } = req.body;
    } catch (error) {

    }
}

export const login = (req, res) => {
    console.log("Login User");
}

export const logout = (req, res) => {
    console.log("Logout User");
}