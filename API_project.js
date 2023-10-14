const API_KEY = "AIzaSyBJkIiegLQsBac17eKY8S4AsEbtNDpPRJs";

const axios = require("axios");

const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function request(title,author,genre,strtIndex){
    return axios.get("https://www.googleapis.com/books/v1/volumes?q=intitle:"+title+author+genre+strtIndex+"&orderBy=relevance&key="+API_KEY);
}

//function to return items
function reply(library){
    let details = library.data.items;
    if(!Array.isArray(details)){
        console.log("NO SUCH BOOK")
        rl.close();
        return 0;       
    }
    if (details.length == 0){
        console.log("No such book")
    }
    else{
        for(let i=0;i<details.length;i++)
        {
            console.log((i+1)+". "+details[i].volumeInfo.title)
        }
    }
}
//function for filters
let[author,genre,index,start]=["","","",0]
function filter(weeds)
{   
    rl.question("\nSelect:\n1.filters\n2.More books\n3.Exit\n",(result)=>{
       if (result==1){
            rl.question("\nEnter author name(you can also leave it blank): ",(authorName)=>{
                if (authorName!=""){
                    author = "+inauthor:"+authorName;
                }
                rl.question("\nEnter genre(you can also leave it blank): ",(genreName)=>{
                    if (genreName!=""){
                        genre = "+subject:"+genreName;
                    }            
                    request(weeds,author,genre,"").then((response)=>
                    {       
                    if(reply(response)==null){
                        filter(weeds)
                    }
                    else{
                        reply(response)
                    }
                })
                })
            })

            
       }
       if(result==2){
            start=start+10
            index="&startIndex="+start
            request(weeds,author,genre,index).then((response)=>
                    {       
                    if(reply(response)==null){
                        filter(weeds)
                    }
                    else{
                        reply(response)
                    }
                })
       }
       if(result==3){
            console.log("Thank you")
            rl.close();
       }
    })
}  

//main
rl.question('\nEnter book name: ', (book) =>{
//maintains order(so that second input is only asked after 1st response)   
    request(book,"","","").then((response)=>
        {       
        if(reply(response)==null){
            filter(book)
        }
        else{
            reply(response)
        }
    })            
})
    
    
    
  