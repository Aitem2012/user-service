import express, { Express, NextFunction, Request, Response } from 'express';
import ConnectDb from './config/database';
import IUserModel from './interfaces/userinterface';

const app: Express = express();
const port = 8000;

const db = new ConnectDb();

app.use(express.json())

app.get("/", async (req: Request, res: Response) => {
    var result = await db.getUsers();
    res.status(200).json(result);
});

app.post("/",async (req:Request<{}, {}, IUserModel>, res: Response, next: NextFunction) => {
    console.log("createusercalled")
    const {Firstname, Lastname, Email, PhoneNumber} = req.body;
    console.log(`${Firstname} ${Lastname}`)
    var result = await db.createUser(req.body);
    res.status(201).json({message: "user created successfully",data: result.recordset });
});

app.get("/:id", async(req:Request, res:Response) => {
    const {id} = req.params;
    console.log(id);
    var result = await db.getUserById(parseInt(id));
    res.status(200).json(result);
});

app.delete("/:id", async(req:Request, res:Response) => {
    const {id} = req.params;
    await db.deleteUser(parseInt(id));
    res.status(204).json("User deleted successfully");
})

app.put("/:id",async (req:Request, res:Response) => {
    const {id} = req.params;
    const user = req.body;
    console.log(user);
    var result = await db.updateUser(parseInt(id),user);
    res.status(200).json("User updated successfully");
})


app.listen(port, () => {
    
    console.log(`[Server]: I am running at http://localhost:${port}`);
});