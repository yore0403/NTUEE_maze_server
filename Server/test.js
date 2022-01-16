const n = ['undefined',undefined,null,'null']
const n2 = ['wgr','gewouirh']
const u = '0'
console.log(u in n2)
for(let i in n){
    console.log(i)
}

n.forEach(ele=>{
    console.log(ele)
    console.log(ele==='0')
    console.log('0'==ele)
})
