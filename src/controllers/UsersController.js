const {hash, compare} = require("bcryptjs")
const AppError = require("../utils/AppError")
const sqliteConnection = require("../database/sqlite")
const UserRepository = require("../repositories/UserRepositories")
const UserCreateServices = require("../services/UserCreateServices")

class UsersController{
    /** REGRAS RECOMENDADAS PARA USO DOS CONTROLLES
     * Index - GET para listar vários registros.
     * Show - GET para exivir um registro especifico.
     * create - POST para criar um registro.
     * Update - PUT para atualizar um registro.
     * delete - DELETE para remover um registro.
     */

    async create(request, response){
        const {name, email, password} = request.body

        const userRepositories = new UserRepository()

        const userCreateServices = new UserCreateServices(userRepositories)

        await userCreateServices.execute({ name, email, password})

        return response.status(201).json()
    }

    async update(request, response){
        const {name, email, password, old_password} = request.body
        const user_id = request.user.id
 
        const database = await sqliteConnection()
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id])
        
        if (!user){
            throw new AppError("Usuário não encontrado")
        }

        const userWithUpdateEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if(userWithUpdateEmail && userWithUpdateEmail.id !== user.id){
            throw new AppError("Este e-mail já está em uso.")
        }

        user.name = name ?? user.name
        user.email = email ?? user.email

        if(password && !old_password){
            throw new AppError("Você precisa informar a senha antiga para definir a nova senha")
        }

        if(password && old_password){
            const checkOldPassword = await compare(old_password, user.password)


            if(!checkOldPassword){
                throw new AppError("A senha antiga não confere.")
            }

            user.password = await hash(password, 8)
        }

    
        await database.run(
          ` UPDATE users SET
            name = ?,
            email = ?,
            password = ?,
            updated_at = DATETIME('now')
            WHERE id = ? `,
            [user.name, user.email, user.password, user_id]
        )

        return response.status(200).json()
    }
}


module.exports = UsersController