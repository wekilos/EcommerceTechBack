// Requiring the module
const reader = require('xlsx')
  

const GetData = ()=>{
// Reading our test file
const file = reader.readFile('./server/functions/NovaPro.xlsx')
  
let data = []
  
const sheets = file.SheetNames
  
for(let i = 0; i < sheets.length; i++)
{
   const temp = reader.utils.sheet_to_json(
        file.Sheets[file.SheetNames[i]])
   temp.forEach((res) => {
      data.push(res)
   })
}

return data;
  
// Printing data
console.log(data);

}

exports.GetData = GetData;