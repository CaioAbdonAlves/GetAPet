const User = require("../models/User.js");
const bcrypt = require("bcryptjs");

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

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = new User({name, email, password: hashedPassword, phone});

        try {
            await user.save();
            res.status(201).json({message: "Usuário criado com sucesso!"});
            console.log("Usuário criado com sucesso!");
        }catch(error) {
            console.log(`Ocorreu um erro ao cadastrar o usuário: ${error}`);
        }
    }
}