
const jwt =require('jsonwebtoken')

require('dotenv').config()
exports.requireSignin=async(req,res,next)=>{
    try{
        const decode = await jwt.verify(req.headers.authorization,process.env.JWT_SECRET)
        req.user=decode;
        
        next();

    }
    catch(err){
        console.log(err)
        return res.status(400).json({
            success:false,
            message:"Failed in token verification"
        })
    }
    
}

// exports.requireSignin=(req,res,next)=>{
//     const token = req.header('authorization');
//     console.log('authorization Header:', token);  // Log the token to check the format
  
//     if (!token) {
//       return res.status(401).json({ msg: 'No token, authorization denied' });
//     }
  
//     try {
//       const tokenPart = token.split(' ')[1];  // Split the Bearer prefix from the token
//       const decoded = jwt.verify(tokenPart, process.env.JWT_SECRET);  // Verify the token
//       req.user = decoded;  // Attach the decoded user to the request
//       next();
//     } catch (err) {
//       console.log(err);  // Log the error for further debugging
//       res.status(401).json({ msg: 'Token is not valid' });
//     }

// }