import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenandAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        console.log("object");
        const { fullName, username, email, password, confirmPassword } =
            req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }

        const userEmail = await User.findOne({ email });

        if (userEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const userUsername = await User.findOne({ username });

        if (userUsername) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const profilePic = `https://avatar.iran.liara.run/username?username=${username}`;

        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword,
            profilePic,
        });

        if (newUser) {
            generateTokenandAndSetCookie(newUser._id, res);

            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({ error: "Invalid User data" });
        }
    } catch (error) {
        console.log("Error in signup controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcryptjs.compare(
            password,
            user?.password || ""
        );

        if (!user || !isPasswordCorrect) {
            return res
                .status(400)
                .json({ error: "Invalid username or password" });
        }

        generateTokenandAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log("Error in login controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
