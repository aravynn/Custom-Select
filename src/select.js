import React from 'react';
import {SelectArrow, RemoveIcon} from './svg';

/**
 * 
 * Select general customized select
 * Manages the internal state and generates the select on click
 * use {props.callback} to return a value to parent object.
 * 
 * does not require a real "select", simply returns a value.
 * 
 * must supply: 
 * {props.options}
 * {props.callback(target.value)}
 * 
 * optional supply: 
 * {props.default}  // starter value, otherwise 0
 * {props.multi}    // multiple select type
 * {props.className}// add an override class to the object, in addition to .select
 * 
 */
 class Select extends React.Component {
    constructor(props){
        super(props);
        
        // default may be supplied as a value or an index, so check for both. 
        let def = this.props.default;
        if(!Number.isInteger(def) && def !== undefined){
            def = this.props.options.indexOf(def);
        }
        if(def === undefined || !Number.isInteger(def) || def === -1){
            def = 0;
        }

        // if this is a multi-select, set as an array.
        if(this.props.multi){
            if(Array.isArray(this.props.default)){
                def = this.props.default; // assume that an array of indexes is given.
            } else {
                def = [];
            }
        }

        this.blockRef = React.createRef();

        // internal state to display values.
        this.state = { 
            options : this.props.options,
            activeOption : def,
            visible : false,
            top : 37, // will add or subtract to get proper value. 
            optionHeight : 40,
            showAbove : false
        };
    }

    componentDidMount(){
        let rect = this.blockRef.current.getBoundingClientRect();

        const curWin = window.innerHeight;

        let mH = curWin - rect.top - 100;

        if(mH < 200){
            // this is too short, swap height and place above.
            mH = this.state.options.length * 43;
            
            this.setState({
                top : -mH,
                optionHeight : mH,
                showAbove : true
            });
        } else {
            this.setState({
                top : 37,
                optionHeight : mH,
                showAbove : false
            });
        }
    }

    clickOption = (id) => { 
        if(this.props.multi){
            // in the case of multi, CHECK for a value, then add it if not already 
            // added or remove it if it is. 
            let newArr = this.state.activeOption.slice();

            if(this.state.activeOption.indexOf(id) != -1){
                // remove this option
                const index = this.state.activeOption.indexOf(id);
                newArr.splice(index, 1);
            } else {
                // add this option.
                newArr.push(id);
            }
            
            newArr.sort();

            this.setState({
                activeOption : newArr
            });

            let ret = [];

            newArr.forEach((data, index) => {
                ret.push(this.state.options[data]);
            });

            this.props.callback(ret);

        } else {
            this.setState({
                activeOption : id
            });
    
            this.props.callback(this.state.options[id]);
        }
        
    }

    openMenu = () => {
        this.setState({
            visible : !this.state.visible
        });
    }

    removeMulti = (id) => {
        let newSelected = this.state.activeOption.slice()
        
        newSelected.splice(id, 1);

        this.setState({
            activeOption : newSelected,
        });
    }

    render(){
        const dropdown = this.state.options.slice().map((value, index) => {
            return(
                <OptionDropdown 
                    key={index}
                    name = {value}
                    callback = {(id) => this.clickOption(id)}
                    id = {index}
                />
            );
        });
        
        let arrow = "arrow";
        if(this.state.visible){
            arrow += " active";
        }
        
        let style = {
            top: this.state.top, 
            maxHeight : this.state.optionHeight
        };

        if(this.state.showAbove){
            style={
                top: this.state.top, 
                height : this.state.optionHeight
            };
        }

        let chosen;

        if(!this.props.multi){
            chosen = this.state.options[this.state.activeOption];
        } else { 
            chosen = this.state.activeOption.slice().map((data, index) => {
                return(
                    <OptionSelected
                        name={this.state.options[data]}
                        callback={(id) => this.removeMulti(id)}
                        id={index}
                    />
                );
            });
        }
        
        // classname adder 
        let thisClass = "select";

        if(this.props.className !== undefined){
            thisClass += " " + this.props.className;
        }

        return(
            <div 
                ref={this.blockRef}
                className={thisClass}
                onClick={!this.props.multi ? this.openMenu : this.nil}

            >
                {this.props.multi ? 
                    <div className="activeOptions">
                        {chosen}
                    </div> 
                : chosen}
                {this.state.visible && 
                    <div 
                        className="optionDropDown"
                        style={style}
                    >
                        {dropdown}
                    </div>
                }
                <div 
                    className={arrow}
                    onClick={this.openMenu}
                >
                    <SelectArrow />
                </div>
            </div>
            
        );
    }
}


/**
 * 
 * @param {string} props.name               // display name
 * @param {function(id)} props.callback     // toggle element.
 * @param {integer} props.id                // id to toggle
 * 
 * @returns  option box with click functionality
 */
function OptionDropdown(props){
    return(
        <div 
            className="option"
            onClick={(id) => props.callback(props.id)}
        >
            {props.name}
        </div>
    );
}


/**
 * 
 * @param {string} props.name               // display name
 * @param {function(id)} props.callback     // remove property. 
 * @param {integer} props.id                // ID to remove. 
 * 
 * @returns selected option box with remove button
 */
function OptionSelected(props){
    return(
        <div
            className="seloption"
        >
            {props.name}
            <span
                onClick={(id) => props.callback(props.id)}
            >
                <RemoveIcon />
            </span>
        </div>
    );
}

export default Select;