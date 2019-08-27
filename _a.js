const database_tool = require("./database_tool");

database_tool.findAllBook((err,data)=>{
	console.log(data);
})