import React from 'react';
import Select from './select';

class App extends React.Component {

    callback = (value) => {
        alert("Selected: " + value);
    } 

    render(){
        return (
            <div className="App">
                <h2>Single Select</h2>
                <p>This version allows for a single value to be selected, as per a typical sleect option. This can be given a default value (in this case, "Five").</p>
                <Select
                    options={['One','Two','Three','Four','Five','Six','Seven','Eight','Nine']}
                    callback={(value) => this.callback(value)}
                    default="Five"
                    className={"light"}
                />

                <h2>Multiple Select</h2>
                <p>In this option, multiple options can be selected, though "defaults" will only work with an index array.</p>
                <Select
                    options={['One','Two','Three','Four','Five','Six','Seven','Eight','Nine']}
                    callback={(value) => this.callback(value)}
                    default={[2,4,5]}
                    multi={true}
                    className={"light"}
                />
            </div>
        );
    }
}

export default App;