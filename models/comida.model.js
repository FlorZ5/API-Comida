import mongoose from 'mongoose';
const {Schema, model} = mongoose;

const comidaSchema = new Schema(
    { 
        codigo:
        {
            type: Number,
            required: true
        },                                                                                                                                                                                                                                                                                                                       
        nombre: 
        { 
            type: String, 
            required: true 
        },
        categoria:
        {
            type: String,
            required: true
        },
        ingredientes:
        {
            type: String, 
            required: true
        },
        descripcion:
        {
            type: String, 
            required: true
        },
        precio:
        {
            type: Number,
            required: true
        }
    },
    {timestamps:true}
)

export const comidaModel = model('comida',comidaSchema);