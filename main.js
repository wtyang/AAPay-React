import React,{Component} from "react";
import ReactDOM from "react-dom";
import AMUIReact,{Button,Icon,Grid,Col,Form,Input,FormGroup,Modal,ModalTrigger} from 'amazeui-react';

class App extends Component{

	render(){
		return (
			<Grid>
			    <Head />
			    <hr />
			    <Main />
			</Grid>
		);
	}
}
class Head extends Component{
	render() {
		return (
			<div className="header">
				<Col md={8} lg={6} mdCentered>
			    	<h1 style={{textAlign:"center",marginTop:"30px"}}>外卖AA付款计算</h1>
			    	<p className="am-monospace">帮你计算订餐后每个人该给多少钱。红包按消费比例减免，配送费按消费比例增加，餐盒费平摊。 可能会有极小的误差（一毛钱）</p>
			    </Col>
			</div>
		);
	}
}
class Main extends Component{
	constructor(props){ 
		super(props); 
		this.state = {
			options : [2,3,4,5,6,7,8,9,10],//人数选项
			count:2,
			list : [//每人填写金额数据
				{key:0,value:""},
				{key:1,value:""}
			],
			listafter : [//每人填写金额数据
				{key:0,value:""},
				{key:1,value:""}
			],
			totalbefore:0,
			totalafter:0,
			coupon:"",//优惠券红包
			send:"",//配送费
			box:"",//餐盒费
			resultlist : []
		}
		this.countChange = this.countChange.bind(this);
		this.couponChange = this.couponChange.bind(this);
		this.sendChange = this.sendChange.bind(this);
		this.boxChange = this.boxChange.bind(this);
		this.listChange = this.listChange.bind(this);
		this.getTotalBefore = this.getTotalBefore.bind(this);
		this.getTotalAfter = this.getTotalAfter.bind(this);
		this.doCal = this.doCal.bind(this);
	}
	//人数变化
	countChange (e){
		var count = e.target.value;
		var list =[];
		for(var i=0;i < count; i++){
			list[i] = {key:i,value:""}
		}
		this.setState({
			count:count,
			list:list
		})
	}
	listChange(e){
		var list = this.state.list;
		var key = e.target.getAttribute("data-key");
		var val = e.target.value;
		list[key] = {
			key:key,
			value:val
		};
		this.setState({
			list : list
		})
	}
	//红包满减金额变化
	couponChange(e) { 
		this.setState({ 
			coupon: e.target.value, 
		}); 
	}
	sendChange(e) { 
		this.setState({ 
			send: e.target.value, 
		}); 
	}
	boxChange(e) { 
		this.setState({ 
			box: e.target.value, 
		}); 
	}
	getTotalBefore(){
		var total = 0;
		var list = this.state.list;
        var count = this.state.count; //人数
        for (var i = 0; i < count; i++) {
            total += (parseFloat(list[i].value) || 0);
        }
        return total;
	}
	getTotalAfter(){
		var coupon = parseFloat(this.state.coupon) || 0; //优惠金额
        var send = parseFloat(this.state.send) || 0; //配送费
        var box = parseFloat(this.state.box) || 0; //餐盒费
        var count = this.state.count; //人数
		var total = this.getTotalBefore();
        total = total + send + box - coupon;
        return total;
	}
	getItemAfter(i) {
        var coupon = parseFloat(this.state.coupon) || 0; //优惠金额
        var send = parseFloat(this.state.send) || 0; //配送费
        var box = parseFloat(this.state.box) || 0; //餐盒费
        var count = this.state.count; //人数
		var total = this.getTotalBefore();
        var itemBefore = this.state.list[i].value; //当前个人金额
        var res = 0;
        if (itemBefore == 0 && total == 0) {
            return 0;
        }
        res = itemBefore - itemBefore / total * (coupon - send) + box/count;
        return res;
    }
	doCal(){
		var totalAfter  = this.getTotalAfter();
		var totalBefore = this.getTotalBefore();
        var count = this.state.count; //人数
        var listAfter = [];
        for (var i = 0; i < count; i++) {
            var price = parseFloat(this.getItemAfter(i)).toFixed(1);
            listAfter.push({key:i,value:price})
        }
        this.setState({
			totalbefore : totalBefore,
			totalafter : totalAfter,
			listafter : listAfter
		})
	}
	render(){
		return (
			<Col md={8} lg={6} mdCentered>
				<Form>
					<FormItem label="订餐人数：">
						<CountSelect onchange={this.countChange} options={this.state.options} value={this.state.count} />
					</FormItem>
					<FormItem label="原金额(不包含餐盒费)：">
						<ItemList list={this.state.list} changeCB={this.listChange}/>
					</FormItem>
					<FormItem label="红包和满减优惠总金额：">
						<input type="text" value={this.state.coupon} onChange={this.couponChange} />
					</FormItem>
					<FormItem label="配送费总金额：">
						<input type="text" value={this.state.send} onChange={this.sendChange} />
					</FormItem>
					<FormItem label="餐盒费总金额：">
						<input type="text" value={this.state.box} onChange={this.boxChange}/>
					</FormItem>
					<hr />
					<FormItem>

						<FormResult click={this.doCal} total={this.state.totalafter} list={this.state.listafter}/>
                        <Button type="reset" radius data-am-loading="{spinner: 'circle-o-notch', loadingText: '加载中...', resetText: '重置'}"><Icon icon="repeat"/> 重置</Button>
					</FormItem>

				</Form>

		    </Col>
		)
	}
}
class ItemList extends Component{
	constructor(props) {
		super(props);	
	}
	
	render() {
		return (
				<div>
	                {
	                	this.props.list.map(function(i){
		                	return <input className="am-form-field" onChange={this.props.changeCB} ref={"list_"+i.key} type="text" data-key={i.key}  key={i.key} value={i.value} name={"item_"+i.key} placeholder={"第"+(parseInt(i.key)+1)+"个人金额"}/>
		                }.bind(this))
	                }
                </div>
		)
	}
}
//select
class CountSelect extends Component{
	constructor(props){ 
		super(props); 		
	}
	render(){
		return (
	            <select  name='count' onChange={this.props.onchange}>
	                {  
                        this.props.options.map(function(i){  
                            return <option key={i} value={i}>{i}</option>  
                        })  
                    }  
	            </select>
		);
	}
}
class FormItem extends Component{
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<FormGroup>
				<label className="am-form-label">{this.props.label}</label>
				{this.props.children}
			</FormGroup>
			);
	}
}

class FormResult extends Component{
	constructor(props) {
		super(props);
	}
	render() {
		const modal = <Modal title="计算结果">
			总应付：{this.props.total}元
	        {
				this.props.list.map(function(item){
					return <div className="res-item" key={item.key}>第{parseInt(item.key)+1}个人应付：{item.value}元</div>
				})
			}
		</Modal>
		return (
			<ModalTrigger modal={modal}>
		    <Button onClick={this.props.click} amStyle="primary" style={{marginRight:"10px"}} radius type="button" data-am-loading="{spinner: 'circle-o-notch', loadingText: '加载中...', resetText: '计算'}"><Icon  icon="play"/> 计算</Button>
		  </ModalTrigger>
		  );
	}
}
ReactDOM.render(<App/>,document.getElementById('app'));