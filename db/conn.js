const mongoose = require("mongoose");

async function main() {
    try {
        await mongoose.connect("mongodb://localhost:27017/getapet");
        console.log("Conectado ao banco de dados com sucesso!");
    }catch(error) {
        console.log(`Ocorreu um erro ao se conectar no banco de dados: ${error}`);
    }
}

main();

module.exports = mongoose;