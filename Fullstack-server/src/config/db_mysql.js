import mysql from "mysql";
const connected = mysql.createConnection({
    host: "mysql-185348-0.cloudclusters.net",
    port: "10154",
    user: "admin",
    password: "2752vpqg",
    database: "db_restaurant",
  
})

// .then(()=>{
//     console.log('Connected Database');
// }).catch(()=>{
//     console.log('Failed Connected Database');
// });
connected.connect((err)=>{
    if (err) console.log('Failed Connected Database'+err);
    console.log('Connected Database');
});
export default connected;
