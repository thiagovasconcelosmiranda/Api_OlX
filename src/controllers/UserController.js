const State = require('../models/State');
const User = require('../models/User');
const Category = require('../models/category');
const Ad = require('../models/Ad');

module.exports = {
    getStates: async (req, res) =>{
        let states = await State.find();
        res.json({states});
    },

    info: async (req, res) =>{
      let token = req.query.token;

      const user = await User.findOne({token});

      const state = await State.findById(user.state);
      const ads = await Ad.find({idUser: user._id.toString()});

      let adList = [];
      for(let i in ads){

        const cat = await Category.findById(ads[i].category);
        /*
         adList.push({
         id: ads[i]._id,
         status: ads[i].status,
         images: ads[i].images,
         dataCreated: ads[i].dataCreated,
         title: ads[i].title,
         priceNeotiable: ads[i].priceNeotiable,
         description: ads[i].description,
         views: ads[i].views,
         category: cat.slug

         });
         */
         adList.push({...ads[i], category: cat.slug});
      }

      res.json({
        name: user.name,
        email: user.email,
        state: state.name,
        ads: adList
      });

    }, 
    editAction: async (req, res) => {
        res.json({})
    },
    getCategories: async (req, res) => {
        res.json({})
    },


}