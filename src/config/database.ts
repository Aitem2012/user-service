import dotenv from 'dotenv';
import IUserModel from '../interfaces/userinterface';

dotenv.config();


export default class ConnectDb{
    connectDb = async () =>{
        console.log("connect is called");
        var mysql = require('mssql/msnodesqlv8');
        var config = {
            server: process.env.SERVER,
            database: process.env.DATABASE,
            user: process.env.USER,
            password: process.env.PASSWORD,
            pool: {
                max: 10,
                min: 0,
                idleTimeoutMillis: 30000
              },        
            options : {
                trustedConnection: true,
                // encrypt: true,
                trustServerCertificate: false
            }
        };

        return await mysql.connect(config);
    }
    getUsers =async () => {
       var connection = await this.connectDb()
            try {                
                const result = await connection.query`select * from Users`;
                return result.recordset as IUserModel[];
            } catch (error) {
                console.log(error);
            }
    }

    createUser = async (userModel:IUserModel) => {
        var connection = await this.connectDb();
        try{
            const result = await connection.query`insert into Users values(${userModel.Firstname}, ${userModel.Lastname}, ${userModel.Email}, ${userModel.PhoneNumber})`;
            return result;
        }catch (error){
            console.log(error);
            throw error;
        }
    }

    updateUser = async (id:number, userModel:IUserModel) => {
        var connection = await this.connectDb();
        try{
            const result = await connection.query`update Users set Firstname =${userModel.Firstname},
            Lastname = ${userModel.Lastname}, EmailAddress = ${userModel.Email}, PhoneNumber = ${userModel.PhoneNumber}
            where Id=${id}`;
            return result.recordset as IUserModel;
        }catch (error){
            console.log(error);
            throw error;
        }
    }

    getUserById =async (Id:number) => {
        var connection = await this.connectDb();
        try {
            const result = await connection.query<IUserModel>`select top 1 * from Users where Id= ${Id}`;
            return result.recordset as IUserModel;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    deleteUser =async (Id:number) => {
        var connection = await this.connectDb();
        try {
            await connection.query`delete from Users where Id=${Id}`;
            return;
        } catch (error) {
            console.log(error);
        }
    }
}