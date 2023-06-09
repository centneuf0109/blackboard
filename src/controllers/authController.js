import User from "../models/User";
import bcrypt from "bcrypt";

const loginUserToSession = (req, user) => {
    req.session.isLoggedIn = true;
    req.session.loggedInUser = user;
};

export const getSignup = (req, res) => {
    return res.render("signup", { pageTitle: "회원가입" });
};

export const postSignup = async (req, res) => {
    const { id, pw, name, stuId, userType } = req.body;
    const exists = await User.exists({ id });
    if (exists) {
        return res.status(400).render("signup", {
            pageTitle: "회원가입",
            errorMessage:
                "같은 아이디를 가진 계정이 이미 존재합니다. 다시 시도해주세요.",
        });
    }
    if (!(userType === "학생" || userType === "교수")) {
        return res.status(400).render("signup", {
            pageTitle: "회원가입",
            errorMessage:
                "유저 타입은 <학생> 또는 <교수> 중 하나여야만 합니다. 다시 시도해주세요",
        });
    }
    try {
        const user = await User.create({
            id,
            pw,
            name,
            stuId,
            userType,
            lectureArr: [],
        });
        loginUserToSession(req, user);
        return res.redirect("/");
    } catch (error) {
        return res.status(400).render("signup", {
            pageTitle: "회원가입",
            errorMessage: error,
        });
    }
};

export const getLogin = (req, res) => {
    return res.render("login", { pageTitle: "로그인" });
};

export const postLogin = async (req, res) => {
    const { id, pw } = req.body;
    const user = await User.findOne({ id });
    if (!user) {
        return res.status(400).render("login", {
            pageTitle: "로그인",
            errorMessage: "계정이 존재하지 않습니다. 다시 시도해주세요.",
        });
    }
    const ok = await bcrypt.compare(pw, user.pw);
    if (!ok) {
        return res.status(400).render("login", {
            pageTitle: "로그인",
            errorMessage: "비밀번호가 올바르지 않습니다. 다시 시도해주세요.",
        });
    }
    loginUserToSession(req, user);
    return res.redirect("/");
};

export const getLogout = async (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};
