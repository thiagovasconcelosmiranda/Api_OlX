const { validationResult, matchedData } = require('express-validator');
const User = require('../models/User');
const State = require('../models/State');
const bcrypt = require('bcrypt');
const { default: mongoose } = require('mongoose');

module.exports = {
    signin: async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
          res.json({error: errors.mapped()});
        }
        const data = matchedData(req);
        
        //Validando e-mail
        const user = await User.findOne({email: data.email});
        if(!user){
           res.json({error: 'Email e/ou senha errados!'});
           return;
        };

        //validando Password
        const match = await bcrypt.compare(data.password, user.passwordHash);
        if(!match){
           res.json({error: 'Email e/ou senha errados!'});
           return;
        };

        const payload = (Date.now() + Math.random()).toString();
        const token = await bcrypt.hash(payload, 10);

        user.token = token;
        await user.save();

        res.json({token, email: data.email });

    },

    signup: async (req, res) => {
      const errors = validationResult(req);
      if(!errors.isEmpty()){
        res.json({error: errors.mapped()});
      }
      const data = matchedData(req);

      //Verificando se o email já existe
      const user = await User.findOne({
         email: data.email
      });
      if(user){
         res.json({
           error: {email: {msg: 'E-mail já existe'}}
         });
         return;
      }

       // Verificando se o states já existe
       const stateItem = await State.findById(data.state);

       if(mongoose.Types.ObjectId.isValid(data.state)){

         if(!stateItem){
            res.json({
               error: {state: {msg: 'Estado Não existe!'}}
            });
            return
         }
        }else{
          res.json({
            error: {state: {msg: 'Código do Estado invalido!'}}
          });
          return;
        }

        const PasswordHash = await bcrypt.hash(data.password, 10);
        const payload = (Date.now() + Math.random()).toString();
        const token = await bcrypt.hash(payload, 10);

        const newUser = new User({
           name: data.name,
           email: data.email,
           passwordHash: PasswordHash,
           token,
           state: data.state
        });

        await newUser.save();
        res.json({token});
    }
};