
const express = require('express')
const app = express()
const port = 5000

app.get('/:routeparam', (req, res) => {
    const routeparam = req.params.routeparam;
    const category= req.query.category ;
    const username = req.query.username;
    try{
if(!category){
    res.status(400).json({ error: 'Category is required in query params' });
    return;
} 
if(!username){
    res.status(400).json({ error: 'Username is required in query params' });
    return;
}

console.log(`Category received: ${category}`,` Username received: ${username}`, `Route param received: ${routeparam}`);
res.json({'message': `Category received: ${category}`, 'username received': `${username}`, 'route param received': `${routeparam}`});



console.log('Request received at /');
       
}catch (error) {

        console.error('Error occurred:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        req.data=[];
    }
  
})
app.delete('/', (req, res) => {
    try{
        //products

res.json({
            data: [
                { id: 1, name: 'Product 1', price: 100 },
                { id: 2, name: 'Product 2', price: 200 },
                { id: 3, name: 'Product 3', price: 500 }
            ]
        });
        
    
console.log('Request received at /');
       
}catch (error) {

        console.error('Error occurred:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        req.data=[];
    }
  
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/post', (req, res) => {
    try{
const data =req.body
 res.json({ message: 'Data received successfully', data: req.body }) 
    console.log('Request received at /post, with data:', data);
    }catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        req.data=[];
    }
   
});
