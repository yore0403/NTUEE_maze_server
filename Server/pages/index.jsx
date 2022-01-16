import React, { Component } from "react";
import io from "socket.io-client";
import fetch from "isomorphic-fetch";
import Display from "../containers/display";
import Ip from "../containers/ip";
import { Container, Row, Col } from "reactstrap";
import localStorage from "localStorage";


const  generateRandomString = (num) => {
    let result1= Math.random().toString(36).substring(3,num+3);       
    return result1;
}

class HomePage extends Component {
    // init state with the prefetched messages
    //fetch data from the server
    static async getInitialProps({ req }) {
        const response = await fetch("http://localhost:4000/info");
        const data = await response.json();
        console.log("getInitialProps",data);
        
        return data;
    }

  constructor(props) {
    super(props);
    console.log("constructor");
    localStorage.setItem("ip",this.props.ip); // NOTE
    this.state = {
        ip:this.props.ip,
        map: "",
        state:-1,
        message: "生成地圖: 隨機生成自訂長寬的的地圖\n鍵盤模擬輸入: 輸入起始位置後，可用方向鍵操作車車\n尋找最小路徑: 計算最小路徑，並用方向鍵查看移動路徑\n下載csv：下載網站生成的csv檔，\n上傳csv：上傳自製的csv檔",
        map_message:"",
        car: -1,
        orientation: -1
    };

  }

    componentDidMount() {
        window.addEventListener("keydown", this.keyDown);
        window.addEventListener("beforeunload", this.onbeforeunload);
        window.addEventListener('load', this.onLoad);
    }
    componentWillUnmount() {
        window.removeEventListener("keydown", this.keyDown);
        window.removeEventListener("beforeunload", this.onbeforeunload);
        window.removeEventListener('load', this.onLoad);
    }
    onLoad = () => {
        console.log("load");
        if (localStorage.getItem("hash") === null) {
            localStorage.setItem("hash",generateRandomString(6));
        }else{
            fetch(localStorage.getItem("ip")+"/loadMap",{method: "GET", headers:{hash:localStorage.getItem("hash")}}) // call get
            .then(async res => {
                var n = await res.json();
                this.setState({
                    state: 2, // can get key
                    map: n.maze,
                    car: n.car,
                    orientation: n.orientation,
                    explored: n.explored,
                    width: localStorage.getItem("width"),
                    height: localStorage.getItem("height")
                })
    
            })
        }
    }





    onbeforeunload = () => {
        //console.log("sds");
        //fetch("http://localhost:4000/hash/remove",{method: "GET",headers:{hash:localStorage.getItem("hash")}})

    }

    handleClickMessage = () => {
        let _width = prompt('輸入迷宮寬度 (2 ≤ x ≤ 8)：','4');
        console.log(_width)
        if(_width == null){
            return;
        }else {
            _width = parseInt(_width,10);   
            if( _width>8){
                alert("寬度不能超過8!");
                return;
            }else if( _width<0){
                alert("寬度不能小於2!");
                return;
            }else if(isNaN(_width)){
                alert("寬度必須是數字!");
                return;
            }
        }

        let _height = prompt('輸入迷宮高度 (2 ≤ y ≤ 6)：','3');
        if(_height== null){
            return;
        }else {
            _height = parseInt(_height,10);
            if( _height>6){
                alert("高度不能超過6!");
                return;
            }else if( _height<0){
                alert("高度不能小於2!");
                return;
            }else if(isNaN(_height)){
                alert("寬度必須是數字!");
                return;
            }
        }
        localStorage.setItem("width",_width);
        localStorage.setItem("height",_height);


        this.setState({ message: "生成地圖中..." });
        console.log(localStorage.getItem("ip")+"/maze");

        fetch(localStorage.getItem("ip")+"/maze",{method: "GET", headers:{width:_width,height:_height,hash:localStorage.getItem("hash")}}) // call get
        .then(async res => {
            var n = await res.json();
            console.log("spawn");

            this.setState({
                state: 1, // have set map
                map: n.maze,
                car: n.car,
                width: _width,
                height: _height
            })
        }).then(async res => {
            this.setState({ message: "完成" });

        })
    }
    handleClickMessageKeyMove = () => {
        let _nd_start = this.state.car;
        let _orientation = this.state.orientation;

        fetch(localStorage.getItem("ip")+"/keyBoard/Move",{method: "GET",headers:{nd_start:_nd_start,orientation:_orientation,hash:localStorage.getItem("hash"),explored:explored}})
        .then(async res => {
            var n = await res.json();
            console.log("keyboard");
            this.setState({
                state: 2, // can get key
                map: n.maze,
                car: n.car,
                orientation: n.orientation
            })
        })
    }

    handleClickMessageKey = () => {
        let w = localStorage.getItem("width")-1;
        let _x = prompt('輸入起始位置x(位於端點會朝向唯一的路徑，其他預設朝上)\n0 ≤ x ≤ '+w,'0');
        if(_x== null){
            return;
        }else {
            _x = parseInt(_x, 10);

            if( _x>w){
                alert("x不能超過"+w+"!");
                return;
            }else if( _x<0){
                alert("x不能小於0!");
                return;
            }else if(isNaN(_x)){
                alert("x必須是數字!");
                return;
            }
        }       
        
        let h = localStorage.getItem("height")-1;
        let _y = prompt('輸入起始位置y(位於端點會朝向唯一的路徑，其他預設朝上)\n0 ≤ y ≤ '+h,'0');
        if(_y== null){
            return;
        }else {
            _y = parseInt(_y, 10);
            if( _y>w){
                alert("y不能超過"+h+"!");
                return;
            }else if( _y<0){
                alert("y不能小於0!");
                return;
            }else if(isNaN(_y)){
                alert("y必須是數字!");
                return;
            }
        } 
        let _nd_start = this.state.height*(this.state.width-_x-1)+_y+1;

        fetch(localStorage.getItem("ip")+"/keyBoard",{method: "GET",headers:{nd_start:_nd_start,hash:localStorage.getItem("hash")}})
        .then(async res => {
            var n = await res.json();
            console.log("keyboard");
            this.setState({
                state: 2, // can get key
                map: n.maze,
                car: n.car,
                orientation: n.orientation,
                explored: n.explored,
                message: "鍵盤輸入模式，請使用方向鍵控制車車移動\n[R]鍵重置已走過的端點"
            })

        })

    }

    handleClickMessageStrMove = () => {
        let _nd_start = this.state.car;
        let _orientation = this.state.orientation;

        fetch(localStorage.getItem("ip")+"/keyBoard/Move",{method: "GET",headers:{nd_start:_nd_start,orientation:_orientation,hash:localStorage.getItem("hash"),explored:explored}})
        .then(async res => {
            var n = await res.json();
            console.log("keyboard");
            this.setState({
                state: 2, // can get key
                map: n.maze,
                car: n.car,
                orientation: n.orientation
            })
        })
    }

    handleClickStr = () => {
        let w = localStorage.getItem("width")-1;
        let _x = prompt('輸入起始位置x(位於端點會朝向唯一的路徑，其他預設朝上)\n0 ≤ x ≤ '+w,'0');
        if(_x== null){
            return;
        }else {
            _x = parseInt(_x, 10);

            if( _x>w){
                alert("x不能超過"+w+"!");
                return;
            }else if( _x<0){
                alert("x不能小於0!");
                return;
            }else if(isNaN(_x)){
                alert("x必須是數字!");
                return;
            }   
        }    
        
        let h = localStorage.getItem("height")-1;
        let _y = prompt('輸入起始位置y(位於端點會朝向唯一的路徑，其他預設朝上)\n0 ≤ y ≤ '+h,'0');
        if(_y== null){
            return;
        }else {
            _y = parseInt(_y, 10);

            if( _y>w){
                alert("y不能超過"+h+"!");
                return;
            }else if( _y<0){
                alert("y不能小於0!");
                return;
            }else if(isNaN(_y)){
                alert("y必須是數字!");
                return;
            }
        }  
        let str = prompt('輸入指令字串：',"");
        const validChar = new Set(['f', 'r', 'l', 'b'])
        let strspilt = str.split("");
        if(str==null)return;
        if(str==""){
            alert("請輸入字串 (f,l,r,b)");

            return;
        }
        for(var i=0;i<str.length;i++){
            if(!validChar.has(strspilt.at(i))){
                alert("有f,l,r,b以外的字元: \'"+strspilt.at(i)+"\'");
                return;
            }
        }

        let _nd_start = this.state.height*(this.state.width-_x-1)+_y+1;

        

        fetch(localStorage.getItem("ip")+"/string",{method: "GET",headers:{nd_start:_nd_start,hash:localStorage.getItem("hash")}})
        .then(async res => {
            var n = await res.json();
            console.log("keyboard");
            this.setState({
                state: 3, // can get key
                map: n.maze,
                car: n.car,
                orientation: n.orientation,
                explored: n.explored,
                message: "字串播放模式，請使用[Enter]播放移動路線\n> "+str+"\n  ",
                map_message: "總步數："+str.length+"，目前在第0步",
                str: str,
                stridx: 0
            })
            console.log(this.state.str);


        })

    }

    downloadCSV = () => {

        fetch(localStorage.getItem("ip")+"/download",{method: "GET",headers:{hash:localStorage.getItem("hash")}})
        .then(async res => res.blob().then(blob => {
            let a = document.createElement(`a`);
            let url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = "maze.csv"; //給下載下來的檔案起個名字
            a.click();
            window.URL.revokeObjectURL(url);
            a = null;

        }))
    }
    uploadCSV = (e) => {
        this.setState({
            message: "上傳中..."
        })
        e.preventDefault();
        let file = e.target.files[0];
        let fileName = file.name;
        var re = /(?:\.([^.]+))?$/;
        
        console.log(fileName);
        if(re.exec(fileName)[1] != "csv") {
            alert("請上傳 csv 檔");
            return;
        }
        let result = [];
        var reader = new FileReader();
        let rawdata2;
        reader.readAsText(file); // NOTE

        reader.onload = function(event) {
            let rawdata = event.target.result;
            console.log(typeof rawdata);
            console.log("rawdata",rawdata);
            if (localStorage.getItem("hash") === null)
                localStorage.setItem("hash",generateRandomString(6));
            rawdata2 = rawdata.split("\n");
            rawdata2 = rawdata2.join("/");
            console.log("ddd",rawdata2);

            return 
        }

        reader.onloadend = (event,(data) => {

            fetch(localStorage.getItem("ip")+"/upload",{method: "GET", headers:{"Content-Type": "application/json",hash:localStorage.getItem("hash"),raw:rawdata2}}) // call get
            .then(async res => {
                var n = await res.json();
                console.log("keyboard");
                this.setState({
                    map: n.maze,
                    car: n.car,
                    orientation: n.orientation,
                    explored: n.explored,
                    message: "上傳完成"

                })
            })
        });






    }



        // for (var i = 0; i < arrayLength; i++) {
        //     console.log(myStringArray[i]);
        //     //Do something
        // }
        
        // for dt in raw_data:
        //     nd_int = int(dt[0])
        //     data[nd_int] = dict()
        //     for i in range(1,5):
        //         if not math.isnan((dt[i])): # exist succ
        //             data[nd_int][i] = [int(dt[i]),int(dt[i+4])]  
        // return data           




    keyDown = (e) => {
        if(this.state.state==2){
            // this.setState({ message: e.keyCode });
            if (e.keyCode === 37) {
            console.log("left");
            fetch(localStorage.getItem("ip")+"/keyBoard/Move",{method: "GET",headers:{nd_start:this.state.car,orientation:this.state.orientation,move:'l',hash:localStorage.getItem("hash"),explored:this.state.explored}})
            .then(async res => {
                var n = await res.json();
                this.setState({
                    state: 2, // can get key
                    map: n.maze,
                    car: n.car,
                    orientation: n.orientation,
                    map_message: "移動方向：左轉 (l)",
                    explored: n.explored
                })
            })
            }else if (e.keyCode === 38) {
            console.log("up");
            fetch(localStorage.getItem("ip")+"/keyBoard/Move",{method: "GET",headers:{nd_start:this.state.car,orientation:this.state.orientation,move:'f',hash:localStorage.getItem("hash"),explored:this.state.explored}})
            .then(async res => {
                var n = await res.json();
                this.setState({
                    state: 2, // can get key
                    map: n.maze,
                    car: n.car,
                    orientation: n.orientation,
                    map_message: "移動方向：前進 (f)",
                    explored: n.explored
                })
            })
            }else if (e.keyCode === 39) {
            console.log("right");
            fetch(localStorage.getItem("ip")+"/keyBoard/Move",{method: "GET",headers:{nd_start:this.state.car,orientation:this.state.orientation,move:'r',hash:localStorage.getItem("hash"),explored:this.state.explored}})
            .then(async res => {
                var n = await res.json();
                this.setState({
                    state: 2, // can get key
                    map: n.maze,
                    car: n.car,
                    orientation: n.orientation,
                    map_message: "移動方向：右轉 (r)",
                    explored: n.explored
                })
            })
            }else if (e.keyCode === 40) {
            console.log("down");
            fetch(localStorage.getItem("ip")+"/keyBoard/Move",{method: "GET",headers:{nd_start:this.state.car,orientation:this.state.orientation,move:'b',hash:localStorage.getItem("hash"),explored:this.state.explored}})
            .then(async res => {
                var n = await res.json();
                this.setState({
                    state: 2, // can get key
                    map: n.maze,
                    car: n.car,
                    orientation: n.orientation,
                    map_message: "移動方向：迴轉 (b)",
                    explored: n.explored

                    
                })
            })
            }
            else if (e.keyCode === 82) { // R for reset
                console.log("down");
                fetch(localStorage.getItem("ip")+"/keyBoard/Move",{method: "GET",headers:{nd_start:this.state.car,orientation:this.state.orientation,move:'x',hash:localStorage.getItem("hash"),explored:''}})
                .then(async res => {
                    var n = await res.json();
                    this.setState({
                        state: 2, // can get key
                        map: n.maze,
                        car: n.car,
                        orientation: n.orientation,
                        explored: n.explored
    
                        
                    })
                })
            }
        }else if(this.state.state==3){
            // if (e.keyCode === 37) {
            //     console.log("Reverse");
            //     var _stridx = this.state.stridx-1;
            //     if(_stridx<0)return
            //     // let move_char = this.state.str[_stridx];
            //     // console.log(move_char);
            //     fetch("http://localhost:4000/keyBoard/Undo",{method: "GET",headers:{nd_start:this.state.car,orientation:this.state.orientation,hash:localStorage.getItem("hash"),explored:this.state.explored}})
            //     .then(async res => {
            //         var n = await res.json();
            //         this.setState({
            //             state: 2, // can get key
            //             map: n.maze,
            //             car: n.car,
            //             orientation: n.orientation,
            //             explored: n.explored
            //         })
            //     })
            // }else 
            if (e.keyCode === 13) {
                var _stridx = this.state.stridx;
                if(_stridx>=this.state.str.length)return
                
                let move_char = this.state.str[_stridx];
                console.log(move_char);



                fetch(localStorage.getItem("ip")+"/keyBoard/Move",{method: "GET",headers:{nd_start:this.state.car,orientation:this.state.orientation,move:move_char,hash:localStorage.getItem("hash"),explored:this.state.explored}})
                .then(async res => {
                    var n = await res.json();
                    let cursor = "  ";
                    for(var i = 0; i < this.state.str.length; i++) {
                        if(i==this.state.stridx)cursor+="^";
                        else cursor+=" ";
                    }
                    console.log(cursor)
                    this.setState({
                        state: 3, // can get key
                        map: n.maze,
                        car: n.car,
                        orientation: n.orientation,
                        map_message: "總步數："+this.state.str.length+"，目前在第"+(_stridx+1)+"步",
                        message: "字串播放模式，請使用[Enter]逐步播放移動路線\n> "+this.state.str+"\n"+cursor,
                        explored: n.explored,
                        stridx: _stridx+1
                    })
                })
            }
        }
    }    






    render() {
        return (
            <div className="all">
                <div className="title">
                    <h1>110-2 電資工程入門設計與實作 循跡演算法測試網站</h1>
                    <Ip ip={this.state.ip}/>
                </div>
                
                <div className="body">
                    <div className="left">
                        {/* <Menu/> */}
                        <button value className="menu" onClick={this.handleClickMessage}> 生成地圖 </button>
                        <button value  className="menu" onClick={this.handleClickMessageKey} > 鍵盤模擬輸入 </button>
                        <button value  className="menu" onClick={this.handleClickStr}> 字串輸入 </button>
                        <button value  className="menu" onClick={this.downloadCSV}> 下載 csv </button>
                        {/* <div className="menu" onClick={this.uploadCSV}>上傳 csv</div> */}
                        <div>
                        <label className="menu" htmlFor="uploads">上傳 csv</label>
                        <input type = {"file"} id="uploads" accept=".csv" className="menu"  style={{ display: "none" }} accept=".csv" onChange={this.uploadCSV}/>
                        </div>

                    </div>
                    <div className="right">
                    <Display  m={this.state.map}/>
                    <p className="map_message">{this.state.map_message}</p>

                    </div>
                </div>
                <div className="message_body">
                        <p className="message">{this.state.message}</p>
                </div>
            </div>
        );
    }
}

export default HomePage;

//子程序呼叫 maze.py
