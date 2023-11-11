const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const createUserToken = require("../helpers/create-user-token.js");
const getToken = require("../helpers/get-token.js");

module.exports = class UserController {
    static async register(req, res) {
        const { name, email, phone, password, confirmpassword } = req.body;

        if(!name) {
            res.status(422).json({message: "O nome é obrigatório."});
            return;
        }

        if(!email) {
            res.status(422).json({message: "O e-mail é obrigatório."});
            return;
        }

        if(!phone) {
            res.status(422).json({message: "O telefone é obrigatório."});
            return;
        }

        if(!password) {
            res.status(422).json({message: "A senha é obrigatória."});
            return;
        }

        if(!confirmpassword) {
            res.status(422).json({message: "A confirmação de senha é obrigatória."});
            return;
        }

        if(password !== confirmpassword) {
            res.status(422).json({message: "As senhas não coincidem"});
            return;
        }

        const userExists = await User.findOne({email: email});

        if(userExists) {
            res.status(422).json({message: "Já existe um usuário com este endereço de e-mail."});
            return;
        }

        const salt = bcrypt.genSaltSync(12);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = new User({name, email, password: hashedPassword, phone});

        try {
            const newUser = await user.save();

            await createUserToken(req, res, newUser);

            console.log("Usuário criado com sucesso!");
        }catch(error) {
            res.status(500).json({message: error});
            console.log(`Ocorreu um erro ao cadastrar o usuário: ${error}`);
        }
    }

    static async login(req, res) {
        const { email, password } = req.body;

        if(!email) {
            res.status(422).json({message: "O e-mail é obrigatório"});
            return;
        }

        if(!password) {
            res.status(422).json({message: "A senha é obrigatória"});
            return;
        }

        const userExist = await User.findOne({email: email});

        if(!userExist) {
            res.status(422).json({message: "O usuário informado não existe!"});
            return;
        }

        const passwordMatch = bcrypt.compareSync(password, userExist.password);

        if(!passwordMatch) {
            res.status(422).json({message: "Senha incorreta!"});
            return;
        }

        try {
            await createUserToken(req, res, userExist);
            console.log("Usuário logado com sucesso!");
        }catch(error) {
            res.status(500).json({message: error});
            console.log(`Ocorreu um erro ao fazer o login: ${error}`);
        }
    }

    static async checkUser(req, res) {
        let currentUser;

        if(req.headers.authorization) {

            const token = getToken(req);
            const decoded = jwt.verify(token, 'nossosecret');

            currentUser = await User.findById(decoded.id);

            currentUser.password = undefined;

        } else {
            currentUser = null;
        }

        res.status(200).json(currentUser);
    }
}