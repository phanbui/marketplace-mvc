const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/marketplace');

const toy_name = [
    'Stuffed Mickey Mouse',
    'Finger Paint',
    'Sock Monkey',
    'Buck Rogers Rocket Pistol',
    'Microscope Set',
    'Beach Ball',
    'Red Ryder BB Gun',
    'Army Men',
    'View-Master',
    'Bubble Solution']

const Listing = require('../models/listing');

seedDB = async() => {
    await Listing.deleteMany({});
    for (let i = 0; i < 10; i++){
        
        const listing = new Listing({
            title: toy_name[i], 
            price: Math.floor((Math.random() * 100) + 20),
            email: 'phan@gmail.com',
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Hic neque iste facilis quaerat molestiae. Obcaecati quam esse ut deleniti, modi quo, eveniet cumque praesentium maiores officia autem. Quidem, quod nostrum.',
            author: '62650958b4496cb9f81c8a4e'
        });
        await listing.save();
    }
}

seedDB().then(() =>{
    mongoose.connection.close();
})