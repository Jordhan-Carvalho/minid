var mongoose = require("mongoose");

var mineralSchema = new mongoose.Schema ({
    name: String,
    image: String,
    imageId: String,
    image2: String,
    image3: String,
    video: {name: String,
        clink: String,
        link: String
        },
    reference: { name: [String],
        link: [String]
        },
    associatemineral: String,
    distinfeat: String,
    mineralclass: String,
    description: String,
    formula: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    
    author: {
        id: {type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        },
    username: String  
    },
    macro: { color: String,
        luster: String,
        hardness: String,
        density: String,
        system: String,
        habit: String,
        cleavage: String,
        streak: String,
        fracture: String,
        tenacity: String
        },
    pmicro: { pcol: { type: Number, default: 0.177 },
            pple:{ type: Number, default: 0.118 },
            prel: { type: Number, default: 0.059 },
            phab:{ type: Number, default: 0.118 },
            pcle: { type: Number, default: 0.177 },
            pbir: { type: Number, default: 0.177 },
            pext: { type: Number, default: 0.059 },
            psig: { type: Number, default: 0.065 }
            },

    planelight: { color: [String],
        pleochroism: String,
        relief: String,
        habit: String,
        cleavage: String
        },
        
    crossedlight: { birefringence: [Number],
        extinction: String,
        corinter: String,
        signofelongation: String,
        },
        
    createdAt: { type: Date, default: Date.now },
    approved: { type: Boolean, default: false }
});



module.exports = mongoose.model("Mineral", mineralSchema);