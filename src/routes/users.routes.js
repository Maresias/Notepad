const {Router, response} = require("express")
const multer = require("multer")
const uploadConfig = require("../configs/upload")

const UsersController = require("../controllers/UsersController")
const UserAvatarController = require("../controllers/UserAvatarController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const usersRoutes = Router()
const upload = multer(uploadConfig.MULTER)

// function myMiddleware(request, response, next){
//     console.log("Voce passou pelo Middleware!")

//     if(!request.body.isAdmin){
//         return response.json({message: "User unauthorized"})
//     }

//     next()
// }


const usersController = new UsersController()
const userAvatarController = new UserAvatarController()

//METODO GET 


//-- USANDO O QUERY

//app.get("/users", (request, response) =>{
 ///   const {page, limit} = request.query
//    response.send(`Page: ${page} View: ${limit}`)
//})

// USANDO PARAMS

// app.get("/message/:id/:user", (request, response) => {
//     const {id, user} = request.params
//     response.send(`
//     Mensagem ID: ${id} .
//     Para o usuario: ${user}`)
// })

// usersRoutes.use(myMiddleware)

usersRoutes.post("/",  usersController.create)
usersRoutes.put("/", ensureAuthenticated, usersController.update)
usersRoutes.patch("/avater", ensureAuthenticated, upload.single("avater"), userAvatarController.update)

module.exports = usersRoutes          
