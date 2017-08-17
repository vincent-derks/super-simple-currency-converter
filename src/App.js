import React, { Component } from 'react'
import './App.css'

export default class App extends Component {

  constructor(props){
    super(props)

    // Bindings
    this.handleAmountChange = this.handleAmountChange.bind(this)
    this.handleFromChange = this.handleFromChange.bind(this)
    this.handleToChange = this.handleToChange.bind(this)
    this.getRates = this.getRates.bind(this)

    // Set the state
    this.state = {
      from: 'EUR',
      to: 'USD',
      rates: undefined,
      amount: 100
    }
  }

  componentDidMount(){
    this.getRates()
  }

  getRates(){
    fetch(`http://api.fixer.io/latest?base=${this.state.from}`)
    .then(res => res.json())
    .then(res => {
      this.setState({
        rates: res.rates
      })
    })
  }

  handleAmountChange(){
    const value = this.refs.amount.value
    this.setState({
      amount: value
    })
  }

  handleFromChange(){
    const value = this.refs.fromValue.value
    this.setState({
      from: value
    }, ()=>{
      this.getRates()
    })
  }

  handleToChange(){
    const value = this.refs.toValue.value
    this.setState({
      to: value
    })
  }

  calcResult(){
    return this.state.from === this.state.to ? this.state.amount : 
           this.state.to + ' ' + (Math.round(this.state.amount * this.state.rates[this.state.to] * 100) / 100).toFixed(2).replace('.',',')
  }

  render() {
    return (
      <div className="app container">
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input className="form-control" ref="amount" type="number" id="amount" name="amount" value={this.state.amount} onChange={this.handleAmountChange}/>
        </div>
        <div className="form-group">
          <label htmlFor="from-value">From</label>
          <select className="form-control" ref="fromValue" id="from-value" name="from-value" value={this.state.from} onChange={this.handleFromChange}>
            <option value={this.state.from}>{this.state.from}</option>
            {this.state.rates ? 
              Object.keys(this.state.rates).sort().map(key => <option key={key} value={key}>{key}</option>)
             : null}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="to-value">To</label>
          <select className="form-control" ref="toValue" id="to-value" name="to-value" value={this.state.to} onChange={this.handleToChange}>
            <option value={this.state.to}>{this.state.to}</option>
            {this.state.rates ? 
                Object.keys(this.state.rates).sort().map(key => <option key={key} value={key}>{key}</option>)
              : null}
          </select>
        </div>
        <strong>{ this.state.rates && this.calcResult() }</strong>
      </div>
    )
  }
}
