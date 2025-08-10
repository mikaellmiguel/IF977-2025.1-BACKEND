const {hash, compare} = require('bcryptjs');
const AppError = require('../utils/AppError');
const knex = require('../database/knex');

class UsersController {
    
    async update(request, response) {
        const {name, email, password, old_password} = request.body;
        const id = request.user;
        const user = await knex('users').where('id', id).first();

        if(!user) throw new AppError("Usuário não encontrado");

        if(email){
            const userWithUpdatedEmail = await knex('users').where('email', email).first();
            if(userWithUpdatedEmail && userWithUpdatedEmail.id !== id) throw new AppError("Este e-mail já está em uso");
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        if(password && !old_password) throw new AppError("Senha antiga não informada");

        if(password && old_password) {
            const oldPasswordMatch = await compare(old_password, user.password);

            if(!oldPasswordMatch) throw new AppError("Senha antiga incorreta");
            user.password = await hash(password, 8);
        }

        await knex('users').where('id', id).update(user);
        return response.status(200).json({ message: 'Usuário atualizado com sucesso' });
    }
}

module.exports = UsersController;