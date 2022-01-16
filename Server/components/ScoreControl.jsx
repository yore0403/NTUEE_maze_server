import React, { useEffect, useState } from "react";
import { ButtonGroup, Button, Input } from "reactstrap";
import fetch from "isomorphic-fetch";
const onEdit = ({team,score})=>{
    fetch(`http://localhost:3000/modify_score?team=${team}&new_score=${score}`)
}

export default ({team,point})=>{
    const [modifying, setMod] = useState(false)
    console.log(`new point ${point}`)
    const [newScore,setScore] = useState(point)
    const ok = ()=>{
        setMod(false)
        onEdit({team,score:newScore})
    }
    const handleKeyPress = (target)=> {
        if(target.charCode==13){
          ok()
        }
    }
    if(modifying){
        return <>
        <td className="rank" style={{ verticalAlign: "middle"}}>
            <Input value={newScore} onChange={(e)=>{setScore(e.target.value)}} onKeyPress={handleKeyPress}/>
        </td>
        <td className="rank" style={{ verticalAlign: "middle"}}>
        <ButtonGroup>
            <Button  color="warning" onClick={ok}>
                ok
            </Button>
            <Button  color="warning" onClick={()=>setMod(false)}>
                cancel
            </Button>
        </ButtonGroup>
        </td>
        </>
    }else{
        return <>
        <td className="rank" style={{ verticalAlign: "middle"}}>
            {point}
        </td>
        <td className="rank" style={{ verticalAlign: "middle"}}>
        <ButtonGroup>
            <Button  color="warning" onClick={()=>{setScore(point);setMod(true)}}>
                edit
            </Button>
            <Button  color="warning" onClick={()=>{
                onEdit({team:team,score:point-50})
                setScore(point-50)
            }}>
                -50
            </Button>
        </ButtonGroup>
        </td>
        </>
    }
}