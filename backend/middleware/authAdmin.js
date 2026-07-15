import jwt from 'jsonwebtoken'

//admin authentication 

const authAdmin = async(req,resp,next)=>{
    try{
        const {atoken} = req.headers;
        if (!atoken){
            return res.json({sucess:false,message:"Token Not Found"})
        }
        const token_decode = jwt.verify(atoken,process.env.JWT_SECRET);
        
        if (token_decode!= process.env.ADMIN_EMAIL+process.env.ADMIN_PASSWORD){
            return res.json({sucess:false,message:"Invalid Token"})
        }
        next();
    }
    catch(error){
        console.log(error);
        resp.json({sucess:false,message:"Something Went Wrong"})
    }
}

export default authAdmin;