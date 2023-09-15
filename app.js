const Mongoose = require('mongoose')
const Express = require('express')

Mongoose.connect(`mongodb+srv://jesusCode:${process.env.mongodb}@cluster0.legj65k.mongodb.net/Person?retryWrites=true&w=majority`)

const app = Express();

// Database Model - Person

const personSchema = new Mongoose.Schema(
    {
        id: {
            type: Number, default:0
        },
        name: String
    }
)

const persons =  Mongoose.model("person",personSchema)


// Endpoint designation

app.get("/api", (req,res) => {
    persons.find().then(
        docs =>{
            res.send(docs)
        }
    )
})
app.get("/api/:user_id", (req,res) => {
    const user_id = +req.params.user_id
    persons.findOne({
        id: user_id
    }).then(
        docs => {
            if(docs){
                res.send(docs)
            }else{
                res.send("No Person stored in this position")
            }
        }
    )
})

app.post("/api", (req,res) => {
    const person_name = req.query.name
    let docsCounter
    let userExist
    let person = {name: person_name};
    let Persons
    persons.find().then(
        docs => {
            docsCounter = docs.length
            Persons  = docs
        }
    )
    persons.find(person).then(
        docs => {
            docs.map((doc) =>{
                if(doc.name == person.name){
                    userExist = true
                }
            })
            if (!userExist){
                // create the user
                if(docsCounter == 0){
                    person.id = 1
                    persons.create(person).then(
                        res.send("New User Inserted Successfully")
                    )
                }else if (docsCounter > 0){
                    person.id = Persons[docsCounter- 1]["id"] + 1
                    persons.create(person).then(
                        res.send("New User Inserted Successfully")
                    )
                }
            }else{
                res.send("User Already Exist")
            }
        }
    )
})

app.patch("/api/:user_id", (req,res) => {

    const {user_id} = req.params
    const {name: person_name} = req.query

    persons.find({id: user_id}).then(
        docs => {
            if(docs.length == 1){
                persons.findOneAndUpdate(
                    {
                        id: user_id
                    },
                    {   
                        name: person_name
                    },
                    {
                        new: true
                    }
                ).then(
                    docs => {
                        res.send(docs)
                    }
                )
            }else{
                res.send("This Id does not yet exist in our system")
            }
        }
    )
    
})

app.delete("/api/:user_id", (req,res) => {
    const {user_id} = req.params
    persons.find({id: user_id}).then(
        docs => {
            if(docs.length == 1){
                persons.deleteOne(
                    {
                        id: user_id
                    }
                ).then(
                    docs => {
                        res.send("User Deleted Successfully")
                    }
                )
            }else{
                res.send("This Id does not yet exist in our system")
            }
        }
    )
    
})

app.listen(3000, () => {
    console.log("Server running on port 3k")
})